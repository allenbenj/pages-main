# Integrated reasoning for motion practice

This adaptation converts general reasoning guidance into reviewable outputs. Frameworks are tools for disciplined work, not proof of a legal conclusion.

| Method | Use | Observable output |
|---|---|---|
| Issue trees and MECE | Separate requirements and identify omissions without duplicating arguments | Element/threshold map with shared-evidence cross-references |
| IRAC/CREAC and deduction | Apply verified law to supported propositions | Developed application paragraphs |
| Toulmin | Test the connection between proof and requested relief | Claim, grounds, warrant, backing, qualifier, rebuttal and response |
| Critical thinking | Test both sides for unsupported premises, inconsistent accounts, and overstatement | Passage-specific defect and correction list |
| Induction | Evaluate whether a claimed pattern is supported | Relevant observations, contrary examples, sample limits, and bounded inference |
| Abduction | Compare explanations for incomplete or conflicting information | Competing explanations, evidence that would distinguish them, and, where useful, a Bayesian comparison with labeled working estimates |
| Causal-chain analysis | Connect conduct to legal consequence and remedy | Each causal link, source, alternative cause, and unproved link |
| First principles | Identify the minimum showing needed for the requested action | Essential proof and burden checklist |
| Second-order review | Consider consequences of the requested relief | Disclosure, preservation, trial, and appeal consequences |
| SWOT/cost-benefit | Prioritize viable work | Benefit, effort, dependencies and risk in words, ranked against the client's goal; a 1–10 scorecard only in local working documents (adaptation 9) |

## Required adaptations

1. Stipulations, adjudicated facts, client representations, assumptions for a hypothetical, and disputed allegations have distinct statuses. A stated fact does not override evidence. Every contradiction between a stated fact and the evidence is flagged with an ID and stays open until the owner resolves it. The owner's resolution then controls and is propagated to every document that references the fact, following `fact-conflict-resolution.md` (flag, argue both sides, owner resolves, log, propagate, verify).
2. Defense posture. Defense work starts from the client's innocence; that is its foundation. Search actively for misconduct, Brady and Giglio violations, and fabricated or altered evidence by the prosecutor and the investigating officers (`discovery-brady-giglio`, `prosecution-case-review`, `analysis-frameworks.md` section 8). Test every piece of evidence rigorously. For each disputed point, build the strongest argument on both sides; the owner then states the answer, which settles the point (`fact-conflict-resolution.md`). Drafting safeguard, for filing strength: in a court filing, tie each misconduct allegation against a named official to cited record evidence (`master-rules.md` K6). Unsupported accusations risk sanctions (for example, Fed. R. Civ. P. 11(b)(3), (c); in North Carolina civil actions, N.C. Gen. Stat. § 1A-1, Rule 11(a); in criminal matters, N.C. R. Prof'l Conduct 3.1) and weaken credibility with the court.
3. Find the best available evidence for each point first; the owner verifies it where possible. State the burden and threshold for each issue and procedural stage as a legal fact from verified authority. For guilt, the State must prove every element beyond a reasonable doubt (In re Winship, 397 U.S. 358, 364 (1970); confirm the ledger entry before citing, K1). The burden statement helps the defense and belongs in filings, but it supports the best-evidence search and never replaces it. Do not apply preponderance to every issue.
4. Evidence may support more than one legal issue. MECE controls issue organization, not artificial exclusion of overlapping facts.
5. A source's bias, a witness's prior dishonesty, or an expert's compensation warrants examination; none automatically makes every statement false or establishes disqualification (examine, do not disqualify). When the opposing side relies on a witness with a documented history of dishonesty, flag that reliance as flawed logic in its case and analyze it (`analysis-frameworks.md` section 8): cite the history and test the specific testimony against independent evidence. Do not reject the testimony automatically.
6. The strongest available hypothesis is not necessarily proved. Missing data is not proof of fabrication or destruction. A contradiction does not by itself establish knowledge, materiality, causation, or entitlement to relief.
7. Every source must actually be read, and its content sent to the model, with locations preserved. Never send only paths, filenames or directory names; that does not establish that the sources were reviewed.
8. A summarizer cannot substitute for a drafter. When a motion is assigned, the workflow must progress to motion text, order, support, and hearing/preservation materials.
9. Scores and probabilities. Bayesian comparison of competing explanations is allowed in working analysis and reasoning tools; state priors and likelihoods as labeled working estimates (`analysis-frameworks.md` section 6). 1–10 scorecards are allowed in local working documents. Final documents (filings, memos to counsel or the court, anything marked final or filing-ready) contain no numeric likelihood, probability or score (`master-rules.md` K7).

Adaptations 1, 2, 3, 5, 7 and 9 record the owner's decisions of 2026-10-02 on the Review Items conflicts (`docs/REVIEW_ITEMS_ADOPTION.md`).

Apply `reasoning-foundation.md` for the supported premise-to-inference-to-action sequence. It operationalizes the existing methods without replacing them or changing fact-conflict resolution, defense posture, burdens, authority statuses or owner-controlled rules.

Use the full method in internal workpapers. Court-facing text presents the legal argument and record, without narration about reasoning frameworks or model operation.
