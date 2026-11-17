# Statutory discovery workup (North Carolina)

Keep this workup separate from *Brady*, *Giglio*, and *Napue*. A statutory violation does not require a constitutional materiality finding, and a constitutional claim does not depend on a statutory request.

## Candidate authorities

- `NC-GS-15A-903` — State disclosure. Status in the kit ledger: `UNVERIFIED`. Verify the current text, subsections, timing, exceptions, and any expert-report language.
- `NC-GS-15A-905` — reciprocal defense disclosure. Status: `UNVERIFIED`. Verify the trigger and exceptions; do not collapse it with the State's duty.

Run the ledger gate before stating either rule:

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id NC-GS-15A-903
py -3.14 -B <kit>/scripts/authority_ledger.py require --id NC-GS-15A-905
```

An `UNVERIFIED` result means the workup must say the rule is unverified and must not present it as controlling.

## Predicate

For each item or category:

1. **What the statute requires.** Quote the verified text and identify the subsection. If the text is not verified, state the candidate proposition and the exact source to check.
2. **When it was required.** Request date, response date, trial date, and any continuing duty.
3. **What was requested.** The request reference and the specific category.
4. **What was produced.** The Bates range or path, and what remains missing.
5. **What was not produced.** The specific category, not a general complaint.
6. **The statutory consequence.** Compel, continue, exclude, sanction, or another remedy the verified text or rule provides.

## Missing predicates

List them explicitly:

- the item's existence is unknown;
- the item was never requested;
- the request was narrower than the claimed category;
- the production is partial but the missing category is unidentified;
- the statute's timing or exception has not been checked;
- the remedy is not provided by the verified text.

## State's best response

- The request exceeded the statutory category.
- The item does not exist or is not in the State's possession.
- The production was complete for the category requested.
- The timing was permitted.
- The defense did not preserve the issue or seek a timely remedy.
- The requested sanction is not available on this record.

## Output

A statutory-discovery section with the verified rule (or `UNVERIFIED`), the request-and-production chronology, the missing category, the prejudice to preparation, the statutory remedy, and the State's best response.
