# Source revisions and stale propagation

A claim is only as current as the source it is pinned to. When the source changes, every dependent output must stop claiming to be current.

## Triggers

- a revised or supplemental laboratory report;
- a corrected bench note or worksheet;
- a changed interpretation, statistic, or conclusion;
- a new version of the SOP or software that changes the result;
- a new disclosure that adds or removes a material fact;
- a corrected quotation or pin.

## What becomes stale

- the claim record;
- every dependent report, memo, or brief;
- every cross-examination outline;
- every prior gate result that relied on the claim;
- any summary that repeats the claim.

## Procedure

1. Record the new source version and SHA-256.
2. Change the claim's `review_status` to `stale`.
3. Mark every `dependent_outputs` entry `stale`.
4. Add a `STALE` gate result for the prior delivery gate.
5. Re-read the exact source language and compare it to the stored quotation.
6. Re-evaluate the proposition level and the method fields.
7. Re-run the qualified-support analysis.
8. Re-review the dependent outputs and only then mark them current.
9. Record the reviewer and the date.

## CLI

```
py -3.14 -B <kit>/skills/forensic-evidence-evaluation/scripts/validate_claims.py stale \
  --register <register.json> --claim-id FC-001 \
  --new-sha256 <64-hex> --new-version <version> --out <updated.json>
```

The command writes a new file. It does not overwrite the original register by default. The updated register has a `STALE` gate result and every dependent output marked `stale`.

## Rules

- A gate pass is not durable across a source revision.
- Do not mark an output current because the change was small.
- Do not delete the prior version; keep the source-version history.
- Do not treat a stale claim as false; treat it as not currently reviewed.
- Revalidate before any filing, hearing, or delivery.
