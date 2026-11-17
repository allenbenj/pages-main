# Master document template

```markdown
# <Title> - MASTER

Built: <YYYY-MM-DD> by <agent/person>. Consolidation run: <run folder>.

## Sources

| # | Source file | SHA-256 |
|---|---|---|
| 1 | <full path of version 1> | <sha256> |
| 2 | <full path of version 2> | <sha256> |

All arguments, facts, record cites, authorities, quotations, exhibits and requests for relief from every source are kept. True repeats only were removed. See [Source Coverage](#source-coverage).

## I. <Argument heading>

<merged text>

[VARIANT A] (<version 1 file name>): <wording in version 1>  (FC-025)
[VARIANT B] (<version 2 file name>): <wording in version 2>  (FC-025)

## Source Coverage

| Source file | Source heading | Master location |
|---|---|---|
| <version 1 file name> | <heading exactly as in the source> | I. <Argument heading> |
| <version 2 file name> | <heading> | I. <Argument heading> |
```

## Rules for the table

- One row per heading per source; `consolidation_check.py skeleton` produces the rows.
- `Master location` is a heading that exists in the master (several may be given, separated by `;`). A blank cell is unmapped.
- A source with no headings: map its arguments by hand (one row per argument, quoting its first words in the heading column), and say so in the header.
- `consolidation_check.py check` must show `"unmapped": 0` and `"defects": []`.

## Variant blocks

- Keep both wordings in full, each with its source file name, and the FC ID within three lines of the marker (the checker looks there).
- Never resolve a variant in the master. When the owner resolves the FC item, the purge skill's annotate mode adds the dated `Resolved YYYY-MM-DD (RES-###)` note.
