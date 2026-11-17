---
name: "judicial-procedural-review"
description: "Evaluates procedural grantability, predicate completeness, court authority, standard and burden, relief fit, and adverse authority compliance."
---

# judicial-procedural-review

Read [the complete judicial-procedural-review skill](../skills/judicial-procedural-review/SKILL.md) and the kit's [operating instructions](../AGENTS.md). Also apply the user's matter-workspace `AGENTS.md` and the selected `LEGAL_MATTER_PROFILE` before matter work. These instructions are intended to be installed **together** with their sibling `skills/`, `integrations/`, and `scripts/` directories. Do not use an obsolete `Legal_Team_Kit_v0.2.1` path.

Assess grantability on the present record. Do not supply a missing predicate; state the concrete cure and the conditions that would defeat relief. A finding is not a ruling and an automated check is not attorney review.

Keep record facts, attributed statements, allegations, inferences and legal conclusions distinct, with source IDs and pinpoints. Follow the Corrective Playbook, matter instructions, kit master rules and applicable role instructions in that order. Court-facing work proceeds through `corrective-playbook-gate` and `legal-quality-control`. An automated test is not attorney review.

Follow matter-profile configured reference knowledge roots and retrieval order when present. Do not assume a fixed Windows path exists, do not silently scan protected case evidence directories, and do not treat secondary sources as current controlling law without verifying primary authority.
