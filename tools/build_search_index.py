#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
from collections import deque
from dataclasses import dataclass
from datetime import datetime, UTC
from html import unescape
from pathlib import Path
from typing import Iterable
from urllib.parse import unquote, urlparse

from bs4 import BeautifulSoup, NavigableString, Tag
from pypdf import PdfReader


ROOT_PAGE_PATHS = [
    "index.html",
    "overview.html",
    "timeline.html",
    "players.html",
    "evidence.html",
    "contradictions.html",
    "catch-all.html",
    "misconduct.html",
    "misconductandfailure.html",
    "documentspage.html",
    "connections.html",
    "case-study.html",
    "scene.html",
    "prosecutor_allowed.html",
    "editor.html",
    "judicial-duty.html",
    "why-dont-we-have-this-system.html",
    "data-snapshot.html",
    "page-index.html",
    "link-diagram.html",
    "false-allegation-framework.html",
    "network_analysis/index.html",
]

# Directories never indexed: content/ holds legacy variants (now redirects to
# the canonical root pages); the rest are non-public working areas.
EXCLUDED_DIR_PARTS = {"content", "archive", "tmp", "tools", "reports", "node_modules", ".git"}

TEXT_EXTENSIONS = {".txt", ".md"}
PAGE_EXTENSIONS = {".html", ".htm"}
MEDIA_EXTENSIONS = {".mp3", ".wav", ".ogg", ".mp4", ".webm", ".mov"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif", ".bmp", ".ico"}


@dataclass
class SearchRecord:
    id: str
    path: str
    url_path: str
    title: str
    section: str
    kind: str
    anchor: str | None
    text: str
    keywords: list[str]


def normalize_space(value: str) -> str:
    value = unescape(value or "")
    value = value.replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "section"


def is_external_link(value: str) -> bool:
    parsed = urlparse(value)
    if parsed.scheme in {"http", "https", "mailto", "tel", "javascript", "data", "blob"}:
        return True
    return value.startswith("//")


def local_link_target(root: Path, source: Path, value: str) -> Path | None:
    if not value or value.startswith("#") or is_external_link(value):
        return None
    trimmed = value.split("#", 1)[0].split("?", 1)[0].strip()
    if not trimmed:
        return None
    decoded = unquote(trimmed)
    if decoded.startswith("/"):
        return (root / decoded.lstrip("/")).resolve()
    return (source.parent / decoded).resolve()


def iter_local_links(root: Path, source: Path, soup: BeautifulSoup) -> Iterable[Path]:
    attrs = ("href", "src", "poster", "data-href", "data-src", "data-modal-image")
    for node in soup.find_all(True):
        for attr in attrs:
            raw = node.get(attr)
            if not raw:
                continue
            target = local_link_target(root, source, raw)
            if target and target.exists() and str(target).startswith(str(root.resolve())):
                yield target


def nearest_anchor(node: Tag | None) -> str | None:
    current = node
    while current and isinstance(current, Tag):
        if current.get("id"):
            return current["id"]
        current = current.parent
    return None


def collect_text_between(start: Tag, stop_names: set[str]) -> str:
    chunks: list[str] = []
    current = start.next_sibling
    while current:
        if isinstance(current, Tag) and current.name in stop_names:
            break
        if isinstance(current, NavigableString):
            text = normalize_space(str(current))
            if text:
                chunks.append(text)
        elif isinstance(current, Tag):
            text = normalize_space(current.get_text(" ", strip=True))
            if text:
                chunks.append(text)
        current = current.next_sibling
    return normalize_space(" ".join(chunks))


def html_title(rel_path: str, soup: BeautifulSoup) -> str:
    title_tag = soup.find("title")
    if title_tag and normalize_space(title_tag.get_text(" ", strip=True)):
        return normalize_space(title_tag.get_text(" ", strip=True))
    h1 = soup.find("h1")
    if h1 and normalize_space(h1.get_text(" ", strip=True)):
        return normalize_space(h1.get_text(" ", strip=True))
    return Path(rel_path).stem.replace("-", " ").replace("_", " ").title()


def make_result_url(path: str, anchor: str | None) -> str:
    if anchor:
        return f"{path}#{anchor}"
    return path


def html_records(root: Path, path: Path) -> tuple[list[SearchRecord], list[Path]]:
    rel_path = path.relative_to(root).as_posix()
    html = path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "html.parser")

    # Skip pure meta-refresh redirect stubs; their targets are indexed directly.
    if soup.find("meta", attrs={"http-equiv": re.compile(r"^\s*refresh\s*$", re.I)}):
        return [], []

    for tag in soup(["script", "style", "noscript", "template"]):
        tag.decompose()

    page_title = html_title(rel_path, soup)
    records: list[SearchRecord] = []

    headings = soup.find_all(re.compile(r"^h[1-6]$"))
    if headings:
        for index, heading in enumerate(headings, start=1):
            heading_text = normalize_space(heading.get_text(" ", strip=True))
            if not heading_text:
                continue
            body_text = collect_text_between(heading, {"h1", "h2", "h3", "h4", "h5", "h6"})
            combined = normalize_space(f"{heading_text} {body_text}")
            if len(combined) < 20:
                continue
            anchor = heading.get("id") or nearest_anchor(heading)
            record_id = f"{rel_path}::heading::{index}"
            records.append(
                SearchRecord(
                    id=record_id,
                    path=rel_path,
                    url_path=make_result_url(rel_path, anchor),
                    title=page_title,
                    section=heading_text,
                    kind="page",
                    anchor=anchor,
                    text=combined,
                    keywords=[heading_text, page_title, Path(rel_path).name],
                )
            )
    else:
        body = soup.body or soup
        text = normalize_space(body.get_text(" ", strip=True))
        if text:
            records.append(
                SearchRecord(
                    id=f"{rel_path}::page",
                    path=rel_path,
                    url_path=rel_path,
                    title=page_title,
                    section=page_title,
                    kind="page",
                    anchor=None,
                    text=text,
                    keywords=[page_title, Path(rel_path).name],
                )
            )

    if not records:
        body = soup.body or soup
        text = normalize_space(body.get_text(" ", strip=True))
        if text:
            records.append(
                SearchRecord(
                    id=f"{rel_path}::fallback",
                    path=rel_path,
                    url_path=rel_path,
                    title=page_title,
                    section=page_title,
                    kind="page",
                    anchor=None,
                    text=text,
                    keywords=[page_title, Path(rel_path).name],
                )
            )

    linked = sorted(set(iter_local_links(root, path, soup)))
    return records, linked


def pdf_records(root: Path, path: Path) -> list[SearchRecord]:
    rel_path = path.relative_to(root).as_posix()
    title = path.stem.replace("_", " ")
    reader = PdfReader(str(path))
    records: list[SearchRecord] = []
    for page_index, page in enumerate(reader.pages, start=1):
        text = normalize_space(page.extract_text() or "")
        if not text:
            continue
        records.append(
            SearchRecord(
                id=f"{rel_path}::page::{page_index}",
                path=rel_path,
                url_path=rel_path,
                title=title,
                section=f"Page {page_index}",
                kind="pdf",
                anchor=None,
                text=text,
                keywords=[title, path.name, f"page {page_index}"],
            )
        )
    if not records:
        records.append(
            SearchRecord(
                id=f"{rel_path}::file",
                path=rel_path,
                url_path=rel_path,
                title=title,
                section=title,
                kind="pdf",
                anchor=None,
                text=title,
                keywords=[title, path.name],
            )
        )
    return records


def text_file_records(root: Path, path: Path) -> list[SearchRecord]:
    rel_path = path.relative_to(root).as_posix()
    text = normalize_space(path.read_text(encoding="utf-8", errors="ignore"))
    if not text:
        return []
    title = path.stem.replace("_", " ")
    chunk_size = 2200
    chunks = [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]
    records: list[SearchRecord] = []
    for index, chunk in enumerate(chunks, start=1):
        records.append(
            SearchRecord(
                id=f"{rel_path}::chunk::{index}",
                path=rel_path,
                url_path=rel_path,
                title=title,
                section=f"Chunk {index}",
                kind="document",
                anchor=None,
                text=chunk,
                keywords=[title, path.name],
            )
        )
    return records


def binary_asset_record(root: Path, path: Path, kind: str) -> list[SearchRecord]:
    rel_path = path.relative_to(root).as_posix()
    title = path.stem.replace("_", " ")
    return [
        SearchRecord(
            id=f"{rel_path}::asset",
            path=rel_path,
            url_path=rel_path,
            title=title,
            section=path.name,
            kind=kind,
            anchor=None,
            text=normalize_space(f"{title} {path.name}"),
            keywords=[title, path.name, rel_path],
        )
    ]


def records_for_path(root: Path, path: Path) -> tuple[list[SearchRecord], list[Path]]:
    suffix = path.suffix.lower()
    if suffix in PAGE_EXTENSIONS:
        return html_records(root, path)
    if suffix == ".pdf":
        return pdf_records(root, path), []
    if suffix in TEXT_EXTENSIONS:
        return text_file_records(root, path), []
    if suffix in {".json", ".csv", ".xml"}:
        return binary_asset_record(root, path, "document"), []
    if suffix in MEDIA_EXTENSIONS:
        return binary_asset_record(root, path, "media"), []
    if suffix in IMAGE_EXTENSIONS:
        return binary_asset_record(root, path, "image"), []
    return [], []


def discover_paths(root: Path) -> list[Path]:
    queue = deque()
    seen: set[Path] = set()
    discovered: list[Path] = []

    for rel in ROOT_PAGE_PATHS:
        candidate = (root / rel).resolve()
        if candidate.exists():
            queue.append(candidate)

    while queue:
        current = queue.popleft()
        if current in seen:
            continue
        seen.add(current)
        if not str(current).startswith(str(root.resolve())):
            continue
        try:
            rel_parts = current.relative_to(root.resolve()).parts
        except ValueError:
            continue
        if any(part in EXCLUDED_DIR_PARTS for part in rel_parts):
            continue
        if current.is_dir():
            continue
        discovered.append(current)
        records, linked = records_for_path(root, current)
        if current.suffix.lower() in PAGE_EXTENSIONS:
            for target in linked:
                if target not in seen:
                    queue.append(target)

    # Include site HTML pages even if nothing links to them yet.
    for rel in ROOT_PAGE_PATHS:
        candidate = (root / rel).resolve()
        if candidate.exists() and candidate not in seen:
            discovered.append(candidate)
            seen.add(candidate)

    return sorted(discovered)


def write_index(root: Path, output: Path) -> dict:
    paths = discover_paths(root)
    records: list[dict] = []
    indexed_paths: set[str] = set()
    kinds: dict[str, int] = {}

    for path in paths:
        file_records, _ = records_for_path(root, path)
        for record in file_records:
            indexed_paths.add(record.path)
            kinds[record.kind] = kinds.get(record.kind, 0) + 1
            records.append(
                {
                    "id": record.id,
                    "path": record.path,
                    "urlPath": record.url_path,
                    "title": record.title,
                    "section": record.section,
                    "kind": record.kind,
                    "anchor": record.anchor,
                    "text": record.text,
                    "keywords": record.keywords,
                }
            )

    payload = {
        "generatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "recordCount": len(records),
        "indexedFileCount": len(indexed_paths),
        "kinds": kinds,
        "records": records,
    }
    output.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(payload, ensure_ascii=True)
    try:
        output.write_text(serialized, encoding="utf-8")
    except OSError:
        fallback_output = Path(str(output).replace("/GITHUB/", "/github/").replace("/Web/", "/web/"))
        fallback_output.parent.mkdir(parents=True, exist_ok=True)
        fallback_output.write_text(serialized, encoding="utf-8")
    return payload


def main() -> int:
    root = Path(os.environ.get("SITE_SEARCH_ROOT", ".")).resolve()
    output = Path(os.environ.get("SITE_SEARCH_OUTPUT", "assets/search-index.json"))
    if not output.is_absolute():
        output = root / output
    payload = write_index(root, output)
    print(json.dumps({k: v for k, v in payload.items() if k != "records"}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
