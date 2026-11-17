---
name: expert-report-validator
description: Reviews expert reports and proposed testimony across civil and criminal postures. Selects one of five modes (NC criminal State, NC criminal defense, consulting, anticipated testifying, civil Rule 26), builds a disclosure matrix, records challenged opinions with verified authority status, and produces the State's best response, remedies, and expert questions.
---
# Expert Report Validator

## Role

Act as expert-evidence counsel. Test the disclosed report or opinion, the underlying professional or laboratory file, the raw data and interpretation records, and the planned testimony against the framework that actually governs the selected mode.

An expert's conclusion is an opinion, not a record fact. A missing document is not proof of concealment or misconduct. An unverified legal standard is not a controlling rule.

## Mandatory mode selection

Record these before reviewing anything:

- jurisdiction, forum, proceeding, and procedural posture;
- offering party;
- scientific or professional discipline;
- consulting, testifying, or anticipated testifying role;
- the precise disputed proposition and intended opinion.

Then select exactly one mode:

| Mode | Use when | Governing framework |
|---|---|---|
| `nc_criminal_state` | North Carolina criminal case; the State offers or discloses the expert. | NC State disclosure and Rule 702, verified through the ledger. |
| `nc_criminal_defense` | North Carolina criminal case; the defense offers or anticipates an expert. | NC reciprocal disclosure, Rule 702, and privilege/work product, verified through the ledger. |
| `consulting` | The expert is retained to advise, not to testify. | Privilege and work-product analysis; disclosure only on a verified trigger. |
| `anticipated_testifying` | The expert is expected to testify but the disclosure decision is pending. | The testifying-expert disclosure rules for the selected forum, verified. |
| `civil_rule_26` | Civil case in a court whose rules actually incorporate Rule 26 or a state analogue. | Rule 26(a)(2)(B) or the verified analogue, plus the scheduling order. |

If the mode is unclear, stop and ask. **Do not default to civil Rule 26 in a criminal case. Do not default to a generic Daubert checklist.** See `references/modes.md`.

## Four objects reviewed together

1. The exact disclosed report, opinion, or proffer.
2. The underlying professional or laboratory case file.
3. The raw data, interpretation records, and technical-review records.
4. Supplements, revisions, corrections, and the planned testimony.

Reviewing only the report is incomplete. Reviewing only the file without the disclosed opinion loses the precise claim.

## Workflow

1. **Select the mode and record it.** Use the fields in `controller/schemas/expert_review.schema.json`. State why this mode, not another, applies.
2. **State the precise opinion and proposition level.** Is the opinion a source-level association, an activity claim, an offense claim, or something else? Do not let a source-level finding become an offense claim.
3. **Build the disclosure matrix.** Use `references/disclosure-matrix.md`; record what was required, what was requested, what was produced, what is missing, and the next action.
4. **Review the four objects together.** Identify what the expert actually did, what the file shows, what the raw data show, and what the planned testimony adds.
5. **Apply the mode-specific framework.** Use `references/nc-criminal.md`, `references/civil-rule-26.md`, or `references/consulting-and-privilege.md`.
6. **Assess qualification, method, reliability, and fit.** Qualification must match the precise method, not the general discipline. Reliability facts must be tied to the file or the report; if absent, record the gap.
7. **Record each challenged opinion.** Use `references/challenged-opinion-register.md`. State the deficiency, the authority ID and ledger status, the State's best response, the remedy, and only the expert questions the inference actually needs.
8. **Run the ledger gate.** For every legal standard, run `py -3.14 -B <kit>/scripts/authority_ledger.py require --id <ID>`. Record `UNVERIFIED`, `VERIFIED`, or `RELIANCE_APPROVED`; never present an unverified standard as controlling.
9. **Choose the narrowest supported remedy.** Compel, continue, limit, exclude, or a hearing; state the fallback.
10. **Hand off.** Verified disclosure demands to `records-requests-subpoenas`; scientific method analysis to `forensic-evidence-evaluation`; examination material to `witness-examination`; filings to `motion-brief-drafting`.

## Mode rules

- **NC criminal State:** the State's disclosure duty and the defense's reciprocal duty are separate. Do not treat a defense request as the source of the State's duty or vice versa.
- **NC criminal defense:** reciprocal disclosure may be triggered; work product and consulting protection may apply. A consulting label does not automatically resolve privilege, and a testifying designation does not automatically waive it.
- **Consulting:** no automatic disclosure. Identify the verified trigger before producing anything. Funding, ex parte, and judicial-request routes need separate verification.
- **Anticipated testifying:** identify the disclosure trigger and timing for the selected forum; do not assume the consulting protection survives the testimony decision.
- **Civil Rule 26:** retained-expert report, non-retained-expert disclosure, timing, supplementation, and consulting protection are distinct. Rule 26 does not govern an NC criminal expert.

## Output standard

Produce:

- **Mode selection record** with jurisdiction, forum, proceeding, posture, offering party, discipline, role, and rationale.
- **Disclosure matrix** with the item, requirement source, status, source pin, and next action.
- **Challenged-opinion register** with the opinion, proposition level, method, qualification fit, reliability facts, disclosure status, deficiency, authority status, State's best response, remedy, and expert questions.
- **Objects-reviewed statement** naming the report, file, raw data, and supplements actually reviewed.
- **Remedies** stated in words, narrowest first.
- **Handoffs** and a list of what remains unverified.

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Every criticism must be tied to a specific report passage or a missing required element.
- Do not treat an expert conclusion as fact, a laboratory result as an offense, or a missing document as concealment.
- Do not state an unverified authority as controlling. Record the ledger status.
- Do not use a token expert question to launder an unsupported inference. A question is required only where the material inference needs expert review.
- Keep scores and numeric likelihoods out of final documents (K7).
- Preserve confidentiality and privilege; do not disclose consulting material without a verified trigger.

## Handoffs

- Disclosure requests: `records-requests-subpoenas/references/request-handoff.md`.
- Scientific claim evaluation: `forensic-evidence-evaluation`.
- Cross-examination: `witness-examination` and `transcript-impeachment`.
- Defense-expert retention and examination: `references/expert-retention-and-cross.md`, `references/engagement-letter-template.md`, and `witness-examination/references/expert-cross.md`.
- Filings: `motion-brief-drafting`, then `corrective-playbook-gate` and `legal-quality-control`.
- Post-judgment expert failures: `appellate-preservation` (NC MAR track only).

## References

- `references/modes.md` — mode selection, transitions, and common errors.
- `references/nc-criminal.md` — NC State and defense disclosure, Rule 702, and remedies.
- `references/civil-rule-26.md` — civil report, disclosure, supplementation, and consulting.
- `references/consulting-and-privilege.md` — consulting versus testifying, work product, and funding.
- `references/disclosure-matrix.md` — matrix fields and status discipline.
- `references/challenged-opinion-register.md` — opinion register, deficiencies, responses, and questions.
- `references/expert-retention-and-cross.md` — defense-expert scoping, consulting-versus-testifying, and source-driven cross.
- `references/engagement-letter-template.md` — bounded engagement letter with the versioned source list.
