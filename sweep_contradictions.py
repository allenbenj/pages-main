"""Contradiction sweep: single-pass multi-query scan of the Court_Data LanceDB index.

Evaluates all query sets in one read and writes JSON results for report compilation.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import lancedb
import pyarrow.compute as pc

INDEX_DIR = Path(r"D:\Court_Data\lancedb\Court_Data-507c97cd136d492f")
OUT = Path(r"D:\Web_Page\pages-main\contradiction_sweep_results.json")
BATCH = 20_000

# Folders that are tooling/pipeline state, not case material
NONCASE = ("_organize_tools", "_organize_manifest", "memgraphrag_", "mcps", "output", ".kilo")

QUERIES = [
    {"id": "freeman_carmen_link", "label": "Freeman–Carmen Love connection",
     "terms": ["Carmen", "Freeman"], "mode": "and"},
    {"id": "undisclosed_relationship", "label": "Undisclosed relationship claims",
     "terms": ["never disclosed", "not disclose", "undisclosed"], "mode": "any"},
    {"id": "carmen_knew_lauren", "label": "Carmen's claims about knowing Lauren",
     "terms": ["Carmen", "knew Lauren"], "mode": "and"},
    {"id": "chain_of_custody", "label": "Chain of custody",
     "terms": ["chain of custody"], "mode": "any"},
    {"id": "no_custody_exists", "label": "'No chain of custody exists' statements",
     "terms": ["no chain of custody exists"], "mode": "any"},
    {"id": "brady_giglio", "label": "Brady / Giglio material",
     "terms": ["Brady", "Giglio"], "mode": "any"},
    {"id": "told_freeman", "label": "Statements to Freeman",
     "terms": ["told Freeman", "told Detective", "Freeman said", "Freeman stated"], "mode": "any"},
    {"id": "timeline_conflict", "label": "Timeline conflict language",
     "terms": ["contradict", "inconsistent", "inconsisten", "timeline"], "mode": "any"},
    {"id": "facebook_meta", "label": "Facebook / Meta records",
     "terms": ["Facebook", "Meta Platforms"], "mode": "any"},
    {"id": "rape_kit", "label": "Rape kit / SANE exam",
     "terms": ["rape kit", "SANE", "sexual assault nurse"], "mode": "any"},
    {"id": "bodycam_911", "label": "Bodycam / 911 call",
     "terms": ["bodycam", "body camera", "911 call", "911 audio"], "mode": "any"},
    {"id": "text_messages", "label": "Text messages",
     "terms": ["text message", "texts between", "phone records"], "mode": "any"},
]

MAX_PER_QUERY = 6
SNIP = 400


def snippet(text, terms):
    first = None
    for t in terms:
        m = re.search(f"(?i){re.escape(t)}", text)
        if m and (first is None or m.start() < first.start()):
            first = m
    if first is None:
        return text[:SNIP].strip()
    start = max(0, first.start() - SNIP // 3)
    end = min(len(text), start + SNIP)
    out = text[start:end]
    for t in terms:
        out = re.sub(f"(?i)({re.escape(t)})", r"**\1**", out)
    return ("…" if start else "") + out.strip().replace("\n", " ") + ("…" if end < len(text) else "")


def main():
    results = {q["id"]: {"label": q["label"], "hits": [], "seen": set()} for q in QUERIES}
    db = lancedb.connect(str(INDEX_DIR))
    ds = db.open_table("vector").to_lance()
    cols = ["filePath", "codeChunk", "startLine", "endLine"]
    scanned = 0
    for batch in ds.to_batches(columns=cols, batch_size=BATCH):
        scanned += batch.num_rows
        # drop non-case folders once per batch
        noncase_mask = None
        for pref in NONCASE:
            m = pc.match_substring_regex(batch["filePath"], f"^{re.escape(pref)}")
            noncase_mask = m if noncase_mask is None else pc.or_(noncase_mask, m)
        case_batch = batch.filter(pc.invert(noncase_mask))
        if case_batch.num_rows == 0:
            continue
        for q in QUERIES:
            r = results[q["id"]]
            if len(r["hits"]) >= MAX_PER_QUERY:
                continue
            masks = [pc.match_substring_regex(case_batch["codeChunk"], f"(?i){re.escape(t)}") for t in q["terms"]]
            combined = masks[0]
            for m in masks[1:]:
                combined = pc.or_(combined, m) if q["mode"] == "any" else pc.and_(combined, m)
            for row in case_batch.filter(combined).to_pylist():
                key = (row["filePath"], int(row["startLine"]))
                if key in r["seen"]:
                    continue
                r["seen"].add(key)
                r["hits"].append({
                    "filePath": row["filePath"],
                    "lines": f"{int(row['startLine'])}-{int(row['endLine'])}",
                    "snippet": snippet(row["codeChunk"], q["terms"]),
                })
                if len(r["hits"]) >= MAX_PER_QUERY:
                    break
        if scanned % 100_000 < BATCH:
            print(f"scanned {scanned:,}...", flush=True)
    for q in results.values():
        q.pop("seen")
    OUT.write_text(json.dumps(results, indent=1, ensure_ascii=False), encoding="utf-8")
    print("scanned total:", scanned)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
