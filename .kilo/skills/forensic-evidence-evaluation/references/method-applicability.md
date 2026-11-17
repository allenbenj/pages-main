# Method applicability

Every method field gets one of four states. The state is a fact about the method and the file, not a criticism.

| State | Meaning | What to do |
|---|---|---|
| `applicable_documented` | The method uses the field and the record documents it. | Pin the record and record the value. |
| `applicable_unavailable` | The method uses the field but the record is unavailable. | State why from the record and set a targeted follow-up. |
| `applicability_unresolved` | It is not yet known whether the method uses the field. | Ask the laboratory or a qualified expert; do not treat the field as missing. |
| `not_applicable` | The method does not use the field. | State why; do not criticize its absence. |

## Common method families

### Autosomal STR

Loci typed, profile completeness, single source versus mixture, contributor assumptions, comparison-sample provenance, analytic and stochastic thresholds, controls, re-amplification, technical review, and the reported statistic (CPI, RMP, or probabilistic-genotyping output).

### Y-STR

Loci typed, haplotype, database name and size, observed count or frequency estimate, paternal-line limits, and the cannot-be-excluded language. A Y-STR result does not uniquely identify an individual.

### Mixture

Number-of-contributors decision, major/minor assumptions, minor-contribution limits, conditioning profiles, probabilistic-genotyping model and version, and the proposition pair.

### Medical / SANE

Exam findings by site, instrument and protocol, photography metadata, time from the reported event, examiner credentials, tests, and the distinction between an absent documentation and an absence of injury.

### Digital

Extraction scope and type, tool and version, hash and verification, write-blocking, original-media custody, logs, collection limits, timestamps, time zone, and known drift.

### Accounting / engineering / other

Source data, models, assumptions, instruments, calibration, calculations, standards, review, and the limits of the opinion.

## Rules

- Do not require a likelihood ratio from a method that does not use one.
- Do not require mixture fields from a single-source profile.
- Do not require Y-STR fields from an autosomal-STR report.
- Do not treat an unavailable field as a laboratory defect; record the availability state.
- Do not treat an unresolved field as not applicable.
- Explain every state with a pin or a research task.

## Evaluation checklist

- Is the method named precisely?
- Are the method fields listed and classified?
- Is any field silently missing?
- Is a statistic reported, and is its type stated?
- Is a limit stated, and is it consistent with the method?
- Is an activity or offense inference being drawn from a source-level field?
