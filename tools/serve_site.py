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
import threading
from datetime import datetime, UTC
import hashlib


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


class CanonicalPageHandler(SimpleHTTPRequestHandler):
    """Map missing root HTML routes to canonical assets/pages sources."""

    history_root = Path(r'D:\Court_Data\.local\webpage-importance-history')
    importance_lock = threading.Lock()
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
        if urlsplit(self.path).path == '/__evidence_review__':
            self.review_importance()
            return
        if urlsplit(self.path).path == '/__evidence_importance__':
            self.save_importance()
            return
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

    def save_importance(self) -> None:
        if not self.editor_is_local() or self.headers.get('Origin') != 'http://' + self.headers.get('Host', ''):
            self.json_response(403, {'message': 'Saving is available only from this local editor.'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 150000 or self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                raise ValueError('Invalid request size or format')
            payload = json.loads(self.rfile.read(length))
            root = Path(self.directory)
            known = {f['filePath'] for f in json.loads((root / 'documents/data/evidence-export.json').read_text(encoding='utf-8'))['evidence']}
            from bs4 import BeautifulSoup
            cards = BeautifulSoup((root / 'assets/pages/documentspage.html').read_text(encoding='utf-8'), 'html.parser').select('article.card[id]')
            known.update('card:' + card['id'] for card in cards)
            file = payload.get('filePath')
            text = payload.get('text')
            if isinstance(file, str) and file.startswith('card:') and text is not None:
                fields = json.loads(text)
                if not isinstance(fields, dict) or not {'label', 'title', 'strength', 'tags'}.issubset(fields) or set(fields) - {'label', 'title', 'strength', 'tags', 'discussion', 'actionLabels'}:
                    raise ValueError('Invalid card fields')
                if not isinstance(fields.get('discussion', ''), str) or len(fields.get('discussion', '')) > 24000:
                    raise ValueError('Invalid discussion length')
                action_labels = fields.get('actionLabels', [])
                if not isinstance(action_labels, list) or len(action_labels) > 50 or any(not isinstance(item, dict) or set(item) != {'href', 'label'} or not isinstance(item['href'], str) or len(item['href']) > 1000 or not isinstance(item['label'], str) or not item['label'].strip() or len(item['label']) > 250 for item in action_labels):
                    raise ValueError('Invalid audio or evidence button labels')
                action_labels = fields.get('actionLabels', [])
                if not isinstance(action_labels, list) or len(action_labels) > 50 or any(not isinstance(item, dict) or set(item) != {'href', 'label'} or not isinstance(item['href'], str) or len(item['href']) > 1000 or not isinstance(item['label'], str) or not item['label'].strip() or len(item['label']) > 250 for item in action_labels):
                    raise ValueError('Invalid audio or evidence button labels')
                for field in ['label', 'title', 'strength']:
                    if not isinstance(fields[field], str) or len(fields[field]) > 250:
                        raise ValueError('Invalid label length')
                if not fields['title'].strip() or not isinstance(fields['tags'], list) or len(fields['tags']) > 20 or any(not isinstance(t, str) or len(t) > 100 for t in fields['tags']):
                    raise ValueError('Invalid title or tags')
            if file not in known or (text is not None and (not isinstance(text, str) or not text.strip() or len(text) > 30000)):
                raise ValueError('Select a valid evidence file and enter an explanation')
            with self.importance_lock:
                destination = root / ('documents/data/card-labels.json' if file.startswith('card:') else 'documents/data/evidence-importance.json')
                data = json.loads(destination.read_text(encoding='utf-8')) if destination.exists() else {'format': 'evidence-importance-v1', 'explanations': {}}
                existing = data['explanations'].get(file)
                if payload.get('expectedUpdated') != (existing or {}).get('updated'):
                    self.json_response(409, {'message': 'This explanation changed since it was loaded. Reload before saving.'})
                    return
                stamp = datetime.now(UTC).isoformat()
                queue_path = self.history_root / 'pending.json'
                queue_path.parent.mkdir(parents=True, exist_ok=True)
                queue = json.loads(queue_path.read_text(encoding='utf-8')) if queue_path.exists() else {}
                queue[file] = {'filePath': file, 'text': text.strip() if text is not None else None, 'submitted': stamp, 'expectedUpdated': (existing or {}).get('updated')}
                temp = queue_path.with_suffix('.writing')
                temp.write_text(json.dumps(queue, indent=2, ensure_ascii=False), encoding='utf-8')
                temp.replace(queue_path)
            self.json_response(200, {'status': 'pending', 'message': 'Saved to the review queue. Approve it to update the website.'})
        except (ValueError, OSError, KeyError) as exc:
            self.json_response(400, {'message': str(exc)})

    def review_importance(self) -> None:
        if not self.editor_is_local() or self.headers.get('Origin') != 'http://' + self.headers.get('Host', ''):
            self.json_response(403, {'message': 'Local editor required'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 10000 or self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                raise ValueError('Invalid request')
            payload = json.loads(self.rfile.read(length))
            with self.importance_lock:
                queue_path = self.history_root / 'pending.json'
                queue = json.loads(queue_path.read_text(encoding='utf-8'))
                file = payload['filePath']
                draft = queue[file]
                if payload.get('submitted') != draft['submitted']:
                    raise ValueError('Draft changed. Reload review queue.')
                action = payload.get('action')
                if action not in {'approve', 'reject'}:
                    raise ValueError('Invalid action')
                destination = Path(self.directory) / ('documents/data/card-labels.json' if file.startswith('card:') else 'documents/data/evidence-importance.json')
                data = json.loads(destination.read_text(encoding='utf-8'))
                existing = data['explanations'].get(file)
                if action == 'approve' and draft.get('expectedUpdated') != (existing or {}).get('updated'):
                    raise ValueError('Website explanation changed. Resubmit this edit before approval.')
                stamp = datetime.now(UTC).isoformat()
                record = {'action': action, 'draft': draft, 'previous': existing, 'reviewedAt': stamp}
                (queue_path.parent / (stamp.replace(':', '-') + '.json')).write_text(json.dumps(record, indent=2), encoding='utf-8')
                if action == 'approve':
                    if draft['text'] is None:
                        data['explanations'].pop(file, None)
                    else:
                        data['explanations'][file] = {'text': draft['text'], 'updated': stamp, 'source': 'editor-approved'}
                    temp = destination.with_suffix('.writing')
                    temp.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
                    temp.replace(destination)
                del queue[file]
                temp = queue_path.with_suffix('.writing')
                temp.write_text(json.dumps(queue, indent=2), encoding='utf-8')
                temp.replace(queue_path)
            self.json_response(200, {'status': action})
        except (ValueError, OSError, KeyError) as exc:
            self.json_response(400, {'message': str(exc)})

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
        if route == '/__evidence_pending__':
            if not self.editor_is_local():
                self.json_response(403, {'message': 'Local editor required'})
                return
            path = self.history_root / 'pending.json'
            self.json_response(200, {'drafts': json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}})
            return
        if route == '/__evidence_editor__':
            self.json_response(200 if self.editor_is_local() else 403, {'editable': self.editor_is_local()})
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
