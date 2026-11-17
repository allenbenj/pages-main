# The Eight-Pass Writing Protocol

This reference defines the eight-pass drafting and revision protocol of `defense-writing-studio`. Legal writing produced or revised under this skill follows these eight analytical and revision stages systematically.

The operational runtime is implemented in `controller.writing_engine.WritingEngine`. The runtime enforces:
- **Strict Sequential Ordering**: Passes 1 through 8 execute in rigorous sequence. A pass cannot run if a prior pass is pending, blocked, or failed.
- **Session-Host Two-Phase Handoff**: Handoff dispatch writes an invocation packet and yields pending host execution; collection accepts transport packets (`handoff.status = "accepted"`), keeping host authoring separate from autonomous model invocation or attorney sign-off.
  - If a pass dispatch yields `pending_host_execution`, the draft is incomplete and a full-draft request is unsatisfied.
  - The host session must author the stage artifact and call `collect_pass` with the invocation id; a second dispatch is refused while work is pending.
- **Match-Only Evidentiary Checks**: Factual checks record exact verbatim/locator matches (`verbatim_match`, `source_locator_match`) or `unknown`/`blocked` states; lexical matches are never equated with substantive legal verification.
- **Fail-Closed Crash Behavior & Unkeyed Chain Limits**: Unkeyed SHA-256 pass history chains detect inconsistent mutation, truncation, reordering, or replay of retained evidence. They are not writer authentication or tamper-proof storage; a fully consistent rewrite of all evidence and anchors is outside this model and is not detected. Crashes and precondition failures fail closed immediately without automatic heuristic recovery. On an integrity or precondition failure, there is no automatic resume path; the operator preserves the workspace and initiates a new run or manual review. Nothing may be edited directly to "repair" history.
- **Separate Bridge/Gate Composition**: Document-level structural completeness is assessed separately through `controller.bridges.writing_gate` and `controller.gates.assess_document` (categorical verdicts; never scored) rather than internal self-approval. The sidecar must be producer-authored under `WRITING_GATE_CONTRACT_v1`. If a sidecar is absent or refused, record the gate as not run and maintain the open item. Gate outcomes are structural only and never approval.
- **Status Ceilings**: Completing Pass 8 yields `REVIEW_REQUIRED` or `AUTOMATED_CHECKS_PASSED_AWAITING_ATTORNEY`; neither is legal approval, filing approval, or counsel sign-off.

Under no circumstances may a scaffold, outline, or placeholder-filled document be returned as a completed draft.

---

## Pass 1: Blueprint

Before generating full prose, establish the structural blueprint:
1. **Reader & Audience:** Identify who will read the document (e.g., trial judge, motions clerk, prosecuting attorney, supervising defense counsel, investigator) and what information they require to act.
2. **Desired Decision:** Formulate the precise judicial or strategic action sought in operative terms (e.g., "order the State to specify which departure and container it relies upon," not "grant general relief").
3. **Controlling Issue:** Pinpoint the single factual or legal hinge that determines the outcome.
4. **Required Sections:** Map the genre-appropriate architecture (consult `controller/gates/rubric.json` for type-specific required roles).
5. **Tone & Register:** Objective, measured, dignified, firm, and unhurried. Avoid performative indignation, sarcasm, or hyperbolic adjectives.
6. **Length & Density:** Proportional to the complexity of the record; developed paragraphs rather than compressed summaries or dilutive filler.
7. **Source & Proof Inventory:** Catalog all available evidence records, locators, attributed witness statements, and identified record gaps.
8. **Remedy Feasibility:** Confirm the requested remedy is legally recognized and directly supported by the factual record.

---

## Pass 2: Argument Development

For each substantive contention, systematically develop the seven core components of legal reasoning:
1. **Record Proof:** State exactly what the evidentiary record establishes, identifying source documents and locators. Distinguish between an attributed statement (what a witness asserted) and an established physical or historical fact.
2. **Opponent Contention:** State the prosecution's or proponent's strongest theory fairly and clearly. Never construct a weak strawman.
3. **Genuine Dispute:** Isolate the exact point of divergence between the competing positions (e.g., a 30-minute timing gap, conflicting exits, or different containers).
4. **Materiality:** Explain why the dispute matters to a charged element, a statutory prerequisite, an evidentiary foundation, or the burden of proof.
5. **Governing Rule:** Quote the controlling legal standard verbatim with verified citation. If analyzing illustrative fixture text or unverified rules, explicitly identify them as unverified and state their status.
6. **Application:** Apply the rule element-by-element to the record-supported facts. Address gaps and qualifications directly.
7. **Conclusion & Remedy:** Draw a measured conclusion that dictates the operative remedy.

---

## Pass 3: Full Document Production

Generate the complete text from beginning to end:
1. **Prose Continuity:** Write fully realized, flowing paragraphs connected by logical transitions.
2. **Anti-Scaffold Mandate:** Never return an outline, bullet list, section skeleton, or prompt repetition. Every substantive section must consist of developed prose.
3. **Paragraph Development:** Substantive paragraphs articulate a complete thought with evidence, warrant, and consequence. Substantive completion depends on sound legal reasoning and factual grounding, never on meeting an arbitrary word-count floor.
4. **No Arbitrary Placeholders:** Final delivered text must be free of arbitrary placeholders (`TODO`, `FIXME`, `[INSERT...]`) or structural skeletons. Narrowly placed, truthful verification markers (e.g. `[VERIFY: ...]`, `[court: not stated in fixture]`, or `[unresolved: ...]`) are permitted on unsupported passages or unverified predicates, ensuring drafters never invent missing facts or unverified authority to make a document appear superficially complete.
5. **Operative Integration:** Weave factual citations, legal principles, and analytical conclusions into unified prose.

---

## Pass 4: Evidentiary Revision

Cross-examine the text against the source ledger:
1. **Attribution Integrity:** Ensure statements made by witnesses are attributed to those witnesses (e.g., "Avery Chen stated that...") rather than asserted as objective historical facts.
2. **Quotation Accuracy:** Check every quotation against the primary source. Punctuation, capitalization, and phrasing must match the record exactly.
3. **Context & Limitations:** Confirm that witness qualifications (e.g., "did not see what was inside the crate," "did not see a crate") are preserved and not suppressed.
4. **Zero Invention:** Verify that no dates, times, biometric facts, forensic conclusions, physical objects, or missing records are fabricated. If an exhibit is missing, acknowledge the gap explicitly. List any date, time, object, or record not found in the source ledger as `unknown` or an open issue; the pass does not certify zero invention.
5. **Conflict Preservation:** Ensure conflicting witness statements are not smoothed over or merged into a single composite account.

---

## Pass 5: Legal Revision

Audit the draft against governing standards and procedural posture:
1. **Burden & Posture:** Explicitly reflect who bears the burden of production and persuasion at the current procedural stage (e.g., pretrial motion vs. trial).
2. **Authority Currency & Status:** Record each authority's status exactly as produced by the authority-verification process; a pass never assigns `reliance_approved`. If analyzing adverse or illustrative fixture rules, state clearly that they are unverified text rather than binding precedent.
3. **Application Completeness:** Never repeat a legal standard without immediately applying it to the factual record.
4. **Remedy Alignment:** Ensure the relief requested in the body of the paper matches what the governing law authorizes. Do not seek extreme sanctions (such as dismissal or disqualification) where the record only supports a demand for specification or discovery.
5. **Appellate Preservation:** Frame objections and requests cleanly to preserve the issue on the record.

---

## Pass 6: Advocacy Revision

Refine the prose for maximum persuasive impact, rhythm, and clarity:
1. **Order of Points:** Place the strongest, legally dispositive argument first.
2. **Opening Discipline:** Eliminate generic throat-clearing (e.g., "Comes now the Defendant...", "It is well established that..."). Open directly with the decisive legal and factual tension.
3. **Sentence Dynamics & Voice:** Use active voice, varied sentence lengths, and concrete verbs (e.g., "recorded," "conceded," "omitted," "separated").
4. **Calibrated Force:** Strip unsupported emotional rhetoric or accusations of bad faith. Force comes from the indisputable facts of the record and their legal consequences. Caution and force are fully compatible.
5. **Prohibition of Sentence-Initial "And":** Strict prohibition against beginning sentences with the conjunction "And." Replace with substantive transitions ("Moreover," "In addition," "Furthermore," or direct restructuring) to maintain professional legal dignity.

---

## Pass 7: Adversarial Revision

Subject the draft to rigorous adversarial stress-testing (incorporating V040-18/19 perspectives):
1. **Confront Strongest Opposing Points:** Directly address the prosecutor's best interpretation of the facts and law.
2. **Alternative Explanations:** Account for plausible state hypotheses (e.g., that two witnessed departures were separate acts, or that a later sighting corroborated an earlier departure).
3. **Proportionate Rebuttals:** Rebut opposing arguments with specific record references and burden allocations, demonstrating why the state's theory fails or remains legally insufficient.
4. **Vulnerability Mitigation:** Identify and close logical gaps, unsupported inferences, or evidentiary overstatements before the opponent or the court can exploit them.

---

## Pass 8: Final Review & Quality Control

Conduct a holistic audit of the completed work:
1. **Document-Level Coherence:** Verify consistency across captions, party designations, exhibit references, timestamps, and geographic markers.
2. **Contradiction Analysis:** Ensure contradictions are not merely inventoried but their legal consequences are fully articulated.
3. **Prayer-to-Order Congruence:** Check that every item in the motion's prayer for relief appears verbatim or in matching operational terms in the attached proposed order.
4. **Completeness Gate Compliance:** Confirm the document satisfies all type-specific criteria of `controller/gates/rubric.json` (categorical verdicts; never scored).
5. **Runner Heuristic Check:** Verify that `detect_outline(text, full_draft_requested=True)` reports zero defects.
6. **Routing Check:** Route all deliverables (motions, court-facing drafts, and legal memoranda/analyses) through `corrective-playbook-gate` and `legal-quality-control` before final delivery or counsel sign-off.
