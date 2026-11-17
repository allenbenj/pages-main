# North Carolina motion for appropriate relief

This is a state post-judgment track. It covers NC motions for appropriate relief (MAR), record completeness, and preservation. **Federal habeas, AEDPA deference, exhaustion, and *Pinholster* are out of scope.** A federal analysis requires a separate assignment and its own verified authorities.

## Stage and date check

Before selecting a ground, record:

- the judgment, verdict, or order and its date;
- the procedural posture (direct appeal, remittitur, post-appeal, retrial, plea);
- the filing deadline and its trigger;
- any prior MAR, appeal, or post-judgment motion;
- the record items available and the items missing;
- the relief sought.

### Governing statutory version and applicability boundaries

The applicable statutory text depends strictly on the date of the verdict and the subject matter of the motion:

1. **Pre-December 1, 2025 Verdicts:**
   - Governed by pre-amendment N.C. Gen. Stat. § 15A-1415.
   - Subdivisions (b)(7) and (b)(9) remain available for motions attacking verdicts entered before December 1, 2025.
2. **Post-December 1, 2025 Verdicts (S.L. 2025-70, § 15):**
   - S.L. 2025-70, § 15(a) repeals subdivisions (b)(7) and (b)(9) and amends subsection (c).
   - Under § 15(c), this amendment applies strictly to verdicts entered on or after December 1, 2025.
   - Noncapital filing limits under subsection (a1) impose a seven-year deadline from the latest specified triggering event in (a)(1)–(5), subject to statutory exceptions.
3. **Forensic / DNA Testing and Procedural Bars (S.L. 2025-93, § 6):**
   - Amends procedural bar provisions (§ 15A-1419) and evidentiary hearing requirements (§ 15A-1420) for post-conviction relief involving newly available forensic or DNA testing.
   - Governs the standards for establishing cause, prejudice, and fundamental miscarriage of justice when new testing methods or previously unavailable evidence are asserted.

## Candidate authorities

All are `UNVERIFIED` in the kit ledger. Run the gate before stating one as controlling:

| ID | Citation | Use |
|---|---|---|
| `NC-GS-15A-1415` | N.C. Gen. Stat. § 15A-1415 | Grounds for an MAR. |
| `NC-GS-15A-1419` | N.C. Gen. Stat. § 15A-1419 | Procedural bars and exceptions. |
| `NC-GS-15A-1420` | N.C. Gen. Stat. § 15A-1420 | Filing, hearing, and evidentiary procedure. |

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id NC-GS-15A-1415
```

If the result is not `RELIANCE_APPROVED`, the analysis says the rule is unverified and does not present it as controlling. The exact grounds, bars, and hearing requirements must be read in the current statute and current cases.

## Grounds

Keep each ground separate:

1. **Newly discovered evidence.** The evidence was not available at trial despite diligence; it is material; it is credible; it would probably change the result. Identify the diligence facts, the new evidence, its source, and the reason it was not presented.
2. **Constitutional violation.** Identify the constitutional right, the record support, the preservation, and the remedy. Do not merge a disclosure issue, a confrontation issue, and an ineffective-assistance issue into one ground.
3. **Ineffective assistance of counsel.** Deficient performance and prejudice, with the specific acts or omissions and the record support. If the claim depends on evidence outside the record, identify the affidavits, records, or hearing needed.
4. **Record-integrity problem.** A missing transcript, exhibit, instruction, jury note, or bench conference. A missing record item is not evidence of misconduct; it is a record gap that may require reconstruction or a settlement procedure.
5. **Sentencing or legal-error ground.** Identify the statute or rule, the error, the preservation, and the remedy.
6. **Other ground.** State the legal basis and the facts; do not use "other" to avoid the elements.

## Bars and exceptions

For each ground, address:

- the time limit and its trigger;
- waiver or procedural default;
- prior litigation or a prior MAR;
- the record support for an exception;
- the State's likely bar argument;
- the response and the verified authority.

Do not assume a bar is self-executing or that an exception applies. Verify the current text and treatment.

## New evidence

For a newly discovered evidence ground, record:

- the evidence and its source pin;
- why it was not available despite diligence;
- why it is material to the verdict or sentence;
- the credibility of the evidence and its source;
- what it would have changed;
- the affidavits, records, or testimony needed;
- the hearing request.

Do not invent testimony. Do not present an affidavit summary as the affidavit.

## Hearing procedure

Verify the current statute and rules for:

- the filing and service;
- the response;
- the motion and supporting affidavits;
- the evidentiary hearing and the standard for granting one;
- the findings and order;
- the deadline and any stay;
- the record to be preserved for review.

A request for a hearing must identify the disputed fact and the evidence that would be presented.

## Record completeness

Inventory:

- trial transcripts and the relevant pretrial hearings;
- trial exhibits and the admitted versions;
- jury instructions given and requested;
- jury questions and notes;
- bench conferences and off-the-record discussions;
- sealed or ex parte records, where accessible;
- the judgment, commitment, and sentencing materials;
- the appellate record and opinion, if any.

Use `controller/schemas/evidence_availability.schema.json` for each item. Distinguish documented existence, alleged existence, and unknown existence. A missing item is a record gap, not proof of misconduct.

## Reconstruction and preservation

- Identify the missing item and its expected content from a source.
- Request reconstruction, a record settlement, or a preservation order as a procedural step.
- Do not invent testimony or fill a transcript gap with a paraphrase.
- Preserve the issue for any later review.
- Record the request, the order, and the response.

## Materiality, remedy, and the State's response

- State the materiality and prejudice in words.
- Identify the remedy: a new trial, a new sentencing, an evidentiary hearing, correction of the record, or another verified remedy.
- State the State's best response: the ground is barred, the evidence is not new, the diligence is lacking, the evidence is not credible, the error is harmless, or the remedy is unavailable.
- Do not state a numeric probability of a different result.

## Federal-habeas boundary

This workflow does not analyze:

- federal habeas corpus;
- AEDPA deference;
- exhaustion;
- *Pinholster* or the federal record rule.

Those issues require a separate assignment, separate authorities, and a separate record review. Do not draft federal habeas analysis under state MAR rules, and do not treat a state MAR denial as a federal-habeas conclusion.

## Output

A ground-by-ground MAR chart with the verified authority and status, the facts and pins, the bar and exception, the materiality, the remedy, the State's best response, and the record items needed. A record-completeness inventory with the availability state and next action for each gap. A hearing request and a preservation plan.
