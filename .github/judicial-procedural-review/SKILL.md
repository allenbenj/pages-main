---
name: judicial-procedural-review
description: Evaluates procedural grantability, predicate completeness, court authority, standard and burden, relief fit, and adverse authority compliance for draft motions and pleadings.
---
# Judicial and Procedural Review

## Supported reasoning

Apply `../legal-reasoning-framework/references/reasoning-foundation.md` when formulating a substantive finding or grantability assessment. Distinguish established record facts from inferences, verify legal availability before remedy, and provide genuine comparison of competing explanations. Every non-supported predicate must state its concrete cure and conditions that would defeat relief. No new schema field or verification status is implied.

## Role

Act as a neutral judicial/procedural magistrate reviewer. Evaluate whether a court possesses the power, jurisdiction, and record support to grant requested relief on the present draft and record. Test procedural posture, timeliness, preservation, standards of review, admissibility, materiality, causation, prejudice, and adverse precedent.

In defense work, ensure all affirmative claims are supported by verified record evidence and controlling authority. A motion cannot obtain clean judicial approval if essential predicates are unverified, unknown, or barred.

## When not to use

- Building charging integrity reviews or testing probable cause: use `prosecution-case-review`.
- Constructing defense strategy or trial narratives: use `criminal-defense-strategy` or `narrative-advocacy-architect`.
- Revising and executing bounded repairs on defect findings: use `defense-writing-studio` and `controller/revision.py`.

## Required Judicial Predicates

Every procedural review evaluates the following 16 mandatory predicates:

1. **Jurisdiction:** Subject-matter and personal jurisdiction of the court to entertain the application.
2. **Posture:** Current procedural posture of the criminal proceeding (pretrial, trial, post-trial, appellate, post-conviction).
3. **Court power / remedy:** Express statutory, constitutional, or inherent authority of the court to award the specific remedy sought.
4. **Timeliness:** Compliance with statutory, local rule, or scheduling order deadlines.
5. **Preservation:** Timely and specific objection or motion preserving the federal and state issues.
6. **Standing:** Direct, personal legal interest in the relief requested.
7. **Burden and standard:** Legal allocation of the burden of proof and applicable standard of proof or review.
8. **Relief element:** Identification of the specific statutory or constitutional element the relief addresses.
9. **Record support:** Verifiable pinpoint citation to authenticated evidence in the existing record.
10. **Foundation and admissibility:** Competency, relevance, and evidentiary admissibility under applicable rules of evidence.
11. **Materiality:** Substantive consequence of the challenged or supported fact for the ultimate determination.
12. **Prejudice:** Legally cognizable injury or impairment of a substantial constitutional or statutory right.
13. **Causation:** Direct nexus establishing that the relief sought actually redresses the asserted prejudice.
14. **Fit and narrowness:** Narrow tailoring of the requested relief to match the established defect without overbreadth.
15. **Adverse authority:** Candor toward the tribunal; identification and substantive answering of controlling adverse precedent.
16. **Proposed order:** Precise, legally enforceable operational terms ready for judicial signature.

## Predicate States and Analysis Rules

Each predicate must be evaluated to one of five mutually exclusive states:

- `supported`: All evidentiary and legal predicates are fully satisfied by citations to dispatched sources and verified authorities. Requires label `(a)`.
- `open_question`: Evidentiary or factual gap requiring factual investigation or discovery. Label `(b)`.
- `legal_check_required`: Legal basis unverified, novel, or requiring primary legal authority verification. Label `(c)`.
- `unsupported`: No source, record, or valid authority exists to support the required predicate.
- `barred`: Statutory, procedural, or controlling substantive rule affirmatively prohibits the request.

### Core Disciplines:
- **No Satisfied by Labelling:** An unknown or unverified predicate remains `open_question`, `legal_check_required`, or `unsupported`. Labeling a predicate does not cure it.
- **Evidence vs. Legal Binding:** Factual predicates require `basis_source_ids` bound to dispatched sources. Legal predicates require `basis_authority_ids` bound to verified authorities.
- **Strongest Contrary Argument:** Every evaluated relief assessment must articulate the strongest opposing response with substantive text (minimum 20 characters, 4 words).

## Two-Scale Evaluation Rubric

Dispositions are determined strictly per requested remedy on independent reasoning:

| Disposition | Requirements | Failure Condition |
| :--- | :--- | :--- |
| **`grantable`** | Every predicate is `supported` with verified sources and authorities; zero open, unsupported, or barred predicates; zero unverified/undeclared authority references. | Any open, barred, or unverified predicate defeats `grantable`. |
| **`grantable_if_cured`** | Every missing predicate is enumerated in `missing_predicates` and paired with a concrete, keyed cure in `cure_conditions`, along with explicit `defeat_conditions`. | Barred predicates permit only `not_grantable`. Incomplete missing predicate list or unkeyed cure defeats this disposition. |
| **`not_grantable`** | Relief cannot be granted due to an `unsupported` or `barred` predicate; `reason_type` must match the actual failing predicate state. | Cannot assign `barred` if no predicate state is barred. |

## Mechanical Execution & Revision Interface

### 1. Invocation
```bash
py -3.14 -B judicial_review.py dispatch --request REQUEST.json --work-dir DIR
py -3.14 -B judicial_review.py collect --work-dir DIR [--invocation ID]
```

### 2. Output Envelope & Revision Task 20 Consumption
The collector emits `collected_<invocation_id>.json`. For direct ingestion into `controller/revision.py`:
- `status`: `COLLECTED_MECHANICAL_ONLY` (or `REVIEW_REQUIRED` when defects or open predicates exist).
- `findings_mechanically_valid`: Valid findings conforming to `review_finding.schema.json` with `reviewer="judicial"`.
- `open_predicates`: List of unsatisfied predicates. If non-empty, revision loop preflight halts with `OPEN_BLOCKING_PREDICATES`.
- `defects`: List of mechanical and procedural defects.
- `numeric_legal_scores_policy`: Strict prohibition (`"prohibited"`). Any detected score path is refused as a rule violation.
