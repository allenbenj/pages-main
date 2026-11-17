# V040-14 argument packet

The mandatory deliverable is a bundle of V040-08 objects plus draft-ready paragraphs. The bundle file is not a new schema. Validate each object with `controller.schemas.validate`. The legacy packet in `output-contract.md` remains what `scripts/audit_defense_framing.py` accepts until V040-15 changes that script. Do not edit that script from this skill task.

Synthetic demonstration: `examples/v04014_argument_packet.json` and `examples/v04014_analytical_paragraphs.md`.

## Field map

| V040-14 item | Where it lives |
|---|---|
| Principal defense proposition | `proposition_records` classified `inference`, cited from `legal_argument_record.defense_reasoning` |
| Supporting record | `evidence_records` plus `supporting_evidence_ids` |
| Adverse record | `contradictory_evidence_ids`, `contrary_or_qualifying_evidence_ids`, and `strongest_opposing_argument` |
| Legal hinge | `legal_argument_record.issue` and `legal_standard` |
| Permissible inference | inference proposition; warrant and limits in `confidence_rationale` and `limitations` |
| Alternative explanation | `limitations` on the proposition that states the unresolved relationship; not stated as a fact |
| Opposing argument | `strongest_opposing_argument` |
| Defense answer | `defense_rebuttal` |
| Material consequence | `legal_significance` |
| Remedy or investigative action | `requested_remedy`, `required_additional_proof`, `recommendation` |
| Draft-ready paragraphs | `examples/v04014_analytical_paragraphs.md`, named in handoff `artifacts` |

Contradiction class and intent grade have no fields on the V040-08 objects. Write them in `limitations` until V040-08 answers the contract question. Do not add a second schema in this folder.

## Authoring rules

V040-R08 accepted the corrections to the shared validator. A locator that has only `kind`, a blank finding or artifact, and an empty evidence id are rejected. Adequate values remain mandatory. Dated history: before that recheck, the validator could accept those empty shapes, and the first V040-14 packet was written with complete values while the defect was open. N-V040-14-1 keeps that history. It is not a present-tense defect report.

- `page_line` locators include `page`, `line`, and a `value` that restates the pin.
- `timestamp` and `paragraph` locators include a non-empty `value`.
- Every evidence id matches `E-` plus visible characters. Every proposition id matches `P-`.
- Handoff `findings`, `artifacts`, and `inputs_received` are non-whitespace strings. Artifact strings name files that exist.
- `established_record_fact` and `attributed_statement` name real supporting ids. A `disputed_proposition` names real contradictory ids.
- An exact quote is a substring of the named synthetic file. `verification_status` is `working_copy_only` for these kit files, because they are not court originals. Do not mark them `verified_against_original`.
- Authority that has not been checked is `research_pending` or `unverified`. Do not invent a reporter citation. Do not mark `reliance_approved` in a kit example.
- A deception or intent label requires evidence that speaks to purpose. Name the grade as an unresolved alternative when that evidence is absent.
- Inconsistency is not deliberate deception. Say which contradiction class is still open: wording, chronology, emphasis, material-assertion, omission, or irreconcilable-account.
- An investigative omission states what was omitted, how the record shows the omission, whether a duty is verified or unverified, the untested proposition, whether the evidence was never collected, lost, unpreserved, or withheld, the resulting limitation, and the next record to obtain. Do not upgrade an unknown cause into suppression.
- Narrative prose stays tied to proposition ids. Do not state a motive or a mental state as fact.
- Synthetic examples use fictional names and Example County. Do not copy a live matter into this folder.

## Acceptance limit

Local schema validation does not show that a controller run traversed this packet. V040-R07, V040-R08, and V040-23 are done on the tracker. Those closures do not establish that traversal. The in-packet handoff stays `partial` until a run of this packet is recorded. This demonstration is not the shared V040-25 fixture.
