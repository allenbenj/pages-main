# Contextual bias, statements, and confrontation

Keep three questions separate:

1. What information reached the analyst, and when?
2. Who made each statement, and what does the sponsoring witness personally know?
3. Does the confrontation authority actually apply to this statement and this use?

Exposure is an inquiry, not proof of bias. A surrogate-witness concern is not an automatic violation. A confrontation claim is not established until the governing authority is verified for the specific statement and use.

## Contextual-bias timeline

Record:

- the request-for-analysis form and the submitting agency's narrative;
- every case-context packet, email, meeting, or conversation with investigators or counsel;
- the date, source, and content of each exposure;
- the analyst's interpretation decisions before and after the exposure;
- any change in the report, conclusion, or statistic;
- the technical and supervisory review;
- any independent verification or blind re-analysis.

For each entry, record the date, the source, the information, the source pin, and the analyst's response. Do not infer bias from the existence of a packet or from a change in language; identify the timing and the effect, or mark the question unresolved.

## Statement-and-actor map

Record one row per material statement:

| Field | Content |
|---|---|
| `actor` | Who made the statement. |
| `role` | Their role in the collection, testing, review, or sponsorship. |
| `statement` | The statement, quoted or closely paraphrased with a pin. |
| `source_pin` | The report, transcript, note, or file location. |
| `testimonial_status` | `testimonial`, `nontestimonial`, or `unverified`. |
| `personal_knowledge` | Whether the actor personally performed or observed the work. |
| `sponsor` | Who will sponsor the statement at the hearing or trial. |

Answer:

- Who handled the sample?
- Who performed each material analysis?
- Who made each statement the report relies on?
- Who reviewed it?
- Who will sponsor the result?
- What does the sponsoring witness personally know, and what will the witness repeat from someone else?

## Confrontation review

Candidate authorities:

| ID | Citation | Status |
|---|---|---|
| `US-CRAWFORD` | *Crawford v. Washington*, 541 U.S. 36 (2004) | `UNVERIFIED` |
| `US-MELENDEZ-DIAZ` | *Melendez-Diaz v. Massachusetts*, 557 U.S. 305 (2009) | `UNVERIFIED` |
| `US-BULLCOMING` | *Bullcoming v. New Mexico*, 564 U.S. 647 (2011) | `UNVERIFIED` |
| `US-SMITH-ARIZONA` | *Smith v. Arizona*, 602 U.S. 779 (2024) | `UNVERIFIED` |
| `NC-EXPERT-DISCLOSURE-RESEARCH` | To be identified | `UNVERIFIED` |

Run the gate before relying on any of them:

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id US-CRAWFORD
```

Record:

- the statement and its source pin;
- the testimonial status and the basis for it;
- whether the witness is the declarant or a surrogate;
- whether the witness has personal knowledge;
- any forfeiture issue;
- the verified authority and its status;
- the specific use proposed (substantive, basis for an opinion, or impeachment).

Do not state a *Crawford* violation merely because a surrogate witness appears. Identify the statement, the use, and the verified rule.

## Rules

- Do not infer bias from exposure alone.
- Do not infer a confrontation violation from a surrogate's appearance alone.
- Do not treat a statement as testimonial without the record and the verified authority.
- Do not treat a witness's personal knowledge as established because the witness signed the report.
- Do not use an unverified authority as controlling.
- Do not supply a legal conclusion in the scientific claim record; route it to the legal analysis.
- Preserve the objection and the record for appeal.

## Output

A contextual-bias timeline, a statement-and-actor map, a confrontation review with the authority status, the witness and statement risks, hearing objections as candidates, preservation actions, and cross-examination questions for `witness-examination`.
