# Disclosure matrix

Use `controller/schemas/evidence_availability.schema.json` as the conceptual model; the expert-review record carries a compatible matrix in `disclosure_matrix`.

## Fields

| Field | Meaning |
|---|---|
| `item` | The report, file, raw data, bench note, quality record, communication, or supplement. |
| `required_by` | The authority ID, order, agreement, or `UNVERIFIED` research task that requires it. |
| `status` | `not_requested`, `requested`, `produced`, `produced_partial`, `withheld_stated_basis`, `unavailable`, `not_applicable`, or `unknown`. |
| `source_pin` | The report page, Bates range, file path, or correspondence pin. |
| `next_action` | The concrete follow-up. |

## Status discipline

- **Not requested:** no request exists.
- **Requested:** a request exists; no response yet.
- **Produced:** the item was received and checked; record the pin.
- **Produced partial:** something was received, but a specific category is missing; name it.
- **Withheld stated basis:** the holder stated a basis; record it.
- **Unavailable:** the item cannot be obtained; state why from the record.
- **Not applicable:** the mode or method does not require it; do not criticize its absence.
- **Unknown:** existence or status is not established.

## What a status does not prove

- `not_requested` does not prove the item does not exist.
- `requested` does not prove withholding.
- `unavailable` does not prove destruction.
- `withheld_stated_basis` does not prove bad faith.
- `unknown` does not support a disclosure violation.
- A missing document does not support a *Brady*, *Giglio*, or *Napue* claim without a supported predicate.

## Partial production

When the status is `produced_partial`:

1. identify the specific missing category;
2. identify the request or authority that covers it;
3. state the effect on the review;
4. set a targeted next action and a follow-up date;
5. do not mark the whole file as produced.

## Authority status

For every `required_by` that is a legal rule, record the ledger ID and status:

- `UNVERIFIED` — cannot be stated as controlling;
- `VERIFIED` — text verified, treatment or reliance not complete;
- `RELIANCE_APPROVED` — approved for reliance with stated limits.

## Output

A matrix with one row per item, a short narrative for each non-produced row, and a next action for every row.
