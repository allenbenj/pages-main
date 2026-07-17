#!/usr/bin/env python3
"""Build the canonical evidence inventory for the site.

Scans the shipped evidence directories (documents/, video/, audio/) and writes
documents/data/evidence-export.json. Every record is verified against the
working tree, so the export can never reference a file that does not exist —
run it after adding, renaming, or removing evidence files.

The output keeps the established schema (evidence / cards / facts / quotes /
chronology / contradictions / motions / referenceStandards) so existing
consumers keep working. Curated website card definitions are preserved from
the previous export when still valid. Each evidence record additionally
carries sizeBytes and sha256 so the public inventory can double as an
integrity manifest.

Prints a JSON summary to stdout.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import datetime, UTC
from pathlib import Path

EVIDENCE_DIRS = ("documents", "video", "audio")
OUTPUT_PATH = Path("documents/data/evidence-export.json")

FILE_TYPE_BY_SUFFIX = {
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".webp": "image",
    ".gif": "image",
    ".svg": "image",
    ".bmp": "image",
    ".pdf": "pdf",
    ".mp4": "video",
    ".mkv": "video",
    ".webm": "video",
    ".mov": "video",
    ".mp3": "audio",
    ".wav": "audio",
    ".ogg": "audio",
}

# Files that are site infrastructure rather than evidence content.
EXCLUDED_PATHS = {"documents/data/evidence-export.json"}

DATE_PREFIX_RE = re.compile(r"^\d{4}-\d{2}-\d{2}\s*-\s*")
ORDINAL_PREFIX_RE = re.compile(r"^\d+[_\s-]+")
TIMESTAMP_SUFFIX_RE = re.compile(r"_\d{8}_\d{6}$")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def humanize_title(path: Path) -> str:
    stem = path.stem
    stem = TIMESTAMP_SUFFIX_RE.sub("", stem)
    stem = DATE_PREFIX_RE.sub("", stem)
    stem = ORDINAL_PREFIX_RE.sub("", stem)
    stem = stem.replace("_", " ").replace("[1]", "").strip()
    stem = re.sub(r"\s{2,}", " ", stem)
    return stem or path.name


def collection_for(root: Path, path: Path) -> str:
    rel = path.relative_to(root)
    if len(rel.parts) > 1:
        return "/".join(rel.parts[1:-1]) or rel.parts[0]
    return rel.parts[0]


def iter_evidence_files(root: Path) -> list[Path]:
    files: list[Path] = []
    for name in EVIDENCE_DIRS:
        base = root / name
        if not base.is_dir():
            continue
        for path in base.rglob("*"):
            if not path.is_file():
                continue
            rel = path.relative_to(root).as_posix()
            if rel in EXCLUDED_PATHS or path.name.startswith("~$"):
                continue
            files.append(path)
    return sorted(files, key=lambda p: p.relative_to(root).as_posix().lower())


def load_previous_cards(output: Path) -> list[dict]:
    if not output.is_file():
        return []
    try:
        previous = json.loads(output.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    cards = previous.get("cards")
    return cards if isinstance(cards, list) else []


def build(root: Path, output: Path) -> dict:
    files = iter_evidence_files(root)

    evidence = []
    for index, path in enumerate(files, start=1):
        rel = path.relative_to(root).as_posix()
        file_type = FILE_TYPE_BY_SUFFIX.get(path.suffix.lower(), "document")
        evidence.append(
            {
                "id": index,
                "title": humanize_title(path),
                "filePath": rel,
                "fileType": file_type,
                "collection": collection_for(root, path),
                "sourceKind": "local_file",
                "note": None,
                "tags": [],
                "cards": [],
                "relatedEvidence": [],
                "sizeBytes": path.stat().st_size,
                "sha256": sha256(path),
            }
        )

    cards = load_previous_cards(output)
    # Drop curated card entries whose page no longer exists at the root.
    cards = [c for c in cards if isinstance(c, dict) and (root / str(c.get("page", ""))).is_file()]

    type_counts: dict[str, int] = {}
    for record in evidence:
        type_counts[record["fileType"]] = type_counts.get(record["fileType"], 0) + 1

    payload = {
        "generatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "generator": "tools/build_evidence_data.py",
        "counts": {
            "evidence": len(evidence),
            "evidenceByType": type_counts,
            "evidenceBytes": sum(r["sizeBytes"] for r in evidence),
            "cards": len(cards),
            "facts": 0,
            "quotes": 0,
            "chronologyEvents": 0,
            "contradictions": 0,
            "motions": 0,
            "referenceStandards": 0,
        },
        "evidence": evidence,
        "cards": cards,
        "facts": [],
        "quotes": [],
        "chronology": [],
        "contradictions": [],
        "motions": [],
        "referenceStandards": [],
    }

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8", newline="\n")
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    args = parser.parse_args()

    root = args.root.resolve()
    output = args.output if args.output.is_absolute() else root / args.output
    payload = build(root, output)

    summary = {k: v for k, v in payload.items() if k not in {"evidence", "cards"}}
    summary["output"] = str(output)
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
