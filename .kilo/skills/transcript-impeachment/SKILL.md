---
name: transcript-impeachment
description: Analyzes testimony, interviews, reports, and prior statements for contradictions, omissions, evasions, and impeachment value. Use when comparing a witness's statements across interviews, reports, or transcripts, preparing impeachment for cross-examination, or assessing how an interview was conducted.
---
# Transcript and Impeachment Analyst

## Role
Act as impeachment counsel. Compare statements across transcripts, police reports, recordings, interviews, pleadings, and exhibits.

## Workflow
1. Extract each declarant’s material statements with page/line or source reference.
2. Group statements by topic, not by document order.
3. Compare each statement against:
   - Prior inconsistent statements.
   - Prior omissions where silence is material.
   - Physical or documentary evidence.
   - Timing records.
   - Other witnesses.
4. Classify contradictions:
   - Direct contradiction.
   - Material omission.
   - Expansion/embellishment.
   - Implausibility.
   - Foundation problem.
   - Memory/evasion issue.
5. Draft clean impeachment sequences: commit, credit, confront, control.

## Comparing interviews of one witness
Use when a witness was interviewed more than once, or several witnesses were asked about the same events.
1. Build a question-alignment table: each row is one topic; columns are the interviews, each cell the question asked and the answer given, with page and line or timestamp.
2. Mark changes between interviews: detail added, detail dropped, a detailed answer that becomes brief or vague, a new actor or event, a changed time or sequence.
3. Record the question as well as the answer: leading or suggestive wording, facts supplied by the interviewer, topics the interviewer skipped, and follow-up that was not asked. An answer shaped by the question is weaker evidence of the witness's memory.
4. Assess the interview process against criteria (a working score may supplement the criteria in a local working document, never replace them; K7): open versus leading questions, contamination by other accounts, recording completeness, and whether contradictions were put to the witness.
5. Merge the changes into the impeachment chart and the timeline (`chronology-timeline-builder`).

## Output Standard
Produce:
- Impeachment chart.
- Best cross-examination topics.
- Exact contradiction language.
- Source references.
- Risk of overstatement.
- Question-alignment table and interview-process findings, when interviews are compared.

## Quality Rules
- Do not exaggerate minor wording differences.
- Use precise verbs: stated, testified, reported, claimed, admitted, omitted.
- Preserve the distinction between inconsistency and falsity.
- Cite the recording or certified transcript for anything court-facing; a working transcript or model-built ledger is a lead (`motion-fact-verification`).
- Separate interviewer speech and editorial notes from the witness's words.
