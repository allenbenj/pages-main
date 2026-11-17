# Writing Specifications: Real Prose, Not a Scaffold

## Inputs -> Artifacts

| Request | Primary Artifact | Companion Only if Useful |
|---|---|---|
| "draft message to my lawyer" | Sendable first-person attorney communication with subject and coherent factual/legal concerns | Action/source check |
| "write a defense note / memo" | Substantive case memo with issue, source, analysis, opposing argument and recommendation | Proof grid |
| "draft this motion" | Complete motion with full legal analysis, numbered relief and proposed order | Source/authority ledger, filing checklist |
| "make a stronger narrative" | Complete continuous narrative in requested voice | Record-accuracy annotations |
| "compare these accounts" | Comparative analysis in plain language with materiality and a finished argument | Exact comparison table |
| "prepare cross" | Foundation-driven sequenced questions with source pins, expected objections and goals | Impeachment plan |

## Paragraph Composition Test
1. **Assertion:** One decision-relevant proposition.
2. **Record:** Source text / attributed statement and precise locator.
3. **Warrant:** Why the record establishes the point or supports a limited inference.
4. **Resistance:** The strongest credible limitation or adversarial account.
5. **Legal consequence:** Specific element, rule, remedy, evidentiary weight or next proof action.

Avoid the skeletal substitute "Fact / Law / Application TBD". Expand into prose and isolate only gaps actually needing source verification, using narrow, truthful `[VERIFY: ...]` markers where record support remains unresolved. Word count is never a quality proxy or pass criterion; substantive completeness depends on sound legal reasoning and factual grounding.

## Structural Blueprints

### Attorney Note / Memorandum
Subject; concise opening with strategic recommendation; factual basis (chronological or issue-organized with precise source attribution); evidentiary significance of conflicts; legal implications; prosecution's best response and rebuttal; actionable investigation or litigation requests. Write in a professional voice tailored to counsel, refusing mere enumeration of statements.

### Litigation Memo
Question presented; brief answer; verified factual posture; governing law; fully developed application with specific headings; counterarguments and response; realistic remedies; preservation and next steps. A neutral short answer can coexist with a strongly argued defense position.

### Court Motion
Caption; title identifying specific relief; introduction; procedural posture; factual background; legal standard and burden; argued grounds (complete analysis; authority and record pins; element-by-element application); counterarguments and rebuttal; specific prayer for relief; operative proposed order; counsel/service blocks. Do not create an affidavit by inference. Proposed order must match prayer provisions exactly.

### Investigative Findings Note
What the source proves; what was not verified; conflict or missing test; legal significance; highest-value evidence to obtain; next step. Maintain distinct headings for documented omissions and inferred motive.

## Voice and Rule Controls
1. **Verbs & Precision:** Prefer precise active verbs (*testified, recorded, conceded, omitted, requested, retained*).
2. **Strict Prohibition of Sentence-Initial "And":** Never begin a sentence with "And." Use substantive transitional phrases (*Moreover, In addition, Furthermore*) or restructure the sentence.
3. **No Throat-Clearing:** Eliminate formulaic phrases (*"Comes now," "It is well settled that"*). Lead directly with the decisive factual or legal tension.
4. **Never Repeat a Standard Without Applying It:** Citing a rule requires immediate, specific application to the record.
5. **Calibrated Force:** Strip unsupported emotional rhetoric or accusations of bad faith; force derives entirely from record facts and governing legal consequences.

## Context and Gate Delivery
Deliverable drafts follow the eight-pass authoring protocol (`references/eight-pass-engine.md`), are checked with `controller.runner.detect_outline`, and—when adapted with a structured sidecar via `controller.bridges.writing_gate`—are evaluated by `controller.gates.assess_document`. All deliverable work products (including motions, court-facing drafts, and legal memoranda/analyses) must be routed through `corrective-playbook-gate` and `legal-quality-control`.
