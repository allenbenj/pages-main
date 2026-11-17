---
name: "case-analysis-repository"
description: "Builds a topic-by-topic expert analysis repository for a whole matter, with global indexes, per-topic crosswalks, and open-item tracking. Use when the user asks for a full-case review, a case analysis folder system, a master issue tree with topic fol"
---

# case-analysis-repository

Read [the complete case-analysis-repository skill](../skills/case-analysis-repository/SKILL.md) and the kit's [operating instructions](../AGENTS.md). Also apply the user's matter-workspace `AGENTS.md` and the selected `LEGAL_MATTER_PROFILE` before matter work. These instructions are intended to be installed **together** with their sibling `skills/`, `integrations/`, and `scripts/` directories. Do not use an obsolete `Legal_Team_Kit_v0.2.1` path.

Keep record facts, attributed statements, allegations, inferences and legal conclusions distinct, with source IDs and pinpoints. Follow the Corrective Playbook, matter instructions, kit master rules and applicable role instructions in that order. Every analysis, memorandum, and court-facing draft passes `corrective-playbook-gate`, then `legal-quality-control`, before delivery. An automated test is not attorney review.

Follow matter-profile configured reference knowledge roots and retrieval order when present. Do not assume a fixed Windows path exists, do not silently scan protected case evidence directories, and do not treat secondary sources as current controlling law without verifying primary authority.

## Research coverage and delivery check

Read the configured `knowledge_roots.guide` before planning research. Account for all authority and work-reference locations in its map, including material outside curated knowledge tiers; nested tiers are subsets. Use the matter-configured retrieval order and approved launchers, preserve source identity and original-source pinpoints, honor retired services, and report unavailable or unreviewed scope. Apply master rule K14 and `legal-research-verification` to secondary-source currency and primary-authority reliance. Never cite background-only tiers. The run report must identify actual searches, original sources reviewed, coverage gaps, and both mandatory gate results. Before delivering every analysis, memorandum, or court-facing draft, pass `corrective-playbook-gate`, then `legal-quality-control`.
