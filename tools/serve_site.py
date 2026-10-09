#!/usr/bin/env python3
"""Serve source pages at the same root URLs used by the release artifact.

When reached over the loopback interface the server also injects the local
click-to-edit overlay (tools/site_editor.js). Editing is text-only: the overlay
posts the changed text to /__site_edit__, which writes it back into the backing
source file under assets/pages/ (or the root index.html). Nothing is injected
into the source tree, so the release artifact is unaffected.
"""

from __future__ import annotations

import argparse
from email.utils import formatdate
from html import unescape as unescape_html
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import socket


SITE_EDITOR_SCRIPT_TAG = '<script src="/__site_editor__.js" defer></script>'
SITE_EDITOR_SCRIPT = Path(__file__).with_name("site_editor.js")
# Contents of these elements are counted as text nodes (the browser does too) but
# are never editable from the overlay.
RAW_TEXT_TAGS = frozenset({"script", "style", "textarea"})


def find_markup_end(html: str, start: int) -> int:
    """Return the index of the '>' that closes the tag starting at ``start``."""
    quote = ""
    index = start + 1
    while index < len(html):
        char = html[index]
        if quote:
            if char == quote:
                quote = ""
        elif char in '"\'':
            quote = char
        elif char == ">":
            return index
        index += 1
    return len(html) - 1


def tag_name_at(html: str, start: int) -> str:
    match = re.match(r"</?\s*([a-zA-Z][a-zA-Z0-9:-]*)", html[start : start + 40])
    return match.group(1).lower() if match else ""


def iter_text_nodes(html: str):
    """Yield (start, end, text, kind) for every text node the browser would create.

    Comments and doctypes are skipped. Script, style, and textarea contents are
    reported with kind "raw" so their ordinal still lines up with the browser but
    they can never be edited.
    """
    index = 0
    length = len(html)
    while index < length:
        start = html.find("<", index)
        if start == -1:
            yield index, length, html[index:length], "text"
            return
        if start > index:
            yield index, start, html[index:start], "text"
        if html.startswith("<!--", start):
            end = html.find("-->", start + 4)
            index = length if end == -1 else end + 3
            continue
        if html.startswith("<!", start) or html.startswith("<?", start):
            end = html.find(">", start)
            index = length if end == -1 else end + 1
            continue
        name = tag_name_at(html, start)
        index = find_markup_end(html, start) + 1
        if name in RAW_TEXT_TAGS:
            close = re.compile(rf"</{re.escape(name)}\s*>", re.IGNORECASE).search(html, index)
            if close is None:
                yield index, length, html[index:length], "raw"
                return
            if close.start() > index:
                yield index, close.start(), html[index : close.start()], "raw"
            index = close.end()


def normalize_text(value: str) -> str:
    return " ".join(value.split())


def escape_text(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def locate_text_span(nodes: list[tuple[int, int, str, str]], index: int, expected: str) -> tuple[int, int]:
    """Resolve the source span the editor meant, refusing ambiguous matches.

    The browser hands over decoded text, so source entities are decoded here too
    before comparing.
    """
    wanted = normalize_text(expected)

    def matches(value: str) -> bool:
        decoded = unescape_html(value)
        return decoded == expected or normalize_text(decoded) == wanted

    if 0 <= index < len(nodes):
        start, end, value, kind = nodes[index]
        if kind == "text" and matches(value):
            return start, end
    exact = [(start, end) for start, end, value, kind in nodes if kind == "text" and unescape_html(value) == expected]
    if len(exact) == 1:
        return exact[0]
    loose = [(start, end) for start, end, value, kind in nodes if kind == "text" and matches(value)]
    if len(loose) == 1:
        return loose[0]
    if not exact and not loose:
        raise ValueError("That text does not come from the source HTML file, so it cannot be edited here.")
    raise ValueError("That text appears more than once in the source file. Reload the page and try again.")


def check_overlaps(replacements: list[tuple[int, int, str]]) -> None:
    ordered = sorted(replacements)
    for previous, current in zip(ordered, ordered[1:]):
        if current[0] < previous[1]:
            raise ValueError("Two edits overlap. Save them one at a time.")


def port_is_in_use(host: str, port: int) -> bool:
    """True when something already accepts connections on host:port.

    Python's HTTP server sets SO_REUSEADDR, so on Windows a second copy of this
    script binds the same port without complaint and the OS then splits requests
    between both instances. Pages then load unpredictably and a stale copy can
    silently serve old code, so refuse to start instead of duplicating.
    """
    probe_host = "127.0.0.1" if host in {"0.0.0.0", "::"} else host
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.settimeout(0.3)
        return probe.connect_ex((probe_host, port)) == 0


class CanonicalPageHandler(SimpleHTTPRequestHandler):
    """Map missing root HTML routes to canonical assets/pages sources."""

    canonical_pages: Path

    def canonical_root_page(self) -> Path | None:
        public_path = unquote(urlsplit(self.path).path)
        name = public_path.lstrip("/")
        if not name or "/" in name or not name.lower().endswith(".html"):
            return None
        regular_path = Path(super().translate_path(self.path))
        canonical_path = self.canonical_pages / name
        if not regular_path.is_file() and canonical_path.is_file():
            return canonical_path
        return None

    def serve_canonical_page(self, include_body: bool) -> bool:
        canonical_path = self.canonical_root_page()
        if canonical_path is None:
            return False
        return self.serve_html(canonical_path, include_body=include_body)

    def serve_html(self, path: Path, *, include_body: bool) -> bool:
        """Serve a source HTML file, injecting the local editor when available."""
        try:
            html = path.read_text(encoding="utf-8")
        except OSError:
            return False
        if path.parent == self.canonical_pages:
            html = html.replace(
                '<base href="../../" target="_top">',
                '<base target="_top">',
                1,
            )
        if self.editor_is_local():
            html = self.inject_editor(html)
        payload = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        try:
            self.send_header(
                "Last-Modified",
                formatdate(path.stat().st_mtime, usegmt=True),
            )
        except OSError:
            pass
        self.end_headers()
        if include_body:
            self.wfile.write(payload)
        return True

    @staticmethod
    def inject_editor(html: str) -> str:
        if SITE_EDITOR_SCRIPT_TAG in html:
            return html
        marker = html.lower().rfind("</body>")
        if marker == -1:
            return html + "\n" + SITE_EDITOR_SCRIPT_TAG + "\n"
        return html[:marker] + SITE_EDITOR_SCRIPT_TAG + "\n" + html[marker:]

    def source_file_for_public_path(self, public_path: str) -> Path | None:
        """Resolve the on-disk HTML source that backs a public route, if any.

        Mirrors canonical_root_page precedence: a real root-level file wins over
        the canonical source under assets/pages/.
        """
        path = unquote(urlsplit(public_path).path)
        name = path.lstrip("/")
        if not name or not name.lower().endswith(".html"):
            return None
        candidate = Path(super().translate_path(path))
        if candidate.is_file():
            return candidate
        if "/" not in name:
            canonical_path = self.canonical_pages / name
            if canonical_path.is_file():
                return canonical_path
        return None

    def serve_site_editor_script(self) -> None:
        if not self.editor_is_local():
            self.send_error(403, "The site editor is available only from this local server.")
            return
        try:
            payload = SITE_EDITOR_SCRIPT.read_bytes()
        except OSError:
            self.send_error(404, "tools/site_editor.js is missing.")
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/javascript; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def save_site_edit(self) -> None:
        """Write the editor's text-only changes back into the source HTML file."""
        if not self.editor_is_local() or self.headers.get('Origin') != 'http://' + self.headers.get('Host', ''):
            self.json_response(403, {'message': 'Editing is available only from this local server.'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 1_000_000 or self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                raise ValueError('Invalid request size or format')
            payload = json.loads(self.rfile.read(length))
            page = payload.get('page')
            edits = payload.get('edits')
            if not isinstance(page, str) or not isinstance(edits, list) or not edits:
                raise ValueError('No edits were supplied.')
            if len(edits) > 500:
                raise ValueError('Too many edits in one request.')
            source = self.source_file_for_public_path(page)
            if source is None:
                raise ValueError(f'No editable source file backs {page}.')
            text = source.read_text(encoding='utf-8')
            nodes = list(iter_text_nodes(text))
            replacements: list[tuple[int, int, str]] = []
            for edit in edits:
                if not isinstance(edit, dict):
                    raise ValueError('Invalid edit.')
                index = edit.get('index')
                expected = edit.get('expected')
                replacement = edit.get('text')
                if isinstance(index, bool) or not isinstance(index, int) or not isinstance(expected, str) or not isinstance(replacement, str):
                    raise ValueError('Invalid edit fields.')
                if len(expected) > 20_000 or len(replacement) > 20_000:
                    raise ValueError('That text is too long to edit here.')
                if not expected.strip():
                    raise ValueError('Select text with content in it.')
                start, end = locate_text_span(nodes, index, expected)
                replacements.append((start, end, escape_text(replacement)))
            check_overlaps(replacements)
            for start, end, replacement in sorted(replacements, key=lambda item: item[0], reverse=True):
                text = text[:start] + replacement + text[end:]
            source.write_text(text, encoding='utf-8', newline='')
            self.json_response(200, {
                'status': 'ok',
                'updated': len(replacements),
                'file': source.relative_to(Path(self.directory)).as_posix(),
            })
        except (ValueError, OSError, KeyError, TypeError) as exc:
            self.json_response(400, {'message': str(exc)})

    def do_POST(self) -> None:
        if urlsplit(self.path).path == '/__site_edit__':
            self.save_site_edit()
            return
        if self.path == '/__editor_commit__':
            self.handle_editor_commit()
            return
        self.send_error(404, 'Not Found')

    def editor_is_local(self) -> bool:
        return self.client_address[0] in {'127.0.0.1', '::1'} and self.headers.get('Host') in {f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}'}

    def json_response(self, status: int, data: dict) -> None:
        payload = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def handle_editor_commit(self) -> None:
        try:
            content_length = int(self.headers.get('Content-Length', '0'))
            body = self.rfile.read(content_length).decode('utf-8')
            payload = json.loads(body)
            page = payload.get('page')
            grids = payload.get('grids')
            if page != 'assets/pages/documentspage.html' or not isinstance(grids, list):
                raise ValueError('Invalid commit payload')
            page_path = Path(self.directory) / page
            if not page_path.is_file():
                raise FileNotFoundError(f'Page not found: {page}')
            updated_text, card_count = self.generate_updated_page_html(page_path, grids)
            backup_path = page_path.with_suffix(page_path.suffix + '.bak')
            if not backup_path.exists():
                backup_path.write_text(page_path.read_text(encoding='utf-8'), encoding='utf-8')
            page_path.write_text(updated_text, encoding='utf-8')

            # Keep the repository's card data source synchronized with the page.
            root = Path(self.directory)
            sync_path = root / 'tools' / 'sync_contradiction_cards.py'
            spec = importlib.util.spec_from_file_location('_sync_contradiction_cards', sync_path)
            if spec is None or spec.loader is None:
                raise RuntimeError('Could not load contradiction card synchronizer')
            sync_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(sync_module)
            sync_module.extract(root)

            response = {
                'status': 'ok',
                'message': f'Saved {card_count} cards to {page}.',
                'cards': card_count,
                'grids': len(grids),
            }
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            payload = json.dumps(response, indent=2).encode('utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except Exception as exc:
            error_payload = {'status': 'error', 'message': str(exc)}
            self.send_response(400)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            payload = json.dumps(error_payload, indent=2).encode('utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

    def generate_updated_page_html(self, page_path: Path, grids: list[dict]) -> tuple[str, int]:
        from bs4 import BeautifulSoup

        text = page_path.read_text(encoding='utf-8')
        spans = self.find_grid_spans(text)
        if len(grids) != len(spans):
            raise ValueError(f'Expected {len(spans)} card grids, received {len(grids)}')

        replacements: list[str] = []
        card_count = 0
        for expected_index, grid in enumerate(grids):
            if not isinstance(grid, dict) or grid.get('index') != expected_index:
                raise ValueError(f'Invalid card grid at index {expected_index}')
            inner_html = grid.get('innerHTML')
            if not isinstance(inner_html, str) or len(inner_html) > 5_000_000:
                raise ValueError(f'Invalid HTML for card grid {expected_index}')
            fragment = BeautifulSoup(inner_html, 'html.parser')
            if fragment.find('script') is not None:
                raise ValueError('Scripts are not allowed inside card grids')
            cards = fragment.select('article.card')
            if any(card.find(class_='card-title') is None for card in cards):
                raise ValueError(f'Every card in grid {expected_index} needs a title')
            card_count += len(cards)
            replacements.append(inner_html)

        updated = text
        for index in range(len(spans) - 1, -1, -1):
            _open_start, open_end, close_start, close_end = spans[index]
            updated = (
                updated[:open_end]
                + replacements[index]
                + updated[close_start:close_end]
                + updated[close_end:]
            )
        return updated, card_count

    @staticmethod
    def find_grid_spans(html: str) -> list[tuple[int, int, int, int]]:
        """Locate top-level section.grid regions without reserializing the page."""
        tag_re = re.compile(r'<(/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(/?)>')
        spans: list[tuple[int, int, int, int]] = []
        for match in re.finditer(r'<section\b[^>]*>', html):
            class_match = re.search(r'class="([^"]*)"', match.group(0))
            if not class_match or 'grid' not in class_match.group(1).split():
                continue
            depth = 1
            for tag in tag_re.finditer(html, match.end()):
                if tag.group(2).lower() != 'section':
                    continue
                if tag.group(1):
                    depth -= 1
                    if depth == 0:
                        spans.append((match.start(), match.end(), tag.start(), tag.end()))
                        break
                elif not tag.group(3):
                    depth += 1
            else:
                raise ValueError(f'Unclosed card grid at offset {match.start()}')
        return spans

    def do_GET(self) -> None:
        route = urlsplit(self.path).path
        if route == '/__site_editor__.js':
            self.serve_site_editor_script()
            return
        if self.editor_is_local():
            source = self.source_file_for_public_path(route)
            if source is not None and self.serve_html(source, include_body=True):
                return
        if not self.serve_canonical_page(include_body=True):
            super().do_GET()

    def do_HEAD(self) -> None:
        if self.editor_is_local():
            source = self.source_file_for_public_path(self.path)
            if source is not None and self.serve_html(source, include_body=False):
                return
        if not self.serve_canonical_page(include_body=False):
            super().do_HEAD()

    def translate_path(self, path: str) -> str:
        public_path = unquote(urlsplit(path).path)
        name = public_path.lstrip("/")
        if name and "/" not in name and name.lower().endswith(".html"):
            regular_path = Path(super().translate_path(path))
            canonical_path = self.canonical_pages / name
            if not regular_path.is_file() and canonical_path.is_file():
                return str(canonical_path)
        return super().translate_path(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    root = args.root.resolve()
    canonical_pages = root / "assets" / "pages"
    if not (root / "index.html").is_file() or not canonical_pages.is_dir():
        parser.error(f"not a site source root: {root}")

    if port_is_in_use(args.host, args.port):
        parser.error(
            f"{args.host}:{args.port} is already serving something. Stop that server first, "
            f"or start this one on a free port (for example --port 8001)."
        )

    CanonicalPageHandler.canonical_pages = canonical_pages

    def handler(*handler_args, **kwargs):
        return CanonicalPageHandler(*handler_args, directory=str(root), **kwargs)

    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Serving {root} at http://{args.host}:{args.port}/index.html", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
