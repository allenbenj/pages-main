# Systems map template (fact purge)

A matter keeps its filled-in map outside the kit and names it in the matter profile as `tools.fact_purge_systems_map`. List every place case text can live and how each is fixed. Use placeholders here; the filled map holds the real paths.

## Folders

| Folder | Status (protected source / work product / control / backup) | Fix |
|---|---|---|
| `<case root>\<sources folder>` | Protected source | Never edit. Correction note in the log |
| `<case root>\<analysis folder>` | Work product | Edit, then sync |

## Casebook database

| Table (text columns) | Fed by | Fix (sync from file / approved direct edit / never) |
|---|---|---|

Destructive commands never to run: `<list>`. Validator command and expected result: `<command>`, `<n/n>`.

## Registers kept true to disk

File index, inventory, deliverable hashes, and each log (change log, decision log, corrections log), with paths.

## Text index and mirrors

Index location and collection; the authorized updater command; status command; backups that can still hold text.

## Search tools

Content-search tool and its status command; file types it does not index; the occurrence finder and its skip options.

## Agent and tool stores

| Store | Contents | Fix |
|---|---|---|

## Not searched

Stores outside the matter root, cloud copies, email, retired stores.

## Corrections log columns

`correction_id, logged_at, requested_by, approved_by, approval_scope, false_fact_summary, correct_version, variants_file, hit_list_csv, documents_changed, db_rows_changed, indexes_rebuilt, source_records_noted, backups_retained, backup_folder, validate_result, change_ids, notes`
