# Brady workup

Use this workup only for an alleged suppression of favorable evidence by the prosecution. Keep it separate from statutory discovery, *Giglio*, and *Napue*.

## Candidate authority

- `US-BRADY` — *Brady v. Maryland*, 373 U.S. 83 (1963). Status in the kit ledger: `UNVERIFIED`. Verify the opinion text, the favorable-evidence scope, the suppression requirement, and the materiality standard.

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id US-BRADY
```

If the result is not `RELIANCE_APPROVED`, the workup states the rule as unverified and does not present it as controlling.

## Predicate

1. **Favorable.** Identify why the item is favorable: exculpatory, impeaching, mitigating, or useful to preparation. State the source pin. Do not rely on a conclusory label.
2. **Suppressed by the prosecution.** Identify the prosecution team's possession or knowledge and the act or omission: no disclosure, late disclosure, misleading disclosure, or a disclosure that omitted the favorable core. Distinguish the defense's own failure to find the item.
3. **Material.** State the reasonable-probability analysis: what the defense could have done differently, what the item would have shown, and how it bears on guilt or punishment. Address the cumulative effect of all favorable items, not each item in isolation.
4. **Timing and remedy.** Was the item disclosed before trial, during trial, or after verdict? Identify the remedy: disclosure, continuance, new trial, evidentiary hearing, or another verified remedy.

## Missing predicates

- existence of the item is unknown;
- favorability is speculative;
- the prosecution did not possess the item;
- the item was disclosed in time;
- the materiality analysis is conclusory;
- the record does not show what the defense would have done differently.

## State's best response

- The item was not favorable.
- The item was disclosed.
- The item was not in the prosecution's possession.
- The item was cumulative or would not have changed the result.
- The defense had the underlying information.
- The claim is procedurally barred or unpreserved.

## Rules

- Do not infer suppression from a missing production alone.
- Do not infer bad faith from nondisclosure; bad faith is a separate *Youngblood* question.
- Do not merge *Giglio* impeachment material into a general *Brady* claim without identifying the impeachment use.
- Do not state a numeric probability of a different result.

## Output

A *Brady* section with the favorable item, the suppression evidence, the materiality analysis, the timing, the remedy, the State's best response, and the authority-ledger status.
