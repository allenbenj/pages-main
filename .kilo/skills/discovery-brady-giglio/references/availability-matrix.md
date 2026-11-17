# Availability matrix

Use `controller/schemas/evidence_availability.schema.json`. One row per item.

## The two axes

| Field | Values | What it means |
|---|---|---|
| `existence_status` | `documented`, `alleged`, `unknown` | Whether the record presently establishes that the item exists or existed. |
| `availability_status` | `not_requested`, `requested`, `produced_partial`, `produced`, `withheld_stated_basis`, `unavailable`, `destruction_reported_unverified` | What has happened to the item in the disclosure process. |

The axes are independent. "Not produced" is not a status by itself. Choose the actual state:

- `not_requested`: no request has been made.
- `requested`: a request exists; no production or response yet.
- `produced_partial`: something was produced, but the requested categories are incomplete.
- `produced`: the requested item was produced; record the Bates range or path.
- `withheld_stated_basis`: the holder stated a basis for withholding; record it.
- `unavailable`: the item cannot presently be obtained; state why from the record.
- `destruction_reported_unverified`: someone reported destruction; record who, when, and where. A report is not proof of intentional destruction.

## Required proof fields

- `source_or_existence_pin`: the source and pinpoint that documents or alleges existence. For `unknown`, use `UNVERIFIED`.
- `request_reference`: the letter, subpoena, motion, order, or request identifier.
- `request_route`: the route used: `subpoena`, `voluntary_request`, `statutory_demand`, `court_order`, `public_records`, `investigative`, `none`, or `other`.
- `production_Bates_or_path`: the Bates range or path for what was actually produced.
- `request_date` and `production_or_response_date`: ISO dates or `UNVERIFIED`.
- `custodian`: the agency or person holding the item, or `UNVERIFIED`.
- `withholding_basis`: required only for `withheld_stated_basis`.
- `reported_destruction_source`: required only for `destruction_reported_unverified`.
- `entitlement_type`: `verified_legal`, `order`, `agreement`, `investigative`, or `unverified`.
- `authority_id`: the ledger ID for `verified_legal`; confirm `RELIANCE_APPROVED` before treating it as a legal entitlement.
- `next_action`: the concrete next step; never leave it blank.

## Review rules

1. **Do not infer existence from a request.** A request identifies what counsel believes exists; it does not prove existence.
2. **Do not infer withholding from silence.** `requested` stays `requested` until a response, a stated basis, or a record showing otherwise.
3. **Do not infer destruction from a report.** Verify through item-level inventory, transfer records, and the custodian's records.
4. **Partial production gets a targeted follow-up.** Identify the missing category (for example, bench notes, raw data, electronic files, a specific date range), the request route, and the next action.
5. **Unknown existence stays unknown.** It is not a *Brady* claim, a disclosure violation, or a destruction finding until the predicate is supported.
6. **Record the reviewer and last-checked date** so stale rows can be identified.

## Output

A matrix with one row per item and a short narrative for each non-produced row stating:

- what is documented,
- what is alleged,
- what is still unknown,
- what request or inquiry would resolve it,
- what legal theory (if any) currently has a supported predicate.
