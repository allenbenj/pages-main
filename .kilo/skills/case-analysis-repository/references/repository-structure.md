# Case analysis repository: structure and fields

Use with `case-analysis-repository`. Folder and file names are defaults; keep them stable once a matter starts so links do not break.

## Global files (repository root)

| File | Contents |
|---|---|
| `00_MASTER_INDEX.md` | Link to every topic folder and global file, one line of purpose each, and status (draft, reviewed, QC passed). |
| `00_GLOBAL_EXECUTIVE_SUMMARY.md` | Objective, posture, strongest issues, largest risks, top open items, next actions. |
| `00_GLOBAL_CHRONOLOGY.md` | Built with `chronology-timeline-builder`: date, time, actor, event, source, significance; conflicts shown as both versions. |
| `00_GLOBAL_EVIDENCE_CROSSWALK.md` | Every major factual claim traced to a source (columns below). |
| `00_GLOBAL_ISSUE_TREE.md` | MECE tree; threshold and dispositive branches first; each branch names its topic folder. |
| `00_GLOBAL_SOURCE_INDEX.json` | One record per source: id, path, SHA-256, type, date, custodian, status (record / work product / unverified), locator scheme. |
| `00_WITNESS_MATRIX.md` | Per witness or actor: role, key statements with pinpoints, contradictions, bias or motive, corroboration, impeachment material, missing follow-up, strategic value. |
| `00_LEGAL_ISSUE_MATRIX.md` | Per candidate legal issue: elements, evidence, counterarguments, prejudice, remedy, preservation status. List candidate issues neutrally ("possible disclosure issue"); each is a question until the elements are shown. |
| `00_PROSECUTION_CASE_REVIEW.md` (criminal matters) or `00_OPPOSING_CASE_REVIEW.md` | What the other side knew or should have known at each point; warning signs; investigative defects; disclosure problems. Hindsight is labeled as hindsight. |
| `00_CASE_THEORY.md` | Built with `case-theory-storytelling`: the narrative grounded in admissible evidence, plus the strongest countertheory. |
| `00_OPEN_ITEMS.md` | All topic open items merged, sorted High, Medium, Low. |

## Topic folder files

| File | Contents |
|---|---|
| `00_EXECUTIVE_SUMMARY.md` | The issue in plain English; why it matters; strongest facts; strongest theories; weaknesses and missing proof; recommended next action. |
| `01_DETAILED_ANALYSIS.md` | IRAC or CREAC per legal question; facts, inferences, standards, argument, and conclusions kept apart; evidentiary significance and litigation consequences. |
| `02_EVIDENCE_CROSSWALK.md` | Columns below. |
| `03_TIMELINE.md` | Topic events: date, time, actor, event, source, significance; gaps, impossible sequences, and unexplained delays flagged. |
| `04_LEGAL_STANDARDS_AND_AUTHORITIES.md` | Controlling law first; binding separated from persuasive; standard, elements, burden, remedy; only `reliance_approved` authority stated as law; everything else marked candidate. |
| `05_COUNTERARGUMENTS_AND_RISKS.md` | How the opposing party, the court, or an appellate panel may respond; factual weaknesses; preservation and harmless-error problems; credibility risks; rebuttal. |
| `06_STRATEGIC_USE.md` | Use in motions, cross-examination, discovery requests, disclosure arguments, suppression, venue, appellate preservation, civil-rights claims, and negotiation. Only the uses that apply. |
| `07_OPEN_ITEMS.md` | Missing documents, testimony, and records to request; unresolved questions; verification steps. Each item: priority (High, Medium, Low) and why it matters. |

## Evidence crosswalk columns

| Column | Rule |
|---|---|
| Claim | The proposition, worded as narrowly as the source allows. |
| Source path | Exact path or source id from the source index. |
| Pinpoint | Page, line, timestamp, exhibit number, Bates number, or chunk id. |
| Quote | Exact quotation; a paraphrase is labeled "paraphrase". |
| Reliability | High, Medium, Low, or Unsupported, with a one-line reason (original vs. copy, sworn vs. unsworn, first-hand vs. hearsay). |
| Relevance | The element or issue it bears on. |
| Effect | supports, refutes, impeaches, corroborates, or contextualizes. |
| Status | The R10 class (court said, party alleged, record shows, inference, unconfirmed), or `unsupported` when no source was found. |

## Topic QC questions

Answer each yes or no before a topic is marked reviewed. A "no" is an open defect.

1. Every factual claim cites source material with a pinpoint.
2. Legal standards come from verified, jurisdictionally correct authority.
3. Conclusions are separated from assumptions and labeled.
4. The strongest counterargument is stated fairly and answered.
5. Evidentiary weaknesses and proof gaps are disclosed.
6. The executive summary matches the detailed analysis.
7. Each claim can be crosswalked to source material.
8. The output is usable for drafting, examination, appellate, or civil-rights work.
9. File and folder names are clear and stable.
