---
name: prosecution-case-review
description: Stress-tests prosecution theories, charging decisions, evidence sufficiency, witness reliability, and ethical disclosure obligations. Use when reviewing how the State built or argues its case, testing probable cause or sufficiency, or identifying what the prosecution knew or should have known.
---
# Prosecution Case Review and Charging Integrity

## Supported reasoning

Apply `../legal-reasoning-framework/references/reasoning-foundation.md` when formulating a substantive finding. Identify the exact defective inference, the supported opposing explanation and material consequence. Use existing finding fields for a bounded substantive correction; a new disclaimer or unsupported citation does not repair a missing premise. No new schema field or verification status is implied.

## Role

Act as a charging-integrity reviewer. Assess whether the State's theory is provable, ethical, and supported by admissible evidence. In defense work, start from the client's innocence and search actively for misconduct, Brady and Giglio violations, and fabricated or altered evidence (`legal-reasoning-framework/references/integrated-reasoning-for-motions.md`, adaptation 2). In a filing, tie each allegation against a named official to cited record evidence (`master-rules.md` K6).

## When not to use

- Whether the State complied with its disclosure duties, and sanctions: use `discovery-brady-giglio`.
- Building the defense theory and trial plan: use `criminal-defense-strategy`.
- Comparing one witness's statements: use `transcript-impeachment`.

## Inputs

- The charging instruments and any amendments, the warrant or arrest paperwork, and the discovery inventory.
- The State's stated theory, taken from its filings, arguments, and testimony.
- The verified standards for probable cause, sufficiency, and the burden at trial in the governing jurisdiction (K3, K11), or a note that they are UNVERIFIED.

## Workflow

1. **Elements.** Goal: know what the State must prove. Action: list each charge with its elements from verified statutory text. Exit: every element is listed with its source, or marked UNVERIFIED.
2. **Evidence per element.** Action: for each element, list each item of evidence the State relies on, its source and pinpoint, and its admissibility basis or "unresolved" (K11). Exit: every element has a row, including "no evidence located".
3. **Three standards, separately.** Action: test probable cause, trial sufficiency, and proof beyond a reasonable doubt in three separate passes, each against its own verified standard. State the burden as a legal fact, never in place of the best-evidence search (K11). Exit: three results, none carried over from another.
4. **Weaknesses.** Action: list inconsistencies, motive and bias, forensic gaps, and untested assumptions, each with a pinpoint. Examine credibility; do not disqualify a witness (adaptation 5). Exit: each weakness cites the record.
5. **Misconduct leads.** Action: for each possible Brady, Giglio, fabrication, or alteration lead, record what the record shows, what is missing, and what would confirm it. Exit: each lead is classed as record shows, party alleged, or unconfirmed (R10); none is stated as established without cited evidence.
6. **Knowledge at the time.** Action: for each warning sign or defect, separate what the prosecution had when it acted from what is known only now. Exit: each item carries a time and source for the prosecution's knowledge.
7. **Opposing-method audit.** Action: run `legal-reasoning-framework/references/analysis-frameworks.md`, section 8, on each State argument: name the method, find where it appears in the record, and answer it with cited facts or report it as a risk. Exit: each State argument has an answer or a risk entry.
8. **Disclosure list.** Action: list evidence that must be disclosed, corrected, or investigated, with the source that shows it exists. Exit: each item has a next step and an owner.
9. **Alternatives and recommendation.** Action: state whether dismissal, a lesser charge, diversion, or a plea position is more defensible, with the verified authority behind each, and mark the rest UNVERIFIED. Exit: one recommended action with its conditions.

## Substantive Draft Review Workflow (P18 / V040-18)

When reviewing a draft legal motion or memorandum (defense or prosecution side), evaluate the draft against the record sources, adverse authorities, and the 12-dimension substantive review rubric (`references/substantive-review-rubric.md`).

1. **Exact-passage challenge**: Identify the verbatim passage challenged. Paraphrasing is prohibited.
2. **Finding generation**: Every defect must be formatted as a standard `review_finding` object (`controller/schemas/review_finding.schema.json`):
   - `defect_id`: Unique identifier (`^D-[A-Za-z0-9_-]+$`).
   - `severity`: `critical`, `high`, `medium`, or `low`.
   - `reviewer`: `prosecution`.
   - `document` and `document_version`: Bound to the target draft.
   - `passage`: Verbatim exact substring from the document.
   - `defect`: Detailed explanation labeled with `(a)` supported conclusion, `(b)` open question, or `(c)` legal check required.
   - `evidence_or_rule`: Specific source or rule citation (or "absent from all sources").
   - `strongest_opposing_response`: Best opposing counterargument answered.
   - `required_correction`: Concrete, bounded text change (including what is NOT sufficient).
   - `recheck_requirements`: Observable tests for subsequent revisions.
3. **Guardrails**:
   - Attack unsupported inferences, adverse omissions, and remedy overreach.
   - Never treat fictional authority as approved law.
   - Do not assert unsupported negative causation (e.g. that an investigative omission caused a statement to be made); state clearly that no causal link is supported on the packet.
   - Do not review the agent's own drafting work as independent evidence.
   - Ensure missing sources or authorities remain marked UNVERIFIED/UNKNOWN.

## Sidecar Schema Contract (Contract Version 1.1)

To maintain strict schema purity for downstream consumers (`controller/schemas/review_finding.schema.json`), substantive finding objects emitted under `findings_accepted` contain only core schema fields (`defect_id`, `severity`, `reviewer`, `document`, `document_version`, `passage`, `defect`, `evidence_or_rule`, `strongest_opposing_response`, `required_correction`, `recheck_requirements`). Mechanical provenance, verification states, and citation resolutions are emitted in top-level sidecar maps.

### Report Fields and Key Aliases
- `contract_version`: `"1.1"`
- `engine_version`: `"prosecution-case-review/0.4-sidecar-contract"`
- **Canonical Key**: `finding_sidecars` (a dictionary mapping each finding `defect_id` to its sidecar object).
- **Aliases**: `findings_sidecars` and `findings_annotations` are identical dictionary references provided for backwards compatibility with downstream tasks (`V040-19`, `V040-20`, `V040-21`).

### Sidecar Entry Structure and Allowed States
Each sidecar entry maps a `defect_id` to:
- `defect_id` (string): The matching unique finding identifier.
- `authority_status` (string enum):
  - `"unverified_research_required"`: Default state for all legal authorities cited in host findings. Host assertions do not approve authority for reliance. Independent verification via `legal-research-verification` is mandatory.
- `source_status` (string enum):
  - `"source_dispatched"`: Every cited record source explicitly matches a dispatched source packet identifier or filename. **Important**: `source_dispatched` denotes identity match only; it does NOT certify factual veracity, pin verification, or record truth.
  - `"source_unverified"`: Assigned when no sources were dispatched (`unbound_sources: true`), an uncited record is referenced, an unrecognized source or exhibit is cited, or any pin locator fails validation.
- `pin_status` (string enum):
  - `"pin_verified"`: Strictly unreachable from unstructured free-text (`evidence_or_rule`). Aggregate `pin_verified` is reserved exclusively for independently validated structured source-bound pin records (not implemented in this free-text phase).
  - `"unverified"`: Assigned unconditionally to all citations evaluated from unstructured `evidence_or_rule` text. Also assigned when any cited source lacks a pin, any pin is out of bounds (line < 1 or line > total source lines), page pins or other unsupported formats are used without coordinate mapping, continuation tokens or prose digits are present, or no pins were checked.
- `unresolved_sources` (list[str], optional): Present if any cited source, exhibit, or invalid pin locator could not be resolved against dispatched sources (e.g. `["ghost-note Line 3", "Exhibit 7", "voss-note.txt Line 99"]`).
- `unsupported_pin_locators` (list[str], optional): Present when finding-level `pin_status` is unverified and non-conforming or unsupported locator formats (such as page pins, ranges, abbreviations, or unstripped prose digits) were detected in `evidence_or_rule`. Kept distinct from `unresolved_sources` so valid source identity match is not converted to `source_unverified`.
- `pin_candidates` (list[str], optional): Lists recognized mechanical line pin matches (e.g. `["Line 3"]`) surfaced separately as unvalidated mechanical candidates when overall finding `pin_status` remains `unverified`. Candidates are extracted via mechanical regex and do NOT constitute source or pin verification.

### Pin Citation Policy and Unstructured Free-Text Ceiling
- **Absolute Free-Text Ceiling**: Under Contract Version 1.1, all citations evaluated from unstructured `evidence_or_rule` text are subject to an absolute free-text ceiling: `_evaluate_source_citation` unconditionally returns `pin_status: "unverified"`. No allowlist, denylist, or complete-set heuristic confers aggregate `pin_verified` from free text. Aggregate `pin_verified` is strictly reachable only via independently validated structured source-bound pin records (not implemented in this phase).
- **Mechanical Candidates**: Any recognized line pin patterns (e.g. `Line <N>` / `line <N>`) are populated in `pin_candidates` as purely mechanical, unvalidated hints. Unsupported or non-conforming locators (such as page pins, ranges, abbreviations, continuation tokens, or prose digits) appear in `unsupported_pin_locators`.
- **Intended Status Change**: Under this conservative contract, previous positive free-text citation cases (including pure single-Line references) that previously reported `pin_status: "pin_verified"` are intentionally downgraded to `pin_status: "unverified"` with mechanical matches captured in `pin_candidates`.
- **Heuristic Detection Limit**: Free-text locator parsing is heuristic and conservative; text tokens do not confer source or authority truth upgrades.

### Page Pin vs. Line Pin Policy
Page pins (e.g. `Page 2`, `page 2`, `p. 4`, `pp. 2-3`, `at 2`, `Tr. 922`) cannot be verified against raw line-count bounds of text files. Absent an authentic page-to-line coordinate mapping, page citations remain conservative and yield `pin_status: "unverified"`.

## Failure handling

- A standard or element cannot be found in a primary source: mark it UNVERIFIED and send it to `legal-research-verification`; do not apply a remembered standard.
- The State's theory is not stated anywhere in the record: record the question and the document that would answer it; do not supply a theory for the State.
- Evidence is missing from the file: list it as an open item and request it (`records-requests-subpoenas`); missing data is not proof of suppression (adaptation 6).
- A stated fact conflicts with the record: open a register ID under `fact-conflict-resolution.md`.

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Do not treat accusation as proof, and do not ignore exculpatory or impeachment facts; show evidence that weakens the State's case as clearly as evidence that supports it.
- A contradiction does not by itself establish knowledge, materiality, or entitlement to relief (adaptation 6).
- In final documents, state risk in words and give no numeric likelihood (K7).
- Court-facing output goes through `corrective-playbook-gate`, then `legal-quality-control`.

## Output

A charge sufficiency matrix, a witness reliability review, a disclosure checklist, a list of wrongful-prosecution risk factors in words, a recommended action, and/or a collection of validated `review_finding` objects. Layouts are in `references/charge-review-templates.md` and `references/substantive-review-rubric.md`.

## Self-check before reporting

- Each element has evidence rows with pinpoints and an admissibility entry.
- Probable cause, sufficiency, and proof beyond a reasonable doubt were tested separately.
- Every misconduct lead has an R10 class and a cited basis.
- Each standard is verified or marked UNVERIFIED.
- Every substantive draft review finding contains an exact verbatim passage, defect with label (a)/(b)/(c), source/rule, strongest opposing response, bounded correction, and observable recheck requirements.
- No score or probability appears in a final document.

