#!/usr/bin/env python3
"""Consolidation checks: source-coverage crosswalk, variant/conflict links, filed-document screen.

Purpose
    Supports the document-consolidation skill. A master built from several versions must
    keep every argument. This tool makes that checkable:
      skeleton  lists every heading of every source version (with SHA-256 of each source)
                as a ready-to-fill "Source Coverage" table and master header block.
      check     reads a finished master and fails if any source heading is unmapped, if a
                mapped location is not a heading in the master, if a source is missing from
                the header or its SHA-256 changed, or if a [VARIANT A]/[VARIANT B] block has
                no FC-### conflict-register ID.
      filed     screens candidate files for filed/served/original markers (file stamp,
                certificate of service, signature line, Filed folder, PDF); such files are
                "kept, not redundant" and must never be merged.

Usage
    py -3 -B consolidation_check.py skeleton --source A.md --source B.docx [--out crosswalk.md]
    py -3 -B consolidation_check.py check --master MASTER.md --source A.md --source B.docx [--json report.json]
    py -3 -B consolidation_check.py check --master MASTER.md --sources-from-header [--search-dir DIR ...]
    py -3 -B consolidation_check.py filed --file A.md --file B.pdf

Inputs
    .md/.markdown/.txt (Markdown '#' headings; for .txt also ALL-CAPS lines and I./A./1. outline lines)
    and .docx (Heading/Title styles). PDFs are treated as filed/original and have no headings here.
    The master's Source Coverage table must have the columns: Source file | Source heading | Master location.

Outputs
    skeleton: Markdown (stdout or --out). check: summary on stdout, optional JSON; exit 0 when zero
    unmapped items and no defects, 1 otherwise, 2 on usage errors. filed: one line per file with
    KEEP_NOT_REDUNDANT or MERGEABLE and the markers found.

Examples
    py -3 -B consolidation_check.py skeleton ^
      --source "D:\\Court_Data\\Legal_Team_Casebook\\01_Sources\\Appeal_and_Postconviction\\Appeals\\Certiorari-Brief-Petitioner-Allen-Nc.md" ^
      --source "D:\\Court_Data\\Legal_Team_Casebook\\01_Sources\\Appeal_and_Postconviction\\Appeals\\Allen-Certiorari-Petitioner-Brief-Nc.md"
    py -3 -B consolidation_check.py check --master Certiorari_Petition_State_v_Allen_MASTER.md --source ... --source ...
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROMAN = r"(?:[IVXLC]+|[A-Z]|\d{1,2})"


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as fh:
        for b in iter(lambda: fh.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest().upper()


def key(s: str) -> str:
    s = re.sub(r"[*_`#>\[\]]", " ", s)
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s.rstrip(" .:")


def text_of(p: Path) -> str:
    if p.suffix.lower() == ".docx":
        import docx
        return "\n".join(par.text for par in docx.Document(str(p)).paragraphs)
    if p.suffix.lower() == ".pdf":
        return ""
    return p.read_text(encoding="utf-8", errors="replace")


def headings(p: Path) -> list[str]:
    ext = p.suffix.lower()
    out = []
    if ext == ".docx":
        import docx
        for par in docx.Document(str(p)).paragraphs:
            st = (par.style.name or "") if par.style is not None else ""
            if par.text.strip() and (st.startswith("Heading") or st == "Title"):
                out.append(par.text.strip())
    elif ext in (".md", ".markdown", ".txt"):
        in_code = False
        for line in text_of(p).splitlines():
            if line.strip().startswith("```"):
                in_code = not in_code
                continue
            if in_code:
                continue
            m = re.match(r"^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$", line)
            b = re.match(r"^\s{0,3}\*\*([^*]{2,220})\*\*\s*$", line)
            if m:
                out.append(m.group(1).strip())
            elif b:  # a line that is entirely bold is a heading in many converted briefs
                out.append(line.strip())
            elif ext == ".txt":
                s = line.strip()
                if 4 <= len(s) <= 120 and (s.isupper() and re.search(r"[A-Z]{3}", s) or re.match(rf"^{ROMAN}\.\s+\S", s)):
                    out.append(s)
    seen, uniq = set(), []
    for h in out:
        if key(h) and key(h) not in seen and not key(h).startswith("source coverage"):
            seen.add(key(h))
            uniq.append(h)
    return uniq


def cmd_skeleton(a) -> int:
    lines = ["<!-- master header: fill title and date -->", "", "## Sources", "",
             "| # | Source file | SHA-256 |", "|---|---|---|"]
    rows = []
    for i, s in enumerate(a.source, 1):
        p = Path(s)
        lines.append(f"| {i} | {p} | {sha256(p)} |")
        for h in headings(p):
            rows.append(f"| {p.name} | {h.replace('|', '/')} |  |")
        if not headings(p):
            rows.append(f"| {p.name} | (no headings found: map the body paragraphs or arguments by hand) |  |")
    lines += ["", "All arguments, facts, record cites, authorities, quotations, exhibits and requests for relief from every source are kept. See [Source Coverage](#source-coverage).", "",
              "## Source Coverage", "", "| Source file | Source heading | Master location |", "|---|---|---|"] + rows
    out = "\n".join(lines) + "\n"
    if a.out:
        Path(a.out).write_text(out, encoding="utf-8")
        print(f"wrote {a.out} ({len(rows)} rows)")
    else:
        sys.stdout.write(out)
    return 0


def parse_coverage(master_text: str):
    """Rows (source, heading, location) from the heading-crosswalk table(s) under the
    'Source Coverage' heading (its subsections included). Tables whose header has no
    'heading' column (for example line-accounting tables) are skipped."""
    m = re.search(r"(?im)^(#{1,6})\s*Source Coverage.*$", master_text)
    if not m:
        return None
    level = len(m.group(1))
    rows, header, use = [], None, False
    for line in master_text[m.end():].splitlines():
        h = re.match(r"^\s{0,3}(#{1,6})\s", line)
        if h and len(h.group(1)) <= level:
            break
        if not line.strip().startswith("|"):
            header = None
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if set("".join(cells)) <= set("-: "):
            continue
        if header is None:
            header = [c.lower() for c in cells]
            use = len(cells) >= 3 and "heading" in " ".join(header[1:2])
            continue
        if use and len(cells) >= 3:
            rows.append([cells[0], cells[1], cells[-1]])
    return rows


def header_sources(master: Path, mt: str, search_dirs: list[str]) -> tuple[list[str], list[str]]:
    """Source files named in the master's header (before Source Coverage): absolute paths,
    or names resolved against the master's folder and any --search-dir."""
    head = mt[: re.search(r"(?im)^#{1,6}\s*Source Coverage", mt).start()] if re.search(r"(?im)^#{1,6}\s*Source Coverage", mt) else mt[:20000]
    cands = []
    header = None
    for line in head.splitlines():  # preferred: the 'Source file' column of the header table
        if not line.strip().startswith("|"):
            header = None
            continue
        cells = [c.strip().strip("`") for c in line.strip().strip("|").split("|")]
        if set("".join(cells)) <= set("-: "):
            continue
        if header is None:
            header = [c.lower() for c in cells]
            continue
        col = next((i for i, h in enumerate(header) if "source file" in h or h in ("source", "file", "path")), None)
        if col is not None and col < len(cells) and re.search(r"\.(?:md|docx|txt)$", cells[col], re.I):
            cands.append(cells[col])
    if not cands:
        cands = re.findall(r"[A-Za-z]:\\[^|\n`*\"<>]+?\.(?:md|docx|txt)\b", head)
        cands += re.findall(r"`([^`|\n]+?\.(?:md|docx|txt))`", head)
    found, missing, seen = [], [], set()
    for c in cands:
        c = c.strip()
        base = re.split(r"[\\/]", c)[-1].lower()
        if base in seen or base == master.name.lower():
            continue
        seen.add(base)
        options = [Path(c)] if Path(c).is_absolute() else [anc / c for anc in [master.parent, *master.parents]] + [Path(d) / c for d in search_dirs] + [Path(d) / Path(c).name for d in search_dirs]
        hit = next((str(o) for o in options if o.is_file()), None)
        (found if hit else missing).append(hit or c)
    return found, missing


def cmd_check(a) -> int:
    master = Path(a.master)
    mt = text_of(master)
    a.source = list(a.source or [])
    header_missing = []
    if a.sources_from_header:
        found, header_missing = header_sources(master, mt, a.search_dir or [])
        a.source += [f for f in found if f not in a.source]
    if not a.source and not header_missing:
        print("no sources given or resolved from the header", file=sys.stderr)
        return 2
    master_heads = {key(h) for h in headings(master)}
    defects, unmapped, notes = [], [], []
    defects += [f"header names a source not found on disk (retired or moved?): {m}" for m in header_missing]
    cov = parse_coverage(mt)
    if cov is None:
        defects.append("master has no 'Source Coverage' heading/table")
        cov = []
    mapped = {}
    for src, head, loc in cov:
        mapped.setdefault((key(Path(src).name), key(head)), []).append(loc)
    for s in a.source:
        p = Path(s)
        digest = sha256(p)
        if p.name not in mt and str(p) not in mt:
            defects.append(f"header does not list source {p.name}")
        elif digest not in mt.upper():
            defects.append(f"SHA-256 for {p.name} is missing or changed (now {digest})")
        for h in headings(p):
            locs = mapped.get((key(p.name), key(h)))
            if not locs:  # crosswalk cell holding a truncated copy of a long heading (40+ chars)
                kh = key(h)
                pref = [v for (sn, sh), v in mapped.items() if sn == key(p.name) and len(sh) >= 40 and kh.startswith(sh)]
                if pref:
                    locs = pref[0]
                    notes.append(f"{p.name}: heading mapped through a truncated crosswalk entry: {h[:80]}")
            if not locs or not any(l.strip() for l in locs):
                unmapped.append({"source": p.name, "heading": h, "problem": "unmapped"})
                continue
            for l in locs:
                n_lines = mt.count("\n") + 1
                line_refs = [int(x) for x in re.findall(r"(?i)\bline\s+(\d+)", l)]
                if line_refs:
                    if any(not 1 <= x <= n_lines for x in line_refs):
                        unmapped.append({"source": p.name, "heading": h, "problem": f"location '{l}' points past the end of the master"})
                    continue
                target = key(re.sub(r"^§+|\(.*?\)$", "", l.split(";")[0]).strip())
                if target and target not in master_heads and not any(target in mh for mh in master_heads):
                    unmapped.append({"source": p.name, "heading": h, "problem": f"location '{l}' is not a master heading or line"})
    variant_lines = [i for i, l in enumerate(mt.splitlines()) if re.search(r"\[VARIANT [A-Z]\]", re.sub(r"`[^`]*`", "", l))]
    lines = mt.splitlines()
    for i in variant_lines:
        window = " ".join(lines[max(0, i - 3): i + 4])
        if not re.search(r"FC-\d{3,}", window):
            defects.append(f"line {i + 1}: VARIANT block without an FC-### register ID")
    report = {"master": str(master), "sources": len(a.source), "coverage_rows": len(cov), "unmapped": len(unmapped),
              "unmapped_items": unmapped, "variant_markers": len(variant_lines), "defects": defects, "notes": notes,
              "status": "pass" if not unmapped and not defects else "fail"}
    if a.json:
        Path(a.json).write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "unmapped_items"} | {"first_unmapped": unmapped[:10]}, indent=2))
    return 0 if report["status"] == "pass" else 1


FILED_MARKERS = [
    (r"(?i)\bfiled\b[^\n]{0,40}\b(?:20\d\d|19\d\d)\b", "file-stamp date"),
    (r"(?i)certificate of service", "certificate of service"),
    (r"(?im)^\s*/s/\s*\S", "signature /s/ line"),
    (r"(?i)clerk of (?:superior )?court", "clerk stamp"),
    (r"(?i)\bserved (?:upon|on|by)\b", "service statement"),
]


def cmd_filed(a) -> int:
    for f in a.file:
        p = Path(f)
        found = []
        if any(seg.lower() in ("filed", "served") for seg in p.parts[:-1]):
            found.append("Filed/Served folder")
        if p.suffix.lower() == ".pdf":
            found.append("PDF (court or original copy)")
        try:
            t = text_of(p)
        except Exception as e:
            t = ""
            found.append(f"unreadable ({e})")
        found += [label for rx, label in FILED_MARKERS if re.search(rx, t)]
        verdict = "KEEP_NOT_REDUNDANT" if found else "MERGEABLE"
        print(f"{verdict}\t{p}\t{'; '.join(found)}")
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Consolidation coverage and safety checks.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("skeleton")
    s.add_argument("--source", action="append", required=True)
    s.add_argument("--out")
    c = sub.add_parser("check")
    c.add_argument("--master", required=True)
    c.add_argument("--source", action="append")
    c.add_argument("--sources-from-header", action="store_true", help="also check every source file named in the master header")
    c.add_argument("--search-dir", action="append", help="folder to resolve header file names in (repeatable)")
    c.add_argument("--json")
    f = sub.add_parser("filed")
    f.add_argument("--file", action="append", required=True)
    a = ap.parse_args(argv)
    return {"skeleton": cmd_skeleton, "check": cmd_check, "filed": cmd_filed}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
