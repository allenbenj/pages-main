# Preservation and retesting decision

Complete this gate before any procedure that consumes, alters, or destroys material. A decision that is not complete is `not_ready`.

## Decision fields

| Field | Content |
|---|---|
| `evidence_id` | The item identifier. |
| `remaining_quantity` | What remains, in the laboratory's units, with the source. |
| `condition` | The current condition and any degradation. |
| `storage_location` | Where the material is stored and who controls it. |
| `proposed_procedure` | The test or examination proposed. |
| `destructive` | `true` or `false`; if `true`, state what is consumed. |
| `scientific_question` | The precise question the test is meant to answer. |
| `alternatives` | Non-destructive or less destructive alternatives considered. |
| `sample_allocation` | How much is allocated, and what is reserved. |
| `approvals` | Who approved, with the date and authority. |
| `expected_impact` | What the result could change in the case. |
| `requests_or_orders` | The request, agreement, order, or notice authorizing the procedure. |
| `preservation_review_status` | `not_ready`, `ready`, or `approved`. |
| `reviewer` | The person accountable for the decision. |
| `last_checked` | The date the decision was last verified. |
| `notes` | Gaps, limits, and follow-up. |

## Ready gate

A decision cannot be marked `ready` unless:

- [ ] the remaining quantity and condition are documented;
- [ ] the storage location and custodian are documented;
- [ ] the proposed procedure is stated;
- [ ] the scientific question is precise;
- [ ] non-destructive or less destructive alternatives are considered;
- [ ] the sample allocation and reserve are stated;
- [ ] the destructive status is stated;
- [ ] the expected impact is stated;
- [ ] the required approvals, requests, or orders are recorded;
- [ ] the defense has notice or an opportunity to be heard, where required;
- [ ] a reviewer is named.

If the procedure is destructive and any item is missing, the status remains `not_ready`. Do not consume the material.

## Destruction reports

A report that evidence was destroyed is an availability event, not proof of intentional destruction. Record:

- who reported the destruction;
- when and where it was reported;
- the stated basis or policy;
- the item-level inventory or transfer record;
- what remains, if anything.

Keep the availability status `destruction_reported_unverified` until the report is verified. Do not infer bad faith or a constitutional violation from the report alone.

## Linkages

- The item and its availability state: `controller/schemas/evidence_availability.schema.json`.
- The custody record: `references/custody-chain.md`.
- The scientific claim and its limits: `forensic-evidence-evaluation`.
- A proposed request or order: `records-requests-subpoenas`.

## Output

A completed decision template, a `ready` or `not_ready` status, the approvals and requests, and a statement of what will be preserved.
