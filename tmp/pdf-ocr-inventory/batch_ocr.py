"""Batch-OCR the scanned PDFs listed in scanned-pdfs.csv.

- Originals are never modified; searchable copies go to ocr_output/.
- Uses --redo-ocr so stub/junk text layers are replaced (see litigation route
  operational notes).
- Writes a chain-of-custody sidecar JSON per file and prints a summary.
"""

import csv
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

import fitz  # PyMuPDF

CSV_PATH = Path(r"D:\Web_Page\pages-main\tmp\pdf-ocr-inventory\scanned-pdfs.csv")
OUT_DIR = Path(r"D:\Web_Page\pages-main\tmp\pdf-ocr-inventory\ocr_output")
OCRMYPDF = r"C:\Python314\Scripts\ocrmypdf.exe"
TESSERACT_DIR = r"C:\Program Files\Tesseract-OCR"


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ)
    env["PATH"] = TESSERACT_DIR + os.pathsep + env.get("PATH", "")
    env["TESSDATA_PREFIX"] = TESSERACT_DIR + r"\tessdata"

    rows = [r for r in csv.DictReader(CSV_PATH.open(encoding="utf-8")) if r["status"] == "scanned"]
    print(f"{len(rows)} scanned PDFs to OCR", flush=True)

    results = []
    for i, r in enumerate(rows, 1):
        src = Path(r["path"])
        out = OUT_DIR / f"{src.stem}_searchable.pdf"
        sidecar = OUT_DIR / f"{src.stem}_searchable.json"
        record = {
            "source_path": str(src),
            "output_path": str(out),
            "page_count": r["pages"],
            "ocr_applied": False,
            "processed_at": datetime.now(timezone.utc).isoformat(),
        }
        print(f"[{i}/{len(rows)}] {src.name} ...", flush=True)
        proc = subprocess.run(
            [OCRMYPDF, "--redo-ocr", str(src), str(out)],
            env=env, capture_output=True, text=True, timeout=600,
        )
        if proc.returncode != 0 or not out.exists():
            record["error"] = (proc.stderr or proc.stdout)[-400:]
            print(f"    FAILED rc={proc.returncode}", flush=True)
        else:
            doc = fitz.open(out)
            chars = sum(len(p.get_text().strip()) for p in doc)
            doc.close()
            record.update(ocr_applied=True, extracted_chars=chars,
                          size_bytes=out.stat().st_size)
            print(f"    ok: {chars} chars extracted", flush=True)
        sidecar.write_text(json.dumps(record, indent=2), encoding="utf-8")
        results.append(record)

    ok = sum(1 for x in results if x.get("ocr_applied"))
    print(f"--- done: {ok}/{len(results)} succeeded ---")
    for x in results:
        if not x.get("ocr_applied"):
            print(f"FAILED: {x['source_path']}\n  {x.get('error', '')[:200]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
