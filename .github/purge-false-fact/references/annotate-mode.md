# Annotate mode: dated resolution notes, other version kept as impeachment

Added 2026-10-03. Tool: `skills/purge-false-fact/scripts/annotate_resolution.py`.

## When to use

The owner has resolved a fact conflict and gives a resolution ID (`RES-###` in `00_Control\Fact_Corrections_Log.csv`) and the current version with its record source. The owner wants the superseded statement left in place, marked as superseded, and kept as impeachment material (for example, a prior inconsistent statement), instead of deleted. When the owner asks to delete instead, use the normal purge sequence.

## Work product versus third-party records

| Class | What it covers | Treatment |
|---|---|---|
| WORK_PRODUCT | Casebook `02_Analysis`, `04_Master`, `06_Motion_Edit_Work`, `00_Control` documents (.md, .txt, .docx); unfiled drafts and notes in the motion drafting root (`motion_drafting_root` in the matter profile); `.codex\legal_matter` and `.agents\workflow` control files | Note inserted after each superseded statement |
| PROTECTED | Protected evidence roots (matter profile); `01_Sources` outside the motion drafting root; `03_Authorities`; `05_Work_Reference` (reference text, transcript text); any `Filed`, `Served`, `Signed`, `Orders`, `Transcripts`, `Proceedings`, `Discovery`, `archive`, `99_Holding`, `Primary_Authority_Archive`, `Reference_Text` or `_Move_Backup` folder; record-type file names in the drafting root (transcript, order, indictment, warrant, subpoena, police/lab/SANE report, judgment, verdict sheet, discovery, letter from, certified); PDFs, images, audio, video, e-mail files, archives, databases, spreadsheets, CSV/JSON data | Listed in `protected_listing.csv`; never altered |
| UNCLASSIFIED | Anything outside the roots above | Listed, not edited; ask the owner |

A transcript, order, filed paper, letter, or report is evidence of what someone said or what a court did. It is never corrected or annotated. Generated blocks, registers and CSVs are fixed through their generators or owners (main SKILL step 7), not by this tool.

## Note format

```
[Resolved 2026-10-03 (RES-022): <current version>; record: <source>. The earlier version is kept as impeachment material, not as fact.]
```

- Inserted after the sentence holding the statement (Markdown/text), or at the end of the paragraph (DOCX, as an italic run; table cells included).
- A statement inside a quotation or blockquote: the note goes after the quotation, and the quoted words stay unchanged.
- Already annotated for the same RES ID: skipped, so a re-run changes nothing.

## Commands

```powershell
# 1. Dry run on the finder's hit list: writes annotation_plan.csv and protected_listing.csv, changes nothing
py -3 -B D:\Court_Data\Legal_Team_Kit_v0.4.0\Legal_Kit\skills\purge-false-fact\scripts\annotate_resolution.py `
  --res-id RES-022 --current "the vote reported at Tr. 922 was 9-3" --source "Tr. 922 (Vol 8, cover Volume 9)" `
  --variants-file D:\Court_Data\Legal_Team_Casebook\00_Control\Fact_Search\variants_RES-022.txt `
  --hits-csv D:\Court_Data\Legal_Team_Casebook\00_Control\Fact_Search\hits_RES-022.csv

# 2. After the owner approves the plan
...same command... --apply
```

Outputs go to `Legal_Team_Casebook\_organize_manifest\processed\annotate_<RES>_<stamp>\`: `annotation_plan.csv`, `protected_listing.csv`, `changes.csv` (SHA-256 before/after, backup path), `backups\` (pre-edit copies by relative path), `summary.json`. Exit 0 done, 1 nothing matched or a backup check failed, 2 usage error.

## After annotating

1. Append the edit to the corrections log row for the RES ID (files, note count, run folder).
2. Run the database sync and refresh the text index (main SKILL step 8).
3. Re-run the finder: every remaining work-product hit must carry its note; protected hits stay listed.
4. A changed brief or motion goes back through `motion-fact-verification`, `scripts\verify_quotes.py`, `corrective-playbook-gate` and `legal-quality-control`.
