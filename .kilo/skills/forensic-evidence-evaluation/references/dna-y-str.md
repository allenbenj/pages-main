# DNA, Y-STR, mixture, and probabilistic genotyping

Use this reference after the method is identified. Do not apply one DNA method's assumptions to another.

## Autosomal STR

Record:

- loci typed and called, and profile completeness;
- single source or mixture;
- contributor assumptions and number-of-contributors decision;
- comparison-sample provenance and collection;
- analytic and stochastic thresholds;
- controls, re-amplification, drop-out, drop-in, pull-up, and contamination indications;
- technical and administrative review;
- the reported statistic and its type.

A single-source profile is not a mixture. A mixture is not a single source. Do not criticize a report for lacking a field the method does not use.

## Y-STR

Record:

- loci typed and the haplotype;
- database name and size;
- observed haplotype count and any frequency estimate, kept distinct;
- the laboratory's stated limits;
- the paternal-line language.

A Y-STR haplotype is shared along the paternal line. It does not uniquely identify an individual. A match means the person and paternal male relatives cannot be excluded; it does not mean the person is the source to the exclusion of all others. Do not infer a familial search from a Y-STR result.

## Mixture interpretation

Record:

- the number-of-contributors decision and its basis;
- major/minor assumptions and conditioning profiles;
- minor-contribution limits and drop-out risk;
- the interpretation method and thresholds;
- any probabilistic-genotyping model, software, version, settings, and validation;
- the proposition pair and the reported output.

A mixture conclusion without contributor assumptions is incomplete. Do not treat a minor component as a confirmed contributor without the supporting interpretation.

## Probabilistic genotyping

Record:

- the model and software, with version and settings;
- the propositions tested and the conditioning;
- the database, population data, and any theta/FST adjustment;
- validation and sensitivity studies;
- the output type (LR or another statistic), point estimate, and confidence bound;
- the laboratory's stated limits.

A probabilistic-genotyping output is not a guilt probability. Do not convert an LR into a numeric probability of guilt in a final document.

## Transfer, persistence, and timing

These are separate expert questions:

- How did the DNA get there?
- Was it primary, secondary, or tertiary transfer?
- How much was deposited, and how long would it persist?
- Does the sampling site and the alleged activity support the proposed transfer?

The laboratory report may express no opinion on these questions. Do not supply a speculative answer. Tie each question to the sampling site, the item, and the alleged activity, and route it to a qualified expert.

## Claim fields

- `method_family`: `autosomal_str`, `y_str`, `mixture`, or `probabilistic_genotyping`.
- `statistic_type`: `CPI`, `RMP`, `LR`, `frequency`, `count`, `none`, `other`, or `unverified`.
- `genetic_search_type`: `routine_comparison`, `incidental_partial_match`, `deliberate_familial`, `y_str_comparison`, `not_applicable`, or `unverified`.
- `database_name` and `database_size`, when a database is used.

## Rules

- Preserve the reported statistic verbatim; do not recalculate or replace it.
- Distinguish a database count from a frequency estimate.
- Do not invent a likelihood ratio for a method that reports a CPI or RMP.
- Do not call a Y-STR result a unique identification.
- Do not infer a familial search from a Y-STR comparison.
- Do not treat a laboratory association as proof of an act or an offense.
- Do not supply transfer, persistence, or timing answers the source does not support.
