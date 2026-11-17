# Laboratory file checklist

Use with `discovery-brady-giglio/references/availability-matrix.md` and `controller/schemas/evidence_availability.schema.json`.

**Do not replace the disclosed report with a generic file request.** Quote the exact report language, identify the method actually used, and request the file that supports that method. A category that does not apply to the method is marked `not_applicable`, not treated as an omitted-lab defect.

## Expert-review hook

Before selecting any module, run `expert-report-validator` and record the mode, the disclosure matrix, and the challenged opinions. Use the validator's `challenged_opinions` to identify the method and the precise proposition; use its `disclosure_matrix` to fill the availability and next-action columns here. A consulting-expert review may produce no request until a verified trigger exists.

## Method-applicability states

| State | Meaning |
|---|---|
| `applicable_documented` | The method uses this item and the file or record exists. |
| `applicable_unavailable` | The method uses this item but the file is not available; state why from the record. |
| `applicability_unresolved` | It is not yet known whether the method uses this item; ask the lab or a qualified expert. |
| `not_applicable` | The method does not use this item; do not criticize its absence. |

## Common core

| # | Item | Why it matters | Applicability | Request wording |
|---|---|---|---|---|
| 1 | Case submission and request-for-analysis form | Shows what was asked, by whom, when, and with what context. | `applicable_documented` | "The case submission form, request-for-analysis form, and any supplements, including the submitting agency, date, requested tests, and stated case context." |
| 2 | Chain-of-custody and tracking history | Shows every transfer, seal, storage location, and date. | `applicable_documented` | "The complete chain-of-custody record and internal tracking history for each item, including receipt, transfer, storage, and return." |
| 3 | Bench notes and worksheets | Shows what the analyst actually did, observed, and changed. | `applicable_documented` | "All handwritten and electronic bench notes, worksheets, and data-entry records for each test, including revisions and crossed-out entries." |
| 4 | Raw data and instrument files | Allows independent review and reproduction. | `applicable_documented` | "The native raw data files for each instrument run, in the original format, with the associated sample sheet and run log." |
| 5 | Analytic and stochastic thresholds | Shows whether the interpretation is within the method's validated limits. | `applicable_documented` | "The analytic, stochastic, and interpretation thresholds in force on the test date, and the values applied to this item." |
| 6 | SOP editions in force on the test dates | Shows the procedure the analyst was required to follow. | `applicable_documented` | "The complete SOP editions in force on each test date, including revision history and any interim memoranda." |
| 7 | Software, version, settings, and configuration | Shows how the data were processed and interpreted. | `applicable_documented` | "The software name, version, module, settings, and configuration used for analysis and interpretation, including any validated parameter files." |
| 8 | Internal validation and performance checks | Shows whether the method performed as validated on this item. | `applicable_documented` | "The internal validation studies, precision and sensitivity data, and the performance checks for the run that produced this result." |
| 9 | Analyst and technical-review worksheets | Shows who did what and what the reviewer checked. | `applicable_documented` | "The analyst worksheet and the technical or administrative review worksheet, with reviewer identity, date, and comments." |
| 10 | Profile interpretation records | Shows the basis for the reported conclusion, not just the conclusion. | `applicable_documented` | "All interpretation records, including the profile, comparisons, statistics, and the analyst's stated basis for the reported conclusion." |
| 11 | Controls and contamination monitoring | Shows whether the run was in control. | `applicable_documented` | "The negative, positive, reagent, and extraction controls for each run, the contamination-monitoring results, and any follow-up." |
| 12 | Reference and comparison samples | Shows the source, collection, and handling of the comparison standard. | `applicable_documented` | "The reference-sample collection records, provenance, handling, and any re-draw or re-collection." |
| 13 | Proficiency testing and corrective actions | Shows the analyst's and laboratory's demonstrated performance. | `applicable_documented` | "Proficiency-test results for the analyst and laboratory for the relevant method and period, and any corrective-action records." |
| 14 | Accreditation, audit, and inspection records | Shows the quality-system context. | `applicable_documented` | "Accreditation records, audit or inspection findings, and corrective-action plans for the relevant period." |
| 15 | Retained extracts, consumption, and disposal records | Shows what remains for retesting and what was consumed. | `applicable_documented` | "The extraction and retention records, remaining quantity and condition, consumption records, and any disposal or destruction authorization." |
| 16 | Laboratory and investigator communications | Shows what the analyst knew and when. | `applicable_documented` | "All communications between the laboratory and the submitting agency or prosecution about this case, including case-context packets and supplemental requests." |
| 17 | Staff-elimination and contamination databases | Shows whether a known staff or laboratory profile could explain the result. | `applicability_unresolved` | "The existence, scope, and access rules for staff-elimination and contamination databases; do not assume disclosure entitlement for every category." |

## DNA-specific modules

Add these only when the method is autosomal STR, Y-STR, mitochondrial, or a mixture interpretation.

| # | Item | Why it matters | Applicability | Request wording |
|---|---|---|---|---|
| D1 | Amplification and electrokinetic records | Shows the run conditions and any deviation. | `applicable_documented` | "Amplification records, injection lists, electrokinetic parameters, and any re-amplification or re-injection." |
| D2 | Electropherograms and peak tables | Allows independent interpretation. | `applicable_documented` | "The electropherograms and peak tables for every injection, in native and exported form, with the analysis labels." |
| D3 | Mixture interpretation records | Shows contributor assumptions, major/minor calls, and number-of-contributors decisions. | `applicable_documented` | "The mixture-interpretation worksheet, contributor assumptions, major/minor determinations, and the basis for any number-of-contributors conclusion." |
| D4 | Statistical calculation records | Shows the reported statistic, the propositions, the database, and the assumptions. | `applicable_documented` | "The statistical calculation worksheet, the proposition pair, the database name and size, the population data, any theta or FST adjustment, and the reported value with its confidence bound." |
| D5 | Probabilistic-genotyping records | Shows the model, software, version, settings, and validation. | `applicability_unresolved` | "If probabilistic genotyping was used: the software, version, settings, validation, and the full likelihood-ratio output. If it was not used, mark this item not_applicable." |
| D6 | Y-STR records | Shows the haplotype, database, and the limits of a paternal-line association. | `applicability_unresolved` | "If Y-STR testing was performed: the haplotype, loci typed, database name and size, the observed count or frequency estimate, and the laboratory's stated limits. If not performed, mark this item not_applicable." |
| D7 | Genetic-search records | Shows whether a database search was routine, incidental, or deliberate, and what policy governed it. | `applicability_unresolved` | "The database-search records and policy, including whether the search was a routine comparison, an incidental partial match, or a deliberate familial or investigative search. Do not infer a familial search from a Y-STR result." |

## Review rules

- **Quote the report first.** The exact report language and the method determine the applicable modules.
- **Do not request a statistic the method does not use.** A method that uses no likelihood ratio is not deficient for lacking one.
- **Preserve the reported statistic verbatim.** Do not recalculate or replace it in the request.
- **Do not assume disclosure entitlement.** Record the existence and availability of staff-elimination, contamination, proficiency, and audit records without asserting a right to every category.
- **Do not label a missing document as concealed or destroyed.** Use the availability state and a targeted follow-up.
- **Record the custodian, request route, authority ID, and follow-up date** for every item.

## Output

A completed checklist with one row per item, the applicability state, the request wording, the existence and availability state, the entitlement type and authority ID, the custodian, and the next action.
