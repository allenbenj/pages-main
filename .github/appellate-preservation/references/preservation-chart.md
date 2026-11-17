# Preservation chart and appellate record templates

Placeholders are illustrative. Fill them only from the docket, the transcripts, and verified authority.

## Preservation chart (one row per issue)

| Field | Content |
|---|---|
| Issue ID | Stable ID |
| Ruling, order, or event challenged | With date and docket entry |
| Where raised | Filing or transcript, with page and line or docket entry; "not located" if none |
| Filed or only drafted | Confirm the file stamp or docket entry; a draft preserves nothing |
| Form of preservation | Objection, motion, renewal, proffer, requested instruction, ruling obtained, none |
| Timing | Made when the issue arose, and renewed at use if the rule requires it (UNVERIFIED unless the rule is verified) |
| Grounds stated below | Quote or close paraphrase with source |
| Grounds argued on appeal | Same grounds? If not, flag the mismatch |
| Ruling obtained | Yes, no, reserved, or unknown, with source |
| Standard of review | Name and verified source, or UNVERIFIED |
| Prejudice or harmlessness test | Name and verified source, or UNVERIFIED |
| Status | Preserved, partly preserved, not preserved, or unknown |
| Fallback if not preserved | Route and its verified authority, or UNVERIFIED |
| Next step | Person and step |

## Record needs

| Item | Why the appellate record needs it | Status (in hand, requested, missing) | Who closes the gap |
|---|---|---|---|

Include transcripts of the proceedings that raised each issue, exhibits, orders, and docket entries. A summary or catalog is a lead, not the record (K6).

## Vehicles and deadlines

| Step | Rule (verified source and date, or UNVERIFIED) | Trigger event | Computation | Second-pass result | Status |
|---|---|---|---|---|---|

Use `local-rules-deadlines` and the jurisdiction reference for time computation. An unverified deadline is a working assumption and is labeled as one (K9).

## Best argument and adverse point

| Issue | Best argument (one sentence, with record cite) | Main adverse point (standard, preservation gap, or harmlessness) | Answer or risk entry |
|---|---|---|---|

## Pre-filing checks

- Each factual statement cites the record by ID and pinpoint (K6).
- Each authority is `reliance_approved` in the authority ledger (K1).
- Routing: `motion-brief-drafting`, then `corrective-playbook-gate`, then `legal-quality-control`; a named person signs off (K13).
