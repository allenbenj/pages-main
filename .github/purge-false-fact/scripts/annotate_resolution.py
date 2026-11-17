#!/usr/bin/env python3
"""Annotate mode for purge-false-fact: add dated resolution notes instead of deleting.

Purpose
    When the owner resolves a fact conflict (a RES-### decision) but wants the record
    of the other version kept, this tool does not delete the superseded statement. It
    inserts, right after each occurrence in the owner's own work product, a note:

        [Resolved YYYY-MM-DD (RES-###): <current version>. The earlier version is kept
        as impeachment material, not as fact.]

    It first classifies every file as WORK_PRODUCT (Ben's own materials: editable) or
    PROTECTED (verbatim third-party records and official records: transcripts, orders,
    filed papers, discovery, authorities, reference text, holding and archive copies,
    PDFs and media). Protected files are never altered; they are listed with each
    occurrence so the owner can see where the other version lives.

Usage
    py -3 -B annotate_resolution.py --res-id RES-022 --current "TEXT" (--superseded "TEXT" ... | --variants-file F)
                                    (--file PATH ... | --hits-csv CSV) [--date YYYY-MM-DD] [--source "record cite"]
                                    [--run-dir DIR] [--apply]

Inputs
    --res-id         resolution ID from 00_Control\\Fact_Corrections_Log.csv (RES-###)
    --current        the resolved (current) version, as the owner stated it
    --source         record support for the current version (optional; added to the note)
    --superseded     exact superseded wording; repeatable. --variants-file: one per line
    --file           a file to annotate (repeatable). --hits-csv: a find_fact_occurrences.py
                     hit list (columns path/file/source_path are recognized). No folder walks.
    --date           note date (default today)
    --apply          write the notes (default: dry run, nothing written)
    Classification roots come from the matter profile (LEGAL_MATTER_PROFILE or
    D:\\Court_Data\\.codex\\legal_matter\\matter_profile.json).

Outputs (run folder, default <casebook>\\_organize_manifest\\processed\\annotate_<RES>_<YYYYMMDD_HHMMSS>)
    annotation_plan.csv     every occurrence: file, class, reason, line/paragraph, statement, action
    protected_listing.csv   occurrences in protected files (listed, never altered)
    backups\\...             pre-edit copy of every changed file (with --apply)
    changes.csv             file, sha256_before, sha256_after, notes_added, backup
    summary.json
    Exit 0 = done, 1 = nothing matched or a check failed, 2 = usage error.

Examples
    py -3 -B annotate_resolution.py --res-id RES-022 --current "the 12-0 vote was on first-degree rape (Tr. 922)" ^
        --superseded "the jury acquitted on all charges" --file "D:\\Court_Data\\Legal_Team_Casebook\\02_Analysis\\DJ_Memo.md"
    py -3 -B annotate_resolution.py --res-id RES-001 --current "$15,000 a year for 10 years" ^
        --variants-file variants.txt --hits-csv Fact_Search_20261003_payoff.csv --apply
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import shutil
import sys
from datetime import date, datetime
from pathlib import Path

DEFAULT_PROFILE = Path(r"D:\Court_Data\.codex\legal_matter\matter_profile.json")
EDITABLE_EXT = {".md", ".txt", ".markdown", ".docx"}
NEVER_EDIT_EXT = {".pdf", ".jpg", ".jpeg", ".png", ".tif", ".tiff", ".gif", ".heic", ".mp3", ".wav", ".m4a", ".mp4", ".mov", ".avi",
                  ".wmv", ".msg", ".eml", ".zip", ".7z", ".db", ".sqlite", ".xlsx", ".xls", ".csv", ".json", ".jsonl"}
PROTECTED_SEGMENTS = re.compile(r"(?i)^(?:filed|served|signed|court_orders?|orders|transcripts?|proceedings|discovery|"
                                r"_move_backup.*|archive|99_holding|primary_authority_archive|reference_text)$")
THIRD_PARTY_NAME = re.compile(r"(?i)(?:transcript|\border\b|_order|order_|mistrial order|indictment|warrant|subpoena|"
                              r"police report|incident report|lab report|sane report|judgment|verdict sheet|discovery|"
                              r"letter from|certified)")
WORK_PRODUCT_TOP = ("02_Analysis", "04_Master", "06_Motion_Edit_Work", "00_Control")


def profile() -> dict:
    p = Path(os.environ.get("LEGAL_MATTER_PROFILE", "").strip() or DEFAULT_PROFILE)
    try:
        return json.loads(p.read_text(encoding="utf-8-sig"))
    except Exception:
        return {}


def norm(p) -> str:
    return os.path.normcase(os.path.abspath(str(p))).rstrip("\\/")


def within(p, root) -> bool:
    a, b = norm(p), norm(root)
    return a == b or a.startswith(b + os.sep)


def classify(path: Path, prof: dict) -> tuple[str, str]:
    """Return (WORK_PRODUCT | PROTECTED | UNCLASSIFIED, reason)."""
    cb = Path(prof.get("casebook_root") or r"D:\Court_Data\Legal_Team_Casebook")
    ws = Path(prof.get("matter_root") or cb.parent)
    motion_root = Path(prof.get("motion_drafting_root") or cb / "01_Sources" / "_Motions_Workplan_2026-08-17")
    ext = path.suffix.lower()
    if ext in NEVER_EDIT_EXT or ext not in EDITABLE_EXT:
        return "PROTECTED", f"file type {ext or '(none)'} is never edited (records, media, data files)"
    for root in prof.get("legal_hooks", {}).get("protected_evidence_roots", []):
        if within(path, root):
            return "PROTECTED", f"under protected evidence root {root}"
    try:
        parts = Path(os.path.relpath(path, ws)).parts
    except ValueError:
        parts = path.parts
    for seg in parts[:-1]:
        if PROTECTED_SEGMENTS.match(seg):
            return "PROTECTED", f"folder '{seg}' holds filed, official or archived records"
    if within(path, motion_root):
        if THIRD_PARTY_NAME.search(path.name):
            return "PROTECTED", "record-type file name inside the motion workplan"
        return "WORK_PRODUCT", "motion draft or working note in the motion drafting root"
    if within(path, cb / "01_Sources"):
        return "PROTECTED", "01_Sources holds case source records"
    if within(path, cb / "03_Authorities") or within(path, cb / "05_Work_Reference"):
        return "PROTECTED", "authorities and reference text are official or third-party records"
    for top in WORK_PRODUCT_TOP:
        if within(path, cb / top):
            return "WORK_PRODUCT", f"casebook work product ({top})"
    if within(path, ws / ".codex" / "legal_matter") or within(path, ws / ".agents" / "workflow"):
        return "WORK_PRODUCT", "matter control file"
    return "UNCLASSIFIED", "outside the known work-product roots: listed, not edited"


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for b in iter(lambda: fh.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest().upper()


def pattern_for(statement: str) -> re.Pattern:
    words = [re.escape(w) for w in statement.split()]
    return re.compile(r"\s+".join(words).replace(r"\'", "['\u2019]").replace("'", "['\u2019]"), re.I)


def note_text(a) -> str:
    src = f"; record: {a.source}" if a.source else ""
    return f" [Resolved {a.date} ({a.res_id}): {a.current}{src}. The earlier version is kept as impeachment material, not as fact.]"


def insertion_point(text: str, end: int) -> tuple[int, str]:
    """After the sentence (and any closing quote or parenthesis) that holds the match."""
    m = re.compile(r"[^.!?\n]*?[.!?](?:[\"\u201d\u2019')\]]+)?(?=\s|$)|[^\n]*?(?=\n|$)").match(text, end)
    pos = m.end() if m else end
    before = text[max(0, end - 400):end]
    quoted = before.count("\u201c") > before.count("\u201d") or before.count('"') % 2 == 1 or text[text.rfind("\n", 0, end) + 1:end].lstrip().startswith(">")
    return pos, "after the quotation; quoted words unchanged" if quoted else "after the sentence"


def already_noted(text: str, pos: int, res_id: str) -> bool:
    return bool(re.search(r"\[Resolved \d{4}-\d{2}-\d{2} \(" + re.escape(res_id) + r"\)", text[pos:pos + 400]))


def annotate_text(text: str, statements, a):
    hits, edits = [], []
    for st in statements:
        for m in pattern_for(st).finditer(text):
            pos, how = insertion_point(text, m.end())
            line = text.count("\n", 0, m.start()) + 1
            if already_noted(text, pos, a.res_id):
                hits.append((line, st, "already annotated"))
                continue
            hits.append((line, st, f"note inserted {how}"))
            edits.append(pos)
    note = note_text(a)
    for pos in sorted(set(edits), reverse=True):
        text = text[:pos] + note + text[pos:]
    return text, hits


def annotate_docx(path: Path, statements, a, apply: bool):
    import docx
    d = docx.Document(str(path))
    hits, changed = [], 0
    paras = list(d.paragraphs)
    for t in d.tables:
        for row in t.rows:
            for cell in row.cells:
                paras.extend(cell.paragraphs)
    for i, p in enumerate(paras, 1):
        for st in statements:
            if pattern_for(st).search(p.text):
                if re.search(r"\[Resolved \d{4}-\d{2}-\d{2} \(" + re.escape(a.res_id) + r"\)", p.text):
                    hits.append((i, st, "already annotated"))
                    continue
                hits.append((i, st, "note added at the end of the paragraph"))
                if apply:
                    run = p.add_run(note_text(a))
                    run.italic = True
                changed += 1
                break
    if apply and changed:
        d.save(str(path))
    return hits, changed


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Add dated resolution notes after superseded statements (annotate mode).")
    ap.add_argument("--res-id", required=True)
    ap.add_argument("--current", required=True)
    ap.add_argument("--source", default="")
    ap.add_argument("--superseded", action="append", default=[])
    ap.add_argument("--variants-file")
    ap.add_argument("--file", action="append", default=[])
    ap.add_argument("--hits-csv")
    ap.add_argument("--date", default=date.today().isoformat())
    ap.add_argument("--run-dir")
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args(argv)
    if not re.fullmatch(r"RES-\d{3,}", a.res_id):
        print("--res-id must look like RES-022", file=sys.stderr)
        return 2
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", a.date):
        print("--date must be YYYY-MM-DD", file=sys.stderr)
        return 2
    statements = list(a.superseded)
    if a.variants_file:
        statements += [l.strip() for l in Path(a.variants_file).read_text(encoding="utf-8-sig").splitlines() if l.strip() and not l.startswith("#")]
    if not statements:
        print("give --superseded or --variants-file", file=sys.stderr)
        return 2
    files = [Path(f) for f in a.file]
    if a.hits_csv:
        with open(a.hits_csv, encoding="utf-8-sig", newline="") as fh:
            for r in csv.DictReader(fh):
                v = r.get("path") or r.get("file") or r.get("source_path") or r.get("file_path") or ""
                if v:
                    files.append(Path(v))
    seen, uniq = set(), []
    for f in files:
        if norm(f) not in seen:
            seen.add(norm(f))
            uniq.append(f)
    prof = profile()
    cb = Path(prof.get("casebook_root") or r"D:\Court_Data\Legal_Team_Casebook")
    run = Path(a.run_dir) if a.run_dir else cb / "_organize_manifest" / "processed" / f"annotate_{a.res_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    run.mkdir(parents=True, exist_ok=True)
    plan, protected, changes = [], [], []
    for f in uniq:
        cls, why = classify(f, prof)
        if not f.is_file():
            plan.append({"file": str(f), "class": cls, "reason": why, "location": "", "statement": "", "action": "file not found"})
            continue
        if cls != "WORK_PRODUCT":
            # list occurrences without changing anything
            occ = []
            if f.suffix.lower() in (".md", ".txt", ".markdown"):
                text = f.read_text(encoding="utf-8", errors="replace")
                for st in statements:
                    for m in pattern_for(st).finditer(text):
                        occ.append((text.count("\n", 0, m.start()) + 1, st))
            elif f.suffix.lower() == ".docx":
                try:
                    hs, _ = annotate_docx(f, statements, a, apply=False)
                    occ = [(h[0], h[1]) for h in hs]
                except Exception as e:
                    occ = [("", f"(could not read: {e})")]
            else:
                occ = [("", "(binary or record type: open the file to confirm; not searched here)")]
            for loc, st in occ or [("", "(no exact match; listed from the hit list)")]:
                row = {"file": str(f), "class": cls, "reason": why, "location": loc, "statement": st, "action": "listed only: never altered"}
                plan.append(row)
                protected.append(row)
            continue
        before = sha256(f)
        if f.suffix.lower() == ".docx":
            hits, changed = annotate_docx(f, statements, a, apply=False)
            new_text = None
        else:
            text = f.read_text(encoding="utf-8", errors="replace")
            new_text, hits = annotate_text(text, statements, a)
            changed = sum(1 for h in hits if h[2].startswith("note inserted"))
        for loc, st, act in hits or [("", "", "no exact match (check the hit list wording)")]:
            plan.append({"file": str(f), "class": cls, "reason": why, "location": loc, "statement": st, "action": act})
        if a.apply and changed:
            rel = Path(os.path.relpath(f, Path(prof.get("matter_root") or cb.parent))) if within(f, Path(prof.get("matter_root") or cb.parent)) else Path(f.name)
            bdir = run / "backups" / rel.parent
            bdir.mkdir(parents=True, exist_ok=True)
            backup = bdir / f.name
            shutil.copy2(f, backup)
            if sha256(backup) != before:
                print(f"backup hash mismatch for {f}; stopping", file=sys.stderr)
                return 1
            if f.suffix.lower() == ".docx":
                annotate_docx(f, statements, a, apply=True)
            else:
                f.write_text(new_text, encoding="utf-8")
            changes.append({"file": str(f), "sha256_before": before, "sha256_after": sha256(f), "notes_added": changed, "backup": str(backup)})
    cols = ["file", "class", "reason", "location", "statement", "action"]
    for name, rows in (("annotation_plan.csv", plan), ("protected_listing.csv", protected)):
        with open(run / name, "w", encoding="utf-8-sig", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=cols)
            w.writeheader()
            w.writerows(rows)
    with open(run / "changes.csv", "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["file", "sha256_before", "sha256_after", "notes_added", "backup"])
        w.writeheader()
        w.writerows(changes)
    summary = {"res_id": a.res_id, "date": a.date, "applied": a.apply, "files": len(uniq),
               "work_product_files": len({p["file"] for p in plan if p["class"] == "WORK_PRODUCT"}),
               "protected_or_unclassified_files": len({p["file"] for p in protected}),
               "notes_planned": sum(1 for p in plan if p["action"].startswith("note")),
               "notes_written": sum(c["notes_added"] for c in changes), "run_dir": str(run), "note_text": note_text(a).strip()}
    (run / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))
    return 0 if plan else 1


if __name__ == "__main__":
    sys.exit(main())
