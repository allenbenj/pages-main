#!/usr/bin/env python3
"""Extract, render, and verify the contradiction card data for documentspage.html.

The three <section class="grid"> blocks in documentspage.html hold the site's
structured contradiction cards. This tool makes documents/data/contradictions.json
the source of truth while keeping the rendered page byte-identical everywhere
outside the grids:

  extract  parse documentspage.html and write contradictions.json
           (each grid's exact inner HTML + per-card metadata)
  render   splice the grids back into documentspage.html from the JSON,
           touching nothing outside the grid regions
  verify   fail (exit 1) if rendering the JSON would change the page

Edit card content in the JSON (or re-run extract after hand-editing the page),
then run render, then verify. Prints a JSON summary to stdout.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, UTC
from pathlib import Path

PAGE_PATH = Path("documentspage.html")
DATA_PATH = Path("documents/data/contradictions.json")

VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
TAG_RE = re.compile(r"<(/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(/?)>")


def find_grid_spans(html: str) -> list[tuple[int, int, int, int]]:
    """Return (open_start, open_end, close_start, close_end) for each top-level
    <section ... class="...grid..."> block, in document order."""
    spans = []
    for match in re.finditer(r"<section\b[^>]*>", html):
        open_tag = match.group(0)
        class_match = re.search(r'class="([^"]*)"', open_tag)
        if not class_match or "grid" not in class_match.group(1).split():
            continue
        depth = 1
        for tag in TAG_RE.finditer(html, match.end()):
            name = tag.group(2).lower()
            if name != "section":
                continue
            if tag.group(1):
                depth -= 1
                if depth == 0:
                    spans.append((match.start(), match.end(), tag.start(), tag.end()))
                    break
            elif not tag.group(3):
                depth += 1
        else:
            raise ValueError(f"Unclosed grid section at offset {match.start()}")
    return spans


def find_article_spans(html: str, start: int, end: int) -> list[tuple[int, int]]:
    """Return (start, end) offsets of <article> elements within html[start:end].

    Articles never nest in this page, so each card ends at its first matching
    </article>. Deliberately avoids full tag-depth counting, which implicitly
    closed HTML tags (unclosed <p>, <a>, etc.) would corrupt.
    """
    spans = []
    pos = start
    while True:
        open_match = re.search(r"<article\b[^>]*>", html[pos:end])
        if not open_match:
            break
        abs_start = pos + open_match.start()
        close_match = re.search(r"</article\s*>", html[abs_start:end])
        if not close_match:
            raise ValueError(f"Unclosed article at offset {abs_start}")
        abs_end = abs_start + close_match.end()
        spans.append((abs_start, abs_end))
        pos = abs_end
    return spans


def text_of(fragment: str, selector_class: str) -> str:
    match = re.search(
        r'<div class="[^"]*' + re.escape(selector_class) + r'[^"]*">(.*?)</div>',
        fragment,
        re.S,
    )
    if not match:
        return ""
    return re.sub(r"<[^>]+>", "", match.group(1)).strip()


def card_metadata(fragment: str) -> dict:
    id_match = re.search(r"<article[^>]*\bid=\"([^\"]+)\"", fragment)
    pills = re.findall(r'<span class="pill">(.*?)</span>', fragment, re.S)
    return {
        "id": id_match.group(1) if id_match else None,
        "label": text_of(fragment, "card-label"),
        "title": text_of(fragment, "card-title"),
        "pills": [re.sub(r"<[^>]+>", "", p).strip() for p in pills],
    }


def extract(root: Path) -> dict:
    html = (root / PAGE_PATH).read_text(encoding="utf-8")
    grids = []
    all_cards = []
    for index, (open_start, open_end, close_start, _close_end) in enumerate(find_grid_spans(html)):
        open_tag = html[open_start:open_end]
        inner = html[open_end:close_start]
        cards = []
        for card_start, card_end in find_article_spans(html, open_end, close_start):
            fragment = html[card_start:card_end]
            meta = card_metadata(fragment)
            meta["grid"] = index
            cards.append(meta)
            all_cards.append(meta)
        grids.append(
            {
                "index": index,
                "openTag": open_tag,
                "innerHtml": inner,
                "cards": cards,
            }
        )

    payload = {
        "generatedAt": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "generator": "tools/sync_contradiction_cards.py extract",
        "sourcePage": PAGE_PATH.as_posix(),
        "counts": {"grids": len(grids), "cards": len(all_cards)},
        "grids": grids,
        "cards": all_cards,
    }
    data_path = root / DATA_PATH
    data_path.parent.mkdir(parents=True, exist_ok=True)
    data_path.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8", newline="\n")
    return payload


def render(root: Path, check: bool = False) -> dict:
    html = (root / PAGE_PATH).read_text(encoding="utf-8")
    data = json.loads((root / DATA_PATH).read_text(encoding="utf-8"))
    spans = find_grid_spans(html)
    grids = data["grids"]
    if len(spans) != len(grids):
        raise ValueError(f"grid count mismatch: page has {len(spans)}, data has {len(grids)}")

    updated = html
    # Apply replacements from last to first so earlier offsets stay valid.
    for (open_start, open_end, close_start, close_end), grid in reversed(list(zip(spans, grids))):
        replacement = grid["openTag"] + grid["innerHtml"] + "</section>"
        updated = updated[:open_start] + replacement + updated[close_end:]

    changed = updated != html
    if changed and not check:
        (root / PAGE_PATH).write_text(updated, encoding="utf-8", newline="\n")
    return {"changed": changed, "grids": len(grids), "cards": data["counts"]["cards"]}


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
