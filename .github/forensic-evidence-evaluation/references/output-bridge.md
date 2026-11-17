# Output bridge

The bridge turns an evaluated claim into a defensible deliverable. It is not a rhetorical frame; it is the minimum record for a claim that survives review.

## Fields

| Field | Content |
|---|---|
| Defensible claim | The claim at its proper proposition level, with a source pin. |
| Source pin | Path/Bates/page/timestamp, version, and SHA-256. |
| Exact language | The report's words, quoted. |
| Method | The method and the method-family record. |
| Applicability | The four-state record for each method field. |
| Reported statistic | The verbatim value, its type, and its assumptions. |
| Limits | What the source says it does not establish, plus further supported limits. |
| Counterargument | The strongest opposing reading of the same record. |
| Missing investigation | The item, test, or record that would resolve the open question. |
| Expert inquiry | The specific question, only if the inference needs one. |
| Remedy / handoff | Compel, continue, limit, exclude, hearing, or a handoff. |
| Review status | Draft, in review, reviewed, stale, or rejected. |
| Dependent outputs | Every report, cross outline, or gate result that relies on the claim. |

## Example

- **Defensible claim:** The single-source autosomal-STR profile is consistent with the reference sample from Sample A (source level).
- **Source pin:** Report p. 2, lines 10-14; version synthetic-1; SHA-256 recorded.
- **Exact language:** "The profile is consistent with the reference sample from Sample A."
- **Method:** autosomal STR; single source; CPI 1 in 2,400 under the stated synthetic database.
- **Applicability:** mixture fields `not_applicable`; stochastic threshold `applicable_documented`.
- **Limits:** the report expresses no opinion on how or when the DNA was deposited; transfer and persistence are not addressed.
- **Counterargument:** consistency is not unique identification; the database and assumptions limit the weight.
- **Missing investigation:** sampling-site context, transfer evidence, and the interpretation worksheet.
- **Expert inquiry:** none required for the source-level claim; a transfer question would require a qualified expert and record facts.
- **Remedy:** if the worksheet is missing, compel production or limit the opinion.
- **Review status:** reviewed, with the worksheet gap noted.
- **Dependent outputs:** forensic memo and cross outline; both stale if the report is revised.

## Rules

- The bridge may narrow a claim; it may not widen it.
- If the claim is activity or offense and the support is unresolved, the bridge says so and does not present the claim as established.
- If the source is revised, the bridge and every dependent output become stale until re-review.
- Do not add a numeric guilt probability or a score to a final document.
