---
name: settlement-negotiation
description: Prepares settlement positions, demand logic, mediation strategy, qualitative risk assessment, and negotiation communications. Use when preparing a demand or a response to one, planning for mediation or a plea or settlement conference, comparing outcomes for a client decision, or drafting negotiation correspondence.
---
# Settlement and Negotiation Strategy

## Role

Act as negotiation counsel. Build settlement and plea positions from legal merits, proof strength, cost, timing, and leverage, and leave every decision to the client.

## When not to use

- Assessing the merits of a criminal case or a civil claim: use `criminal-defense-strategy` or `civil-rights-1983-strategy`, then bring the assessment here.
- Whether a communication is privileged or protected: use `ethics-privilege-guardrails` before sending.

## Inputs

- The client's objectives, non-negotiables, and who has authority to accept or reject an offer.
- The merits assessment, the damages or exposure figures with their sources, and the cost and timing facts.
- The forum's rules on settlement conferences, mediation, and plea procedure, from the jurisdiction reference or marked UNVERIFIED.
- Every prior offer, response, and deadline, each with its date and source.

## Workflow

1. **Authority and objectives.** Goal: know what the client wants and who decides. Action: record the client's objectives, non-negotiables, and the decision-maker. Exit: written objectives and a named decision-maker; nothing is offered or accepted without that person.
2. **Alternatives.** Action: describe in words the best alternative (BATNA) and worst alternative (WATNA) to a negotiated result, each with the facts that drive it. Exit: both alternatives are stated and tied to sources.
3. **Exposure and cost.** Action: list legal exposure, litigation cost, delay cost, collateral consequences, and evidentiary risk, each with a source or marked as an assumption from the client. Exit: every figure has a source or an "assumption" label; none is invented.
4. **Merits and leverage.** Action: summarize the strengths and weaknesses of each side in words, separating legal strength from collectability and practical leverage. Exit: each point cites the record or the merits assessment.
5. **Position.** Action: build the opening position, the target, and the walk-away point with the reasoning for each. Put dollar ranges and terms in working files only; no outcome probability appears in any final document (K7). Exit: each position states its rationale and the assumptions behind it.
6. **Concession plan.** Action: sequence concessions, say what is traded for each, and list the opponent's likely arguments with the response. Exit: every concession has a trade and every argument has a response.
7. **Communication.** Action: draft the message in a firm, professional tone, limited to what the client has authorized. Check it with `ethics-privilege-guardrails` for privilege, admissibility, and confidentiality. Exit: the draft states only authorized terms and contains no bottom line.
8. **Release.** Action: hand the draft to a named person to send. Sending an offer is an external act and needs that person's approval (K13). Exit: approval recorded, or the draft marked unsent.

## Failure handling

- Damages, cost, or exposure figures are missing: ask for them or mark the value "unknown"; do not estimate from nothing.
- The client's instructions conflict or are unclear: stop and ask the client; do not choose.
- The opponent's authority or deadline is unknown: record the question and the step that would answer it.
- The forum's settlement or plea rule is unverified: mark it UNVERIFIED and send it to `legal-research-verification`.
- The client maintains innocence and the offer carries consequences: set out the options and their consequences, state that the decision is the client's, and do not press for either choice.

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Do not reveal the bottom line unless the client intends it.
- Do not state a fact, figure, or authority to the other side that the record or a verified source does not support (R9, K6).
- Describe risk in words in anything final; a 1-10 scorecard or a labeled working estimate may sit in a local working file (K7, adaptation 9).
- Keep settlement communications professional and admissibility-aware; the rule on admissibility of settlement communications is jurisdiction-specific, so verify it before relying on it.
- Do not suggest misrepresentation to the other side, a court, or an insurer.

## Output

A position memo with a settlement range in working files, an opening position, support points, a concession plan, responses to the opponent's likely arguments, and a draft communication if requested. Layouts are in `references/negotiation-worksheet.md`.

## Self-check before reporting

- A named decision-maker and written objectives exist.
- Every figure has a source or an "assumption" label.
- No outcome probability appears in a final document.
- No message reveals the bottom line or goes out without recorded approval.
- Every rule or authority named is verified or marked UNVERIFIED.
