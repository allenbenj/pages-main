---
name: casebook-moves
description: Moves, retires or reorganizes matter files and folders in five recorded steps (plan, hash-verified move, manifest, Casebook DB path update, QMD and Anytxt index refresh) without ever deleting or overwriting, and repoints Casebook DB rows after moves made by other tools (restores, consolidations). Use when the user asks to move, relocate, retire, archive, supersede, restore or reorganize files in the matter workspace, or when DB rows still point at old paths after a move.
---

# Casebook Moves

## Role

Every move in the matter workspace leaves the files byte-identical, leaves a manifest, and leaves the Casebook DB and search indexes pointing at the new paths. The tool is `scripts/casebook_moves.py` (kit root `scripts\`); its header documents every option. The DB step uses `casebook_db.py update-paths` (alias `relocate`) through the matter's launcher, which works for any destination inside the workspace.

Precedence is the kit's usual order. Legal_Hooks denials are binding. Never delete; never overwrite; never move across drives (copy-then-delete is a deletion).

## Sequence

1. **Plan** (changes nothing):
   `py -3 -B <kit>\scripts\casebook_moves.py plan --source <file or folder> [--source ...] --dest-dir <folder> --reason "<why>"`
   or `plan --map moves.csv` (columns `source,destination`). It hashes every file, refuses a destination that exists, a destination inside its source, a cross-drive move, and any source that is or contains a junction or symlink (links are never followed or moved; for example `D:\Legal_Kit\skills` is a junction to the live kit skills), and flags sources under protected evidence roots. Show the owner `move_plan.csv` and `plan.json`.
2. **Move:** `move --run-dir <run>` (dry run), then `move --run-dir <run> --apply`. Sources under a protected evidence root need `--owner-approval "<who, when, what>"`, recorded in the manifest. It re-hashes before and after and writes `MOVE_MANIFEST.csv` and `moved_verified.jsonl`.
3. **Manifest:** `manifest --run-dir <run>` re-verifies every moved file on disk and writes `MOVES_README.md`.
4. **DB:** `db --run-dir <run>` (dry run: `db_plan.csv` with the action for each file), then `db --run-dir <run> --apply`. Batches of up to 100 files, each with a DB backup and report. `--only-registered` leaves files that were never in the DB unregistered (use it for tool copies and other non-case material); `--register-outside` registers files that came from outside the workspace. Afterwards run the launcher's `validate` and `stats`.
5. **Index:** `index --run-dir <run>` (dry run), then `index --run-dir <run> --apply [--embed]`. It runs `D:\Court_Data\QMD\bin\qmd.cmd update -c court-data-textmirror` (and `embed` when asked; never start a second embedding writer), checks Anytxt (`anytxt_rpc.py status`, API `http://127.0.0.1:9924/rpc`) and asks it to re-sync the affected folders. If Anytxt is down, report it in the first lines of the reply.

**Moves made by another tool** (a restore, a consolidation): `reconcile --manifest <csv> --old-col <col> --new-col <col> [--sha-col <col>] [--verified-col <col>] --run-dir <run>` builds a run folder from that manifest (rows that were not verified, are missing, fail the hash check, or whose old path exists again are skipped and listed), then run steps 3 to 5.

## Rules

- Run folders default to `Legal_Team_Casebook\_organize_manifest\processed\moves_<stamp>`; keep them.
- Superseded copies go to a `superseded` or `processed` folder with a stub README at the old location when other tools might look there.
- Check references (configs, launchers, Agents.md files, registries, junctions) before moving anything a tool loads; update or report them.
- Use the DB only through the launcher's supported commands (`update-paths`, `add-files`, `sync`, `validate`, `stats`); never direct SQL.
- Report every step that did not run, with its error (IR-C3).

## Output contract

Run folder path; items and files moved with total bytes; hash verification result; DB result per batch (rows repointed, registered, marked stale, locator references updated, integrity) and the `validate` result; QMD and Anytxt results; anything skipped and why.
