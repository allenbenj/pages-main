# Handoff template for a cheaper or less capable model

Use this when a task is handed to a smaller or cheaper model (or any agent that has not read the kit). Paste the whole block, fill the brackets, and keep the rules section unchanged. The rules are not optional for the receiving model; the handing agent checks the result against them before accepting it.

```markdown
# Task handoff: [one-line task]

Owner: Ben Allen. Workspace: D:\Court_Data. Written [YYYY-MM-DD HH:MM ET] by [agent].
Live kit: D:\Court_Data\Legal_Team_Kit_v0.4.0\Legal_Kit (other kit copies are superseded; do not load them).

## Goal
[What done looks like, in one or two sentences.]

## Inputs (exact paths)
- [file or folder]: [what it is]

## Output (exact paths)
- [file]: [format]. Report to [where] with the items listed under "Report".

## RULES (mandatory; stop and ask instead of breaking one)
1. NEVER DELETE. Do not delete, overwrite or empty any file or folder. Retired copies go to a `processed` or `superseded` folder by hash-verified move (`scripts\casebook_moves.py`). Back up every file before editing it and record SHA-256 before and after.
2. RES-001: the payoff/extortion demand Joel Kelly communicated was "$15,000 a year for 10 years". Use exactly that wording in work product. Never write another amount or a computed total. Check `Legal_Team_Casebook\00_Control\Fact_Corrections_Log.csv` for every other RES-### item and use the owner's wording.
3. WORK PRODUCT VERSUS THIRD-PARTY RECORDS. Ben's own materials (02_Analysis, 04_Master, 06_Motion_Edit_Work, 00_Control documents, unfiled drafts) may be edited. Verbatim third-party records and official records (transcripts, orders, filed or served papers, discovery, police/lab reports, letters, messages, authorities, 01_Sources, 03_Authorities, 05_Work_Reference\Reference_Text, archive, 99_Holding, any PDF) are NEVER altered. List problems in them instead.
4. QUOTE VERIFIER BEFORE FILING. Before any brief, motion or memo is called ready, run
   `py -3.14 -B D:\Court_Data\Legal_Team_Kit_v0.4.0\Legal_Kit\scripts\verify_quotes.py "<draft>" --gate`
   Use `py -3.14` (the GIL build, `C:\Python314\python.exe`), not `py -3`: on this PC `py -3` starts the free-threaded 3.14t build, where PyMuPDF crashes, so the verifier falls back to pypdf, which drops text (pypdf 6.14 loses the "formal verdict" sentence of the filed DJ motion) and a misquote in a PDF can go unchecked.
   NOT_FOUND, a NEAR or unsourced quotation, and a pin mismatch block filing. Fix the draft (or record an owner-approved waiver); never edit the verifier output.
5. Conflicts are not yours to resolve. A disagreement between a stated fact and the record goes to `00_Control\Fact_Conflict_Register.csv` as the next FC ID (back it up first). Ben resolves it.
6. No new authority that is not already in a source; no citations or quotations from memory; mark doubtful ones [VERIFY]. No numeric likelihoods in final documents.
7. Search order: Casebook DB launcher (`Legal_Team_Casebook\00_Control\run_casebook_db.py`), then QMD (`D:\Court_Data\QMD\bin\qmd.cmd query "..." -c court-data-textmirror`), then Anytxt (`http://127.0.0.1:9924/rpc`), then the original file. No grep/rg/findstr/Select-String or recursive folder walks over case files. A search hit is a locator; quote only from the original file. Transcript pages: `scripts\tr_lookup.py <page>`.
8. Do not touch `.codex\hooks.json`, live configs, OneDrive, or `D:\Court_Data\API Key.txt`. Never route around a Legal_Hooks or guard denial; report it.
9. Do not write logs or plans under C:\Users\allen or %TEMP%; use the run folder named above.
10. Report honestly: a check that did not run is reported as not run, with the error.

## Steps
1. [step]
2. [step]

## Report
- Files created or changed (path, SHA-256 before/after, backup path)
- verify_quotes result (report path, blocking count) for any court-facing draft
- New FC IDs; anything not done and why
```

## Acceptance check by the handing agent

Before accepting the result: confirm no file was deleted (compare the run manifest), backups exist with hashes, RES-001 wording is exact, no third-party or official record changed (hash check), and `verify_quotes.py --gate` passes for any court-facing draft. A result that fails a rule goes back, with the rule number.
