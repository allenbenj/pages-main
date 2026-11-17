# Master rules

Version: 0.2.1. Single source of truth for the rules every kit role follows. It carries every rule in the matter's Corrective Playbook plus the kit's own drafting and verification rules. The Playbook's location is set per matter in the matter profile (`playbook.path`; see `Legal_Kit/matter_profile.template.json`). If another kit file conflicts with this file, this file governs. The Playbook governs this file. In literal mode the Playbook's own text controls; in general mode the Playbook applies through the general-mode principles in this file (owner scope decision of 2026-09-30, below). If this file misstates the Playbook, correct this file.

The owner directs that the Corrective Playbook rules are **always** followed. They are pre-delivery rules about the correctness of work product. They are not transmission or file-movement gates, so the authorization to send case material to outside models does not relax them.

This file supplies workflow discipline, not legal advice or substantive law.

## How to apply the Playbook

A Corrective Playbook is written from one reference opinion (the "reference opinion"), named in the matter profile (`playbook.reference_opinion`). Apply it in two modes. Both are mandatory.

- **Literal mode.** When the reference opinion is the source or the subject of the work, apply every Playbook rule exactly as the Playbook states it, including any closed list of authorities, exact page cites, and exact disposition wording. The literal-mode specifics live in the Playbook itself and, when one has been prepared, in the matter's literal-rules file (`playbook.literal_rules_file` in the matter profile). They are not reproduced in this kit.
- **General mode.** For any other court document, and for any drafting, apply the rule's principle as stated in the "General mode" column. Never use general mode to weaken a rule. If it is unclear whether the reference opinion is the subject of the work, ask; until answered, apply literal mode to the passages about that opinion and general mode to the rest.

### Owner scope decision (2026-09-30)

The owner decided on 2026-09-30 how far the Playbook's literal wording reaches. The Playbook was written first for one reference opinion; it now supports the Legal Kit processes.

1. **Literal mode applies only when the reference opinion is the source or subject of the work.** The literal wording (its closed list of authorities, page cites, disposition wording, and advice framing) lives in the Playbook and the matter's literal-rules file.
2. **All other work applies the Playbook as general principles supporting the kit processes:** the "General mode" column below, the pre-delivery checklist, and the K-rules.
3. **R1 in general mode:** cite only verified authority, meaning an authority that is `reliance_approved` in the authority ledger after primary-source verification, and state facts only from the record, cited by source ID and pinpoint. Never cite an unverified authority, and never cite from memory or model output.
4. **Part III check 10 (checklist A10) in general mode:** the "study aid, not legal advice" framing becomes a status label, used only on work that is not a filing (for example: "Internal analysis. Not legal advice. Not reviewed for filing."). A filing carries no such disclaimer. No work product predicts a ruling.
5. Work that mixes both applies literal mode to the passages about the reference opinion and general mode to the rest.

The matter records the same decision in its control folder (see the matter profile, `playbook.scope_decision_path`).

Severity tags come from the Playbook:

- **[BLOCKER]**: violating it makes the output false or worthless. Fix before delivering.
- **[REQUIRED]**: violating it weakens the output materially.
- **[DISCIPLINE]**: a habit that prevents the first two classes of error.

## Part I: correctness rules (Playbook R1–R10)

| ID | Tag | Rule | General mode (every other document and all drafting) | Check |
|---|---|---|---|---|
| R1 | BLOCKER | Never cite a case, statute, rule, or page that is not in the source document. In literal mode the reference opinion's authorities are exactly the Playbook's closed list. | Analyzing a document: cite only authorities that appear in it, with the page. Drafting: cite only authorities that are `reliance_approved` in the authority ledger after primary-source verification. Never cite from memory or from model output. | Paste the page (analysis) or the ledger ID and primary-source URL (drafting) for each cite. If you cannot, delete the cite. |
| R2 | BLOCKER | Distinguish a failure of pleading from a failure of proof. Never describe a pleading-stage ruling as a merits defeat. Forbidden phrasings for a pleading ruling: "the court found the plaintiffs' account untrue"; "the evidence did not support"; "the court weighed the testimony"; "the plaintiffs lost at trial"; "the court found no probable cause existed." | Identify the procedural stage of every ruling you describe (screening, pleading, summary judgment, trial, appeal, postconviction). Describe it only at that stage. A pleading ruling assumes the pleaded facts; it does not find them. | No sentence says or implies that a court weighed evidence it did not weigh. |
| R3 | BLOCKER | Never state or imply that a recommendation already disposed of the case. Report each part of a multi-part disposition with its own verb (for example, relief **ordered** for a limited purpose, dismissal **recommended**). | Report every disposition exactly as entered: ordered, recommended, granted, denied, taken under advisement, or pending. Name the decision-maker and document type (order, recommendation, judgment, text order). | The disposition verb matches the document's own verb, with a page cite. |
| R4 | BLOCKER | A quotation embedded in an opinion is not its holding. An opinion that quotes an earlier order or a brief is reporting that text, not adopting it. | Before attributing a proposition to "the court," find it in the court's own voice, outside a quotation of an earlier ruling or brief and outside an "X asserts" construction. | Every "the court held/said" traces to a passage in the court's own voice. |
| R5 | BLOCKER | Do not elevate a footnote or passing observation to a holding. Report alternative grounds as alternatives. Do not report a holding on an issue the court did not reach. | Label each proposition as holding, alternative ground, footnote, observation, or dictum. Never assert a holding on an issue the court said it did not reach. | No footnote or observation is quoted as a holding. |
| R6 | REQUIRED | State the standard the court actually used, with its source and page. Do not use summary-judgment or burden-of-proof language for a pleading ruling. | State the standard of review or decision the court actually applied, with its source and page. Do not import a standard from another court system. A federal pleading standard is not automatically a state court's pleading standard. Verify the governing standard before stating it; until verified, mark it UNVERIFIED. | The standard is quoted with a page cite and matches the court and stage. |
| R7 | REQUIRED | Attribute each defect to its kind: legal unavailability, missing element, conclusory pleading, or internal inconsistency. Each has a different cure (see the Playbook's defect table). | Classify every defect you report or find in your own draft into one of the four kinds and state the cure. Do not promise that more facts cure a legal bar. | Each defect carries a kind and a cure. |
| R8 | REQUIRED | Quote the court's legal tests verbatim with the page. A shifted word ("must" → "should") is a misstatement. | Quote every legal test, statute, and rule verbatim from the primary source, with page, section, or subsection. Paraphrase only after the quotation, and mark it as paraphrase. Never alter quoted characters, including dashes and curly quotes, except by marked brackets or ellipses. | Compare each quotation character-for-character against the source. |
| R9 | REQUIRED | Add no facts, statistics, or context the document does not contain. In literal mode, the allowed facts are the Playbook's list. | Add no fact that the cited source does not contain. Anything later or outside it (objections, outcomes, relationships, later rulings) is unconfirmed unless a separate source is cited. | Every factual sentence has a record or source cite. |
| R10 | DISCIPLINE | Mark each sentence as (a) the court said X, (b) a party alleged X, or (c) X is unconfirmed or not in the document. | Use the proposition classes: court said / party alleged / record shows (with cite) / inference (labeled) / unconfirmed. A party's allegation is never written as fact. | Every factual sentence carries an attribution. |

## Part II: substantive audit (Playbook Part II, items 1–14)

Use before producing any civil-rights pleading (for example, 42 U.S.C. § 1983) or any document that describes one. These items are an audit list, not statements of law. Verify each element in controlling authority for the governing jurisdiction and court before relying on it, and record the authority in the ledger. A reference opinion that states these elements (for example, a magistrate judge's recommendation) is not controlling authority.

**A. Threshold gates (before drafting any count)**
1. Suable entity. Confirm under the governing state law that each defendant (including any sheriff's office, police department, or other agency) is a legal entity capable of being sued. Do not assume it.
2. Capacity. Individual or official capacity determines the required showing.
3. Actionability. Negligence alone is not a constitutional claim under § 1983. Criminal statutes generally create no private right of action. Verify both for the claim at issue.
4. Remedy availability. An injunction must meet the governing rule's specificity requirements (in federal court, Fed. R. Civ. P. 65(d)); a declaration must have legal effect.

**B. Per-defendant elements**
5. Individual capacity: personal participation. Knowledge alone fails. Post-incident conduct fails for want of causation. Do not name a supervisor for a subordinate's act.
6. Official capacity: policy, custom, or policymaker omission, and final authority. Contradiction alert: pleading that an official violated the department's own policy can defeat a policy-based claim.
7. Warrant application: the governing standard for an officer's reliance on a warrant application (verify; in federal claims this is commonly analyzed under *Malley v. Briggs*); there is generally no duty to exhaust every investigative avenue.
8. Warrant execution: knowledge of the warrant's infirmities, or an identified deficiency in the warrant.

**C. Factual enhancement**
9. Plead every element with facts, not labels.
10. Match the standard you attack.
11. Plead the amendment or right actually alleged; listing an amendment is not pleading it.
12. State the remedy specifically and in reasonable detail.

**D. Disposition discipline**
13. A screening dismissal is not a merits determination; report it as a pleading failure.
14. Report a two-step disposition as ordered versus recommended. (Playbook Part III check 4 cites this item as "R14".)

For drafting a complaint, also run the matter's complaint-drafting gate (`playbook.complaint_gate_path` in the matter profile), Gates 0–10 and its Part 10 certification, when the matter has one.

## Part III: pre-delivery checklist

Run `pre-delivery-checklist.md` in order. Any failure blocks release.

## Part IV: the nine mistakes the Playbook is built to catch

1. Reporting a screening dismissal (for example, under 28 U.S.C. § 1915(e)) as a merits ruling.
2. Saying the case "was dismissed" when dismissal was only recommended.
3. Treating a quoted earlier order as the opinion's own analysis.
4. Attributing claims from one pleading to another (for example, original versus amended complaint).
5. Citing authority the court did not cite.
6. Paraphrasing a test loosely.
7. Inventing context (objections, outcomes, later rulings).
8. Missing that an allegation can defeat its own claim.
9. Treating all defects as curable by more facts.

## Part V: kit drafting and verification rules (K-rules)

These extend R1, R8, and R9 to all court-facing work.

- **K1. Authority ledger.** Every cited authority has a ledger entry with the fields in `Legal_Hooks/policy.json` `authority_required_for_reliance`, including primary source and treatment check date. Label anything else `Candidate authority - verification incomplete` and keep it out of the argument.
- **K2. Identity, not name.** A citation matches the ledger by reporter volume, reporter, and first page, or by docket number, statute section, or rule number. A case name alone never verifies a cite.
- **K3. Primary sources.** Verify statutes and court rules at the official legislative and judicial sources for the jurisdiction (see `local-rules-deadlines/references/jurisdictions/` for recorded sources; for federal courts, the official federal source). Record the URL and date checked. A model answer, a secondary source, or a search snippet is a lead, not verification.
- **K4. Current law.** Check the section's history note for recent session-law amendments and effective-date limits before relying on it. See the jurisdiction reference for a worked example.
- **K5. Citation form.** Use current Bluebook form unless a court rule requires another form. Include pincites for every proposition. Whether the court requires parallel or public-domain citations is jurisdiction-specific; verify before filing.
- **K6. Record support.** Every factual sentence in a court paper cites a record source by ID and pinpoint. Summaries, catalogs, AI output, and `Prior_Work_Product_Unverified` files are leads, not record support. A misconduct allegation against a named official in a court paper is tied to cited record evidence; an unsupported accusation risks sanctions and weakens credibility with the court (`legal-reasoning-framework/references/integrated-reasoning-for-motions.md`, adaptation 2; owner decision 2026-10-02).
- **K7. Court-facing text only.** Remove model tags, prompts, framework labels, internal review dialogue, and placeholders before release. Final documents (filings, memos to counsel or the court, and anything marked final or filing-ready) contain no scores and no numeric likelihood or probability figures. Local working documents may carry 1–10 scorecards and labeled Bayesian working estimates; strip them when text moves into a final document (owner decision 2026-10-02).
- **K8. Caption and identity.** Confirm court, county, file number, parties, and title against the court file and the matter profile. Do not carry a caption from another matter's or another county's template.
- **K9. Deadlines.** Compute every deadline from the rule's text and the triggering event, state the rule and the computation, and have a second pass recompute it. Treat unconfirmed dates as working assumptions and label them.
- **K10. Structure.** Court papers follow the template in `motion-brief-drafting/references/court-document-template.md`: introduction, procedural posture, factual background, legal standard, argument (IRAC per issue, with the strongest counterargument answered), requested relief, conclusion, signature and service.
- **K11. Burden, best evidence, and admissibility.** For each point, find the best available evidence first; the owner verifies it where possible. State who bears the burden, the standard, and its source for each issue, as a legal fact from verified authority (for guilt, proof beyond a reasonable doubt of every element). The burden statement supports the best-evidence search and never replaces it. Do not apply preponderance to every issue (owner decision 2026-10-02). For each exhibit or quoted statement, state the foundation and admissibility basis under the governing rules of evidence (recorded in the jurisdiction reference) or mark it unresolved.
- **K12. Epistemic labels survive drafting.** Internal work product keeps R10 labels. Court papers convert them into attribution ("The affidavit states…", "Defendant contends…"), never into unattributed fact.
- **K13. Human sign-off.** No automated output, gate result, or tracker status is filing approval. A named person records the sign-off.
- **K14. Matter knowledge sources.** A matter may name reference knowledge in its profile (`knowledge_roots`), each tier with a role. A `base_secondary` tier (for example, a state judges' benchbook) is where research on the governing law starts; a `companion_secondary` tier is read alongside it, and where the two differ, flag the difference. Both are secondary sources: they locate primary authority and never replace it (K3). Verify every proposition against current primary law (statute, rule, controlling opinion) before citing it, and cite the primary authority; cite the secondary source itself only after that check. Read a chapter's currency date first; a chapter dated before the tier's `law_change_check_before` date needs a law-change check (K4) before any reliance. A `background_only` tier is never cited, quoted as authority, or used to support a proposition. Knowledge tiers do not change the case-fact retrieval order; search them through the same layers, and take quotations and pin cites from the original file. The matter's knowledge guide (`knowledge_roots.guide`) says how to search them.

## Precedence and conflicts

1. The matter's Corrective Playbook. It always applies: its own text in literal mode, and through this file's general-mode principles otherwise (owner scope decision of 2026-09-30).
2. Matter-specific operating instructions and source restrictions: the matter profile and its folder, and the matter's control folder. They may add restrictions; they do not relax a Playbook rule.
3. This file and `pre-delivery-checklist.md`.
4. Other kit skills and references.

AGENTS.md files, per-tool agent wrappers, and tool configurations point agents to this ranking. They may not override it. An installed or per-tool copy of a kit skill is a mirror; if it differs from the kit copy, the kit copy controls and the mirror is stale.

Every analysis, memorandum, and court-facing draft passes `corrective-playbook-gate`, then `legal-quality-control`, before delivery.

Report any conflict you find instead of choosing silently.
