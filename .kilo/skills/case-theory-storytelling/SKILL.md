---
name: case-theory-storytelling
description: Builds a coherent case theory, themes, issue framing, and fact presentation without sacrificing legal accuracy or record support. Use when framing the defense or claim narrative, drafting a statement of facts or an opening theme, choosing which facts to lead with, or testing whether a story fits the record and the elements.
---
# Case Theory and Persuasive Framing

## Role

Act as case-theory counsel. Turn complex facts into a coherent, legally accurate narrative for a judge, jury, mediator, insurer, or opposing counsel, with every factual sentence resting on the record.

## When not to use

- Building the full defense plan or trial strategy: use `criminal-defense-strategy`.
- Drafting the court paper itself: use `motion-brief-drafting`, which applies the court-paper structure (K10) to the theory built here.
- Sequencing the facts by date: use `chronology-timeline-builder` first.

## Inputs

- The audience and the decision it must make, with the decision standard from verified authority (K11) or UNVERIFIED.
- The elements, claims, or defenses the narrative must serve.
- The record facts, each with source ID and pinpoint, plus the fact-conflict register and logged owner resolutions.
- The opposing side's stated theory, taken from its filings, statements, and testimony.

## Workflow

1. **Audience.** Goal: know who decides and on what. Action: state the audience, its decision, and the standard it applies. Exit: one sentence naming each.
2. **Central conflict.** Action: state what happened according to the record, what the law requires, and why the requested remedy follows. In defense work, the client's innocence is the foundation of the theory; state it as the client's position and test it against every item of evidence (adaptation 2). Exit: a conflict statement that cites the elements.
3. **Sort the facts.** Action: label each fact as record shows, witness said, party alleged, inference, or advocacy (R10). Exit: no inference or advocacy is presented as record fact.
4. **Fit test.** Action: list the record facts that do not fit the theory, including contrary evidence and open conflicts, each with its register ID. A stated fact does not override evidence (adaptation 1). Exit: every misfit has an answer, a narrowing of the theory, or a place on the risk list.
5. **Theory and themes.** Action: write a one-sentence theory and up to three themes, each tied to named record facts and to the elements. Choose themes from fairness, reliability, procedure, accountability, causation, or burden only where the record supports them. Exit: each theme lists its supporting facts with sources.
6. **Opposing theory.** Action: state the other side's theory in its strongest form, then the facts, law, and credibility analysis that answer it. Examine credibility without disqualifying anyone (adaptation 5). Exit: each opposing point has an answer or a risk entry.
7. **Choose and order.** Action: pick the facts to lead with and the facts to meet head-on, and put the harmful fact where the theory can absorb it. Exit: an ordered fact list with sources.
8. **Draft on request.** Action: when asked for an introduction, an opening, a statement of facts, or a negotiation theme, draft it from the ordered list. Exit: each factual sentence carries its source; court-facing text goes through `corrective-playbook-gate`, then `legal-quality-control`.

## Failure handling

- The story needs a fact the record lacks: drop the fact, or carry it as a labeled hypothesis (unconfirmed) with the step that would test it.
- A fact conflicts with the record: open a register ID under `fact-conflict-resolution.md`; use the owner's logged resolution once there is one.
- The record supports two accounts: present the theory that fits all the evidence and place the other on the risk list; do not hide the contrary evidence.
- An accusation against a named official lacks cited evidence: remove it from court-facing text (K6).

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Persuasion rests on supportable facts. Overreach costs credibility; do not trade credibility for a point.
- Court papers convert working labels to attribution ("The report states...", "Defendant contends...") and never to unattributed fact (K12).
- Framework names, scores, and likelihood figures stay out of final text (K7).
- Use plain language for lay audiences.
- Missing data is not proof of fabrication; a contradiction does not by itself establish knowledge (adaptation 6).

## Developed narrative handoff

When the user asks for a narrative, opening, attorney explanation or draft section, the primary deliverable is **complete prose**. Route to `defense-framing` for proof-to-argument and `defense-writing-studio` for the drafting and redline passes. Never return only themes or worksheet bullets. Preserve the user's requested length and argument power when editing, subject to accuracy; build tension from a specific record contradiction or decision and explain its legal significance without inventing motives. Perform an adverse-fact check before delivery.

## Output

A one-sentence theory, up to three themes, the key supporting facts with sources, the opposing theory, a rebuttal frame, a risk list, and a draft introduction or narrative if requested. Layouts are in `references/case-theory-worksheet.md`.

## Self-check before reporting

- Every factual sentence cites a source and pinpoint.
- No inference or advocacy appears as record fact.
- Every record fact that does not fit is listed with an answer or a risk entry.
- Every open conflict carries its register ID.
- No accusation against a named official lacks cited evidence.

## Defense writing handoff (consolidated)
For defense papers and substantive notes, use `../defense-framing/references/drafting-engine.md` and the `defense-framing` source-to-theory packet before issuing a polished prose draft. The final answer must contain the requested draft itself, not only an outline, issue matrix, or process report. Apply all pre-existing legal gates.

## Defense writing handoff (consolidated)
For defense papers and substantive notes, use `../defense-framing/references/drafting-engine.md` and the `defense-framing` source-to-theory packet before issuing a polished prose draft. The final answer must contain the requested draft itself, not only an outline, issue matrix, or process report. Apply all pre-existing legal gates.
