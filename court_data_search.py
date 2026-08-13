"""Full-text search over the Kilo Code LanceDB index of D:\\Court_Data.

Reads the vector store directly (read-only) and returns citation-backed
passages: filePath + line range + highlighted snippet. No API key needed —
matching runs locally against the raw chunk text.

Examples:
  python court_data_search.py "Carmen Love"
  python court_data_search.py Happel statement --path 06_Witnesses
  python court_data_search.py "told me" "never said" --any --limit 5
  python court_data_search.py --regex "(?i)chain of custody" --path Freeman
  python court_data_search.py Brady --json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import lancedb
import pyarrow.compute as pc

INDEX_DIR = Path(r"D:\Court_Data\lancedb\Court_Data-507c97cd136d492f")
TABLE = "vector"
BATCH = 20_000
MAX_SNIPPET = 600


def iter_hits(terms, regex_mode, any_mode, path_filter, ext_filter, max_scan_rows=None):
    db = lancedb.connect(str(INDEX_DIR))
    ds = db.open_table(TABLE).to_lance()
    cols = ["filePath", "codeChunk", "startLine", "endLine"]
    scanned = 0
    for batch in ds.to_batches(columns=cols, batch_size=BATCH):
        scanned += batch.num_rows
        mask = None
        if path_filter:
            m = pc.match_substring_regex(batch["filePath"], f"(?i){re.escape(path_filter)}")
            mask = m
        if ext_filter:
            m = pc.match_substring_regex(batch["filePath"], f"(?i){re.escape('.' + ext_filter.lstrip('.'))}$")
            mask = m if mask is None else pc.and_(mask, m)
        if mask is not None:
            batch = batch.filter(mask)
            if batch.num_rows == 0:
                continue
        if terms:
            patterns = [t if regex_mode else re.escape(t) for t in terms]
            masks = [pc.match_substring_regex(batch["codeChunk"], f"(?i){p}") for p in patterns]
            combined = masks[0]
            for m in masks[1:]:
                combined = pc.or_(combined, m) if any_mode else pc.and_(combined, m)
            batch = batch.filter(combined)
        for row in batch.to_pylist():
            yield row
        if max_scan_rows and scanned >= max_scan_rows:
            return


def snippet(text, terms, regex_mode, width=MAX_SNIPPET):
    pats = [t if regex_mode else re.escape(t) for t in terms]
    first = None
    for p in pats:
        m = re.search(f"(?i){p}", text)
        if m and (first is None or m.start() < first.start()):
            first = m
    if first is None:
        return text[:width].strip()
    start = max(0, first.start() - width // 3)
    end = min(len(text), start + width)
    out = text[start:end]
    for p in pats:
        out = re.sub(f"(?i)({p})", r"**\1**", out)
    prefix = "…" if start > 0 else ""
    suffix = "…" if end < len(text) else ""
    return (prefix + out.strip() + suffix).replace("\n", " ")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("terms", nargs="*", help="search terms (AND by default)")
    ap.add_argument("--any", action="store_true", help="OR the terms instead of AND")
    ap.add_argument("--regex", action="store_true", help="treat terms as regex (case-insensitive)")
    ap.add_argument("--path", help="filter filePath by substring, e.g. 06_Witnesses or Carmen_Love")
    ap.add_argument("--ext", help="filter by extension, e.g. md, htm, json")
    ap.add_argument("--limit", type=int, default=10)
    ap.add_argument("--context", type=int, default=MAX_SNIPPET, help="snippet width in chars")
    ap.add_argument("--json", action="store_true", help="emit JSON lines")
    args = ap.parse_args()

    if not args.terms and not args.path:
        ap.error("provide at least one search term or --path filter")

    hits = []
    for row in iter_hits(args.terms, args.regex, args.any, args.path, args.ext):
        hits.append(row)
        if len(hits) >= args.limit * 5:  # over-collect, dedupe below
            break

    seen = set()
    shown = 0
    for row in hits:
        key = (row["filePath"], int(row["startLine"]))
        if key in seen:
            continue
        seen.add(key)
        shown += 1
        snip = snippet(row["codeChunk"], args.terms, args.regex, args.context)
        if args.json:
            print(json.dumps({
                "source_path": str(Path(r"D:\Court_Data") / row["filePath"]),
                "lines": f"{int(row['startLine'])}-{int(row['endLine'])}",
                "snippet": snip,
            }, ensure_ascii=False))
        else:
            print(f"\n[{shown}] {row['filePath']}  (lines {int(row['startLine'])}-{int(row['endLine'])})")
            print(f"    {snip}")
        if shown >= args.limit:
            break

    if not args.json:
        print(f"\n— {shown} result(s) shown —", file=sys.stderr)


if __name__ == "__main__":
    main()
