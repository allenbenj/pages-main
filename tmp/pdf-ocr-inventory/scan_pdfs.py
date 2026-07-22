"""Scan D:\\Court_Data for PDFs lacking a usable text layer.

Samples up to 10 pages per PDF with PyMuPDF and classifies each file:
  scanned  -> fewer than 50 extractable chars in the sample (needs OCR)
  has-text -> usable text layer
  error    -> could not open/read (encrypted, corrupt, etc.)

Writes results incrementally to a CSV (resumable: already-scanned paths are
skipped on re-run) and prints a summary at the end.
"""

import csv
import os
import sys
import time
from pathlib import Path

import fitz  # PyMuPDF

ROOT = Path(r"D:\Court_Data")
OUT = Path(r"D:\Web_Page\pages-main\tmp\pdf-ocr-inventory\scanned-pdfs.csv")
SAMPLE_PAGES = 10
CHAR_THRESHOLD = 50


def classify(path: Path) -> dict:
    size = path.stat().st_size
    row = {
        "path": str(path),
        "size_mb": round(size / 1e6, 2),
        "pages": "",
        "sampled_pages": "",
        "sampled_chars": "",
        "status": "",
        "error": "",
    }
    try:
        doc = fitz.open(path)
        if doc.needs_pass:
            row.update(status="error", error="encrypted/password")
            doc.close()
            return row
        n = len(doc)
        chars = 0
        for i in range(min(n, SAMPLE_PAGES)):
            try:
                chars += len(doc[i].get_text().strip())
            except Exception:
                pass
        row.update(
            pages=n,
            sampled_pages=min(n, SAMPLE_PAGES),
            sampled_chars=chars,
            status="scanned" if chars < CHAR_THRESHOLD else "has-text",
        )
        doc.close()
    except Exception as e:  # corrupt file, MuPDF error, etc.
        row.update(status="error", error=str(e).replace("\n", " ")[:120])
    return row


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    done = set()
    if OUT.exists():
        with OUT.open(newline="", encoding="utf-8") as f:
            done = {r["path"] for r in csv.DictReader(f)}

    pdfs = sorted(ROOT.rglob("*.pdf")) + sorted(ROOT.rglob("*.PDF"))
    todo = [p for p in pdfs if str(p) not in done]
    print(f"total PDFs: {len(pdfs)}, already scanned: {len(done)}, todo: {len(todo)}", flush=True)

    fields = ["path", "size_mb", "pages", "sampled_pages", "sampled_chars", "status", "error"]
    counts = {"scanned": 0, "has-text": 0, "error": 0}
    t0 = time.time()
    with OUT.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        if not done:
            writer.writeheader()
        for i, p in enumerate(todo, 1):
            try:
                row = classify(p)
            except Exception as e:
                row = {"path": str(p), "size_mb": "", "pages": "", "sampled_pages": "",
                       "sampled_chars": "", "status": "error", "error": str(e)[:120]}
            counts[row["status"]] = counts.get(row["status"], 0) + 1
            writer.writerow(row)
            f.flush()
            if i % 50 == 0:
                print(f"  {i}/{len(todo)} done ({time.time()-t0:.0f}s) ...", flush=True)

    print("--- summary (this run) ---")
    for k, v in counts.items():
        print(f"{k}: {v}")
    print(f"elapsed: {time.time()-t0:.0f}s")


if __name__ == "__main__":
    sys.exit(main())
