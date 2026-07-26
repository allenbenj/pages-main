#!/usr/bin/env python3
"""Serve source pages at the same root URLs used by the release artifact."""

from __future__ import annotations

import argparse
from email.utils import formatdate
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


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
        self.send_header(
            "Last-Modified",
            formatdate(canonical_path.stat().st_mtime, usegmt=True),
        )
        self.end_headers()
        if include_body:
            self.wfile.write(payload)
        return True

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
