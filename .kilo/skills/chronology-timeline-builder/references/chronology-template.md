# Chronology templates

Placeholders below are illustrative. Fill them only from sources.

## Master table (one row per event)

| Field | Content |
|---|---|
| ID | Stable entry ID, for example `T-001`. Never renumber. |
| Track | Incident, investigation, discovery, court and procedural, or communications. |
| Original date/time | Exactly as the source states it, with the zone or device label. |
| Normalized | One format, for example `YYYY-MM-DD hh:mm:ss` plus zone; or `UNVERIFIED`. |
| Precision | Exact, approximate, range, or inferred, with the reason. |
| Date type | Occurrence, record, filing, modification, discovery or receipt, or knowledge. |
| Event | One event per row, in neutral words. |
| Actor or speaker | Who did, said, or recorded it. |
| Source ID and pinpoint | Source ID plus page and line, timestamp, Bates number, or docket entry. |
| R10 class | Record shows, witness said, party alleged, inference, or unconfirmed. |
| Conflict ID | Register ID if another source disagrees; otherwise blank. |
| Note | Open item, offset, or reason for the label. |

## Procedural track (court events)

Record, for each order, filing, hearing, and service event: the document, the file-stamp or docket-entry date, the date signed, the date entered, the date served, and the source. Occurrence date, signing date, entry date, and service date can differ; a deadline may run from any of them depending on the rule, so keep all four.

## Delay and interval table

| Interval | Start event (ID) | End event (ID) | Rule and trigger | Computation | Second-pass result | Excluded periods and why |
|---|---|---|---|---|---|---|

The rule and the exclusions come from verified authority (`local-rules-deadlines`, K9). An unverified rule means the row is marked UNVERIFIED and the interval is a working assumption.

## Knowledge track (when each person learned it)

| Fact | Person or office | When they had it | How they got it | Source | What they did next |
|---|---|---|---|---|---|

Use this track to separate what a person had at the time from what is known only in hindsight.

## Recording and metadata clock table

| Source | Device or system | Clock source | Zone | Known offset | Basis for the offset | Status |
|---|---|---|---|---|---|---|

Never correct a displayed time silently. Record the displayed time, then the offset and its basis.

## Conflicts and gaps list

| Item | Entries involved | Kind (conflict, impossibility, gap) | Register ID | What would settle it | Status |
|---|---|---|---|---|---|

## Narrative

Write the narrative from the table, not the reverse. Each sentence carries its entry IDs. Court papers convert R10 labels to attribution ("The report states...") and cite the record directly (K6, K12).
