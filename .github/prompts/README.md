# Prompt Library

This is the structured prompt library for the USAA property-loss workflow.

## Folder Map

- 00_Master
  - Master_Claim_Intake.md
  - Master_Guardrails.md
  - Prompt_Router.md
- 01_Estimate_Audit
  - Carrier_Estimate_Audit.md
  - Line_Item_Explainer.md
  - RCV_ACV_Calculator.md
  - Material_Labor_Split.md
- 02_Scope_Audit
  - Electrical_Scope_Audit.md
  - Flooring_Scope_Audit.md
  - What_Is_Missing.md
  - Estimate_vs_Contractor_Comparison.md
- 03_Contents
  - Contents_Invoice.md
  - Contents_Category_Classifier.md
  - Contents_Evidence_Index.md
- 04_Documents
  - Supplement_Letter.md
  - Adjuster_Email.md
  - Contractor_Scope.md
  - Draw_Schedule.md
- 05_QA
  - Anti_Double_Counting_QA.md
  - Claim_Category_QA.md
  - Final_Submission_QA.md

## Recommended Use Order

1. Start with 00_Master/Master_Claim_Intake.md
2. Apply 00_Master/Master_Guardrails.md
3. Use 00_Master/Prompt_Router.md to select specialist prompts
4. Run specialist prompt from 01 through 04
5. Run final checks in 05_QA
