#!/usr/bin/env python3
"""Archive raster masters and restore smaller delivery files at the same URLs."""

from __future__ import annotations

import argparse
import csv
import json
import subprocess
from pathlib import Path


RASTER_EXTENSIONS = {".png", ".jpg", ".jpeg"}
SCALE_FILTER = "scale='if(gte(iw,ih),min(2560,iw),-2)':'if(gte(iw,ih),-2,min(2560,ih))'"


def build_manifest(root: Path, archive: Path, manifest: Path, minimum_bytes: int) -> None:
    rows: list[dict[str, str]] = []
    for directory in (root / "assets", root / "documents"):
        for source in sorted(directory.rglob("*")):
            if not source.is_file() or source.suffix.lower() not in RASTER_EXTENSIONS:
                continue
            if source.stat().st_size < minimum_bytes:
                continue
            relative = source.relative_to(root)
            rows.append({
                "Action": "move",
                "SourcePath": str(source),
                "DestPath": str(archive / relative),
                "Category": "preserved_raster_master",
                "Reason": "restore optimized delivery copy at original public URL",
            })
    manifest.parent.mkdir(parents=True, exist_ok=True)
    with manifest.open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=["Action", "SourcePath", "DestPath", "Category", "Reason"])
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({"operations": len(rows), "manifest": str(manifest)}, indent=2))


def optimize(manifest: Path, report: Path) -> None:
    records: list[dict[str, object]] = []
    with manifest.open(encoding="utf-8-sig", newline="") as stream:
        rows = list(csv.DictReader(stream))
    for row in rows:
        master = Path(row["DestPath"])
        delivery = Path(row["SourcePath"])
        if not master.is_file():
            raise FileNotFoundError(master)
        delivery.parent.mkdir(parents=True, exist_ok=True)
        temporary = delivery.with_name(f"{delivery.stem}.delivery-tmp{delivery.suffix}")
        command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(master), "-vf", SCALE_FILTER, "-frames:v", "1"]
        if delivery.suffix.lower() == ".png":
            command.extend(["-c:v", "png", "-compression_level", "9"])
        else:
            command.extend(["-c:v", "mjpeg", "-q:v", "2"])
        command.append(str(temporary))
        subprocess.run(command, check=True)
        if not temporary.is_file():
            raise RuntimeError(f"Encoder did not produce {temporary}")
        temporary.replace(delivery)
        records.append({
            "public_path": str(delivery),
            "archived_master": str(master),
            "master_bytes": master.stat().st_size,
            "delivery_bytes": delivery.stat().st_size,
        })
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(records, indent=2), encoding="utf-8")
    print(json.dumps({
        "files": len(records),
        "master_bytes": sum(int(record["master_bytes"]) for record in records),
        "delivery_bytes": sum(int(record["delivery_bytes"]) for record in records),
    }, indent=2))


def main() -> int:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)
    plan = subparsers.add_parser("plan")
    plan.add_argument("--root", type=Path, required=True)
    plan.add_argument("--archive", type=Path, required=True)
    plan.add_argument("--manifest", type=Path, required=True)
    plan.add_argument("--minimum-bytes", type=int, default=1_000_000)
    render = subparsers.add_parser("render")
    render.add_argument("--manifest", type=Path, required=True)
    render.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    if args.command == "plan":
        build_manifest(args.root.resolve(), args.archive.resolve(), args.manifest.resolve(), args.minimum_bytes)
    else:
        optimize(args.manifest.resolve(), args.report.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
