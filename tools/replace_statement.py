#!/usr/bin/env python3
"""Preview or replace a time value in text-based files under a directory."""

from __future__ import annotations

import argparse
from pathlib import Path


DEFAULT_EXTENSIONS = {
    ".css", ".csv", ".html", ".htm", ".js", ".json", ".md", ".txt", ".ts", ".tsx", ".xml", ".yaml", ".yml",
}


def parse_extensions(value: str) -> set[str]:
    return {
        extension if extension.startswith(".") else f".{extension}"
        for extension in (item.strip().lower() for item in value.split(","))
        if extension
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Find a time in text-based files and optionally replace it."
    )
    parser.add_argument("directory", type=Path, help="Directory to scan recursively")
    parser.add_argument("--find", default="This statement is false. Freeman presented an inaccurate timeline to the court.", help="Text to find (default: 2:42)")
    parser.add_argument("--replace", default="", help="Replacement text (default: 3:42)")
    parser.add_argument(
        "--extensions",
        default=",".join(sorted(DEFAULT_EXTENSIONS)),
        help="Comma-separated file extensions to scan",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write changes. Without this flag the script only previews matches.",
    )
    args = parser.parse_args()

    root = args.directory.resolve()
    if not root.is_dir():
        parser.error(f"Not a directory: {root}")
    if not args.find:
        parser.error("--find cannot be empty")

    extensions = parse_extensions(args.extensions)
    matched_files = 0
    replacements = 0

    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in extensions:
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue

        count = content.count(args.find)
        if not count:
            continue

        matched_files += 1
        replacements += count
        relative = path.relative_to(root)
        print(f"{relative}: {count} match{'es' if count != 1 else ''}")

        if args.apply:
            path.write_text(content.replace(args.find, args.replace), encoding="utf-8")

    action = "Replaced" if args.apply else "Would replace"
    print(f"{action} {replacements} occurrence(s) in {matched_files} file(s).")
    if not args.apply:
        print("Preview only. Add --apply to write the replacements.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
