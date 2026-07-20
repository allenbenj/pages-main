#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import unquote, urlparse


SCAN_EXTENSIONS = {
    ".html",
    ".htm",
    ".css",
    ".js",
    ".mjs",
    ".cjs",
    ".ts",
    ".tsx",
    ".jsx",
    ".md",
}

MAX_SCAN_BYTES = 750_000

FILE_EXTENSIONS = {
    ".html",
    ".htm",
    ".css",
    ".js",
    ".mjs",
    ".cjs",
    ".ts",
    ".tsx",
    ".jsx",
    ".md",
    ".json",
    ".xml",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".avif",
    ".ico",
    ".bmp",
    ".pdf",
    ".mp4",
    ".mov",
    ".webm",
    ".mp3",
    ".wav",
    ".ogg",
    ".txt",
    ".csv",
    ".sqlite",
    ".db",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
}

SITE_ROOT_FILENAMES = {
    "index.html",
    "overview.html",
    "timeline.html",
    "players.html",
    "evidence.html",
    "contradictions.html",
    "general-videos.html",
    "misconduct.html",
    "misconductandfailure.html",
    "documentspage.html",
    "connections.html",
    "case-study.html",
    "scene.html",
    "prosecutor_allowed.html",
    "judicial-duty.html",
    "why-dont-we-have-this-system.html",
}

IGNORE_DIRS = {
    ".git",
    "node_modules",
    ".venv",
    ".local",
    "__pycache__",
}

HTML_ATTR_RE = re.compile(
    r"""(?P<attr>href|src|poster|data-href|data-src|data-modal-image)\s*=\s*(?P<quote>["'])(?P<value>.*?)(?P=quote)""",
    re.IGNORECASE,
)
CSS_URL_RE = re.compile(r"""(?<![A-Za-z])url\(\s*(?P<quote>["']?)(?P<value>.*?)(?P=quote)\s*\)""", re.IGNORECASE)
FETCH_RE = re.compile(
    r"""(?P<kind>fetch|import)\s*\(\s*(?P<quote>["'])(?P<value>.*?)(?P=quote)""",
    re.IGNORECASE,
)
LOCATION_RE = re.compile(
    r"""(?<![\w.])(?P<kind>window\.open|open|location(?:\.href)?|window\.location(?:\.href)?|document\.location(?:\.href)?)\s*(?:=\s*|\(\s*)(?P<quote>["'])(?P<value>.*?)(?P=quote)""",
    re.IGNORECASE,
)
MARKDOWN_RE = re.compile(
    r"""!\[[^\]]*]\((?P<img>[^)\s]+)(?:\s+"[^"]*")?\)|\[[^\]]+]\((?P<link>[^)\s]+)(?:\s+"[^"]*")?\)"""
)


@dataclass
class LinkRecord:
    source_path: str
    source_type: str
    line_no: int
    link_kind: str
    raw_target: str
    normalized_target: str
    target_path: str | None
    target_exists: bool
    target_type: str
    is_external: bool
    has_fragment: bool
    fragment: str | None
    has_query: bool
    query: str | None


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def should_ignore_dir(path: Path) -> bool:
    return path.name in IGNORE_DIRS


def iter_files(root: Path) -> Iterable[Path]:
    for current_root, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        base = Path(current_root)
        for filename in filenames:
            path = base / filename
            if path.is_file():
                yield path


def read_text(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            return None
    except OSError:
        return None


def line_number_from_offset(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def should_scan_file(path: Path) -> bool:
    suffix = path.suffix.lower()
    if suffix not in SCAN_EXTENSIONS:
        return False
    posix_path = path.as_posix()
    if "/documents/research/" in posix_path:
        return False
    if "/.agents/" in posix_path or "/.codex/" in posix_path or "/.github/" in posix_path:
        return False
    if path.parent.name == "pages" and path.suffix.lower() == ".js" and (
        path.name.startswith(("fix_", "test_", "check_links_"))
    ):
        return False
    try:
        size = path.stat().st_size
    except OSError:
        return False
    name = path.name.lower()
    if size > MAX_SCAN_BYTES:
        return False
    if name.endswith(".min.js") or name.endswith(".min.css"):
        return False
    if name in {"jquery.js", "tailwindcdn.js", "webflow-main.js", "webflow-schunk.js"}:
        return False
    return True


def classify_site_role(rel_path: str, extension: str) -> str | None:
    path = Path(rel_path)
    parts = path.parts
    if not parts:
        return None

    first = parts[0]
    if len(parts) == 1 and path.name in SITE_ROOT_FILENAMES:
        return "page"
    if first == "content" and extension in {".html", ".htm"}:
        return "page"
    if first == "shared" and extension in {".js", ".css"}:
        return "shared"
    if first == "assets":
        return "asset"
    if first in {"audio", "video"}:
        return "media"
    if first == "documents":
        if len(parts) > 1 and parts[1] == "research":
            if extension in {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".mp4", ".mp3", ".wav"}:
                return "document_asset"
            return None
        if extension in FILE_EXTENSIONS:
            return "document_asset"
    if first == "network_analysis" and extension in {".html", ".css", ".js", ".ts", ".tsx", ".jsx"}:
        return "app_asset"
    return None


def is_probably_external(value: str) -> bool:
    parsed = urlparse(value)
    if parsed.scheme in {"http", "https", "mailto", "tel", "javascript", "data", "blob", "about"}:
        return True
    return value.startswith("//")


def should_skip_target(value: str) -> bool:
    stripped = value.strip()
    if not stripped:
        return True
    if "${" in stripped or "{" in stripped or "}" in stripped:
        return True
    if ", window.location" in stripped or ",window.location" in stripped:
        return True
    if stripped.startswith(("item.", "entry.", "candidate", "objectUrl", "blob:", "data:")):
        return True
    if stripped.startswith("/api/"):
        return True
    return False


def normalize_target(value: str) -> tuple[str, str | None, str | None]:
    stripped = value.strip()
    no_query, _, query = stripped.partition("?")
    no_fragment, _, fragment = no_query.partition("#")
    normalized = no_fragment.strip()
    return normalized, fragment or None, query or None


def candidate_paths(root: Path, source_file: Path, normalized_target: str) -> list[Path]:
    decoded = unquote(normalized_target)
    candidates: list[Path] = []

    if decoded.startswith("/"):
        rel = decoded.lstrip("/")
        candidates.append((root / rel).resolve())

        source_parts = source_file.resolve().parts
        root_parts = root.resolve().parts
        relative_parts = source_parts[len(root_parts) : -1]
        for index in range(len(relative_parts), 0, -1):
            base = root.joinpath(*relative_parts[:index])
            if (base / "package.json").exists():
                candidates.append((base / rel).resolve())
    else:
        candidates.append((source_file.parent / decoded).resolve())
        if source_file.parent.name == "shared" and not decoded.startswith((".", "#")):
            candidates.append((root / decoded).resolve())

    unique: list[Path] = []
    seen: set[str] = set()
    for path in candidates:
        key = str(path)
        if key not in seen:
            seen.add(key)
            unique.append(path)
    return unique


def classify_target(path: Path | None) -> str:
    if path is None:
        return "missing"
    if path.is_dir():
        return "dir"
    return path.suffix.lower() or "file"


def extract_links(root: Path, source_file: Path, text: str) -> list[LinkRecord]:
    source_rel = source_file.relative_to(root).as_posix()
    records: list[LinkRecord] = []

    patterns = [
        ("html_attr", HTML_ATTR_RE),
        ("css_url", CSS_URL_RE),
        ("script_call", FETCH_RE),
        ("script_nav", LOCATION_RE),
    ]
    if source_file.suffix.lower() == ".md":
        patterns.append(("markdown", MARKDOWN_RE))

    for source_type, pattern in patterns:
        for match in pattern.finditer(text):
            raw_target = next(
                (group for group in (match.groupdict().get("value"), match.groupdict().get("img"), match.groupdict().get("link")) if group),
                "",
            ).strip()
            if not raw_target:
                continue
            if should_skip_target(raw_target):
                continue

            if raw_target.startswith("#"):
                normalized = ""
                fragment = raw_target[1:] or None
                query = None
                records.append(
                    LinkRecord(
                        source_path=source_rel,
                        source_type=source_type,
                        line_no=line_number_from_offset(text, match.start()),
                        link_kind=(match.groupdict().get("attr") or match.groupdict().get("kind") or source_type).lower(),
                        raw_target=raw_target,
                        normalized_target=normalized,
                        target_path=None,
                        target_exists=True,
                        target_type="fragment",
                        is_external=False,
                        has_fragment=bool(fragment),
                        fragment=fragment,
                        has_query=False,
                        query=None,
                    )
                )
                continue

            if is_probably_external(raw_target):
                normalized, fragment, query = normalize_target(raw_target)
                records.append(
                    LinkRecord(
                        source_path=source_rel,
                        source_type=source_type,
                        line_no=line_number_from_offset(text, match.start()),
                        link_kind=(match.groupdict().get("attr") or match.groupdict().get("kind") or source_type).lower(),
                        raw_target=raw_target,
                        normalized_target=normalized,
                        target_path=None,
                        target_exists=True,
                        target_type="external",
                        is_external=True,
                        has_fragment=bool(fragment),
                        fragment=fragment,
                        has_query=bool(query),
                        query=query,
                    )
                )
                continue

            normalized, fragment, query = normalize_target(raw_target)
            if not normalized:
                continue

            target_path: Path | None = None
            target_exists = False
            candidates = candidate_paths(root, source_file, normalized)
            for candidate in candidates:
                if candidate.exists():
                    target_path = candidate
                    target_exists = True
                    break
            if target_path is None and candidates:
                target_path = candidates[0]

            records.append(
                LinkRecord(
                    source_path=source_rel,
                    source_type=source_type,
                    line_no=line_number_from_offset(text, match.start()),
                    link_kind=(match.groupdict().get("attr") or match.groupdict().get("kind") or source_type).lower(),
                    raw_target=raw_target,
                    normalized_target=normalized,
                    target_path=target_path.relative_to(root).as_posix() if str(target_path).startswith(str(root.resolve())) else str(target_path),
                    target_exists=target_exists,
                    target_type=classify_target(target_path if target_exists else None),
                    is_external=False,
                    has_fragment=bool(fragment),
                    fragment=fragment,
                    has_query=bool(query),
                    query=query,
                )
            )

    return records


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        PRAGMA journal_mode=WAL;
        DROP TABLE IF EXISTS runs;
        DROP TABLE IF EXISTS files;
        DROP TABLE IF EXISTS links;
        DROP VIEW IF EXISTS site_files;
        DROP VIEW IF EXISTS site_unlinked_files;

        CREATE TABLE runs (
            id INTEGER PRIMARY KEY,
            root_path TEXT NOT NULL,
            generated_at TEXT NOT NULL,
            total_files INTEGER NOT NULL,
            total_site_files INTEGER NOT NULL,
            total_scanned_files INTEGER NOT NULL,
            total_links INTEGER NOT NULL,
            total_internal_links INTEGER NOT NULL,
            broken_internal_links INTEGER NOT NULL,
            unlinked_files INTEGER NOT NULL,
            unlinked_site_files INTEGER NOT NULL
        );

        CREATE TABLE files (
            path TEXT PRIMARY KEY,
            extension TEXT NOT NULL,
            size_bytes INTEGER NOT NULL,
            modified_at TEXT NOT NULL,
            site_role TEXT,
            is_site_file INTEGER NOT NULL,
            scanned_for_links INTEGER NOT NULL,
            outgoing_links INTEGER NOT NULL,
            incoming_links INTEGER NOT NULL,
            is_linked INTEGER NOT NULL,
            exists_on_disk INTEGER NOT NULL
        );

        CREATE TABLE links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_path TEXT NOT NULL,
            source_type TEXT NOT NULL,
            line_no INTEGER NOT NULL,
            link_kind TEXT NOT NULL,
            raw_target TEXT NOT NULL,
            normalized_target TEXT NOT NULL,
            target_path TEXT,
            target_exists INTEGER NOT NULL,
            target_type TEXT NOT NULL,
            is_external INTEGER NOT NULL,
            has_fragment INTEGER NOT NULL,
            fragment TEXT,
            has_query INTEGER NOT NULL,
            query TEXT
        );

        CREATE INDEX idx_links_source_path ON links(source_path);
        CREATE INDEX idx_links_target_path ON links(target_path);
        CREATE INDEX idx_links_broken ON links(target_exists, is_external);

        CREATE VIEW site_files AS
        SELECT *
        FROM files
        WHERE is_site_file = 1;

        CREATE VIEW site_unlinked_files AS
        SELECT *
        FROM files
        WHERE is_site_file = 1
          AND incoming_links = 0;
        """
    )


def build_database(root: Path, db_path: Path, summary_path: Path) -> dict:
    all_files = []
    scanned_files = []
    links: list[LinkRecord] = []

    for path in iter_files(root):
        rel = path.relative_to(root).as_posix()
        stat = path.stat()
        all_files.append(
            {
                "path": rel,
                "extension": path.suffix.lower(),
                "size_bytes": stat.st_size,
                "modified_at": datetime.fromtimestamp(stat.st_mtime, timezone.utc).replace(microsecond=0).isoformat(),
                "site_role": classify_site_role(rel, path.suffix.lower()),
                "is_site_file": 0,
                "scanned_for_links": int(should_scan_file(path)),
            }
        )
        if should_scan_file(path):
            scanned_files.append(path)
            text = read_text(path)
            if text is not None:
                links.extend(extract_links(root, path, text))

    incoming_counts: dict[str, int] = {}
    outgoing_counts: dict[str, int] = {}
    broken_links: list[dict] = []

    for link in links:
        outgoing_counts[link.source_path] = outgoing_counts.get(link.source_path, 0) + 1
        if link.target_path and not link.is_external and link.target_exists:
            incoming_counts[link.target_path] = incoming_counts.get(link.target_path, 0) + 1
        if not link.is_external and not link.target_exists:
            broken_links.append(
                {
                    "source_path": link.source_path,
                    "line_no": link.line_no,
                    "raw_target": link.raw_target,
                    "resolved_target": link.target_path,
                    "link_kind": link.link_kind,
                }
            )

    for file_info in all_files:
        incoming = incoming_counts.get(file_info["path"], 0)
        file_info["is_site_file"] = int(file_info["site_role"] is not None)
        file_info["incoming_links"] = incoming
        file_info["outgoing_links"] = outgoing_counts.get(file_info["path"], 0)
        file_info["is_linked"] = int(incoming > 0)
        file_info["exists_on_disk"] = 1

    site_files = [file_info for file_info in all_files if file_info["is_site_file"]]
    unlinked_files = [
        file_info["path"]
        for file_info in all_files
        if file_info["extension"] in FILE_EXTENSIONS and file_info["incoming_links"] == 0
    ]
    site_unlinked_files = [file_info["path"] for file_info in site_files if file_info["incoming_links"] == 0]

    db_path.parent.mkdir(parents=True, exist_ok=True)
    summary_path.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(db_path)
    try:
        init_db(conn)

        conn.execute(
            """
            INSERT INTO runs (
                root_path,
                generated_at,
                total_files,
                total_site_files,
                total_scanned_files,
                total_links,
                total_internal_links,
                broken_internal_links,
                unlinked_files,
                unlinked_site_files
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(root),
                utc_now(),
                len(all_files),
                len(site_files),
                len(scanned_files),
                len(links),
                sum(1 for link in links if not link.is_external),
                len(broken_links),
                len(unlinked_files),
                len(site_unlinked_files),
            ),
        )

        conn.executemany(
            """
            INSERT INTO files (
                path,
                extension,
                size_bytes,
                modified_at,
                site_role,
                is_site_file,
                scanned_for_links,
                outgoing_links,
                incoming_links,
                is_linked,
                exists_on_disk
            )
            VALUES (:path, :extension, :size_bytes, :modified_at, :site_role, :is_site_file, :scanned_for_links, :outgoing_links, :incoming_links, :is_linked, :exists_on_disk)
            """,
            all_files,
        )

        conn.executemany(
            """
            INSERT INTO links (
                source_path,
                source_type,
                line_no,
                link_kind,
                raw_target,
                normalized_target,
                target_path,
                target_exists,
                target_type,
                is_external,
                has_fragment,
                fragment,
                has_query,
                query
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    link.source_path,
                    link.source_type,
                    link.line_no,
                    link.link_kind,
                    link.raw_target,
                    link.normalized_target,
                    link.target_path,
                    int(link.target_exists),
                    link.target_type,
                    int(link.is_external),
                    int(link.has_fragment),
                    link.fragment,
                    int(link.has_query),
                    link.query,
                )
                for link in links
            ],
        )
        conn.commit()
    finally:
        conn.close()

    summary = {
        "generated_at": utc_now(),
        "root_path": str(root),
        "total_files": len(all_files),
        "total_site_files": len(site_files),
        "total_scanned_files": len(scanned_files),
        "total_links": len(links),
        "total_internal_links": sum(1 for link in links if not link.is_external),
        "broken_internal_links": len(broken_links),
        "unlinked_files": len(unlinked_files),
        "unlinked_site_files": len(site_unlinked_files),
        "top_broken_links": broken_links[:100],
        "top_unlinked_files": unlinked_files[:200],
        "top_unlinked_site_files": site_unlinked_files[:200],
        "db_path": str(db_path),
    }
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit local links across the pages workspace and store results in SQLite.")
    parser.add_argument("--root", default=".", help="Root folder to scan. Defaults to the current directory.")
    parser.add_argument("--db", default=".local/link_audit/link_audit.sqlite", help="SQLite output path.")
    parser.add_argument("--summary", default=".local/link_audit/link_audit_summary.json", help="JSON summary output path.")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    db_path = Path(args.db)
    if not db_path.is_absolute():
        db_path = (root / db_path).resolve()
    summary_path = Path(args.summary)
    if not summary_path.is_absolute():
        summary_path = (root / summary_path).resolve()

    summary = build_database(root, db_path, summary_path)
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
