# Non-laboratory expert file checklist

Use for medical, digital-forensic, accounting, engineering, and other professional experts. Use the laboratory checklist only for laboratory methods. Do not carry laboratory-specific items into a non-laboratory request.

## Expert-review hook

Before selecting a discipline module, run `expert-report-validator` and record the mode, the disclosure matrix, and the challenged opinions. Use the validator's `challenged_opinions` to identify the precise proposition and method; request only the file categories that support that proposition. Do not request a full file dump. A consulting-expert review may produce no request until a verified trigger exists.

## Method-applicability states

Use the same four states as the laboratory checklist: `applicable_documented`, `applicable_unavailable`, `applicability_unresolved`, `not_applicable`.

## Common core

| # | Item | Why it matters | Applicability | Request wording |
|---|---|---|---|---|
| 1 | Engagement letter and scope | Shows what the expert was asked to do and what was excluded. | `applicable_documented` | "The engagement letter, scope of work, any amendments, and the expert's understanding of the disputed proposition." |
| 2 | Qualifications and licenses | Shows whether the expert is qualified on the precise issue. | `applicable_documented` | "Current CV, licenses, certifications, board status, and the basis for the claimed expertise." |
| 3 | Report, drafts, and supplements | Shows the opinion and how it changed. | `applicable_documented` | "The signed report, all drafts and supplements, and a change log identifying what changed and why." |
| 4 | Underlying data and source materials | Allows the opinion to be tested. | `applicable_documented` | "The complete data set, source documents, images, measurements, or records the expert relied on, in native form where available." |
| 5 | Instruments, tools, software, and versions | Shows how the data were collected or analyzed. | `applicable_documented` | "The instruments, tools, software, versions, settings, and calibration or validation records used in the analysis." |
| 6 | Procedures, protocols, and standards | Shows the method the expert was required to follow. | `applicable_documented` | "The procedures, protocols, internal standards, and any published standard the expert applied, including the edition in force on the analysis date." |
| 7 | Working papers and calculations | Shows the path from data to opinion. | `applicable_documented` | "All working papers, calculations, models, spreadsheets, and intermediate outputs, including versions and assumptions." |
| 8 | Review and supervision records | Shows who checked the work and what was reviewed. | `applicable_documented` | "Reviewer identity, review notes, supervision records, and any quality-control sign-off." |
| 9 | Communications about the case | Shows what the expert knew and when. | `applicable_documented` | "Communications with counsel, investigators, or the retaining party about the facts, assumptions, and scope, subject to applicable privilege." |
| 10 | Prior testimony and publications | Shows the expert's prior positions and reliability history. | `applicable_documented` | "A list of prior testimony and publications on the precise issue, with transcripts or articles where available." |
| 11 | Compensation and arrangements | Shows potential bias or incentive. | `applicable_documented` | "The compensation arrangement, contingent-fee terms if any, and any other benefit connected to the engagement." |
| 12 | Quality control, accreditation, and discipline | Shows the expert's or firm's quality context. | `applicability_unresolved` | "Accreditation, quality-control, audit, complaint, discipline, and corrective-action records for the relevant period, subject to relevance and entitlement." |
| 13 | Preservation of originals | Shows whether the underlying data remain available. | `applicable_documented` | "The location, format, and retention status of the original data, images, instruments, and samples, and any preservation instruction." |

## Discipline-specific modules

### Medical / SANE

- Exam records, anatomical diagrams, and contemporaneous notes.
- Photographs and their metadata, including timestamps and custody.
- Protocol and kit instructions in force on the exam date.
- Examiner qualifications and training.
- Time from the reported event to the examination.
- Laboratory tests and their collection and handling.
- Any supplemental or peer review.

### Digital forensics

- Extraction type, scope, tool, version, and settings.
- Hash values and verification, write-blocking, and original-media custody.
- Acquisition and analysis logs.
- File-system, cloud, and application collection limits.
- Filtered or redacted exports.
- Examiner notes and peer review.
- Device, account, and time-zone context.

### Accounting / financial

- Ledgers, journals, bank records, and source documents.
- The model, assumptions, and inputs.
- Version history and adjustments.
- Sampling method and coverage.
- Reviewer and quality-control records.

### Engineering / physical

- Inspection and testing records.
- Measurements, instruments, calibration, and uncertainty.
- Calculations, models, and assumptions.
- Standards and editions applied.
- Photographs and sample custody.

## Review rules

- **Do not use laboratory-specific items** for a non-laboratory expert.
- **Tie every category to the precise disputed proposition**, not to a generic "expert file."
- **Distinguish consulting from testifying** and record the disclosure consequence separately.
- **Mark non-applicable items as not_applicable**, not as omissions.
- **Do not assume every quality-control record is discoverable.** Record existence and availability; state the entitlement basis.
- **Do not label a missing document as concealed or destroyed.**

## Output

A completed checklist with one row per item, the discipline module, the applicability state, the request wording, the existence and availability state, the entitlement type and authority ID, the custodian, and the next action.
