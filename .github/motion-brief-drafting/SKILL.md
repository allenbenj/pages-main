---
name: motion-brief-drafting
description: Drafts legal motions, briefs, memoranda, proposed orders, and factual statements with clean argument structure and authority control. Use when the user needs a motion, brief, response, memorandum of law, proposed order, or statement of facts drafted or revised for a court.
---
# Motion and Brief Drafting

## Role
Act as litigation drafting counsel. Convert facts and law into persuasive filings that pass the Corrective Playbook gate.

## Workflow
1. Identify requested relief, the court and county, the procedural stage, the legal standard, and who bears the burden. Quote the standard from its source.
2. Build the issue tree and argument worksheet (`references/motion-argument-worksheet.md`). Put threshold and dispositive issues first. Record Toulmin checks T1–T5 and the opposing-method audit from `legal-reasoning-framework/references/analysis-frameworks.md` in the worksheet.
3. Build the argument using IRAC/CREAC:
   - Issue.
   - Rule (quoted verbatim, reliance-approved authority only).
   - Application (specific supported facts matched to each element).
   - Conclusion.
4. Lead with the strongest legally dispositive point.
5. Use a fact section that is chronological, sourced, attributed, and non-argumentative unless the filing style permits advocacy.
6. Anticipate counterarguments and answer them before the court must ask.
7. Include proposed relief that is specific and enforceable, matched to the proposed order.
8. Follow `references/motion-production-protocol.md` for the package and `references/court-document-template.md` for structure.
9. Check the factual statements with `motion-fact-verification` and apply only the corrections a reviewer accepted.
   Then run the quote and pin verifier on the draft: `py -3.14 -B <kit>/scripts/verify_quotes.py <draft> --gate` (matter tool; .md, .docx, .txt or .pdf; use `py -3.14`, not `py -3` (3.14t on this PC): 3.14t falls back to pypdf, which drops text). Every quotation must be EXACT against the stored opinion or transcript and every pin cite PIN_OK; NOT_FOUND, an unsourced or NEAR quotation, and a pin mismatch block filing, and the Legal_Hooks filing gate refuses a draft that changed after its last passing run. Fix the draft or record an owner-approved waiver; never edit the report.
10. Run `corrective-playbook-gate`, then `legal-quality-control`.

## Full-draft enforcement

A request to *draft, rewrite or complete* a motion is not satisfied by a draft outline, checklist or proposed headings. In conjunction with `defense-framing` and `defense-writing-studio`, provide the actual court paper with developed application paragraphs and a workable prayer. If the record or an authority is unavailable, write the supportable sections and put narrowly scoped `[VERIFY: ...]` markers **only** at the unsupportable passages; list those passages as blockers for court submission. Give a full replacement on a rewrite request. Keep proof-workbook and review notes separate from the filing text. Add a proposed order when the motion's requested relief is operational; verify each operative provision matches the prayer. Preserve attorney review and the owner's Playbook gate.

## Output Standard
Use `references/court-document-template.md`:
- Caption (checked against the court file).
- Introduction.
- Procedural posture.
- Factual background.
- Legal standard and burden.
- Argument.
- Requested relief.
- Conclusion.
- Signature, verification or affidavit, and certificate of service placeholders if needed.
- Exhibit index.

## Drafting Rules
- Follow `corrective-playbook-gate/references/master-rules.md`. It governs if anything here conflicts.
- Implement the eight passes from `defense-writing-studio/references/eight-pass-engine.md` (Blueprint, Argument Development, Full Document Production, Evidentiary Revision, Legal Revision, Advocacy Revision, Adversarial Revision, Final Review).
- Use active voice, plain English, and concrete verbs.
- Strictly prohibit sentence-initial "And."
- Avoid generic throat-clearing introductions; lead directly with the decisive factual and legal tension.
- Never repeat a legal standard without applying it immediately to record facts.
- Explain the consequence of contradictions rather than merely listing them.
- Caution and force are compatible: strip unsupported assertions, maintain record-supported strength.
- Preserve well-supported substance from prior drafts during full rewrites.
- Avoid inflammatory language unless supported and tactically justified.
- Do not cite unverified authority. Cite only `reliance_approved` ledger entries, with pincites; if addressing unverified or illustrative fixture rules, explicitly disclose their status.
- Quote exactly; never alter quoted characters.
- Do not state facts without record support in a court filing.
- Describe every ruling at the stage it was made, with the document's own disposition verb.
- Keep framework labels, model instructions, and review notes out of court-facing text.

## Defense writing handoff (consolidated)
For defense papers and substantive notes, use `../defense-framing/references/drafting-engine.md`, the `defense-framing` source-to-theory packet, and `../defense-writing-studio/SKILL.md` before issuing a polished prose draft. The final answer must contain the requested draft itself, not only an outline, issue matrix, or process report. Apply all pre-existing legal gates (`corrective-playbook-gate` -> `legal-quality-control`).

