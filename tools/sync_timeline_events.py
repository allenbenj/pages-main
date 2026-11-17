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

PAGE_PATH = Path("assets/pages/timeline.html")
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
        claim_node = node.select_one(".event-claim-body") or node.select_one(".event-claim")
        graphic_btn = node.select_one(".graphic-btn") or node.select_one(".hug-lie-image")

        desc_text = desc_node.get_text(" ", strip=True) if desc_node else ""
        desc_text = re.sub(r"\s*WATCH VIDEO\s*$", "", desc_text).strip()
        claim_text = claim_node.get_text(" ", strip=True) if claim_node else ""

        event_id = node.get("id") or f"event-{index:02d}"
        phase = node.get("data-phase")
        exhibit = node.get("data-exhibit") or (video_btn.get("data-exhibit") if video_btn else None)
        video_src = video_btn.get("data-modal-image") if video_btn else None
        if not video_src:
            video_tag = node.select_one("video")
            if video_tag:
                video_src = video_tag.get("src")
        graphic_src = (
            graphic_btn.get("data-modal-image") or graphic_btn.get("src")
            if graphic_btn
            else None
        )

        events.append(
            {
                "id": event_id,
                "side": "left" if "left" in classes else ("right" if "right" in classes else None),
                "standalone": "standalone" in classes,
                "phase": phase,
                "exhibit": exhibit,
                "time": time_node.get_text(" ", strip=True) if time_node else None,
                "description": desc_text,
                "claim": claim_text,
                "video": video_src,
                "graphic": graphic_src,
            }
        )
    return events


FIXTURE_HTML = """
<div class="timeline-events">
    <article class="timeline-event" id="event-03" data-phase="phase-1" data-exhibit="A">
        <div class="event-meta">
            <div class="event-time">Oct 19 2019 12:08 AM</div>
            <span class="event-phase-badge">Phase 1</span>
            <span class="event-exhibit-badge">Exhibit A</span>
        </div>
        <div class="event-record">
            <div class="event-description">Benjamin Allen and Friends Arrive at Schooly's</div>
            <div class="event-media-player">
                <video class="timeline-inline-video" preload="none" controls src="video/A Arrival.mp4"></video>
                <a class="video-btn" data-exhibit="A" data-modal-image="video/A Arrival.mp4">WATCH VIDEO</a>
            </div>
        </div>
        <div class="event-claim">
            <div class="event-claim-body">Deal claimed she hugged Allen upon arrival.</div>
            <a class="graphic-btn" data-modal-image="content/images/evidence/graphics/inserts/hug_lie.webp">View Insert Graphic</a>
        </div>
    </article>
</div>
"""


def run_self_test() -> bool:
    open_start, open_end, close_start, close_end = find_container_span(FIXTURE_HTML)
    inner = FIXTURE_HTML[open_end:close_start]
    events = event_metadata(inner)
    assert len(events) == 1, f"Expected 1 event, got {len(events)}"
    ev = events[0]
    assert ev["id"] == "event-03", f"Expected event-03, got {ev['id']}"
    assert ev["time"] == "Oct 19 2019 12:08 AM", f"Unexpected time {ev['time']}"
    assert ev["phase"] == "phase-1", f"Unexpected phase {ev['phase']}"
    assert ev["exhibit"] == "A", f"Unexpected exhibit {ev['exhibit']}"
    assert "Benjamin Allen" in ev["description"], f"Unexpected description {ev['description']}"
    assert ev["video"] == "video/A Arrival.mp4", f"Unexpected video {ev['video']}"
    assert "hugged Allen" in ev["claim"], f"Unexpected claim {ev['claim']}"
    assert ev["graphic"] == "content/images/evidence/graphics/inserts/hug_lie.webp", f"Unexpected graphic {ev['graphic']}"
    return True


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
    parser.add_argument("command", nargs="?", choices=("extract", "render", "verify"), default=None)
    parser.add_argument("--root", type=Path, default=Path("."))
    parser.add_argument("--self-test", action="store_true", help="Run contract test on sample 3-column markup")
    args = parser.parse_args()

    if args.self_test:
        run_self_test()
        print(json.dumps({"selfTest": "passed"}, indent=2))
        return 0

    if not args.command:
        parser.error("the following arguments are required: command")

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
