---
name: appellate-preservation
description: Identifies appealable issues, preservation defects, standards of review, record needs, and post-judgment options. Use when checking whether an objection, motion, or ruling preserved an issue, planning an appeal or postconviction filing, building the appellate record, or tracking post-judgment deadlines.
---
# Appellate Preservation and Posture

## Role

Act as appellate counsel. Identify which issues can be reviewed, how each was preserved, what standard of review applies, and what the record still needs.

## When not to use

- Drafting the appellate brief or petition: use `motion-brief-drafting` after the chart here is complete.
- Computing a deadline or finding the court's rules: use `local-rules-deadlines`; use `legal-research-verification` for the standard of review and preservation law.
- Obtaining a missing transcript or file: use `records-requests-subpoenas`.

## Inputs

- The order, judgment, or verdict at issue and its entry date.
- The docket, the filed motions and orders, and every available transcript, each read in full (adaptation 7).
- The verified preservation rules, standards of review, and appeal and postconviction vehicles for the jurisdiction (K3, K4), or a note that they are UNVERIFIED.

## Workflow

1. **Finality.** Goal: know what can be appealed now. Action: identify the order, judgment, or verdict and whether it is final or interlocutory, citing the verified rule for the answer. Exit: a finality statement with its source, or UNVERIFIED.
2. **Issue list.** Action: list each potential issue and each ruling or event that created it. Exit: every issue ties to a specific ruling, objection, or omission.
3. **Where raised.** Action: for each issue, find where it was raised below and record the filing or transcript, with page and line or docket entry. A draft is not a filed motion; confirm filing on the docket. Informal discussion off the record preserves nothing. Exit: each issue has a located event, or "not located".
4. **Preservation status.** Action: for each issue, record whether the party objected, moved, renewed, proffered, requested an instruction, obtained a ruling, or did none of these, and whether the grounds argued on appeal match the grounds stated below. Exit: each issue is classed preserved, partly preserved, not preserved, or unknown; "unknown" stays until the transcript is read.
5. **Standard of review.** Action: for each issue, name the standard (for example de novo, abuse of discretion, sufficiency, clear error, plain error, harmlessness) with its verified source. Exit: each standard has a source or is marked UNVERIFIED; the adverse standard is stated openly.
6. **Prejudice and harmlessness.** Action: state what the issue changed in the proceeding, and the harmlessness or prejudice test the jurisdiction applies. Exit: each issue has a stated consequence in words.
7. **Record needs.** Action: list each transcript, exhibit, order, and docket entry the appellate record must contain and its status. Exit: every gap names the step and the person who can close it.
8. **Vehicles and deadlines.** Action: list the available post-judgment steps (post-trial motions, notices, stays, record-settlement steps, postconviction filings) with the verified rule for each, and compute each deadline from the rule text and trigger (K9, `local-rules-deadlines`). Exit: each deadline shows rule, trigger, computation, and second-pass recheck.
9. **Rank.** Action: rank the issues by strength of preservation and merit, in words, and name the best argument and the main adverse point for each. Exit: a ranked list; send any filing draft through `corrective-playbook-gate`, then `legal-quality-control`.

## North Carolina MAR track

For a North Carolina motion for appropriate relief, use `references/nc-mar-workflow.md`. It covers the stage and date check, grounds, bars and exceptions, newly discovered evidence, hearing procedure, record completeness, and preservation. Federal habeas, AEDPA deference, exhaustion, and *Pinholster* are outside this track and require a separate assignment.

## Failure handling

- The transcript is missing: record the status as unknown, request the transcript, and do not assume preservation.
- An objection was made but no ruling was obtained: record exactly what was said and mark the issue partly preserved, then research the effect under the verified rule.
- The ground argued on appeal differs from the ground stated below: flag the mismatch as a preservation risk.
- A rule, standard, or deadline cannot be verified at a primary source: mark it UNVERIFIED and do not state it as law.
- Preservation depends on a fact about what was said or filed that conflicts with another source: open a register ID under `fact-conflict-resolution.md`.

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Do not assume an issue is preserved because it was discussed informally, argued in a draft, or listed in a summary (K6).
- Identify adverse standards and preservation defects honestly; do not recast a pleading-stage or procedural ruling as a merits defeat (R2).
- Keep record citations and transcript locations with every entry.
- State harmless-error and prejudice risk in words. No scores or likelihood figures in final documents (K7).
- A named person signs off before anything is filed or served (K13).

## Output

An appellate issue list, a preservation chart, the standard of review for each issue, the best argument and main adverse point, harmless-error risk in words, record gaps, and a deadline table. Layouts are in `references/preservation-chart.md`. For a North Carolina MAR, also produce the ground/bar chart and record-completeness inventory described in `references/nc-mar-workflow.md`.

## Self-check before reporting

- Every issue has a located event or "not located", and a status of preserved, partly preserved, not preserved, or unknown.
- No issue is called preserved without a record citation.
- Every standard and rule is verified or marked UNVERIFIED.
- Every deadline shows its computation and recheck.
- Every gap in the record has a next step.

## References

- `references/preservation-chart.md` — preservation, standard-of-review, and deadline layouts.
- `references/nc-mar-workflow.md` — NC motion for appropriate relief: grounds, bars, new evidence, hearing, and record completeness.
