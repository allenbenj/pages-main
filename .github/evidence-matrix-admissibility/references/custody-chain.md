# Custody chain

Record every transfer for each item. The chain is a factual record, not a conclusion about admissibility.

## Per-transfer record

| Field | Content |
|---|---|
| `evidence_id` | The item identifier used in the availability record. |
| `sender` | Person or agency releasing the item. |
| `receiver` | Person or agency receiving the item. |
| `date_time` | Date and time of the transfer, with the time basis. |
| `location` | Place of transfer or storage. |
| `condition` | Condition, packaging, and seal at the transfer. |
| `seal_number` | Seal or package identifier, if any. |
| `record_pin` | The document, page, or log entry that proves the transfer. |
| `gap_or_note` | Any missing transfer, unexplained interval, or inconsistency. |

One row per transfer. Do not summarize multiple transfers into one row.

## Separate questions

Do not collapse these into a single "admissibility" conclusion:

1. **Identity.** Is this the item at issue?
2. **Authenticity.** Is it what the proponent claims it is?
3. **Integrity.** Has it been altered, substituted, or degraded?
4. **Contamination potential.** Could it have been contaminated, and is there evidence?
5. **Custody reliability.** Are the transfers documented and consistent?
6. **Method foundation.** Is the testing or examination method reliable for this item?
7. **Probative weight.** What does it prove, and how strongly?

The answer to one does not answer the others. A custody gap may affect weight, authentication, or another question depending on the verified standard and the actual use. It is not automatically exclusion, and it is not automatically only a weight issue.

## Testing state

Record one state for each item, with the supporting record and analyst:

| State | Meaning |
|---|---|
| `untested` | No test or examination has been performed. |
| `tested` | A test or examination has been performed; record the report. |
| `consumed` | The item was consumed; record the authorization and what remains. |
| `extract_retained` | An extract or retained sample is available; record the location and condition. |
| `unknown` | The testing state cannot be established from the record. |

## Review rules

- Do not assume the chain is complete because a form exists.
- Do not assume a gap proves tampering.
- Do not assume a gap is harmless.
- State the factual consequence of the gap and the verified standard that governs it.
- Link each item to the availability record (`controller/schemas/evidence_availability.schema.json`).
- Link each testing state to the analyst and the report.
- Do not state an evidentiary ruling as a conclusion; identify the question and the verified rule.

## Output

A custody table with one row per transfer, a testing-state line for each item, and a list of gaps with the factual consequence and the next action.
