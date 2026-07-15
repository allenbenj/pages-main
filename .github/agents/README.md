# Agents Index

This directory contains standalone specialist agents for the Insurance Reconstruction AI Agent Kit. Skills are reusable procedures; agents are role-based workers that combine skills, apply judgment, and hand off work to other agents.

The primary entry point for the residential property loss workflow is the [Residential Property Loss Master Orchestrator](residential-property-loss.agent.md). Use specialist agents below for delegated work, then recombine their outputs through the orchestrator.

| Agent | ID | Primary Use |
|---|---|---|
| Residential Property Loss Master Orchestrator | `residential-property-loss.agent.md` | Leads the full claim workflow, delegates to specialists, reconciles evidence, and assembles final deliverables. |
| Claim Director / Orchestrator Agent | `orchestrator_claim_director` | Routes work, selects specialist agents, controls assumptions, prevents double counting, and assembles final deliverables. |
| Estimate Auditor Agent | `estimate_auditor` | Extracts and audits carrier/Xactimate-style estimates. |
| Line Item Explainer Agent | `line_item_explainer` | Explains individual estimate line items in plain English and identifies what is included or excluded. |
| Calculation Forensics Agent | `calculation_forensics` | Verifies estimate arithmetic, splits material/labor approximations, and reconciles RCV/ACV/depreciation. |
| Electrical Scope Auditor Agent | `electrical_scope_auditor` | Audits electrical fire-rebuild scope for code, safety, completeness, and claim adequacy. |
| Flooring Scope Auditor Agent | `flooring_scope_auditor` | Audits flooring lines for scope, matching, continuity, underlayment, demo, prep, trim, and ACV/RCV issues. |
| Contents Claim Specialist Agent | `contents_claim_specialist` | Builds and audits personal property/contents scopes, invoices, inventories, sorting, packout, disposal, and documentation. |
| Mitigation & Restoration Scope Agent | `mitigation_restoration_agent` | Creates and audits water/fire/smoke mitigation scopes for clean, dry, repair-ready turnover. |
| Reconstruction Scope Builder Agent | `reconstruction_scope_builder` | Creates construction plans/specs packages and room-by-room rebuild scopes. |
| Supplement Writer Agent | `supplement_writer` | Drafts carrier-facing supplement letters and scope dispute narratives. |
| Invoice & Proposal Generator Agent | `invoice_proposal_generator` | Creates clean invoices, proposals, estimates, and billing packages. |
| Spreadsheet Builder Agent | `spreadsheet_builder` | Builds structured Excel workbooks for claim analysis, tracking, and calculation. |
| Evidence Organizer Agent | `evidence_organizer` | Indexes photos, invoices, receipts, logs, measurements, and claim communications. |
| Draw Schedule, Lien Waiver & Closeout Agent | `payment_control_agent` | Controls payment timing, draw documentation, lien waivers, retainage, and closeout packages. |
| Code, Permit & Upgrade Analyzer Agent | `code_permit_upgrade_agent` | Identifies code-triggered, permit-required, inspection-required, and ordinance/law issues. |
| QA, Consistency & Claim-Risk Agent | `qa_compliance_agent` | Reviews all outputs for math, category separation, factual support, claim-risk language, and consistency. |
| Claim Project Manager Agent | `claim_project_manager` | Maintains task lists, deadlines, document status, evidence gaps, and next actions across the claim project. |

## Recommended Default Workflow

1. Residential Property Loss Master Orchestrator
2. Estimate Auditor Agent
3. Specialist trade/category agent: Electrical, Flooring, Contents, Mitigation, Reconstruction, or Code/Permit
4. Calculation Forensics Agent where math or RCV/ACV splits are needed
5. Spreadsheet Builder Agent if data must be structured
6. Supplement Writer or Invoice Generator depending on deliverable
7. Evidence Organizer Agent for exhibits and support
8. QA, Consistency & Claim-Risk Agent before release
9. Claim Project Manager Agent to track next actions

## Prompt Entry Points

Use these structured prompts when you want focused tasks instead of a full agent-led workflow.

| Prompt | File | Primary Use |
|---|---|---|
| Master Claim Intake | [Master_Claim_Intake.md](../prompts/00_Master/Master_Claim_Intake.md) | Normalize inputs and identify missing information |
| Prompt Router | [Prompt_Router.md](../prompts/00_Master/Prompt_Router.md) | Route requests to the right specialist workflow |
| Carrier Estimate Audit | [Carrier_Estimate_Audit.md](../prompts/01_Estimate_Audit/Carrier_Estimate_Audit.md) | Estimate audit and omission detection |
| What Is Missing | [What_Is_Missing.md](../prompts/02_Scope_Audit/What_Is_Missing.md) | Fast missing-item issue spotting |
| Supplement Letter | [Supplement_Letter.md](../prompts/04_Documents/Supplement_Letter.md) | Carrier-facing supplement drafting |
| Adjuster Email | [Adjuster_Email.md](../prompts/04_Documents/Adjuster_Email.md) | Professional adjuster communication |
| Final Submission QA | [Final_Submission_QA.md](../prompts/05_QA/Final_Submission_QA.md) | Final quality and risk screening |
