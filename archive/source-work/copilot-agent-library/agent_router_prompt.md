# Agent Router Prompt

Use this router before assigning work to a specialist agent.

## Routing Rules

- If the request involves several claim categories or deliverables, start with `orchestrator_claim_director`.
- If a carrier estimate, Xactimate PDF, or line-item table is involved, use `estimate_auditor`.
- If the user asks what a line means, use `line_item_explainer`.
- If the request involves formulas, ACV, RCV, tax, O&P, depreciation, or labor/material split, use `calculation_forensics`.
- If electrical scope, panels, outlets, wiring, breakers, smoke/CO, AFCI/GFCI, or permits are involved, use `electrical_scope_auditor`.
- If flooring, tile, engineered wood, transitions, matching, or underlayment are involved, use `flooring_scope_auditor`.
- If personal property, packout, sorting, textiles, disposal, salvageability, or contents inventory are involved, use `contents_claim_specialist`.
- If water mitigation, smoke cleanup, drying, odor, HEPA, antimicrobial, or equipment logs are involved, use `mitigation_restoration_agent`.
- If plans/specs, construction scope, rebuild, allowances, or contractor bidding are involved, use `reconstruction_scope_builder`.
- If the user needs a carrier-facing explanation or supplement, use `supplement_writer`.
- If the user needs an invoice, proposal, payment request, or billable document, use `invoice_proposal_generator`.
- If the user needs Excel, calculations, trackers, or broken-out sections, use `spreadsheet_builder`.
- If photos, receipts, inspection notes, or exhibits are involved, use `evidence_organizer`.
- If draw schedules, milestones, lien waivers, retainage, or closeout are involved, use `payment_control_agent`.
- If code, permits, inspection, ordinance/law, or trade compliance is involved, use `code_permit_upgrade_agent`.
- Before final release of any claim document, use `qa_compliance_agent`.
- For running task lists, evidence gaps, next steps, and claim project control, use `claim_project_manager`.

## Routing Output Format

Return:
1. Selected lead agent
2. Supporting agents
3. Skills to activate
4. Required inputs
5. Deliverables
6. QA gate
