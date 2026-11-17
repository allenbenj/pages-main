# Investigative standards index

This is a kit-level index of technical and practice standards relevant to investigative omissions and method review. It is not a legal authority. A standard is not binding law merely because it is authoritative technical guidance.

## Index fields

| Field | Content |
|---|---|
| `standard_id` | Stable identifier. |
| `issuer` | Organization or agency. |
| `title` | Full title. |
| `edition_or_date` | Edition, version, or date. |
| `section` | The section or chapter relied on. |
| `applicability` | The method, discipline, or investigative step. |
| `status` | `binding_law`, `agency_policy`, `technical_guidance`, `advisory_report`, or `unverified`. |
| `source` | The official source or locator. |
| `verification_status` | `UNVERIFIED`, `VERIFIED`, or `RELIANCE_APPROVED` for the text. |
| `notes` | Limits, edition changes, and relevance. |

## Seed candidates

These are candidates to verify. Do not treat an entry as read or current until the edition and section are checked.

| Standard ID | Issuer | Title / scope | Edition or date | Applicability | Status |
|---|---|---|---|---|---|
| `OSAC-FORENSIC` | Organization of Scientific Area Committees for Forensic Science | Standards and guidance for forensic disciplines | Verify current edition | Forensic method selection and validation | `technical_guidance` |
| `SWGDAM-DNA` | Scientific Working Group on DNA Analysis Methods | Recommendations for DNA analysis and interpretation | Verify current edition | DNA, mixtures, probabilistic genotyping | `technical_guidance` |
| `SANE-NATIONAL` | U.S. Department of Justice, Office on Violence Against Women | National Protocol for Sexual Assault Medical Forensic Examinations | Verify current edition | Medical/SANE examination, documentation, photography | `technical_guidance` |
| `NC-CRIME-LAB-POLICY` | North Carolina State Crime Laboratory | Laboratory policy and procedure manuals | Verify current edition and effective date | NC forensic testing and reporting | `agency_policy` |
| `LOCAL-GENERAL-ORDERS` | The relevant law-enforcement agency | General orders and standard operating procedures | Verify the order and date | Collection, preservation, investigation | `agency_policy` |
| `NAS-2009` | National Academy of Sciences | Strengthening Forensic Science in the United States: A Path Forward | 2009 | Forensic science reliability and governance | `advisory_report` |
| `PCAST-2016` | President's Council of Advisors on Science and Technology | Forensic Science in Criminal Courts: Ensuring Scientific Validity of Feature-Comparison Methods | 2016 | Feature-comparison methods and validity | `advisory_report` |
| `NIST-HUMAN-FACTORS` | National Institute of Standards and Technology | Human-factors guidance for forensic examination | Verify current edition | Contextual bias, workflow, and interpretation | `technical_guidance` |

## Rules

- **Do not state guidance as binding law.** A standard may inform ordinary practice, but the legal duty must come from a verified statute, rule, order, or case.
- **Record the edition and section.** A standard without an edition or section is not a usable citation.
- **Check the applicability.** A DNA standard does not govern a SANE examination; a national protocol does not govern a local agency's collection practice.
- **Mark the verification status.** `UNVERIFIED` means the text has not been read. A `technical_guidance` entry is not a finding.
- **Do not block on a complete library.** Add standards as they are reviewed; do not wait for an exhaustive archive before producing the analysis.
- **Keep the matter-side seeding separate.** Copying standards into the casebook's `03_Authorities/Investigative_Standards/` is a separate, matter-authorized step. This kit-level index contains no client data.

## Use in an investigative-omission analysis

For each omission under F7:

1. what was done, with a pin;
2. what was not done, with a pin;
3. whether the step was ordinary practice or a required duty, citing the standard with issuer, edition, and section, or `UNVERIFIED`;
4. the element, competing explanation, or constitutional issue left untested;
5. the effect the missing step could have had;
6. the concrete next ask (inventory, subpoena, motion, expert, or verification).

## Output

A standard entry with the issuer, edition, section, applicability, status, source, and verification status, plus the omission analysis it supports.
