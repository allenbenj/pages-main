# Pre-delivery checklist

Version: 0.2.1. Run in order. **Any failure blocks release.** Stage A is the Corrective Playbook Part III checklist, verbatim in its pass conditions; "R14" in A4 is the Playbook's shorthand for Part II item 14. Stages B–E extend it to drafting. Rules are defined in `master-rules.md`.

Record the result in the gate record at the end, and in `filing_checklist.json` (`playbook_*`, `proofread_complete`, `format_general_rules_checked`, `no_internal_model_text`) when Legal_Hooks is in use.

## Stage A: Corrective Playbook Part III (always)

| # | Check | Pass condition (Playbook) | General mode |
|---|---|---|---|
| A1 | Citation audit | Every case/statute/rule named appears in the source with a page cite (R1, R8) | Drafting: every authority is `reliance_approved` in the ledger, matched by reporter, docket, section, or rule number (K1, K2) |
| A2 | Quote audit | Every quotation is character-for-character from the source, including bracketed alterations (R8) | Same, for every source, statute, rule, and transcript |
| A3 | Pleading-vs-proof audit | No sentence implies the court weighed evidence or reached the merits (R2) | No sentence describes a ruling at a stage it did not reach |
| A4 | Disposition audit | "Recommended" appears; the Order/Grant and the Recommendation are stated separately (R3, R14) | Each disposition uses the document's own verb and names the document type |
| A5 | Voice audit | No holding attributed to a passage that is itself a quotation of an earlier ruling (R4) | Same, for quoted briefs, orders, and testimony |
| A6 | Level audit | No footnote quoted as a holding; no holding asserted about unaddressed amendments or the fee request (R5) | Holding, alternative ground, footnote, and dictum are labeled |
| A7 | Kind audit | Each failure labeled legal-unavailability / missing-element / conclusory / inconsistency (R7) | Same, with the cure for each |
| A8 | Fact audit | Nothing asserted that the document does not contain; unconfirmed items marked (R9, R10) | Every factual sentence has a source cite (K6) |
| A9 | Attribution audit | Every fact labeled as "court said" or "plaintiffs alleged" (R10) | Court said / party alleged / record shows / inference / unconfirmed (K12) |
| A10 | Advice boundary | Analysis is described as a study aid on pleading standards, not legal advice, and does not predict the district court's ruling on the Recommendation | Work that is not a filing carries a status label (for example, "Internal analysis. Not legal advice. Not reviewed for filing."); a filing carries no advice disclaimer; nothing predicts a ruling (owner scope decision 2026-09-30, `master-rules.md`) |

## Stage B: authority and citation form

- [ ] B1. Every statute and rule checked at its official primary source for the jurisdiction (see `local-rules-deadlines/references/jurisdictions/`) or the official federal source, with URL and date recorded (K3).
- [ ] B2. History note checked for recent amendments and effective-date limits (K4).
- [ ] B3. Every case: opinion text, court, date, reporter or neutral cite, subsequent history, and treatment checked and recorded; unpublished status and citation limits noted.
- [ ] B4. Pincite for every proposition; pincite actually supports the proposition.
- [ ] B5. Bluebook form (or court-required form); parallel- or public-domain-citation requirement verified for the court.
- [ ] B6. Adverse authority searched and addressed (`adverse_authority_review.json`).
- [ ] B7. No `Candidate authority - verification incomplete` item in court-facing text.
- [ ] B8. Automated scan run (`legal_workflow.py scan-document`) and every flagged cite resolved by a person. A clean scan is necessary, not sufficient.

## Stage C: analysis and structure

- [ ] C1. Structure follows `court-document-template.md` (K10).
- [ ] C2. Each issue: IRAC complete; Toulmin claim, grounds, warrant, backing, qualifier, rebuttal stated in the worksheet.
- [ ] C3. Issue tree is MECE; threshold and dispositive issues come first.
- [ ] C4. Strongest counterargument stated fairly and answered.
- [ ] C5. Burden, standard, and source stated for each issue (K11).
- [ ] C6. Each exhibit or quoted statement: foundation and admissibility basis stated or marked unresolved (K11).
- [ ] C7. Requested relief is specific and matches the proposed order paragraph by paragraph.
- [ ] C8. Standard of review or decision matches the court and stage (R6); no imported federal standard without verification.
- [ ] C9. Optional analysis-quality check, subordinate to C2, C4, and the master rules; it adds no rule and changes no precedence. For each dispositive argument, Toulmin checks T1–T5 (`legal-reasoning-framework/references/analysis-frameworks.md`) are recorded as pass in the worksheet, or each failure is answered. Repair a failure under the rule it touches (for example, T1 under R9 and K6, T3 under R1 and K1, T5 under C4).

## Stage D: procedure, format, deadlines

- [ ] D1. Caption: court, county, file number, parties, title checked against the court file (K8).
- [ ] D2. Paper format checked against the jurisdiction's current statewide practice rules and any local rule (paper size, binding, cover sheets). Font, margins, and page limits verified for the court or marked UNVERIFIED. Record source URL and date.
- [ ] D3. Nonpublic and unneeded sensitive information omitted or redacted as the governing rules require.
- [ ] D4. Local rules checked at the court's official local-rules page (recorded in the court profile) and the governing plan identified for the case type. Record date checked.
- [ ] D5. Every deadline computed from the rule's text and trigger, with rule cited and computation shown, and recomputed by a second pass (K9). Use the jurisdiction's time-computation rule and the motion-timing statute or rule for the motion type.
- [ ] D6. Signature, verification or affidavit, and service requirements identified from the governing statute or rule.
- [ ] D7. Proposed order, exhibits, affidavits, certificate of service assembled; nothing signed, sworn, or served is invented.

## Stage E: proofreading and release

- [ ] E1. Read-aloud pass for grammar, typos, and sentence clarity; active voice; plain English.
- [ ] E2. Consistency pass: names, dates, times, file numbers, exhibit labels, defined terms, and pronouns.
- [ ] E3. Numbers pass: every date, count, amount, and time recomputed or rechecked against source.
- [ ] E4. No model tags, prompts, framework labels, review notes, scores, bracketed placeholders, or tracked changes remain (K7).
- [ ] E5. Final file rendered and checked (page numbers, headings, table of contents if any, quotation characters unchanged).
- [ ] E6. Version, SHA-256, and path recorded; prior version retained.
- [ ] E7. Named human sign-off recorded (K13).

## Gate record

```
Document:            <path>
Version / SHA-256:   <version> / <hash>
Mode:                literal (reference opinion) | general
Stage A (A1–A10):    pass | fail: <check IDs and passages>
Stage B:             pass | fail: <items>
Stage C:             pass | fail: <items>
Stage D:             pass | fail: <items>
Stage E:             pass | fail: <items>
Unverified items:    <list, each marked UNVERIFIED>
Reviewer / date:     <name> / <date>
Release decision:    blocked | released for <purpose>
```
