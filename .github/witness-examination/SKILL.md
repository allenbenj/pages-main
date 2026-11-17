---
name: witness-examination
description: Creates direct, cross, deposition, and hearing examination plans tied to elements, exhibits, and impeachment material. Use when preparing to examine or cross-examine a witness, outlining a deposition or suppression-hearing examination, preparing a client or friendly witness, or organizing impeachment for a hearing or trial.
---
# Witness Examination and Deposition Prep

## Role

Act as examination counsel. Prepare controlled questioning outlines for trial, hearing, deposition, or investigation, each question tied to a purpose and a source.

## When not to use

- Finding contradictions across a witness's statements: use `transcript-impeachment` first, then build the sequence here.
- Whether a statement or exhibit is admissible: use `evidence-matrix-admissibility`.
- Contact with a represented person, a protected witness, or a sealed record: use `ethics-privilege-guardrails` before any contact.

## Inputs

- The witness's role, every prior statement, and every document tied to the witness, each read in full and kept with its source and pinpoint (adaptation 7).
- The elements or issues the examination must serve.
- The forum and its rules for this type of examination, taken from the jurisdiction reference or marked UNVERIFIED.
- The exhibits, with foundation facts for each.

## Workflow

1. **Profile.** Goal: know the witness. Action: record the witness's role, expected testimony, relationship to the parties, bias or motive, and credibility risks, each with a source. Examine credibility; do not disqualify (adaptation 5). Exit: each credibility point cites the record.
2. **Objective.** Action: write one sentence stating what the examination must establish or undo, and name the element or issue it serves. Exit: every later topic ties back to that sentence.
3. **Must-get list.** Action: list the admissions or facts the examination must obtain, each with the source that shows the witness can give it. Exit: each must-get has a fallback if the witness will not give it.
4. **Choose the form.** Action: pick direct, cross, deposition, or hearing and apply the matching steps in `references/examination-outline-template.md`. For an expert witness, also apply `references/expert-cross.md`. Exit: the outline uses the form's question style (open for direct; leading, one fact per question, for cross).
5. **Build topics.** Action: order topics for clarity and for risk, put the strongest admission where it will be remembered, and write each question with its expected answer and source. Exit: no question lacks an expected answer and a source or a stated purpose.
6. **Impeachment sequence.** Action: for each contradiction, write the commit, credit, confront, and control steps (the vocabulary `transcript-impeachment` uses) with the exact words of the prior statement, its source, and its pinpoint. Exit: each quoted line matches the original file character for character (checklist A2).
7. **Foundation and exhibits.** Action: for each exhibit, list the foundation questions and the admissibility basis under the governing evidence rules, or mark them unresolved (K11). Exit: no exhibit is offered without a foundation sequence.
8. **Objections and rehabilitation.** Action: list the objections the other side is likely to make, the response, and the authority (verified, or UNVERIFIED), plus the rehabilitation the other side may attempt and your answer. Exit: every anticipated objection has a response.
9. **Gate.** Action: send outlines meant for court or for a person to use through `legal-quality-control`. Exit: gate record, or a note that the outline is a working file.

## Failure handling

- A prior statement exists only as a summary: do not quote it; mark the impeachment UNVERIFIED and obtain the original (`records-requests-subpoenas`).
- A transcript page or line cannot be confirmed: do not cite it; mark it UNVERIFIED.
- The witness's expected answer is unknown: write the question as a discovery question for a deposition, and omit it from a cross outline unless a safe answer is known.
- The forum's rule for the examination is unverified: mark the form UNVERIFIED and send the question to `legal-research-verification`.

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Use the exact language of a prior statement when impeaching; a shifted word is a misstatement (R8).
- Do not ask one question too many after a useful admission, and avoid compound questions.
- When preparing a client or friendly witness, prepare the witness to tell the truth in the witness's own words. Never script a changed account or suggest testimony.
- A contradiction does not by itself prove knowledge or fabrication (adaptation 6). Frame the question around what the record shows.
- Keep scores and likelihood figures out of outlines meant for use in court (K7).

## Output

A witness objective, a topic outline, an exhibit list, direct or cross questions, an impeachment sequence, expected objections with responses, and the must-get admissions. Layouts are in `references/examination-outline-template.md`. For an expert witness, use the expert-cross outline in `references/expert-cross.md`.

## Self-check before reporting

- Every question has an expected answer with a source, or a stated purpose.
- Every quotation was compared to the original file.
- Every exhibit has a foundation sequence.
- Every objection has a response, and every authority is verified or marked UNVERIFIED.
- No witness is described as disqualified or as lying beyond what the record shows.

## References

- `references/examination-outline-template.md` — direct, cross, deposition, and hearing layouts.
- `references/expert-cross.md` — expert-specific cross topics, impeachment sequence, and concessions.
