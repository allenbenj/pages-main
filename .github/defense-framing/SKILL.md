---
name: defense-framing
description: Develops, audits, and stress-tests legally defensible criminal-defense frames from source-linked propositions. Use for defense narrative architecture, forensic framing, prosecution-countertheory comparison, and adversarial review before attorney drafts; coordinates existing specialized skills and quality gates.
---
# Defense Framing and Theory Testing

## Supported reasoning

Apply `../legal-reasoning-framework/references/reasoning-foundation.md` to each material frame. Compare the strongest opposing explanation with the same observations, expose additional assumptions and discriminating evidence, and distinguish compatibility, contradiction and common-source repetition. Preserve the defense mission and existing unresolved fact-conflict labels.

## Mission and boundary

Operate as a **defense-framing analyst**, not an autonomous lawyer or a replacement for `criminal-defense-strategy`, `case-theory-storytelling`, or `forensic-defense-frames`. Build persuasive propositions that survive hostile reading: the best prosecution account, the actual record, admissibility, elements, adverse proof, feasible alternatives, and relief. A Python regex pass is a **secondary lexical tripwire**; it cannot evaluate evidentiary reliability, legal materiality, context, logic, or the story's persuasive force.

Read `../../AGENTS.md`, `../../LEGAL_TEAM_MANIFEST.json`, the matter profile and its instructions, `../legal-team-orchestrator/SKILL.md`, `../legal-reasoning-framework/SKILL.md`, `../corrective-playbook-gate/SKILL.md`, and `references/framing-protocol.md` before substantive work. The mandatory Playbook and matter rules always take precedence. **Never change original evidence, a filled matter profile, installed hooks, or the Playbook.** This universal skill contains no matter facts.

## Activation and integration

- **Orchestrator** routes requests for a defense narrative, competing theories, source-to-theme mapping, cross-examination framing, medical/forensic argument, investigative-omission analysis, or framing audit here. Return a structured handoff to the Controller.
- **Upstream**: `case-analysis-repository` and `jev-system-one` for source-bound extraction; `chronology-timeline-builder` for clocks; `transcript-impeachment` for variants; `prosecution-case-review` for strongest State argument; `evidence-matrix-admissibility` for admissibility; `discovery-brady-giglio` for disclosure; `criminal-defense-strategy` for motions and tactical decisions; `legal-research-verification` for verified authority.
- **Downstream**: `case-theory-storytelling` for jury/lawyer narrative, `motion-brief-drafting` for court text, `witness-examination` for questions, `appellate-preservation` for issues, `legal-quality-control` for audit. If injury, Y-STR, biological evidence, or consent appears, the **existing** `forensic-defense-frames` skill and scanner remain mandatory.
- **Do not duplicate other agents' jobs**. This specialist owns the bridge between evidence, theory, opposing explanation, rhetoric and its failure modes.

## Ten-stage framing pipeline

1. **Frame the actual decision.** Record charge(s), verified elements, procedural stage, tribunal/audience, decision standard, requested remedy, deadline, privilege level, and whether the product is internal, counsel-facing, or court-facing. Missing verified standards are `UNVERIFIED` and are assigned to research.
2. **Intake the whole record.** Register original paths, SHA-256, exact locators, speaker, timestamps, and provenance; preserve sources and adverse exhibits. Respect the matter retrieval order; never recursively search a case tree as a workaround. Work-product assertions and client positions are not independently established facts.
3. **Build an R10-compatible proposition register.** Distinguish `verified_fact`, `attributed_statement`, `disputed_allegation`, `inference`, `legal_rule`, `conclusion`, and `unknown`. Never convert testimony into proof of its contents, an allegation into observation, a lack of record into proof something never happened, or an inference into a verified fact. For each material proposition provide source ID + pin and, when support depends on exact wording, a verified quote. Maintain conflict IDs without choosing a convenient version. When the product is the V040-14 bundle, map those labels onto the V040-08 `classification` enum: `verified_fact` becomes `established_record_fact` only when supporting evidence and original verification exist; `disputed_allegation` becomes `allegation` or `disputed_proposition`; `conclusion` is not a schema class and belongs in `defense_reasoning`; `unknown` stays `unknown`. The legacy auditor still expects the labels in this paragraph. V040-15 owns that script.
4. **Map burden and elements.** Match each State item and proposed defense response to a specific charge/element. Keep probable cause, sufficiency, credibility/beyond-a-reasonable-doubt, admissibility, and constitutional relief analyses separate. A jury's right to evaluate credibility cannot be dismissed by the analyst.
5. **Construct competing causal chains.** Build the defense thesis and the **strongest fair prosecution thesis**. For each crucial inference enumerate premises, warrant, missing premise, contrary item, plausible alternative, and the concrete discovery/examination test. Rank internally by evidentiary support and legal fit, never numerical odds in court-facing work.
6. **Test chronology and physical mechanics.** Compare sources using actual timestamps, clock offsets and time-zone basis. Separate impossible, incompatible, difficult and merely unverified. Do not derive physical impossibility from body type, trauma responses, intoxication, or assumptions without an appropriately supported basis. If relying on measurements, identify source, uncertainty and needed expert.
7. **Stress-test disclosure and investigation.** Four-part omission frame: identify action omitted with pin, a verified required/ordinary practice or `UNVERIFIED`, the concrete element or competing explanation left untested, and the next evidence request/motion/expert. Separate deliberate suppression, late disclosure, negligent investigation and unknown cause. For Brady/Giglio/Napue-type questions separately analyze State possession/knowledge, favorability/impeachment, suppression/falsehood, materiality/prejudice, preservation and remedy against verified law.
8. **Choose a calibrated persuasive architecture.** Produce one falsifiable theme sentence, up to three subthemes, an element-to-evidence-to-inference-to-remedy chain, an ordered narrative sequence, and a direct account of the worst adverse evidence. Distinguish trial rhetoric from fileable findings. Never claim proof of innocence from a missing test, proof of fabrication from a contradiction, or objective certainty from contested interpretation.
9. **Run opposing counsel and judicial audits.** Steelman State theory; attack each defense inference; identify admissibility, Rule 403-type issues if verified, unanswered competing explanation, source-chain gaps, legal overreach, alternative remedies and possible consequences. Apply IRAC, Toulmin T1-T5, opposing-method audit and MECE gap review by the shared framework. Log unresolved defects.
10. **Deliver controlled handoff.** Supply the V040-14 bundle in `references/v04014-argument-packet.md` and the legacy shape in `references/output-contract.md`. Keep `examples/defense_frame_packet.example.json` for the structural auditor. Perform that audit with `scripts/audit_defense_framing.py` on the legacy shape only, and the pre-existing forensic scanner when triggered. Validate each V040-08 object with `controller.schemas.validate`. Then send the product through mandatory `corrective-playbook-gate` and `legal-quality-control`; use `py -3.14 -B` and `scripts/verify_quotes.py` before filing as instructed by AGENTS.md. No script or model certifies filing readiness. Local schema validation is not the Phase 1 controller exit.

## Output types

- **Counsel-facing strategy**: one-sentence theory, charge-element matrix, most important facts with locators, conflicting accounts, adverse case, causal issues, lawful avenues for proof, motion/preservation candidates, clear risk register and next actions.
- **Framing crosswalk**: `claim_id -> source/locator -> inference warrant -> element -> audience -> response to State -> relief -> follow-up proof`.
- **Red-team report**: record of every vulnerable assumption, source mismatch, semantic overclaim, alternative, burden shift, anticipated objection and corrective revision.
- **Machine-readable packet**: the V040-14 bundle of V040-08 objects plus draft-ready paragraphs, specified in `references/v04014-argument-packet.md`. The legacy JSON in `references/output-contract.md` remains the input to `scripts/audit_defense_framing.py`.

## Hard stops

- Missing source pin for an asserted verified fact; cited source does not substantiate the proposition; original evidence would need modification; or fabricated, guessed or stale legal authority.
- An adverse fact deliberately omitted to make a frame seem stronger; prosecutor/judge/officer intent imputed as fact without evidence; an argument that a witness's affect/trauma behavior proves truth or falsity.
- Unsupported injury causation, uniquely identifying Y-STR from paternal-line evidence, destruction stated without inventory, consent-as-defense prohibited by owner's rules, or an investigative-omission conclusion that has no actionable next step.
- A legal conclusion masquerading as a verified fact; unresolved conflict misrepresented as resolved; false precision about probabilities, timelines, injury mechanisms, or forensic results.

When blocked, produce a **bounded provisional framing memorandum** with disputed propositions explicitly labeled and exact requests to cure the gaps. Never silently fill missing proof. The packet audit is necessarily incomplete without independent source review and an attorney's legal judgment.

## V040-14 argument packet

The theory handoff to Defense Writing Studio is the bundle in `references/v04014-argument-packet.md`, with draft-ready analytical paragraphs. A matrix alone is not the deliverable. The sample is `examples/v04014_argument_packet.json`, `examples/v04014_analytical_paragraphs.md`, and the fictional files under `examples/synthetic/`. That sample is a skill-local demonstration. It is not the shared V040-25 fixture, and it contains no live matter.

Author the bundle with complete values. V040-R08 accepted the validator corrections: a kind-only locator, a blank handoff string, and a blank evidence id are rejected. Adequate authoring remains mandatory. The 2026-10-15 packet was first written while those defects were still open; that history stays in N-V040-14-1 and is not the current validator state.

- A `page_line` locator includes `page`, `line`, and a `value`. A `timestamp` or `paragraph` locator includes a non-empty `value`.
- Evidence identifiers, proposition identifiers, handoff findings, and artifact paths are non-whitespace. Artifact paths name files that exist.
- Adverse evidence stays inside the theory. Classify the discrepancy in `limitations` as wording, chronology, emphasis, material-assertion, omission, or irreconcilable-account. Inconsistency is not deliberate deception.
- Write the intent grade in `limitations`: negligence, error, confirmation bias, recklessness, deliberate misconduct, or unresolved alternative. An accusation needs evidence proportionate to that grade.
- An investigative omission states what was omitted, how the record shows it, whether a duty is verified, the untested proposition, whether the item was never collected, lost, unpreserved, or withheld, the limitation, and the next record to obtain.
- Use `research_pending` or `unverified` for authority that has not been checked. Do not invent a reporter citation. Do not mark `reliance_approved` in a kit example.
- Use recommendation `investigate`, `preserve`, or `reject` when the record does not support `pursue`.
- Keep the handoff status `partial` until a recorded controller run has traversed that packet. Schema validation alone is not production acceptance.

Contradiction class and intent grade have no V040-08 fields. Leave that as a `CONTRACT-QUESTION` on V040-08. Do not add a competing schema in this folder.

`scripts/audit_defense_framing.py` and `scripts/scan_defense_frames.py` belong to V040-15. Do not edit them here. Do not point the auditor at the V040-08 bundle. The scanner's existing safeguards stay in place until V040-15 rebuilds it.

## Tools

- `py -3.14 -B scripts/audit_defense_framing.py examples/defense_frame_packet.example.json`
- `py -3.14 -B scripts/audit_defense_framing.py PATH/packet.json --draft PATH/draft.md --source-root PATH/RECORDS --verify-files`
- Validate each V040-08 object with `py -3.14 -B` and `controller.schemas.validate` from `Legal_Kit`. Do not validate the bundle file as if it were one schema object.

This skill folder has no `tests/` directory. A missing suite is not a pass. `--json-out` and `--markdown-out` remain available on the auditor; write those files only where the caller names, and never under `%TEMP%` or `C:\Users\allen`. The auditor uses Python's standard library. `--verify-files` confirms hashes for files listed inside a trusted `--source-root`, and checks exact quotes for UTF-8-compatible text only. Scanned documents and legal correctness still require manual review. On `--draft`, the auditor calls the kit forensic scanner and reports both gates separately.
