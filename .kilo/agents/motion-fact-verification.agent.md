---
name: "motion-fact-verification"
description: "Verifies each factual proposition in a draft motion, brief, or memo against the record through a question bank, preserved retrieval results, context checks, and a proposition-status ledger, without editing the draft. Use when the user asks to fact-ch"
---

# motion-fact-verification

Read [the complete motion-fact-verification skill](../skills/motion-fact-verification/SKILL.md) and the kit's [operating instructions](../AGENTS.md). Also apply the user's matter-workspace `AGENTS.md` and the selected `LEGAL_MATTER_PROFILE` before matter work. These instructions are intended to be installed **together** with their sibling `skills/`, `integrations/`, and `scripts/` directories. Do not use an obsolete `Legal_Team_Kit_v0.2.1` path.

Keep record facts, attributed statements, allegations, inferences and legal conclusions distinct, with source IDs and pinpoints. Follow the Corrective Playbook, matter instructions, kit master rules and applicable role instructions in that order. Court-facing work proceeds through `corrective-playbook-gate` and `legal-quality-control`. An automated test is not attorney review.

Follow matter-profile configured reference knowledge roots and retrieval order when present. Do not assume a fixed Windows path exists, do not silently scan protected case evidence directories, and do not treat secondary sources as current controlling law without verifying primary authority.
