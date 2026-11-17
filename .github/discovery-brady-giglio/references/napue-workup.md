# Napue workup

Use this workup only for an alleged false statement by a government witness that the prosecution knew about and presented or failed to correct.

## Candidate authority

- `US-NAPUE` — *Napue v. Illinois*, 360 U.S. 264 (1959). Status in the kit ledger: `UNVERIFIED`. Verify the opinion, the knowledge requirement, and the materiality standard.

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id US-NAPUE
```

## Predicate

1. **The statement.** Quote the testimony exactly, with the transcript page and line. Do not paraphrase the alleged falsity.
2. **Falsity.** Identify the contrary record, document, or testimony that shows the statement was false. Distinguish a lie from a mistake, an estimate, an inconsistency, or a lawyer's argument.
3. **Knowledge.** Identify the record support for the prosecution's knowledge at the time of the testimony. Do not infer knowledge from the fact that the statement was false.
4. **Materiality.** Explain how the false statement could have affected the verdict. State the concrete effect on the jury's assessment.
5. **Duty to correct.** Identify when the prosecution learned of the falsity and what it did or failed to do.

## Distinctions

- A prior inconsistent statement is impeachment, not necessarily *Napue*.
- A witness's mistake or faulty memory is not *Napue* without knowledge of falsity.
- A *Giglio* nondisclosure is not *Napue* unless the witness also testified falsely and the prosecution knew.
- An argument by counsel is not testimony.

## State's best response

- The statement was true or was a reasonable estimate.
- The prosecution did not know it was false.
- The defense had the contrary information.
- The statement was not material.
- The issue was not preserved or was cured.

## Output

A *Napue* section with the exact testimony, the falsity proof, the knowledge proof, the materiality analysis, the duty-to-correct chronology, the remedy, the State's best response, and the authority-ledger status.
