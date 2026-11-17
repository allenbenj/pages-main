# Verification workspace

Use with `motion-fact-verification`. One workspace per controlled draft. Place it where the matter profile says work product lives, never inside a source folder.

## Folder map

| Folder | Contents |
|---|---|
| `01_question_bank` | Numbered questions: id, draft paragraph, proposition, query text, approved scope. |
| `02_raw_query_results` | Complete raw responses, one file per question, including no-hit and degraded-provenance responses. |
| `03_context_results` | Surrounding passages obtained by locator or chunk id. |
| `04_reviewed_answers` | One reviewed answer per question (`reviewed-answer-template.md`), limited to context-checked passages. |
| `05_ledgers` | Query status ledger; proposition status ledger; source and admissibility matrix; proposed corrections ledger. |
| `06_run_logs` | Batch manifests, timestamps, errors, retries. |
| `07_source_snapshots` | Draft and source hashes or extracts that tie the review to specific versions. |

## Review states

| State | Meaning |
|---|---|
| VERIFIED | The exact proposition is supported by a context-checked primary passage. |
| SUPPORTED | The substance is supported, but the wording needs qualification. |
| CORROBORATED | Supported by at least two genuinely independent source documents. |
| CONFLICTED | Citation-ready primary passages materially disagree. |
| MISCHARACTERIZED | The draft's wording exceeds or differs from the source. |
| DERIVED_ONLY | Found only in commentary, synthesis, summaries, or analysis. |
| NO_CITATION_READY_HIT | Retrieval returned nothing with usable provenance. |
| OUTSIDE_CORPUS | Needs direct review of a transcript, recording, email, forensic report, court record, or other source outside the searched set. |
| EXPERT_DEPENDENT | The source facts may exist, but the conclusion needs qualified expert testimony. |
| INTENT_DEPENDENT | The conduct may be documented, but knowledge, recklessness, bad faith, coaching, fabrication, or intent is unproved. |

## Retrieval rules

- Query only approved collections or folders. Retrieval is read-only; do not index, rebuild, or mutate a collection.
- A passage is citation-ready only with a source path and a stable locator, and only after its context is read.
- Distinguish witness speech, interviewer speech, transcript text, editorial annotation, derived analysis, and graph-extracted facts.
- A no-hit triggers either direct-source review or one narrower reformulated query, recorded in the run log. It never establishes that an event did not occur.
- Duplicates and copies of one document are not independent sources.

## Ledgers

**Query status ledger**: question id, date run, scope, raw file, hit count, citation-ready count, context checked, state, next action.

**Proposition status ledger**: draft paragraph, proposition (quoted from the draft), question ids, state, supporting passages (path and locator), conflicting passages, recommended action (keep, strengthen, narrow, remove, investigate), owner.

**Source and admissibility matrix**: source id, type, original or copy, sworn status, sponsoring witness or custodian, authentication needed, hearsay layer and intended use, likely objection (`evidence-matrix-admissibility`).

**Proposed corrections ledger**: draft paragraph, current text, proposed text, reason and state, supporting passage, reviewer, decision (accepted, rejected, deferred), date.

## Transcript and interview sources

- A working transcript or ledger built from a recording is not a certified transcript. Label it and cite the recording or certified version for anything court-facing.
- Separate editorial or model commentary blocks from the speech they annotate before searching.
- Pair each answer with the question that produced it, and keep the line or time range.
