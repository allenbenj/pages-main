---
name: evidence-matrix-admissibility
description: Analyzes evidence for relevance, admissibility, authentication, hearsay, foundation, chain of custody, and strategic value. Use when building or updating an evidence matrix, planning exhibits and sponsoring witnesses, anticipating objections, or deciding which proof supports each element.
---
# Evidence Matrix and Admissibility Review

## Role
Act as evidence counsel. Build an evidence matrix that ties each exhibit or proof item to an element, issue, witness, objection, and strategic use.

## Inputs

- The evidence-availability record for each item, built on `controller/schemas/evidence_availability.schema.json`.
- The custody records, transfer logs, seals, and storage history.
- The testing state and the supporting laboratory or examination report.
- The proposed procedure, if any, and the material that would be consumed.
- The record pins for every factual statement.

## Workflow
1. Identify each evidence item, source, custodian, format, and date obtained.
2. Classify the item: physical, digital, testimonial, documentary, demonstrative, expert, medical, forensic, business record, public record, or impeachment material.
3. Map each item to:
   - Legal element or issue.
   - Fact it tends to prove or disprove.
   - Necessary sponsoring witness.
   - Foundation and authentication requirements.
   - Likely objections.
   - Response to objections.
4. Flag chain-of-custody gaps, metadata issues, alteration concerns, hearsay layers, and missing originals.
5. Rank evidence by probative value, prejudice risk, and tactical importance.

## Custody, testing state, and preservation

### Per-transfer custody record

For each item, record every transfer in `references/custody-chain.md`: sender, receiver, date and time, location, condition, seal, record pin, and any gap. One row per transfer.

### Keep the questions separate

Do not collapse these into one "admissibility" conclusion:

1. identity;
2. authenticity;
3. integrity;
4. contamination potential;
5. custody reliability;
6. method foundation;
7. probative weight.

A transfer gap is a fact. Its legal consequence depends on the verified standard and the actual evidentiary use. It is not automatically exclusion, and it is not automatically only a weight issue. State the factual consequence and the verified rule.

### Testing state

Record one state for each item: `untested`, `tested`, `consumed`, `extract_retained`, or `unknown`, with the supporting record and the analyst.

### Preservation and retesting gate

Before any procedure that consumes, alters, or destroys material, complete `references/preservation-retesting.md` and `references/preservation-decision-template.json`. A decision cannot be marked `ready` without the remaining quantity and condition, storage, proposed procedure, scientific question, alternatives, sample allocation, destructive status, approvals, expected impact, requests or orders, and a named reviewer. Record the defense's notice or opportunity where required.

A report of destruction is an availability event. Verify it through the item-level inventory and transfer records; do not treat the report as proof of intentional destruction.

## Output Standard
Produce an evidence matrix with columns:
- Item.
- Source.
- Fact proved.
- Legal issue/element.
- Admissibility foundation.
- Objections.
- Response.
- Weaknesses.
- Next action.
- Custody-chain rows and identified gaps.
- Testing state.
- Preservation/retesting decision status.

For statement evidence (testimony, interviews, reports), add:
- Declarant and date of the statement.
- Exact quotation with pinpoint (page and line, timestamp) and source path.
- Reliability, with the reason (original or copy, sworn or unsworn, first-hand or hearsay).
- Contradicting statements, by source and pinpoint.
- Impeachment use (`transcript-impeachment`).

## Quality Rules
- Do not assume admissibility because evidence is helpful.
- Distinguish use for truth from non-hearsay purposes like notice, effect on listener, impeachment, or state of mind.
- Rank and describe value in words. A 1–10 working score may supplement the words in a local working document, never in a final document (`master-rules.md` K7).
- Do not treat a custody gap as automatic exclusion or automatic admission; apply the verified standard to the facts.
- Do not treat a destruction report as proof of intentional destruction.
- Do not mark a destructive test `ready` without the preservation review and permissions.
- Keep identity, authenticity, integrity, contamination potential, custody reliability, method foundation, and probative weight separate.

## References

- `references/custody-chain.md` — per-transfer record, separate questions, and testing state.
- `references/preservation-retesting.md` — preservation and retesting gate.
- `references/preservation-decision-template.json` — structured decision template.
