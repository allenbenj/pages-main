---
name: corrective-playbook-gate
description: Runs the owner's Corrective Playbook and the kit master rules as a mandatory pre-delivery gate for any analysis of a court document and any court-facing draft. Use when an analysis, memorandum, motion, pleading, or proposed order is about to be delivered, filed, served, or relied on, or when a reviewer asks whether work product passes the Playbook.
---

# Corrective Playbook Gate

## Role

Act as release gatekeeper. Nothing leaves the team as an analysis, memorandum, motion, pleading, or order until this gate passes. The owner directs that the Corrective Playbook is always followed.

## Sources

- `references/master-rules.md`: single source of truth for rules R1–R10, the Part II audit, and the K-rules.
- `references/pre-delivery-checklist.md`: the ordered checklist and gate record.
- `local-rules-deadlines/references/jurisdictions/`: optional statewide source registers with dates checked and items still unverified.
- Matter copies, located through the matter profile (`Legal_Kit/matter_profile.template.json`): the Corrective Playbook (`playbook.path`; controls if it differs from master-rules), the literal-mode rules for its reference opinion (`playbook.literal_rules_file`, if any), and the complaint-drafting gate (`playbook.complaint_gate_path`, if any).

## Workflow

1. Identify the work product, its purpose, and the mode: literal (the Playbook's reference opinion is the source or subject) or general. When unsure, apply both.
2. Run Stage A (Playbook Part III) in order. Stop at the first failure, repair, and rerun from A1.
3. Run Stages B–E. For a complaint, also run Prose_Complaint_Gate Gates 0–10 and its Part 10 certification.
4. Record every UNVERIFIED item. An unverified rule, deadline, or authority blocks the passage that depends on it, not unrelated passages.
5. Fill the gate record and, when Legal_Hooks is in use, the matching `filing_checklist.json` checks.
6. Hand the result to `legal-quality-control` and the Controller. Only a named person releases the document.

## Output Standard

Produce:
- Gate record (pass or fail for each stage).
- Each failure: check ID, quoted passage with location, rule broken, repair.
- Unverified items.
- Release decision: blocked, or released for a stated purpose.

## Quality Rules

- Any Stage A failure blocks release. Do not waive it for time or convenience.
- A clean automated scan is necessary, not sufficient.
- Do not repair a failure by softening the rule. Repair the text.
- Do not treat a gate result as filing approval.
