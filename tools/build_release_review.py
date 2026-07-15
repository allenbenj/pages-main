#!/usr/bin/env python3
"""Create a non-destructive release-readiness review manifest."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit

from site_release import (
    BUILT_PUBLIC_DIRECTORIES,
    MAX_ARTIFACT_BYTES,
    PUBLIC_DIRECTORIES,
    PUBLIC_ROOT_FILES,
    REFERENCE_RE,
    SKIPPED_SCHEMES,
    SCRIPT_BODY_RE,
)


TEXT_EXTENSIONS = {".css", ".html"}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def public_files(root: Path) -> list[Path]:
    files = [path for path in root.glob("*.html") if path.is_file()]
    files.extend(root / name for name in PUBLIC_ROOT_FILES)
    for name in PUBLIC_DIRECTORIES:
        files.extend(path for path in (root / name).rglob("*") if path.is_file())
    for source_name in BUILT_PUBLIC_DIRECTORIES.values():
        built_root = root / source_name
        if built_root.is_dir():
            files.extend(path for path in built_root.rglob("*") if path.is_file())
    return files


def find_missing_targets(root: Path, files: list[Path]) -> list[dict[str, str]]:
    missing: list[dict[str, str]] = []
    for source in (path for path in files if path.suffix.lower() in TEXT_EXTENSIONS):
        published_source = source
        for published_name, source_name in BUILT_PUBLIC_DIRECTORIES.items():
            built_root = root / source_name
            if source.is_relative_to(built_root):
                published_source = root / published_name / source.relative_to(built_root)
                break
        try:
            content = source.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if source.suffix.lower() == ".html":
            content = SCRIPT_BODY_RE.sub(r"\1\2", content)
        for _, raw_target in REFERENCE_RE.findall(content):
            if "${" in raw_target or "{{" in raw_target:
                continue
            if raw_target.startswith(SKIPPED_SCHEMES) or raw_target.startswith("#"):
                continue
            target = urlsplit(raw_target)
            if not target.path:
                continue
            decoded = unquote(target.path)
            candidate = (
                root / decoded.lstrip("/")
                if decoded.startswith("/")
                else published_source.parent / decoded
            )
            try:
                relative = candidate.relative_to(root)
            except ValueError:
                missing.append({
                    "source": published_source.relative_to(root).as_posix(),
                    "target": raw_target,
                    "reason": "escapes_publish_root",
                })
                continue
            if not candidate.exists():
                missing.append({
                    "source": published_source.relative_to(root).as_posix(),
                    "target": raw_target,
                    "resolved_target": relative.as_posix(),
                    "reason": "missing",
                })
    return missing


def exact_duplicates(root: Path, files: list[Path]) -> list[dict[str, object]]:
    by_size: dict[int, list[Path]] = defaultdict(list)
    for path in files:
        size = path.stat().st_size
        if size:
            by_size[size].append(path)

    groups: list[dict[str, object]] = []
    for size, paths in by_size.items():
        if len(paths) < 2:
            continue
        by_hash: dict[str, list[Path]] = defaultdict(list)
        for path in paths:
            by_hash[sha256(path)].append(path)
        for digest, matches in by_hash.items():
            if len(matches) < 2:
                continue
            relative_paths = sorted(path.relative_to(root).as_posix() for path in matches)
            groups.append({
                "sha256": digest,
                "file_size_bytes": size,
                "count": len(relative_paths),
                "recoverable_bytes_after_review": size * (len(relative_paths) - 1),
                "paths": relative_paths,
                "recommended_action": "manual_review_only",
            })
    return sorted(groups, key=lambda group: int(group["recoverable_bytes_after_review"]), reverse=True)


def content_variants(root: Path) -> list[dict[str, object]]:
    content_root = root / "content"
    variants: list[dict[str, object]] = []
    for path in sorted(content_root.glob("*.html")):
        root_version = root / path.name
        entry: dict[str, object] = {
            "content_path": path.relative_to(root).as_posix(),
            "root_counterpart": root_version.name if root_version.exists() else None,
            "review_status": "manual_publish_decision_required",
        }
        if root_version.exists():
            entry["exact_duplicate_of_root"] = sha256(path) == sha256(root_version)
        else:
            entry["exact_duplicate_of_root"] = False
        variants.append(entry)
    return variants


def build_manifest(root: Path) -> dict[str, object]:
    files = public_files(root)
    total_bytes = sum(path.stat().st_size for path in files)
    duplicates = exact_duplicates(root, files)
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_root": str(root),
        "non_destructive": True,
        "public_directories": list(PUBLIC_DIRECTORIES),
        "built_public_directories": BUILT_PUBLIC_DIRECTORIES,
        "public_root_files": list(PUBLIC_ROOT_FILES),
        "artifact": {
            "file_count": len(files),
            "total_bytes": total_bytes,
            "budget_bytes": MAX_ARTIFACT_BYTES,
            "over_budget_bytes": max(0, total_bytes - MAX_ARTIFACT_BYTES),
        },
        "missing_targets": find_missing_targets(root, files),
        "content_variants": content_variants(root),
        "exact_duplicates": duplicates,
        "exact_duplicate_recoverable_bytes": sum(
            int(group["recoverable_bytes_after_review"]) for group in duplicates
        ),
        "do_not_auto_delete": [
            "legal records",
            "evidence images",
            "audio",
            "video",
            "PDFs",
            "source code",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    manifest = build_manifest(args.root.resolve())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps({
        "output": str(args.output),
        "missing_targets": len(manifest["missing_targets"]),
        "exact_duplicate_groups": len(manifest["exact_duplicates"]),
        "recoverable_bytes_after_review": manifest["exact_duplicate_recoverable_bytes"],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
