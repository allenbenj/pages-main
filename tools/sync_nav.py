#!/usr/bin/env python3
"""Synchronize the shared nav-tabs block across all root pages.

The canonical tab list lives here (NAV_TABS). To add or rename a top-level
page, edit NAV_TABS once and run this script — every page carrying a
<div class="nav-tabs"> block is rewritten with the canonical set, and the
tab whose href matches the page filename gets the `active` class.

Pages without a nav-tabs block (redirect stubs, the Webflow landing page)
are left untouched. Prints a JSON summary to stdout.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

NAV_TABS: list[tuple[str, str]] = [
    ("index.html", "Landing"),
    ("overview.html", "Project Map"),
    ("timeline.html", "Timeline"),
    ("players.html", "Players"),
    ("evidence.html", "Evidence"),
    ("contradictions.html", "Contradictions"),
    ("misconduct.html", "Misconduct"),
    ("documentspage.html", "Documents"),
    ("misconductandfailure.html", "Mindmaps"),
    ("case-study.html", "Case Study"),
]

NAV_BLOCK_RE = re.compile(r'(<div class="nav-tabs"[^>]*>)(.*?)(\n\s*</div>)', re.S)


def render_tabs(page_name: str) -> str:
    lines = []
    for href, label in NAV_TABS:
        active = " active" if href == page_name else ""
        lines.append(f'            <a class="nav-tab{active}" href="{href}">{label}</a>')
    return "\n".join(lines)


def sync_page(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    match = NAV_BLOCK_RE.search(html)
    if not match:
        return False
    replacement = match.group(1) + "\n" + render_tabs(path.name) + match.group(3)
    updated = html[: match.start()] + replacement + html[match.end() :]
    if updated == html:
        return False
    path.write_text(updated, encoding="utf-8", newline="\n")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("."))
    args = parser.parse_args()

    root = args.root.resolve()
    changed: list[str] = []
    skipped: list[str] = []
    for page in sorted(root.glob("*.html")):
        (changed if sync_page(page) else skipped).append(page.name)

    print(json.dumps({"changed": changed, "skipped_no_navtabs_or_uptodate": skipped}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
