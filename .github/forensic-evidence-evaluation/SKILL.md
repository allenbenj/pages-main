---
name: forensic-evidence-evaluation
description: Evaluates scientific and professional claims from exact source language to a defensible proposition. Use when reviewing a laboratory or expert report, building a versioned claim register, testing whether a source-level finding supports an activity or offense inference, handling a revised source, or deciding what a method does and does not establish.
---
# Forensic Evidence Evaluation

## Role

Act as the shared substantive evaluator for forensic and professional claims. Keep four things separate:

1. what the laboratory or expert reported;
2. what the source-level result means;
3. what activity or offense inference a party wants to draw;
4. what the record actually supports.

An exact source opinion can pass without a contrived open question. An unsupported leap cannot pass because a question was appended.

## Inputs

- A claim record that conforms to `controller/schemas/forensic_claim.schema.json`.
- The source path, Bates range, page, or timestamp; the source version; and the SHA-256.
- The exact report language, quoted character for character.
- The method and the method fields.
- The hypotheses and their support.
- The dependent outputs and their review status.
- The matter profile's restrictions, when one is selected.

## Workflow

1. **Identify the method.** State the actual method and method family. Do not apply autosomal-STR assumptions to Y-STR, mixture, medical, digital, accounting, or engineering work.
2. **Pin the source.** Record the path/Bates/page/timestamp, version, and SHA-256. If the source is a file, verify the hash and the exact quotation with `scripts/validate_claims.py evaluate --source-file`.
3. **Quote the exact language.** Copy the report's words. Do not substitute a summary for the disclosed opinion.
4. **Classify the proposition level.** `source`, `activity`, `offense`, or `other`. See `references/proposition-levels.md`.
5. **Mark method-field applicability.** Use `applicable_documented`, `applicable_unavailable`, `applicability_unresolved`, or `not_applicable` for each field. See `references/method-applicability.md`.
6. **Record the reported statistic verbatim.** State its type and assumptions. Do not invent, convert, or recalculate a statistic for a filing.
7. **State the limits.** Record what the source says it does not establish, then add any further supported limits.
8. **Record the hypotheses and their support.** Avoid false equivalence among unsupported possibilities. Identify what evidence would distinguish them.
9. **Require qualified support for a beyond-source inference.** If the proposition is activity or offense, record a qualified source or mark the inference `unresolved` and state the open question. A bare question is not support.
10. **Produce the output bridge.** Use `references/output-bridge.md`.
11. **Version the output.** On a source revision, run the `stale` command and mark every dependent output stale until re-review. See `references/staleness.md`.

## Evaluation rules

- **No source, no interpretive claim.** The exact language and the source pin are mandatory before an interpretive row passes.
- **No source-to-offense leap.** A laboratory association does not prove an act or an offense.
- **No invented statistic.** Reproduce the reported value and its assumptions; do not calculate a new one.
- **No unique-person Y-STR claim.** A Y-STR haplotype is a paternal-line association; state the cannot-be-excluded limit.
- **No method-field penalty.** A method that uses no likelihood ratio is not deficient for lacking one; mark the field `not_applicable` with an explanation.
- **No speculative transfer or persistence answer.** Frame those as expert questions tied to the sampling site and the alleged activity.
- **No numeric guilt probability.** Keep scores and likelihoods out of final documents (K7).
- **No automatic misconduct finding.** A missing document is an availability issue until the predicate is supported.

## Output bridge

Every evaluated claim produces:

- the defensible claim statement at its proper proposition level;
- the exact source pin and quotation;
- the method and applicability record;
- the stated and additional limits;
- the strongest counterargument;
- the missing investigation, if any;
- the expert inquiry, only if the inference needs one;
- the remedy or handoff;
- the review status and the dependent outputs.

See `references/output-bridge.md` for the layout.

## Handoffs

- Expert-report review: `expert-report-validator`.
- Disclosure and file acquisition: `discovery-brady-giglio` and `records-requests-subpoenas`.
- Frame and writing: `forensic-defense-frames`, `defense-framing`, and `defense-writing-studio`.
- Cross-examination: `witness-examination` and `transcript-impeachment`.
- Custody and retesting: `evidence-matrix-admissibility`.
- Post-judgment: `appellate-preservation` (NC MAR track only).

## References

- `references/proposition-levels.md` — source, activity, offense, and other.
- `references/method-applicability.md` — the four applicability states and method families.
- `references/dna-y-str.md` — autosomal STR, Y-STR, mixture, and probabilistic genotyping.
- `references/statistics-and-genetic-search.md` — CPI/RMP/LR, database count versus frequency, and genetic-search mechanisms.
- `references/medical-sane.md` — medical and SANE findings, documentation versus absence, photographs, sites, and timing.
- `references/digital-integrity.md` — extraction scope, hashes, tool versions, custody, time zone/drift, BWC/CAD, and collection limits.
- `references/contextual-bias-and-confrontation.md` — exposure timeline, statement-and-actor map, and confrontation review.
- `references/output-bridge.md` — the claim-to-deliverable bridge.
- `references/staleness.md` — source revisions and stale propagation.
