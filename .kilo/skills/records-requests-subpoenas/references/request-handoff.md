# Request handoff

This reference connects an evidence-availability record to a records request. It is the handoff contract between `discovery-brady-giglio`, `expert-report-validator`, `forensic-evidence-evaluation`, and `records-requests-subpoenas`.

## Trigger

Create a handoff when an availability record has:

- `availability_status` of `not_requested` or `requested`; or
- `availability_status` of `produced_partial` with a specific missing category; or
- a `next_action` that requires a request, subpoena, order, or inquiry.

Do not create a handoff merely because an item is `unknown`, `unavailable`, or `destruction_reported_unverified`. First identify the item, the holder, and the route.

## Required handoff packet

| Field | Source | Purpose |
|---|---|---|
| `evidence_id` | availability record | Links the request to the matrix row. |
| `description` | availability record | Names the item or category. |
| `source_or_existence_pin` | availability record | Shows why the item is believed to exist or why existence is unknown. |
| `existence_status` | availability record | Prevents a request from implying existence. |
| `availability_status` | availability record | Shows what has already happened. |
| `request_route` | new or updated record | Selects the vehicle: subpoena, voluntary request, statutory demand, court order, public records, investigative, or other. |
| `request_reference` | new record | The letter, subpoena, motion, or order identifier. |
| `entitlement_type` | new record | `verified_legal`, `order`, `agreement`, `investigative`, or `unverified`. |
| `authority_id` | authority ledger | The verified legal basis for a `verified_legal` entitlement. Run the ledger gate before relying on it. |
| `custodian` | new record | The agency or person who holds the item. |
| `request_date` | new record | The date sent or to be sent. |
| `next_action` | availability record | The concrete follow-up. |
| `reviewer` | new record | The person accountable for the request. |
| `last_checked` | new record | The date the record was last verified. |

Also attach:

- the exact disclosed-report language or the source pin that identifies the item;
- the method or discipline (for a laboratory or expert file);
- the disputed proposition the item is meant to test;
- the date range and format requested;
- any known privilege, privacy, or protective-order limit;
- the proposed follow-up date.

## Route selection

| Situation | Candidate route | What must be verified |
|---|---|---|
| Party or prosecution-held record in a criminal case | Statutory discovery demand, motion to compel, or court order | The governing statute/rule and the timing. |
| Non-party record holder | Subpoena duces tecum or motion for subpoena | The court's subpoena authority, service, and notice rules. |
| Government agency record | Public-records request or the applicable criminal-process route | The public-records statute and any exemption. |
| Regulated provider | Subpoena, court order, or authorization | The provider-specific statute and notice rules. |
| Voluntary production | Written request or agreement | The holder's authority to produce and any privacy limit. |
| Investigative inquiry | Interview or informal request | That the route does not purport to compel. |

## Drafting rules

- Request categories, not a generic file dump.
- Tie each category to an element, issue, or impeachment point.
- Use the holder's language and the method's actual terminology.
- State the date range and the requested format.
- State the purpose without disclosing privileged strategy.
- Address privilege, privacy, redaction, and protective-order issues.
- Do not request a statistic or record the method does not use.
- Do not state that a missing item was concealed or destroyed.

## No automatic sending

Serving, sending, or filing a request is an external action. A named person must approve it. The handoff packet records the approver and the date.

## Return path

When a response arrives:

1. Update the availability record with `production_Bates_or_path` and `production_or_response_date`.
2. Change `availability_status` to `produced` or `produced_partial` only for what was actually received and checked.
3. If the response is a withholding, record the stated basis in `withholding_basis`.
4. If the response reports destruction, record `reported_destruction_source` and keep `destruction_reported_unverified` until item-level verification.
5. If the response is incomplete, identify the missing category and set a new `next_action`.
6. Do not convert a missing production into a *Brady*, *Giglio*, *Napue*, or bad-faith finding without a supported predicate.

## Output

A completed handoff packet, a drafted request using `references/request-checklist.md`, a tracked follow-up date, and an updated availability record.
