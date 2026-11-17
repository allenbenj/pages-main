# Statistics and genetic search

Keep the reported statistic, its type, and its assumptions together. A number without its basis is not a finding.

## Statistic types

| Type | What it is | What it is not |
|---|---|---|
| `CPI` | Combined probability of inclusion for a profile or mixture. | A likelihood ratio or a guilt probability. |
| `RMP` | Random match probability for a profile. | A probability that the person is the source. |
| `LR` | Likelihood ratio comparing two propositions. | A probability of guilt; it depends on the propositions and assumptions. |
| `frequency` | An estimated population frequency. | A count of observed haplotypes. |
| `count` | An observed number in a database. | A frequency estimate or an LR. |
| `none` | The report states no statistic. | A deficiency if the method does not require one. |
| `unverified` | The type is not established. | A basis for reliance. |

## Database count versus frequency

- A **count** is how many times a haplotype or profile was observed in a named database of a stated size.
- A **frequency** is an estimate derived from a database, with assumptions and often a confidence bound.
- Do not present a count as a frequency, or a frequency as a count.
- Record the database name and size, the population data, and any theta/FST adjustment.
- Record whether the reported value is a point estimate or a confidence bound.

## Likelihood ratios

For an LR, record:

- the proposition pair (prosecution and defense propositions);
- the conditioning profile or assumed contributor;
- the model and software, with version and settings;
- the database and population data;
- the validation and sensitivity;
- the point estimate and any confidence bound;
- the laboratory's stated limits.

An LR is not a guilt probability. Do not convert it into one in a final document.

## Genetic search mechanisms

| Mechanism | What to record | What not to infer |
|---|---|---|
| Routine database comparison | The database, the search policy, the candidate list, and the comparison result. | That the search was targeted at this person. |
| Incidental partial match | The match criteria, the candidate, and the follow-up. | That a familial search was conducted. |
| Deliberate familial search | The written policy, the authorization, the search parameters, the candidate list, and the confirmation testing. | That the policy permitted the search without reading it. |
| Y-STR comparison | The haplotype, the database, the count or frequency, and the paternal-line limits. | That a Y-STR result is a unique identification or a familial search. |

## Claim fields

- `statistic_type`: `CPI`, `RMP`, `LR`, `frequency`, `count`, `none`, `other`, or `unverified`.
- `genetic_search_type`: `routine_comparison`, `incidental_partial_match`, `deliberate_familial`, `y_str_comparison`, `not_applicable`, or `unverified`.
- `database_name` and `database_size`.

## Rules

- Quote the reported statistic exactly; do not round, convert, or recalculate it.
- State the type and assumptions in the same record.
- If the method reports no statistic, mark the field `none` or `not_applicable`; do not demand an LR.
- If the search type is unknown, mark it `unverified`; do not assume a familial search.
- If a deliberate familial search is claimed, require the written policy and authorization.
- Do not state a numeric guilt probability in a final document.
