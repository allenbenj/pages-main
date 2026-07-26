#!/usr/bin/env python3
"""Synchronize the shared nav-tabs block across canonical page sources.

The canonical navigation lives here (NAV_TABS and NAV_GROUPS). To add, move,
or rename a page, edit those structures once and run this script — every page
carrying a <div class="nav-tabs"> block is rewritten. The current page and
its parent group receive the `active` class.

Canonical pages without a nav-tabs block are left untouched. The Webflow
landing page remains at the repository root and carries a marker-delimited
copy of the same navigation. Prints a JSON summary to stdout.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

NAV_TABS: list[tuple[str, str]] = [
    ("index.html", "Landing"),
    ("overview.html", "Project Map"),
]

NAV_GROUPS: list[tuple[str, list[tuple[str, str]]]] = [
    ("Case Record", [
        ("timeline.html", "Timeline"),
        ("players.html", "Players"),
        ("scene.html", "Scene Analysis"),
        ("evidence.html", "Evidence"),
        ("documentspage.html", "Documents"),
    ]),
    ("Analysis", [
        ("contradictions.html", "Contradictions"),
        ("Deal's Ever Changing Testimony.html", "Deal's Ever Changing Testimony"),
        ("New_Face.html", "New Face"),
        ("general-videos.html", "General Videos"),
        ("case-study.html", "Case Study"),
        ("data-snapshot.html", "Data Snapshot"),
    ]),
    ("Diagrams", [
        ("connections.html", "Connections"),
        ("false-story-diagram.html", "False Story"),
        ("misconductandfailure.html", "Mindmaps"),
    ]),
    ("Accountability", [
        ("misconduct.html", "Misconduct"),
        ("prosecutor_allowed.html", "Prosecutor Conduct"),
        ("judicial-duty.html", "Judicial Duty"),
        ("why-dont-we-have-this-system.html", "System Essay"),
    ]),
]

NAV_START_RE = re.compile(
    r'<div\b(?=[^>]*\bclass="nav-tabs")(?=[^>]*\baria-label="Project navigation")[^>]*>',
    re.IGNORECASE,
)
DIV_TOKEN_RE = re.compile(r'<div\b[^>]*>|</div\s*>', re.IGNORECASE)
CONTENT_START_RE = re.compile(
    r'\n\s*(?:<div class="header"|<section class="(?:hero|hero-grid)")',
    re.IGNORECASE,
)
HOME_NAV_BLOCK_RE = re.compile(
    r"(?<=<!-- PROJECT_NAV_START -->).*?(?=<!-- PROJECT_NAV_END -->)",
    re.S,
)


def render_tabs(page_name: str) -> str:
    lines: list[str] = []
    for href, label in NAV_TABS:
        is_current = href.casefold() == page_name.casefold()
        active = " active" if is_current else ""
        current = ' aria-current="page"' if is_current else ""
        lines.append(f'            <a class="nav-tab{active}" href="{href}"{current}>{label}</a>')

    for group_index, (group_label, group_pages) in enumerate(NAV_GROUPS, start=1):
        group_active = any(href.casefold() == page_name.casefold() for href, _ in group_pages)
        active = " active" if group_active else ""
        menu_id = f"project-nav-group-{group_index}"
        lines.extend([
            '            <div class="nav-dropdown">',
            f'                <button class="nav-tab nav-dropdown-toggle{active}" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="{menu_id}">{group_label}</button>',
            f'                <div class="nav-dropdown-menu" id="{menu_id}" role="menu">',
        ])
        for href, label in group_pages:
            is_current = href.casefold() == page_name.casefold()
            child_class = ' class="active"' if is_current else ""
            current = ' aria-current="page"' if is_current else ""
            lines.append(f'                    <a{child_class} role="menuitem" href="{href}"{current}>{label}</a>')
        lines.extend([
            "                </div>",
            "            </div>",
        ])
    return "\n".join(lines)


def find_nav_block(html: str) -> tuple[int, int, str] | None:
    start_match = NAV_START_RE.search(html)
    if not start_match:
        return None
    depth = 0
    for token in DIV_TOKEN_RE.finditer(html, start_match.start()):
        if token.group(0).lower().startswith("<div"):
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return start_match.start(), token.end(), start_match.group(0)
    raise ValueError("Unbalanced project navigation div")


def sync_page(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    block = find_nav_block(html)
    if not block:
        return False
    start, end, opening_tag = block

    # Remove malformed dropdown siblings left by the older regex-based sync.
    content_start = CONTENT_START_RE.search(html, end)
    if content_start and 'class="nav-dropdown"' in html[end : content_start.start()]:
        html = html[:end] + html[content_start.start() :]
        block = find_nav_block(html)
        if not block:
            raise ValueError(f"Project navigation disappeared while repairing {path}")
        start, end, opening_tag = block

    indent_match = re.search(
        r'(?m)^(\s*)<div\b(?=[^>]*\bclass="nav-tabs")(?=[^>]*\baria-label="Project navigation")',
        html[: end],
    )
    indent = indent_match.group(1) if indent_match else "    "
    replacement = opening_tag + "\n" + render_tabs(path.name) + f"\n{indent}</div>"
    updated = html[:start] + replacement + html[end:]
    if updated == html:
        return False
    path.write_text(updated, encoding="utf-8", newline="\n")
    return True


def sync_home_page(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    if not HOME_NAV_BLOCK_RE.search(html):
        return False
    replacement = (
        '\n  <div class="home-nav-shell">\n'
        '    <div class="nav-tabs" aria-label="Project navigation">\n'
        f"{render_tabs(path.name)}\n"
        "    </div>\n"
        "  </div>\n  "
    )
    updated = HOME_NAV_BLOCK_RE.sub(replacement, html, count=1)
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
    home_page = root / "index.html"
    (changed if sync_home_page(home_page) else skipped).append(home_page.name)
    pages_root = root / "assets" / "pages"
    for page in sorted(pages_root.glob("*.html")):
        (changed if sync_page(page) else skipped).append(page.name)

    print(json.dumps({"changed": changed, "skipped_no_navtabs_or_uptodate": skipped}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
