#!/usr/bin/env python3
"""Render consolidated WebP deliveries and rewrite repository image references."""

from __future__ import annotations

import argparse
import csv
import json
import subprocess
from pathlib import Path
from urllib.parse import quote


TEXT_EXTENSIONS = {".css", ".html", ".js", ".json", ".md", ".py", ".yaml", ".yml"}
EXCLUDED_PARTS = {".git", ".local", "archive", "node_modules", "reports"}
GENERATED_FILES = {Path("assets/search-index.json"), Path("documents/data/evidence-export.json")}


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def render_webp(manifest: Path, report: Path) -> None:
    records: list[dict[str, object]] = []
    for row in read_rows(manifest):
        source = Path(row["SourcePathAfterMove"])
        output = Path(row["OutputWebP"])
        mode = row["Mode"]
        if not source.is_file():
            raise FileNotFoundError(source)
        if output.exists():
            records.append({
                "source": str(source),
                "output": str(output),
                "mode": mode,
                "status": "existing",
                "source_bytes": source.stat().st_size,
                "output_bytes": output.stat().st_size,
            })
            continue
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_name(f"{output.stem}.conversion-tmp.webp")
        encoder_source = source
        svg_temporary: Path | None = None
        if source.suffix.lower() == ".svg":
            import cairosvg

            svg_temporary = output.with_name(f"{output.stem}.conversion-svg.png")
            cairosvg.svg2png(url=str(source), write_to=str(svg_temporary))
            encoder_source = svg_temporary
        command = [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(encoder_source), "-frames:v", "1", "-c:v", "libwebp",
            "-compression_level", "6",
        ]
        if mode == "lossless":
            command.extend(["-lossless", "1"])
        else:
            command.extend(["-q:v", "90"])
        command.append(str(temporary))
        try:
            subprocess.run(command, check=True)
        finally:
            if svg_temporary is not None:
                svg_temporary.unlink(missing_ok=True)
        if not temporary.is_file():
            raise RuntimeError(f"Encoder did not produce {temporary}")
        temporary.replace(output)
        records.append({
            "source": str(source),
            "output": str(output),
            "mode": mode,
            "status": "converted",
            "source_bytes": source.stat().st_size,
            "output_bytes": output.stat().st_size,
        })
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(records, indent=2), encoding="utf-8")
    print(json.dumps({
        "converted": len(records),
        "source_bytes": sum(int(item["source_bytes"]) for item in records),
        "output_bytes": sum(int(item["output_bytes"]) for item in records),
        "report": str(report),
    }, indent=2))


def replacement_pairs(old: str, new: str) -> list[tuple[str, str]]:
    pairs = [(old, new), (old.replace("/", "\\"), new.replace("/", "\\"))]
    encoded_old = quote(old, safe="/")
    encoded_new = quote(new, safe="/")
    if encoded_old != old:
        pairs.append((encoded_old, encoded_new))
    partially_encoded_old = quote(old, safe="/()")
    partially_encoded_new = quote(new, safe="/()")
    if partially_encoded_old not in {old, encoded_old}:
        pairs.append((partially_encoded_old, partially_encoded_new))
    return pairs


def rewrite_references(root: Path, mapping: Path, report: Path) -> None:
    mappings = [(row["OldPath"], row["NewPath"]) for row in read_rows(mapping)]
    changed: list[dict[str, object]] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        relative = path.relative_to(root)
        if any(part in EXCLUDED_PARTS for part in relative.parts) or relative in GENERATED_FILES:
            continue
        original = path.read_text(encoding="utf-8")
        updated = original
        replacements = 0
        for old, new in mappings:
            for old_value, new_value in replacement_pairs(old, new):
                count = updated.count(old_value)
                if count:
                    updated = updated.replace(old_value, new_value)
                    replacements += count
        if updated != original:
            path.write_text(updated, encoding="utf-8", newline="\n")
            changed.append({"path": str(relative), "replacements": replacements})
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(changed, indent=2), encoding="utf-8")
    print(json.dumps({
        "changed_files": len(changed),
        "replacements": sum(int(item["replacements"]) for item in changed),
        "report": str(report),
    }, indent=2))


def verify(root: Path, mapping: Path, conversion_manifest: Path) -> None:
    missing_outputs = [
        row["OutputWebP"]
        for row in read_rows(conversion_manifest)
        if not Path(row["OutputWebP"]).is_file()
    ]
    stale: list[dict[str, str]] = []
    old_paths = [row["OldPath"] for row in read_rows(mapping)]
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        relative = path.relative_to(root)
        if any(part in EXCLUDED_PARTS for part in relative.parts) or relative in GENERATED_FILES:
            continue
        text = path.read_text(encoding="utf-8")
        for old in old_paths:
            if old in text or quote(old, safe="/") in text:
                stale.append({"path": str(relative), "old_reference": old})
    result = {"missing_outputs": missing_outputs, "stale_references": stale}
    print(json.dumps(result, indent=2))
    if missing_outputs or stale:
        raise SystemExit(1)


def main() -> int:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    convert = subparsers.add_parser("convert")
    convert.add_argument("--manifest", type=Path, required=True)
    convert.add_argument("--report", type=Path, required=True)

    rewrite = subparsers.add_parser("rewrite")
    rewrite.add_argument("--root", type=Path, required=True)
    rewrite.add_argument("--map", type=Path, required=True)
    rewrite.add_argument("--report", type=Path, required=True)

    check = subparsers.add_parser("verify")
    check.add_argument("--root", type=Path, required=True)
    check.add_argument("--map", type=Path, required=True)
    check.add_argument("--conversion-manifest", type=Path, required=True)

    args = parser.parse_args()
    if args.command == "convert":
        render_webp(args.manifest.resolve(), args.report.resolve())
    elif args.command == "rewrite":
        rewrite_references(args.root.resolve(), args.map.resolve(), args.report.resolve())
    else:
        verify(args.root.resolve(), args.map.resolve(), args.conversion_manifest.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
