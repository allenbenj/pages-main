---
name: document-consolidation
description: Merges near-duplicate versions of the same work-product document into one master that keeps every argument, fact, record cite, authority, quotation, exhibit and request for relief from every version, shows conflicting statements side by side as variants, maps every source heading in a Source Coverage crosswalk with zero unmapped items, never merges filed, served or third-party original documents, retires the old versions by hash-verified move (never deletion), and sends every factual conflict to the fact conflict register. Use when the user asks to consolidate, merge, dedupe or combine redundant document versions into a master.
---

# Document Consolidation

## Role

Turn a group of redundant versions of one document (same type and subject, different file names) into one master, without losing anything any version said. This is an organizing task, not an editing task: it does not choose between versions, improve arguments, or correct facts. Built from the owner's handoff of 2026-10-02 (`Legal_Team_Casebook\00_Control\Consolidation_Handoff_20261002.md`), which remains the matter-specific instruction for D:\Court_Data.

Precedence is the kit's usual order (`corrective-playbook-gate/references/master-rules.md`): the Corrective Playbook, then the matter's instructions, then the master rules, then this skill. Legal_Hooks denials are binding.

## Rules (all mandatory)

1. **Keep every argument.** Every argument, sub-argument, fact, record cite, authority, quotation, exhibit reference and request for relief in any version appears in the master. Never pick one version's argument over another's; never drop a point because it looks weak, repetitive in spirit or inconsistent. Remove only true repeats (same point in the same words, or restated with no new fact, cite or reasoning). When in doubt, keep both.
2. **Variants side by side.** When versions state a fact differently (dates, amounts, who said what, page cites), keep both, marked `[VARIANT A] (source file)` / `[VARIANT B] (source file)`, and give each variant block its conflict register ID (`FC-###`). Do not decide which is right. Layout: `references/master-template.md`.
3. **Source Coverage crosswalk, zero unmapped.** Each master ends with a Source Coverage table: every section or argument heading from every source and where it now lives in the master. `scripts/consolidation_check.py check` must report `unmapped: 0` and no defects before the master is reported done.
4. **Never merge filed or original documents.** A version that was filed or served (court stamp, file-stamp date, signed certificate of service, docket number with a filing date), and any evidence or third-party original (letters, transcripts, police reports, messages, orders), stays exactly as it is and is listed as "kept, not redundant". Screen candidates with `consolidation_check.py filed`; a KEEP_NOT_REDUNDANT result needs the owner's word before any merge.
5. **Never delete.** Retired versions move, by hash-verified move, to the run's `superseded\` folder keeping their relative path (use `scripts/casebook_moves.py` and the `casebook-moves` skill). Record SHA-256 before and after every move and confirm they match.
6. **Conflicts go to the register.** Every factual disagreement between versions is added to the matter's fact conflict register (`Legal_Team_Casebook\00_Control\Fact_Conflict_Register.csv`) as the next FC ID, after a backup. The owner resolves conflicts; this skill never does.
7. **Fixed facts and authorities.** Apply the matter's resolved facts (for example RES-001 in D:\Court_Data: the demand Joel Kelly communicated was "$15,000 a year for 10 years"; no other amount or computed total in work product). No numeric likelihoods in final documents. Add no authority that is not already in a source version; do not correct citations from memory; mark doubtful ones `[VERIFY]`, and run `scripts/verify_quotes.py` on the master before it is used in a filing.
8. **Don't touch** history folders (`archive`, `.archive`, `processed`, `99_Holding`), OneDrive, the files the matter names as off limits (in D:\Court_Data: `04_Master\14_Master_Fact_Statements.md`, `04_Master\Comprehensive_Fabrication_Narrative_Analysis.md` and its .docx), hooks.json, or live config.
9. **Find files through the retrieval order** (Casebook DB inventory, the file index CSV, QMD `court-data-textmirror`, Anytxt). No recursive PowerShell walks or Select-String over the workspace.

## Sequence

0. **Check for partial work.** Look for an earlier run folder (in D:\Court_Data: `_organize_manifest\processed\consolidation_20261002\` at the workspace and casebook levels): CHANGES.md, moved files, draft masters. Verify the hash of every moved file and continue from there; log any redo or undo.
1. **Find groups.** A group is the same document type and subject with high text overlap, or titles that differ only in naming style. Record candidates in `clusters.csv` (group ID, member files, similarity, master path, action merged / kept-not-redundant / candidate, SHA-256 values). When unsure whether two files are the same document, list them as `candidate` and do not merge.
2. **Screen** each member with `consolidation_check.py filed`. Filed, served and original members are `kept-not-redundant`.
3. **Skeleton.** `consolidation_check.py skeleton --source ... --out <master>.crosswalk.md` gives the header source list (with SHA-256) and the empty Source Coverage table.
4. **Build the master** with the header from `references/master-template.md`: title, date built, every source file with its SHA-256, the statement that all arguments from all sources are kept, and a link to the Source Coverage table. Merge section by section; variants side by side with FC IDs.
5. **Register conflicts** (back up the register first; next FC IDs).
6. **Check.** `consolidation_check.py check --master <master> --source ...` must pass (zero unmapped, every source and hash in the header, every variant linked to an FC ID). Then `verify_quotes.py <master>` for quotations and pin cites.
7. **Retire** the merged versions (rule 5) with `casebook_moves.py plan / move --apply / manifest / db --apply / index --apply`.
8. **Update systems.** Casebook DB through its supported commands only (the moves tool's `db` step uses `update-paths`; new masters use `add-files`), then `validate` and `stats`; update the file index CSV; repoint live references (Master Index, Agents.md files, analysis docs) from retired paths to the master.
9. **Log.** Append to the run's CHANGES.md after every batch of at most 25 files so work can resume.

## Output contract

Report: master paths; for each master, the `check` result showing zero unmapped items; new FC IDs; totals (groups found, files merged, masters created, files retired, groups kept); DB results (`validate`, `stats`); the moves run folders; and anything left undone. A master is internal work product until it passes `corrective-playbook-gate` and `legal-quality-control`.

## Self-check

Every source heading mapped; every variant has an FC ID and a register row; no filed or original document merged; no file deleted; every move hash-verified; DB updated through supported commands; CHANGES.md current.

## Resources

- `references/master-template.md`: master header, variant layout and crosswalk format.
- `scripts/consolidation_check.py`: `skeleton`, `check`, `filed` (documented in its header).
- `../../scripts/casebook_moves.py` and the `casebook-moves` skill: hash-verified moves with DB and index refresh.
