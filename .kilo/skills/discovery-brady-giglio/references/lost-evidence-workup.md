# Lost, preserved, and destroyed evidence workup

Use this workup when evidence was not collected, collected but lost, destroyed, consumed, or retained only as an extract. Keep it separate from *Brady*, statutory discovery, and custody/authentication analysis.

## Categories

| Category | Question | Evidence needed |
|---|---|---|
| Never collected | Was collection required or ordinary practice? | Scene reports, policy, witness accounts, photographs. |
| Collected and lost | Where was it after collection? | Property records, transfer log, inventory, custodian statement. |
| Destroyed | Who destroyed it, when, under what policy, and what notice was given? | Destruction log, retention policy, correspondence. |
| Consumed in testing | Was the consumption necessary and documented? | Test request, extraction record, remaining-quantity record. |
| Extract retained | Is a usable extract available for retesting? | Extraction record, storage location, quantity, condition. |

## Candidate authorities

- `US-YOUNGBLOOD` — *Arizona v. Youngblood*, 488 U.S. 51 (1988). Status in the kit ledger: `UNVERIFIED`. Verify the bad-faith requirement and its limits.
- `NC-PRESERVATION-RESEARCH` — an explicit research placeholder. The governing North Carolina statute, rule, or standing order must be identified and verified before any preservation duty is stated.

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id US-YOUNGBLOOD
```

## Predicate

1. **What the item was and why it mattered.** State the source pin and the defense use.
2. **What happened to it.** Use the availability record: not collected, lost, destroyed, consumed, or retained as an extract.
3. **The duty.** Identify a verified statutory, rule-based, order-based, or professional-standard duty. If the only support is a general practice, label it as practice, not law.
4. **The state of mind.** For a federal due-process claim, identify the record support for bad faith. Negligence, sloppiness, or a missing item is not enough.
5. **Prejudice.** State what the evidence could have shown and how its absence affected the defense. Do not speculate beyond the record.
6. **Remedy.** Preservation order, adverse inference, exclusion, continuance, hearing, or another verified remedy; dismissal is extraordinary.

## Rules

- A report of destruction is not proof of intentional destruction.
- A missing item is not proof that it was destroyed.
- Do not infer bad faith from the failure to preserve alone.
- Do not state a preservation duty without a verified source.
- Link the item to the custody and testing-state analysis in `evidence-matrix-admissibility`.

## Output

A lost-evidence section with the item, the event, the verified duty (or `UNVERIFIED`), the state-of-mind evidence, the prejudice, the remedy, the State's best response, and the authority-ledger status.
