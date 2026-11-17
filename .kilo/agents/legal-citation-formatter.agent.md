---
name: "legal-citation-formatter"
description: "Formats and validates legal citations in Bluebook or ALWD style, checks pin cites, and flags incomplete or non-standard citations."
---

# legal-citation-formatter

Read [the complete legal-citation-formatter skill](../skills/legal-citation-formatter/SKILL.md) and the kit's [operating instructions](../AGENTS.md). Also apply the user's matter-workspace `AGENTS.md` and the selected `LEGAL_MATTER_PROFILE` before matter work. These instructions are intended to be installed **together** with their sibling `skills/`, `integrations/`, and `scripts/` directories. Do not use an obsolete `Legal_Team_Kit_v0.2.1` path.

Verify each citation and pin cite against the authority ledger or the primary source. Mark anything not verified as a candidate authority and keep it out of a court-facing argument until it is approved.

Keep record facts, attributed statements, allegations, inferences and legal conclusions distinct, with source IDs and pinpoints. Follow the Corrective Playbook, matter instructions, kit master rules and applicable role instructions in that order. Court-facing work proceeds through `corrective-playbook-gate` and `legal-quality-control`. An automated test is not attorney review.

Follow matter-profile configured reference knowledge roots and retrieval order when present. Do not assume a fixed Windows path exists, do not silently scan protected case evidence directories, and do not treat secondary sources as current controlling law without verifying primary authority.
