#!/usr/bin/env python3
"""Stage and validate the static GitHub Pages release artifact."""
from __future__ import annotations
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

PUBLIC_DIRECTORIES = ("assets", "audio", "content", "documents", "shared", "video")
BUILT_PUBLIC_DIRECTORIES = {"network_analysis": "network_analysis/dist"}
PUBLIC_ROOT_FILES = ("shell.js",)
MAX_ARTIFACT_BYTES = 900 * 1024 * 1024
FORBIDDEN_PATH_PARTS = {".agents", ".codex", ".github", ".grok", ".copilot", ".cursor", ".kilo", ".git", "node_modules"}
REFERENCE_RE = re.compile(
    r"(?:href|src|poster|data-modal-image|data-href)\s*=\s*([\"'])(.*?)\1",
    re.IGNORECASE,
)
SCRIPT_BODY_RE = re.compile(r"(<script\b[^>]*>).*?(</script\s*>)", re.IGNORECASE | re.DOTALL)
SKIPPED_SCHEMES = ("data:", "http:", "https:", "javascript:", "mailto:", "tel:", "//")
# Preserve the public URL while producing a web-optimized delivery copy in the
# disposable release artifact. The original evidence file remains untouched.
VIDEO_TRANSCODES = (
    "video/O Deals Last Blowup Every Stares At Her Compressed.mp4",
)


def transcode_delivery_video(path: Path) -> None:
    temporary = path.with_suffix(".release-tmp.mp4")
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(path),
        "-map", "0:v:0", "-map", "0:a?", "-c:v", "libx264", "-preset", "medium",
        "-crf", "28", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k", str(temporary),
    ]
    subprocess.run(command, check=True)
    if not temporary.is_file() or temporary.stat().st_size >= path.stat().st_size:
        temporary.unlink(missing_ok=True)
        return
    temporary.replace(path)

def stage_site(source: Path, output: Path) -> None:
    if output.exists():
        raise ValueError(f"Output path already exists: {output}")
    output.mkdir(parents=True)
    for page in source.glob("*.html"):
        shutil.copy2(page, output / page.name)
    for name in PUBLIC_ROOT_FILES:
        path = source / name
        if not path.is_file():
            raise FileNotFoundError(f"Required public root file is missing: {path}")
        shutil.copy2(path, output / name)
    for name in PUBLIC_DIRECTORIES:
        path = source / name
        if not path.is_dir():
            raise FileNotFoundError(f"Required public directory is missing: {path}")
        shutil.copytree(path, output / name)
    for destination, source_name in BUILT_PUBLIC_DIRECTORIES.items():
        path = source / source_name
        if not path.is_dir():
            raise FileNotFoundError(f"Required built public directory is missing: {path}")
        shutil.copytree(path, output / destination)
    for relative in VIDEO_TRANSCODES:
        delivery_file = output / relative
        if not delivery_file.is_file():
            raise FileNotFoundError(f"Configured delivery video is missing: {delivery_file}")
        transcode_delivery_video(delivery_file)
    (output / ".nojekyll").touch()

def iter_files(root: Path):
    yield from (path for path in root.rglob("*") if path.is_file())

def validate_site(root: Path) -> dict:
    errors: list[str] = []
    files = list(iter_files(root))
    total_bytes = sum(path.stat().st_size for path in files)
    for path in files:
        relative = path.relative_to(root)
        if any(part in FORBIDDEN_PATH_PARTS for part in relative.parts):
            errors.append(f"forbidden file in release artifact: {relative.as_posix()}")
    for page in (path for path in files if path.suffix.lower() in {".html", ".css"}):
        try:
            text = page.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            errors.append(f"cannot decode text file: {page.relative_to(root).as_posix()}")
            continue
        if page.suffix.lower() == ".html":
            text = SCRIPT_BODY_RE.sub(r"\1\2", text)
        for _, raw_target in REFERENCE_RE.findall(text):
            if "${" in raw_target or "{{" in raw_target:
                continue
            if raw_target.startswith(SKIPPED_SCHEMES) or raw_target.startswith("#"):
                continue
            target = urlsplit(raw_target)
            if not target.path:
                continue
            decoded = unquote(target.path)
            candidate = root / decoded.lstrip("/") if decoded.startswith("/") else page.parent / decoded
            try:
                candidate.relative_to(root)
            except ValueError:
                errors.append(f"path escapes artifact: {page.relative_to(root).as_posix()} -> {raw_target}")
                continue
            if not candidate.exists():
                errors.append(f"missing target: {page.relative_to(root).as_posix()} -> {raw_target}")
    if total_bytes > MAX_ARTIFACT_BYTES:
        errors.append(f"artifact is {total_bytes} bytes; limit is {MAX_ARTIFACT_BYTES} bytes")
    manifest = {"commit": os.environ.get("GITHUB_SHA", "local"), "files": len(files), "bytes": total_bytes, "sha256": hashlib.sha256("\n".join(f"{path.relative_to(root).as_posix()}:{path.stat().st_size}" for path in sorted(files)).encode()).hexdigest(), "errors": errors}
    (root / "release-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    if errors:
        raise RuntimeError("\n".join(errors))
    return manifest

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("stage", "validate"))
    parser.add_argument("--source", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--root", type=Path)
    args = parser.parse_args()
    try:
        if args.command == "stage":
            if not args.source or not args.output:
                parser.error("stage requires --source and --output")
            stage_site(args.source.resolve(), args.output.resolve())
            print(f"staged {args.output}")
        else:
            if not args.root:
                parser.error("validate requires --root")
            print(json.dumps(validate_site(args.root.resolve()), indent=2))
    except (OSError, RuntimeError, ValueError) as error:
        print(f"release validation failed: {error}", file=sys.stderr)
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
