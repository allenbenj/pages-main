#!/usr/bin/env python3
"""Serve source pages at the same root URLs used by the release artifact."""

from __future__ import annotations

import argparse
from email.utils import formatdate
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re


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
        html = canonical_path.read_text(encoding="utf-8")
        html = html.replace(
            '<base href="../../" target="_top">',
            '<base target="_top">',
            1,
        )
        payload = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header(
            "Last-Modified",
            formatdate(canonical_path.stat().st_mtime, usegmt=True),
        )
        self.end_headers()
        if include_body:
            self.wfile.write(payload)
        return True

    def do_POST(self) -> None:
        if self.path == '/__editor_commit__':
            self.handle_editor_commit()
            return
        self.send_error(404, 'Not Found')

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
        if not self.serve_canonical_page(include_body=True):
            super().do_GET()

    def do_HEAD(self) -> None:
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
