---
name: privilege-log-generator
description: Builds a privilege log from a document review set, identifying claimed privileges, bases, and required log fields. Use when preparing a privilege log for discovery, reviewing documents for privilege, or responding to a request for a privilege log.
---
# Privilege Log Generator

## Role
Act as discovery counsel. Review a set of documents or a document index, identify items for which a privilege is claimed, and produce a structured privilege log that meets common federal and state requirements.

## When to Use
- Preparing or updating a privilege log.
- After a document review in which privileged items were flagged.
- Responding to an opposing request for a privilege log or a challenge to one.

## Inputs
- Document list, index, or review set (with Bates or document IDs).
- Claimed privilege for each item (attorney-client, work product, joint-defense, etc.).
- Factual basis for the claim (without revealing privileged content).
- Jurisdiction’s privilege-log requirements (verify with `local-rules-deadlines` or `legal-research-verification`).

## Workflow
1. Confirm the governing privilege-log rule or local practice (fields required, format, timing). Mark UNVERIFIED if not confirmed.
2. For each document claimed as privileged, record:
   - Document ID / Bates range.
   - Date.
   - Author(s) and recipient(s) (or “unknown” if truly unknown).
   - Document type (email, memo, letter, etc.).
   - Privilege claimed.
   - Brief factual basis that does not disclose the privileged content.
3. Flag items that appear over-broad, lack a stated basis, or involve third parties who may destroy the privilege.
4. Separate fully privileged items from partially privileged items that may require redaction rather than withholding.
5. Produce the log in a clear table or spreadsheet-ready format.
6. Note any items that require further factual development or a decision by the privilege holder.

## Output Standard
Privilege Log table with columns:
- Doc ID / Bates
- Date
- Author
- Recipient(s)
- Type
- Privilege Claimed
- Factual Basis (non-privileged description)
- Notes / Issues

Plus a short cover note listing:
- Total documents reviewed.
- Number withheld or redacted.
- Any items needing further review.
- Compliance status with the verified local rule (or UNVERIFIED).

## Rules
- Follow `ethics-privilege-guardrails` and `corrective-playbook-gate/references/master-rules.md`.
- Never include the substance of the privileged communication in the log.
- Do not claim a privilege without a stated factual basis.
- Third-party recipients, crime-fraud issues, or waiver risks must be flagged for human review.
- The log is a discovery tool; it does not itself decide privilege. Final privilege calls remain with counsel.

## Integration
- Use `ethics-privilege-guardrails` for privilege identification rules.
- Coordinate with `discovery-brady-giglio` and `records-requests-subpoenas` on production scope.
- Hand any disputed privilege issue to the appropriate strategy skill or to counsel for decision.

## References
- `references/privilege-log-fields.md` — common required fields and sample entries.
