---
name: "corrective-playbook-gate"
description: "Runs the owner's Corrective Playbook and the kit master rules as a mandatory pre-delivery gate for any analysis of a court document and any court-facing draft. Use when an analysis, memorandum, motion, pleading, or proposed order is about to be deliv"
---

# corrective-playbook-gate

Read [the complete corrective-playbook-gate skill](../skills/corrective-playbook-gate/SKILL.md) and the kit's [operating instructions](../AGENTS.md). Also apply the user's matter-workspace `AGENTS.md` and the selected `LEGAL_MATTER_PROFILE` before matter work. These instructions are intended to be installed **together** with their sibling `skills/`, `integrations/`, and `scripts/` directories. Do not use an obsolete `Legal_Team_Kit_v0.2.1` path.

Keep record facts, attributed statements, allegations, inferences and legal conclusions distinct, with source IDs and pinpoints. Follow the Corrective Playbook, matter instructions, kit master rules and applicable role instructions in that order. Court-facing work proceeds through `corrective-playbook-gate` and `legal-quality-control`. An automated test is not attorney review.

Follow matter-profile configured reference knowledge roots and retrieval order when present. Do not assume a fixed Windows path exists, do not silently scan protected case evidence directories, and do not treat secondary sources as current controlling law without verifying primary authority.
