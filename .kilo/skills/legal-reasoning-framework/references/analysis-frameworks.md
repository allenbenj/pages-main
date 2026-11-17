# Analysis frameworks: procedures and rule crosswalk

Use with `legal-reasoning-framework`. This file gives each method's procedure and failure checks. Every output of every method obeys `corrective-playbook-gate/references/master-rules.md`; the crosswalk at the end says how. A method never supplies a fact, an authority, or a finding. It organizes and tests what the record and verified authority supply.

Framework labels (IRAC, Toulmin, MECE, and the rest) belong in internal worksheets. Remove them from court-facing text (K7).

## 1. IRAC (per legal issue)

1. **Issue**: one legal question, stated narrowly enough to answer.
2. **Rule**: quoted verbatim from a `reliance_approved` source with a pincite (R8, K1). Paraphrase only after the quotation, and label it.
3. **Application**: each element matched to specific, cited facts (K6). Keep attributed statements attributed (R10).
4. **Conclusion**: phrased as the argument or the likely analysis, never as a finding the court has made (R2, R3, A10).

Checks: the rule is from the correct jurisdiction and stage (R6, C8); every element has facts or is marked as a proof gap; the conclusion follows from the application alone.

## 2. Toulmin (per dispositive or contested argument)

Parts: claim, grounds (data), warrant, backing, qualifier, rebuttal, plus the response to the rebuttal.

Five failure checks. Record each as pass or fail in the worksheet:

| # | Failure | Test | Fix |
|---|---|---|---|
| T1 | Missing grounds | The claim has no cited record facts. | Add cited facts or downgrade the claim to a question. |
| T2 | Unstated warrant | The link from facts to claim is assumed. | State the rule or inference that connects them. |
| T3 | No backing | The warrant cites no verified authority or accepted principle. | Add `reliance_approved` authority or label the warrant as argument. |
| T4 | Overly absolute claim | No qualifier; exceptions ignored. | State the limits and conditions. |
| T5 | Ignored rebuttal | The strongest counterargument is not stated or answered. | State it fairly and answer it (C4). |

## 3. Deductive check

For each conclusion: write the major premise (the verified rule), the minor premise (the cited facts), and the conclusion. The argument is **valid** if the conclusion follows; it is **sound** only if both premises are verified. Report any unsound premise as a proof gap or an authority gap.

## 4. Critical-thinking and fallacy scan (own work and the opposing side's)

1. State the core claim.
2. List the assumptions it depends on, including unstated ones ("the witness is credible", "the lab followed protocol").
3. Test evidence quality: admissibility, reliability, and whether it actually supports the claim.
4. Scan for fallacies:
   - Ad hominem: attacking a person instead of the argument.
   - Hasty generalization: a broad conclusion from limited evidence.
   - Circular reasoning: the conclusion used as a premise.
   - Absence of evidence as proof: for example, "no alibi, so guilty", or "no search hit, so it did not happen".
   - Appeal to authority or status: a title or office treated as proof.
5. Check inconsistencies across witnesses, documents, and cited authority (a case whose facts differ materially from ours).
6. Check bias and motive: confirmation bias (contrary evidence ignored), overweighting one kind of evidence, and interest bias (a stake in the outcome). Bias warrants examination; it does not make every statement false (`integrated-reasoning-for-motions.md`, adaptation 5). Test favorable and unfavorable evidence rigorously. Where a stated fact conflicts with the evidence, follow `fact-conflict-resolution.md`.
7. Test alternatives with abductive reasoning (section 6).
8. Rank the weaknesses found by severity (does it defeat the argument?), correctability (can more evidence cure it?), and strategic impact.

## 5. MECE issue trees

1. State the root question.
2. Split into top-level branches that do not overlap and together cover the question (for example, elements, defenses, evidence, procedure, remedy, preservation).
3. Subdivide each branch the same way.
4. Check exhaustiveness against the elements of every claim and every available defense, and against the seven issue categories in `issue-category-checklist.md`.
5. Remove duplicate arguments; each argument lives in one branch. Evidence may support several branches; cross-reference it rather than excluding it (`integrated-reasoning-for-motions.md`, adaptation 4).
6. Prioritize branches by legal significance, strength of evidence, and strategic risk (which branch could end the case). Record the reason in words. A 1–10 score may supplement the reason in a local working document, never replace it, and never appears in a final document (K7).
7. Run IRAC on each priority branch. Update the tree when facts or law change.

## 6. Abductive reasoning (competing explanations)

1. List every explanation that fits the facts, including the unfavorable ones.
2. Compare them by fit with the evidence, internal consistency, and how much each must assume.
3. Name the best current explanation and say what evidence would change it.
4. The best explanation is not proven. Label it an inference (R10). Do not rely on "how common this is" unless a cited source supplies the base rate.
5. A Bayesian comparison is allowed (owner decision 2026-10-02): give each explanation a prior and the likelihood of each key item of evidence under it, as labeled working estimates, and show the update. The result is an inference (R10) and stays in working documents (K7). A real-world base rate stated as fact still needs a cited source (step 4).

## 7. Causal chain

1. Map each link from conduct to event, harm, prejudice, and remedy.
2. Give each link its source, or mark it a gap.
3. Identify break points: intervening causes, alternative causes, and timing that makes a link impossible.
4. Check each link against the governing causation standard (verified authority).

## 8. Opposing-method audit

For each argument the opposing side makes or is likely to make:

1. Name the method it uses (causal claim, inference from silence, pattern from few instances, credibility by status, reliance on a witness with a documented history of dishonesty, and so on). Reliance on a dishonest witness is flawed logic to flag and analyze, not testimony to reject automatically (`integrated-reasoning-for-motions.md`, adaptation 5).
2. Search the record for where that method was used: pleadings, affidavits, testimony, reports, argument.
3. Test it with sections 2, 4, and 7.
4. Answer it with cited record facts. If the record supports the opposing argument, say so; that is a risk, not something to hide.

## 9. Strategy methods (strategy only, never law or fact)

- **Cost-benefit**: for each option, list costs (time, money, risk to credibility, public perception, procedural and appellate consequences) and benefits (relief obtained, reduced penalties or sentencing exposure, public perception, leverage). Compare them in words.
- **Rank against the client's goal**: state the client's goal in one sentence. Rank the options against it, in words only, with no scores: for each option, say how it advances or sets back that goal and why it sits where it does in the order.
- **SWOT**: strengths, weaknesses, opportunities, threats, each tied to a cited fact or a verified rule. The opposing side's weaknesses are listed only when the record shows them.
- **Backcasting**: state the end state (for example, records authenticated and admitted); list the conditions that must be true; work backward from the deadline to date each step; turn the steps into the work plan.
- **Second-order effects**: for each recommendation, state what it triggers next (the other side's response, waiver, appellate posture).

## 10. Combining methods

- Issue tree → IRAC per priority branch → Toulmin for each dispositive argument.
- MECE branches + abductive comparison where the facts are disputed.
- Causal chain + cost-benefit when deciding whether to litigate a weak link.
- Critical-thinking scan on the Rule and Application of every IRAC, and on every branch of the tree.

## Crosswalk to master rules

| Method output | Rule that governs it |
|---|---|
| Any rule statement | R1, R8, K1–K4: verified, quoted, pincited authority only. |
| Any fact in an application, ground, or causal link | R9, K6: cited record fact; otherwise a proof gap. |
| Conclusions, best explanations, inferences | R2, R3, R10, K12, A10: labeled as argument or inference; no finding attributed to a court that did not make it. |
| Defects found | R7: classify as legal unavailability, missing element, conclusory pleading, or internal inconsistency. |
| Scores, weights, probabilities | Allowed only in local working documents, labeled as working estimates (1–10 scorecards; Bayesian estimates, section 6). Final documents contain none (K7). The client-goal ranking in section 9 is in words. |
| Stated fact that conflicts with evidence | `fact-conflict-resolution.md`: flagged with an ID, open until the owner resolves it, resolution logged and propagated. |
| Framework labels | K7: internal only; removed from court papers. |
