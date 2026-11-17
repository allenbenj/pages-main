---
name: defense-writing-studio
description: Produces complete attorney notes, motions, memoranda, court-facing argument sections, hearing scripts, client letters, investigative summaries, and long-form case narratives from source-supported defense strategy; repairs weak writing by iterative substantive and adversarial revision following a structured eight-pass drafting and revision protocol. Use when drafting, reviewing, or revising substantive defense work product.
---
# Defense Writing Studio

## Supported reasoning

Apply `../legal-reasoning-framework/references/reasoning-foundation.md` across the existing eight passes. Argument development supplies the inference and threshold legal requirements; evidentiary revision limits absence-based claims; adversarial revision addresses the strongest material alternative; final review reconciles the conclusion, prayer and available relief. Finished prose remains developed argument, not a reasoning worksheet.

## Job
Convert analysis and proof into **complete, polished legal prose**. This is not an outline generator. A request to draft a paper, note, message, memo, letter, proposed order, defense theory, or narrative ends with a substantive, fully developed draft in the requested format. Never return a scaffold, outline, bullet-dominated skeleton, or placeholder-filled document when a full draft is requested.

Use `defense-framing` and `criminal-defense-strategy` for reasoning, `motion-brief-drafting` for filing conventions, and specialized skills for evidence and authority verification.

---

## The Eight-Pass Writing Protocol

Drafting and revision tasks follow the eight-pass authoring and revision protocol detailed in `references/eight-pass-engine.md`. The callable eight-pass orchestration runtime is implemented in `controller.writing_engine.WritingEngine`. The runtime enforces strict sequential pass execution, unkeyed SHA-256 hash chains across passes, and fail-closed crash behavior without automatic unvalidated recovery.

Key runtime architecture and boundaries:
- **Host-Authoring Boundary**: The engine orchestrates two-phase dispatch/collect handoffs via `SessionHostAdapter`. Content is authored by the host session; stage collection records transport receipt (`handoff.status = "accepted"`), which is strictly distinct from autonomous substantive approval or attorney sign-off. Completing Pass 8 yields `REVIEW_REQUIRED` or `AUTOMATED_CHECKS_PASSED_AWAITING_ATTORNEY`; neither is legal approval, filing approval, or counsel sign-off.
- **Match-Only Statuses**: Evidentiary checks record verbatim/locator matches (`verbatim_match`, `source_locator_match`) or `unknown`/`blocked` states; lexical matches are never equated with autonomous factual verification.
- **Unkeyed History & Fail-Closed Behavior**: When pass history is recorded without cryptographic HMAC keying, the unkeyed SHA-256 hash chain detects inconsistent mutation, truncation, reordering, or replay of retained evidence. It is not writer authentication or tamper-proof storage; a fully consistent rewrite of all evidence and anchors is outside this model and is not detected. Crashes and precondition failures do not attempt heuristic or silent recovery.
  - If a pass dispatch yields `pending_host_execution`, the draft is incomplete and a full-draft request is unsatisfied.
  - The host session must author the stage artifact and call `collect_pass` with the invocation id; a second dispatch is refused while work is pending.
  - On an integrity or precondition failure, there is no automatic resume path; the operator preserves the workspace and initiates a new run or manual review. Nothing may be edited directly to "repair" history.
- **Separate Gate Composition**: Output structured assessment is handled separately through `controller.bridges.writing_gate` and `controller.gates.assess_document` (outcome and per-criterion categorical verdicts; no score) rather than internal self-certification. The sidecar must be producer-authored under `WRITING_GATE_CONTRACT_v1`. If a sidecar is absent or refused, the gate is recorded as not run and remains an open item.

1. **Pass 1: Blueprint**
   Define reader, operative decision sought, controlling issue, required sections, measured tone, scope/length, available sources and proof ledger, and realistic remedy.
2. **Pass 2: Argument Development**
   For each theory, establish what the record proves (with precise source locators), what the opponent contends, what is genuinely disputed, why the dispute is material, the governing rule, element-by-element application, and the resulting conclusion or remedy.
3. **Pass 3: Full Document Production**
   Produce complete, continuous prose with logical transitions. Every substantive section is developed into complete, reasoned paragraphs. Substantive completion depends on sound legal reasoning and factual grounding, never on meeting an arbitrary word-count floor. Eliminate structural skeletons and arbitrary placeholders (`TODO`, `FIXME`, `[INSERT...]`), while permitting narrowly placed, truthful `[VERIFY: ...]` markers on unresolved factual or legal predicates.
4. **Pass 4: Evidentiary Revision**
   Cross-check every factual proposition against the source ledger. Ensure exact quotations, distinguish attributed witness statements from established historical facts, preserve witness limitations, and maintain zero invented facts or missing records. List any date, time, object, or record not found in the source ledger as `unknown` or an open issue; the pass does not certify zero invention.
5. **Pass 5: Legal Revision**
   Record each authority's status exactly as produced by the authority-verification process; a pass never assigns `reliance_approved`. Verify procedural posture, burden allocation, and materiality. Ensure no standard is repeated without immediate application. Calibrate relief strictly to governing law.
6. **Pass 6: Advocacy Revision**
   Order strongest points first. Eliminate generic throat-clearing. Use active voice and concrete verbs. Enforce calibrated force: strip unsupported rhetoric while maintaining record-grounded strength. Strictly enforce the prohibition of sentence-initial "And."
7. **Pass 7: Adversarial Revision**
   Incorporate prosecution red-team findings (e.g., V040-18/19 perspectives). Directly address the opponent's strongest contentions and plausible alternative explanations. Provide proportionate, record-supported rebuttals.
8. **Pass 8: Final Review & Packaging**
   Check document-level coherence, prayer-to-order congruence, completeness gate compliance (`controller.gates.rubric.json` for each type's required roles; outcome and per-criterion verdicts, no score), and outline-detection cleanliness (`controller.runner.detect_outline`). Route all deliverables (motions, court-facing drafts, and legal memoranda/analyses) through `corrective-playbook-gate` and `legal-quality-control`.

---

## Binding Writing Rules

1. **Preserve Well-Supported Substance:** A full rewrite must preserve all substantial, supported factual and legal content from prior drafts unless specific instructions or verified corrections require removal.
2. **No Generic Throat-Clearing:** Eliminate formulaic openings ("Comes now...", "It is well established that...", "This motion presents critical constitutional questions..."). Open immediately with the decisive legal and factual tension.
3. **Never Repeat a Standard Without Applying It:** Every cited standard or rule must be applied immediately to specific, attributed facts in the record.
4. **Explain Consequences of Contradictions:** Do not merely enumerate or list conflicting witness accounts; explain their legal and evidentiary significance for elements, burdens, and transaction unity.
5. **Preserve Voice and Detail in Revisions:** Maintain the author's intended voice, strategic emphasis, and factual granularity when refining or repairing drafts.
6. **Caution and Force Are Fully Compatible:** Strip unverified emotional assertions, bad-faith accusations, or speculative conclusions; keep and emphasize indisputable record facts and their inescapable legal consequences.
7. **Prohibition of Sentence-Initial "And":** Never begin a sentence with the conjunction "And." Use substantive transitional phrases ("Moreover," "In addition," "Furthermore") or restructure sentences to preserve judicial gravitas.
8. **Full-Draft Enforcement:** Output must be actionable, usable prose. Outline detection (`detect_outline`) must report zero defects. Placeholders, headings-only sections, or bullet checklists in lieu of argument are strictly prohibited, while narrow, truthful `[VERIFY: ...]` markers are permitted on unsupported passages to prevent inventing facts.

---

## Genre-Specific Output Contracts

- **Attorney Note / Memorandum:** Formal memorandum to counsel containing executive recommendation, source-specific factual basis, legal implications, analysis of evidentiary conflicts, anticipated counterarguments, and concrete next litigation/investigation steps. Not a task checklist.
- **Court Motion & Brief:** Caption, procedural posture, factual background, governing standard, developed legal argument with element-by-element application, opposing contention and rebuttal, specific prayer for relief, operational proposed order matching the prayer, and service block.
- **Narrative / Statement:** Objective, chronological account with clear attribution, narrative continuity, fair treatment of contrary evidence, and zero invented mental states or motivations.
- **Proposed Order:** Formal operational order with caption, findings of fact/law where appropriate, and clear, enforceable decretal paragraphs matching the motion's prayer.

---

## Delivery and Routing

Drafted deliverables are checked through:
1. `controller.writing_engine.WritingEngine` — callable runtime enforcing pass ordering, version diffs, and fail-closed integrity. Completing Pass 8 yields `REVIEW_REQUIRED` or `AUTOMATED_CHECKS_PASSED_AWAITING_ATTORNEY`; neither is legal approval or filing release.
2. `controller.runner.detect_outline(text, full_draft_requested=True)` — confirming no outline or scaffold defects.
3. `controller.gates.assess_document` (via producer-authored structured sidecar adaptation in `controller.bridges.writing_gate`) — assessing structural completeness against `controller/gates/rubric.json` (categorical verdicts; never scored). If sidecar is absent or refused, record the gate as not run and maintain the open item. Gate outcomes are structural only and never approval.
4. Mandatory gate delivery routing: `corrective-playbook-gate` -> `legal-quality-control` before final counsel review.
