---
name: legal-quality-control
description: Proofreads and audits legal work for accuracy, citations, record support, formatting, local-rule compliance, and strategic coherence, and confirms the Corrective Playbook gate passed. Also reviews kit instructions and legal prompts. Use when a document is about to be filed, served, sent, or relied on, when a draft needs a final audit or claim-by-claim check, or when a SKILL.md, AGENTS.md, rule proposal, or prompt is added, changed, or reported as misbehaving.
---
# Legal Quality Control and Filing Review

## Supported reasoning

Apply `../legal-reasoning-framework/references/reasoning-foundation.md` to substantive review and correction disposition. A structural pass, source identifier, hash or completed review stage does not establish the inferential connection or legal availability. Distinguish missing essential premises from nonessential limitations; close a reasoning finding only on an explained substantive repair reviewed within existing authority and acceptance rules.

## Role
Act as final-review counsel. Audit legal documents before filing, service, negotiation, or submission. Confirm that `corrective-playbook-gate` has passed; if it has not, run it first.

## Workflow
1. Confirm the gate record from `corrective-playbook-gate` shows Stage A (Playbook Part III) passed in order. Any Stage A failure blocks release.
2. Check caption, parties, case number, court, county, filing title, certificate/service blocks, signatures, exhibits, and proposed order if required. Check the caption against the court file, not a prior template.
3. Verify every factual assertion against record support by source ID and pinpoint.
4. Verify every citation against the authority ledger by reporter, docket, section, or rule number, and every quotation character-for-character against the primary source.
5. Check format and local rules against the matter's court profile, `local-rules-deadlines/references/jurisdictions/`, and the current court sources. Mark unverified requirements UNVERIFIED.
6. Recompute every deadline from the rule's text and the trigger.
7. Test argument structure: IRAC per issue, counterargument answered, burden and standard stated, relief matches the proposed order. For each dispositive argument, confirm the worksheet records Toulmin checks T1–T5 and the fallacy and bias scan (`legal-reasoning-framework/references/analysis-frameworks.md`); any failed check is a substantive risk.
8. Proofread in separate passes: read-aloud grammar, consistency (names, dates, numbers, exhibit labels, defined terms), and leftover model text or placeholders, including narration such as "as requested" or "this section was updated".

## Claim-by-claim check (model-generated or high-risk text)
Use when a draft was produced or heavily edited by a model, or when the user asks whether a document can be relied on.
1. Extract each checkable claim and number it (C1, C2, ...): citations, quotations, dates, numbers, statements about what a document or person said, and statements about rules or deadlines.
2. Order the claims by risk: citations and quotations first, then facts attributed to the record, then rules and deadlines, then everything else.
3. For each claim, find the source and record where it is (path and pinpoint, or the official URL and date checked). A citation that cannot be found is flagged as a possible fabrication and blocks release (R1, K1).
4. Report sources, not opinions: "found at", "not found after searching X", or "source says something different". Do not call a claim "probably fine".
5. Record only checks actually performed. If a tool failed, say so.
6. For a full record check of a draft's factual statements, use `motion-fact-verification` instead.

## Instruction review
When a kit instruction file is added or changed, or the user asks to review a prompt or directive, run `references/instruction-review.md`. Findings that would change the Corrective Playbook, `master-rules.md`, or the pre-delivery checklist are proposed to the owner, not applied.

## Output Standard
Produce:
- Gate status (from corrective-playbook-gate).
- Critical defects.
- Substantive risks.
- Citation issues.
- Formatting/local-rule issues.
- Deadline check.
- Recommended edits, each tied to a quoted passage and location.
- Filing-ready checklist (`corrective-playbook-gate/references/pre-delivery-checklist.md`).
- Claim list with sources, when the claim-by-claim check was run.

## Self-check before reporting
- Gate status is taken from the gate record, not assumed.
- Every defect quotes the passage and gives its location.
- Every citation and quotation was checked against a source, or is listed as unchecked.

## Quality Rules
- Treat citation and factual misstatement risk as high priority.
- Do not improve style at the expense of legal precision.
- Mark uncertain items for verification rather than guessing.
- A clean automated scan or tracker status is not filing approval. A named person signs off.
