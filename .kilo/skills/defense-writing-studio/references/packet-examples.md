# Draft packet specifications and non-case examples

## Working packet directory

```
output/
  defense_argument.md          # coherent complete argument prose
  attorney_note.md             # decision memo with specific next asks
  proof_map.json               # source-located material propositions
  authority_status.json        # only current primary law may be marked approved
  review_status.json           # performed checks and unresolved blocking issues
```

Use `scripts/defense_workbench.py init` to scaffold the first four ledgers without modifying case evidence. The workbench never writes a substantive argument for the model; **the agent must write it** based on reviewed source content.

## Safe working example (fabricated scenario, not real evidence)
"The interview summary places the witness at the entrance before the officer reached the scene (Interview Summary at 4). The dispatch log, however, records the officer's arrival eleven minutes earlier (Dispatch Log at 2). The records therefore need to be reconciled before the summary can be used to establish the order of events. The State may contend that the clocks were not synchronized. A synchronized audit log, original dispatch recording, and testimony about clock settings would distinguish that explanation from an inaccurate summary. Counsel should request those materials and seek a limited evidentiary hearing if timing remains material to the contested identification."

The example illustrates structure only: it creates **no fact** about the user's case and does not declare a constitutional remedy as automatic.
