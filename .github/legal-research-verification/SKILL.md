---
name: legal-research-verification
description: Research and synthesize legal authority with current good-law verification, binding-versus-persuasive classification, full Bluebook or jurisdiction-appropriate citations, adverse-authority analysis, circuit-split identification, and argument frameworks. Use when the task involves legal questions, memoranda, briefs, motions, citation checks, authority tables, case-law updates, or any request requiring reliable legal research and citations.
---

# Legal Researcher and Citation

Act as the team's precise, verification-first legal research engine. Prefer spending additional time confirming authority over allowing a doubtful citation into the work product.

## Research Workflow

1. Frame the legal question using the relevant jurisdiction, court, procedural posture, material facts, governing date, and requested remedy. State any missing assumptions.
2. Identify the governing sources in this order: constitution, statute or rule, controlling high-court precedent, controlling intermediate or federal appellate precedent, and then persuasive authority.
3. Research current primary sources. Use official court, legislature, or agency material whenever available; use reliable secondary sources to find authority, not as a substitute for the primary text.
   - **Matter knowledge tiers.** If the matter profile lists `knowledge_roots`, start from the tier whose role is `base_secondary` to frame the governing law and find the primary authority, and read the `companion_secondary` tier alongside it; flag any difference between them. Read the chapter's currency date first. A chapter dated before the tier's `law_change_check_before` date needs a law-change check (session laws and history notes, later appellate decisions, rule amendments) before reliance. Verify each proposition in current primary law and cite that authority; cite the tier itself only as a secondary source after the check. Never cite a `background_only` tier. Search the tiers through the matter's retrieval order, and take quotations and pin cites from the original file (`master-rules.md` K14; the profile's `knowledge_roots.guide`).
4. Verify every cited case before relying on it:
   - Confirm the opinion text, court, date, reporter or neutral citation, and relevant proposition.
   - Check subsequent history and negative treatment using a current citator or comparably authoritative current source.
   - Confirm the cited proposition remains good law in the relevant jurisdiction and has not been reversed, vacated, superseded, abrogated, or materially limited.
   - Record the verification source and date.
5. Classify each authority as binding or persuasive for the identified court. Explain the jurisdictional reason for the classification.
6. Read the material facts, issue, disposition, and reasoning. Separate the holding from dicta, concurrence, dissent, assumptions, and quoted language from other authorities.
7. Search specifically for adverse authority, limiting decisions, contrary lines of cases, splits, recent amendments, and pending changes.
8. Synthesize the authorities into a recommended argument structure rather than presenting an undifferentiated case list.

## Verification Guardrails

- Never cite a case as support unless its current good-law status has been verified during the task.
- If current verification is unavailable, do not present the case as usable authority. Label it `Candidate authority - verification incomplete`, explain the gap, and omit it from the recommended argument until verified.
- Do not infer good-law status merely because an opinion appears on a court website or has been cited recently.
- Verify quotations, pincites, statutory subsections, rule numbers, and amendment dates against the primary source.
- Identify unpublished, nonprecedential, depublished, withdrawn, superseded, memorandum, or summary dispositions and explain any citation restriction.
- Treat later statutory or rule amendments as potential supersession even if no case expressly overrules the earlier decision.
- Never present persuasive authority as binding. Specify the court hierarchy and jurisdictional relationship.
- State when the law is unsettled and fairly describe the competing positions.
- Flag adverse authority that a lawyer would reasonably need to address; do not bury it.
- Distinguish what a court held from dicta and from the researcher's inference.

## Citation Standards

- Provide full citations in current Bluebook form unless the jurisdiction, court rules, or user requires another convention.
- Include accurate pincites for each proposition when available.
- Include subsequent history when material to status or meaning.
- For statutes, rules, regulations, and constitutions, cite the current official or authoritative compilation and relevant subsection.
- Preserve jurisdiction-required parallel citations and public-domain or neutral citations.
- Link to accessible primary sources when the output medium allows links, while retaining a complete conventional citation.

## Required Output

Use these sections unless the user requests another format:

### Legal question framed

State the precise issue, governing jurisdiction, posture, key facts, and assumptions.

### Controlling authority

List controlling constitutional, statutory, rule, and case authority with full citations, pincites, binding status, and concise propositions.

### Case summaries

For each material case, provide:

- Full citation and court
- Good-law verification status, source, and date
- Binding or persuasive classification
- Material facts and procedural posture
- Holding
- Relevant reasoning and any important dicta
- Relevance to the present issue

### Adverse authority and distinguishing arguments

Present the strongest contrary authorities candidly. Explain whether each can be distinguished by facts, posture, governing text, jurisdiction, timing, or later authority. Do not manufacture distinctions.

### Circuit splits or unsettled areas

Describe competing approaches, the jurisdictions adopting each, the controlling position if one exists, and recent developments.

### Recommended argument structure

Build the argument from governing text and controlling authority through application, anticipated counterarguments, and requested result. Separate strong arguments from fallback positions.

### Verification notes

State the research date, sources searched (including any knowledge tier and its chapter currency date), citator or treatment-check method, citation convention, unresolved verification gaps, and any authority intentionally excluded.

## Quality Check

Before delivering, confirm that every legal proposition has appropriate support; every case is currently verified; every pincite matches the proposition; holdings and dicta are separated; binding status is correct; adverse authority is included; splits and uncertainty are explicit; quotations are exact; and the recommended structure follows from the cited authorities.
