---
name: redaction
description: "Builds a source-bound redaction plan and review copy for counsel. Use when preparing discovery production or filing copies with proposed material withheld."
---
# Redaction

## Purpose and limits

Prepare proposed redactions for a specified production or filing. A marked review copy is not a sanitized production copy. This skill supplies instructions and review artifacts; it does not itself run a PDF sanitization tool, grant withholding approval, file, or transmit documents. Original source records remain unchanged.

Apply the matter instructions and `../corrective-playbook-gate/references/master-rules.md` (K6, K7 and K11). Use `../ethics-privilege-guardrails/SKILL.md` for privilege and confidentiality questions and `../privilege-log-generator/SKILL.md` when a privilege log is required. These skills supply different outputs: this skill maps proposed redactions to exact document regions.

## Inputs

Obtain the production or filing purpose, intended recipients, jurisdiction, deadline, confidentiality restrictions, and any relevant order or counsel direction. Register each selected source by document ID, original path, SHA-256, version, page or other stable locator, and record/work-product/unverified status. Read the selected content; a path or search hit does not establish its contents. Follow the matter retrieval policy, including mandatory AnyTXT readiness and coverage where applicable.

## Workflow

1. Record the intended disclosure scope and governing requirements. Use `../legal-research-verification/SKILL.md` and `../local-rules-deadlines/SKILL.md` for current primary authority and court requirements. Mark missing or unverified bases UNVERIFIED; do not infer permission to withhold.
2. Read each registered source and identify proposed regions by page and bounding box, paragraph, cell, or timestamp as appropriate. If extraction or rendering is unreadable, record the affected scope as NOT_CHECKED and request an accessible derivative. Preserve the original.
3. Create one plan row per proposed redaction using the fields below. Separate privacy, privilege, protective-order, and other proposed bases. Record why a narrower redaction is insufficient when broader withholding is proposed. Refer disputed scope or unclear bases to counsel.
4. Record adverse information and disclosure duties that could defeat the proposed withholding. When none is identified, state the actual scope reviewed and that result. An empty list alone does not establish that review occurred. Keep privileged excerpts out of the shareable plan; retain necessary originals in the restricted source store.
5. Prepare a separately named marked review copy only when the available tool can do so without changing the original. Label annotations PROPOSED REDACTIONS — NOT SANITIZED. If no suitable tool is available, deliver the plan and record the marked copy as NOT_CREATED; do not claim a file was produced.
6. Obtain a named review decision for each proposed region. A changed source hash makes the prior plan and decisions STALE for that source. Re-map and review changed regions before reuse; preserve the earlier plan and decisions.
7. If an approved derivative is actually sanitized with a suitable tool, record the tool and operation, derivative path and SHA-256, and checks actually performed. Check rendered pages and recoverable text, OCR layers, comments, metadata, attachments, and prior revisions as applicable to the format. A black rectangle or a successful text search alone does not establish removal. Unavailable checks remain NOT_CHECKED; this planning skill never certifies sanitization from a model opinion.
8. Send the plan and any explanatory court-facing text through `../corrective-playbook-gate/SKILL.md`, then `../legal-quality-control/SKILL.md`. Record remaining scope and review needs. Named release, filing and transmission authorization remain separate from preparation.

## Outputs

- A restricted working plan with: redaction_id, document_id, source_path, source_sha256, version, locator/region, proposed_basis, verified_authority_or_order_locator, basis_status, scope_rationale, adverse_information, proposed_action, reviewer, review_decision, decision_date, derivative_path, derivative_sha256, sanitization_check_results, and unchecked_scope. Missing values remain explicit, never invented. Review decisions are PROPOSED, APPROVED, REJECTED or STALE; they do not confer filing approval.
- A non-sensitive summary for counsel with actual reviewed/proposed/approved/unchecked counts and their scope. Omit withheld content and identifiers inappropriate for the summary's audience.
- A marked review copy, if actually created, separately identified from any sanitized derivative. Every output identifies its source version and records what was not checked.

## Self-check

Confirm that every proposed region resolves to the registered source version, every asserted basis has a verified source or UNVERIFIED label, and every approval has a named decision. Confirm that originals are unchanged, missing artifacts are not claimed, sensitive text does not leak into a shareable log, and an annotated copy is never described as sanitized. No score, probability, release approval or `filing_approval` is supplied by this skill.
