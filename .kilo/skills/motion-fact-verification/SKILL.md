---
name: motion-fact-verification
description: Verifies each factual proposition in a draft motion, brief, or memo against the record through a question bank, preserved retrieval results, context checks, and a proposition-status ledger, without editing the draft. Use when the user asks to fact-check a draft against the record, verify a motion's factual statements, build a verification workspace, or decide which assertions to keep, narrow, or remove.
---

# Motion Fact Verification

## Role

Act as the record checker for a draft. Report, for every material factual sentence, what the record actually supports and what change is needed. Do not rewrite the draft; propose corrections in a ledger for the drafter and a named reviewer.

## Vocabulary

- **Citation-ready passage**: a retrieved passage with both a source path and a stable locator (page and line, timestamp, or chunk id) whose surrounding context was read.
- **Review states**: VERIFIED, SUPPORTED, CORROBORATED, CONFLICTED, MISCHARACTERIZED, DERIVED_ONLY, NO_CITATION_READY_HIT, OUTSIDE_CORPUS, EXPERT_DEPENDENT, INTENT_DEPENDENT. Definitions are in `references/verification-workspace.md`. Use no other states.

## Workflow

1. **Freeze the draft.** Record the draft's path, version, and SHA-256 in `07_source_snapshots`. Exit: the hash is recorded. If the draft changes later, re-run step 2 for the changed paragraphs.
2. **Question bank.** Split the draft into atomic factual propositions (one actor, one act, one time). Give each a question id and a paragraph reference. Exit: every factual sentence maps to at least one question.
3. **Retrieve.** Query only the collections or folders the matter profile approves, read-only. Save every raw response, including no-hit and degraded responses, one file per question. Exit: a raw file exists for every question.
4. **Check context.** For each hit you intend to rely on, read the surrounding passage and confirm the speaker (witness, interviewer, author, editor, model). Exit: each relied-on passage is marked "context checked: yes".
5. **Rank sources.** Prefer the original record (recording, certified transcript, native file, court record) over a working transcript, and both over summaries, analysis files, credibility notes, or graph output. Exit: every relied-on passage has a source type.
6. **Assign a state.** Give each proposition one review state and a recommended action: keep, strengthen, narrow, remove, or investigate. Exit: the proposition ledger has no blank state.
7. **Route the gaps.** A no-hit is not proof of absence. Send OUTSIDE_CORPUS items to direct review of the named source, EXPERT_DEPENDENT items to an expert question, and INTENT_DEPENDENT items to the drafter to reword as attributed or inferred (R10). Exit: every gap has an owner and next action.
8. **Report.** Write the reviewed answers (`references/reviewed-answer-template.md`), the proposition ledger, and the proposed-corrections ledger. Then hand the corrections to `motion-brief-drafting` and the draft to `corrective-playbook-gate` and `legal-quality-control`.

## Failure handling

- Retrieval tool errors or returns nothing: record the error in the run log and the state NO_CITATION_READY_HIT; do not describe a search you did not run.
- A passage lacks a stable locator: it is a lead. Find the same text in the original with a locator, or leave the proposition unverified.
- Two primary passages disagree: state CONFLICTED and quote both; do not choose.

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md` (R9, R10, K6, K12 in particular). It governs any conflict.
- Never change the draft from raw retrieval. Changes go through the corrections ledger and a named reviewer.
- A retrieval tool's "sufficiency" or confidence score is a retrieval measure, not a finding of truth, credibility, admissibility, or legal sufficiency.
- Label graph or model-extracted relationships "lead" until a record passage confirms them.
- Write ledgers atomically (write a temporary file, then rename) and keep prior versions.

## Self-check before reporting

- Every factual sentence in the draft has a state.
- Every VERIFIED, SUPPORTED, or CORROBORATED state cites a citation-ready passage; CORROBORATED cites two independent documents.
- Raw responses exist for every question, including no-hits.
- The draft's hash still matches step 1, or the changed paragraphs were re-checked.
