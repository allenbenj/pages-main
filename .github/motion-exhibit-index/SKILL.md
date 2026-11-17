---
name: motion-exhibit-index
description: Builds a reference-only exhibit and source index (expert review package) for one workplan motion from a per-motion JSON config. It resolves every source through the Casebook DB inventory, records each file's SHA-256 in place without copying it, runs verify_quotes --gate on cited quotations and the motion draft, and writes an openpyxl workbook with CSV/JSON twins into the motion's 07_Exhibit_Index folder. Use when the user asks for an exhibit index, expert package, source index, records-to-obtain list or issue matrix for a motion (P00-P04, R01-R11, H01-H04), or to rebuild the legacy Build_Expert_Package / Build_Expert_Index output.
---

# Motion Exhibit Index

## Role

One motion, one config, one reproducible index. The tool is `scripts/build_motion_exhibit_index.py` (kit root `scripts\`); its header documents every option. It replaces the legacy `Build_Expert_Package.ps1` + `Build_Expert_Index.mjs` (workplan `00_Case_Control\Tools\Expert_Package_Builder\`, superseded), which copied 68 files into a package and needed a Node artifact library.

Precedence is the kit's usual order. Legal_Hooks denials are binding. Never copy source files (Structure.md: no copy-duplicates), never delete, never overwrite: every build writes a new `<stamp>` folder.

## Sequence

1. **Config:** `py -3.14 -B <kit>\scripts\build_motion_exhibit_index.py init --motion P02` writes a starter `exhibit_index_config.json` into `<motion>\07_Exhibit_Index\`. It refuses to overwrite. The motion folder comes from `00_Case_Control\04_Master_Issue_Tracker\MASTER_MOTION_REGISTER.csv`. Fill in the config:
   - **sources:** `id`, `title`, `tier` 1-4, and a `locator`. The locator is one of: `inventory_id`, `relative_path` (casebook-relative, as in the DB), or `filename` (plus `path_contains`). Then `pinpoint`, `why`, `authentication`, `confidentiality`, `restricted`.
   - **issues:** the Issue Matrix rows.
   - **comparisons** and **records_to_obtain.**
   - **quotes:** each one exact, with a `cite` that verify_quotes can check.
   - **gate_files:** for example the motion's current draft.
   - **limitations**, **qc_expected** (count checks) and **banned_patterns.**
   Find locators through the retrieval order (Casebook DB, then QMD, then Anytxt). Do not walk `01_Sources` recursively.
2. **Dry run** (writes nothing in the casebook): `build --motion P02`. It resolves each source in the inventory, read-only. Each file must exist on disk, match exactly one row, and match the DB byte count. It hashes each file in place, runs `verify_quotes.py --gate` in a temp folder, scans the config for banned patterns, and prints the QC. Fix every UNRESOLVED or AMBIGUOUS source and every gate failure before applying.
3. **Apply:** `build --motion P02 --apply` writes the following to `<motion>\07_Exhibit_Index\<yyyymmdd_hhmmss>\`:
   - `EXHIBIT_INDEX_<ID>.xlsx`, with these sheets: Start, Master Source Index, Reference Manifest, Issue Matrix, Source Comparisons, Records to Obtain, Quick Lookup, Reliability Tiers, Guardrails, Opinion Worksheet, Quality Control;
   - `REFERENCE_MANIFEST_<ID>.csv` and `.json`;
   - `QUOTES_FOR_GATE_<ID>.md`;
   - the `verify_quotes\` reports;
   - `BUILD_REPORT.json`.
   Exit code 2 means a QC or gate failure. The index is still written, but its QC sheet shows FAIL, and it must not go to an expert or counsel until it passes.
4. **Register (optional):** to make the output searchable, register the new folder with the Casebook launcher (`add-files`). Do not use direct SQL.

## Rules

- Reference, never copy. When a reviewer needs a portable package, produce it only on Ben's explicit request, as a separate step that records the copies' hashes.
- Tiers: 1 primary contemporaneous, 2 sworn, 3 official policy and standards, 4 derived or secondary (locator only).
- Guardrails are built in and cannot be removed:
  - never argue consent (owner ruling 2026-10-12);
  - no likelihood numbers;
  - allegations such as "DNA destroyed" are stated as allegations to verify, together with the vehicle that will verify them (P03c), never as fact.
- Quotations must pass `verify_quotes.py --gate`. A blocking item clears only through a reviewed waiver file.
- Run with `py -3.14` (the GIL build), as for verify_quotes. PyMuPDF crashes on the free-threaded build.
- The DB is read only (`mode=ro`). The tool never writes the DB.

## Output contract

Report:
- the motion ID and folder;
- the config path;
- the mode;
- the output folder;
- each source's status, with its SHA-256 when it resolved;
- the gate result for each file;
- the QC table with PASS/FAIL;
- anything skipped, and why.
