#!/usr/bin/env python3
"""Extract, render, and verify the timeline event data for timeline.html.

The .timeline-events container in timeline.html holds the site's chronological
event list. This tool makes documents/data/timeline.json the source of truth
while keeping the rendered page byte-identical everywhere outside the
container:

  extract  parse timeline.html and write timeline.json
           (the container's exact inner HTML + per-event metadata)
  render   splice the container back into timeline.html from the JSON,
           touching nothing outside the container region
  verify   fail (exit 1) if rendering the JSON would change the page

Edit event content in the JSON (or re-run extract after hand-editing the
page), then run render, then verify. Prints a JSON summary to stdout.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, UTC
from pathlib import Path

from bs4 import BeautifulSoup

PAGE_PATH = Path("timeline.html")
DATA_PATH = Path("documents/data/timeline.json")

CONTAINER_RE = re.compile(r'<div class="timeline-events"[^>]*>')
DIV_TAG_RE = re.compile(r"<(/?)div\b[^>]*?(/?)>")


def find_container_span(html: str) -> tuple[int, int, int, int]:
    """Return (open_start, open_end, close_start, close_end) of the
    .timeline-events div. Depth counting over div tags only is safe: HTML
    never closes divs implicitly."""
    match = CONTAINER_RE.search(html)
    if not match:
        raise ValueError("timeline-events container not found")
    depth = 1
    for tag in DIV_TAG_RE.finditer(html, match.end()):
        if tag.group(1):
            depth -= 1
            if depth == 0:
                return match.start(), match.end(), tag.start(), tag.end()
        elif not tag.group(2):
            depth += 1
    raise ValueError("timeline-events container is not closed")


def event_metadata(inner_html: str) -> list[dict]:
    soup = BeautifulSoup(inner_html, "html.parser")
    events = []
    for index, node in enumerate(soup.select(".timeline-event"), start=1):
        classes = node.get("class") or []
        time_node = node.select_one(".event-time")
        desc_node = node.select_one(".event-description")
        video_btn = node.select_one(".video-btn")
        desc_text = desc_node.get_text(" ", strip=True) if desc_node else ""
        desc_text = re.sub(r"\s*WATCH VIDEO\s*$", "", desc_text).strip()
        events.append(
            {
                "id": f"event-{index:02d}",
                "side": "left" if "left" in classes else ("right" if "right" in classes else None),
                "standalone": "standalone" in classes,
                "time": time_node.get_text(" ", strip=True) if time_node else None,
                "description": desc_text,
                "video": video_btn.get("data-modal-image") if video_btn else None,
            }
        )
    return events


def extract(root: Path) -> dict:
    html = (root / PAGE_PATH).read_text(encoding="utf-8")
    open_start, open_end, close_start, _close_end = find_container_span(html)
    inner = html[open_end:close_start]
    events = event_metadata(inner)
    payload = {
        "generatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "generator": "tools/sync_timeline_events.py extract",
        "sourcePage": PAGE_PATH.as_posix(),
        "counts": {"events": len(events)},
        "container": {
            "openTag": html[open_start:open_end],
            "innerHtml": inner,
        },
        "events": events,
    }
    data_path = root / DATA_PATH
    data_path.parent.mkdir(parents=True, exist_ok=True)
    data_path.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8", newline="\n")
    return payload


def render(root: Path, check: bool = False) -> dict:
    html = (root / PAGE_PATH).read_text(encoding="utf-8")
    data = json.loads((root / DATA_PATH).read_text(encoding="utf-8"))
    open_start, open_end, close_start, close_end = find_container_span(html)
    container = data["container"]
    replacement = container["openTag"] + container["innerHtml"] + "</div>"
    updated = html[:open_start] + replacement + html[close_end:]
    changed = updated != html
    if changed and not check:
        (root / PAGE_PATH).write_text(updated, encoding="utf-8", newline="\n")
    return {"changed": changed, "events": data["counts"]["events"]}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("extract", "render", "verify"))
    parser.add_argument("--root", type=Path, default=Path("."))
    args = parser.parse_args()

    root = args.root.resolve()
    if args.command == "extract":
        payload = extract(root)
        print(json.dumps({"output": str(root / DATA_PATH), "counts": payload["counts"]}, indent=2))
        return 0
    result = render(root, check=args.command == "verify")
    print(json.dumps(result, indent=2))
    if args.command == "verify" and result["changed"]:
        print("verify FAILED: page and JSON are out of sync", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
