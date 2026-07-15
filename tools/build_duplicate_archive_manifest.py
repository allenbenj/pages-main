#!/usr/bin/env python3
"""Create a reversible manifest that archives redundant published files."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


TEXT_EXTENSIONS = {".html", ".css", ".js"}
EXCLUDED_PARTS = {"node_modules", ".git", "archive", "_archive"}


def source_texts(root: Path) -> list[str]:
    texts: list[str] = []
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if any(part in EXCLUDED_PARTS for part in path.relative_to(root).parts):
            continue
        texts.append(path.read_text(encoding="utf-8", errors="ignore"))
    return texts


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--review", type=Path, required=True)
    parser.add_argument("--archive", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--mapping", type=Path, required=True)
    args = parser.parse_args()

    root = args.root.resolve()
    archive = args.archive.resolve()
    review = json.loads(args.review.read_text(encoding="utf-8"))
    texts = source_texts(root)
    rows: list[dict[str, str]] = []
    mapping: list[dict[str, object]] = []
    for group in review["exact_duplicates"]:
        paths = list(group["paths"])
        references = {path: sum(text.count(path) for text in texts) for path in paths}
        canonical = min(paths, key=lambda path: (-references[path], len(path), path))
        archived = [path for path in paths if path != canonical]
        mapping.append({
            "sha256": group["sha256"],
            "canonical": canonical,
            "archived": archived,
            "references_before_rewrite": references,
            "recoverable_bytes_after_review": group["recoverable_bytes_after_review"],
        })
        for path in archived:
            source = root / path
            destination = archive / path
            if not source.is_file():
                raise FileNotFoundError(source)
            rows.append({
                "Action": "move",
                "SourcePath": str(source),
                "DestPath": str(destination),
                "Category": "exact_duplicate_media",
                "Reason": f"sha256={group['sha256']}; canonical={canonical}",
            })

    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    with args.manifest.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=["Action", "SourcePath", "DestPath", "Category", "Reason"])
        writer.writeheader()
        writer.writerows(rows)
    args.mapping.write_text(json.dumps(mapping, indent=2), encoding="utf-8")
    print(json.dumps({"operations": len(rows), "groups": len(mapping), "archive": str(archive)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
