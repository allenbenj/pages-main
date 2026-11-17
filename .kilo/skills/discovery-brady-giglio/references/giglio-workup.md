# Giglio workup

Use this workup for impeachment evidence about a government witness's benefits, arrangements, or credibility incentives. It is not a general credibility attack and it is not a *Napue* false-testimony claim.

## Candidate authority

- `US-GIGLIO` — *Giglio v. United States*, 405 U.S. 150 (1972). Status in the kit ledger: `UNVERIFIED`. Verify the opinion and its relationship to *Brady*.

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id US-GIGLIO
```

## Categories to check

- promises of leniency, reduced charges, or sentencing benefits;
- pending charges, probation, or parole status;
- cooperation agreements and expectations;
- payments, expenses, or other benefits;
- immigration consequences or benefits;
- pending investigations;
- any other arrangement that could motivate the witness to favor the State.

## Predicate

1. **The arrangement.** Identify the actual promise, benefit, or expectation from a record pin. Do not infer it from the witness's hope.
2. **Suppression.** Show that the prosecution knew or possessed the information and did not disclose it, disclosed it late, or disclosed it in a misleading form.
3. **Materiality.** Explain how the impeachment value bears on the witness's credibility and the verdict. Identify what the defense could have done with timely disclosure.
4. **Timing and remedy.** Disclosure, continuance, recall, new trial, or another verified remedy.

## Distinctions

- A witness's general inconsistency is not *Giglio*.
- A witness's hope of leniency, without an actual arrangement, is not automatically *Giglio*.
- A *Napue* claim requires false testimony and knowledge; a *Giglio* claim requires suppressed impeachment evidence. Do not merge them.
- A benefits disclosure that was made in time may still support cross-examination; it is not necessarily a suppression claim.

## State's best response

- The information was disclosed.
- There was no agreement or promise.
- The information was not material.
- The defense possessed the information.
- The claim is untimely or unpreserved.

## Output

A *Giglio* section with the arrangement, the source pin, the suppression evidence, the materiality analysis, the remedy, the State's best response, and the authority-ledger status.
