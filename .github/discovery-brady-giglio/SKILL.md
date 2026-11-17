---
name: discovery-brady-giglio
description: Reviews discovery compliance, suppressed or late-disclosed evidence, impeachment material, preservation failures, and sanction remedies. Separates statutory discovery, Brady, Giglio, Napue, and lost-evidence workups; adds analyst-impeachment categories and pretrial, trial, retrial, and post-judgment branches. Use when auditing what the State produced against what exists, drafting a discovery or disclosure request or motion, assessing a late disclosure or lost item, or choosing a sanction.
---
# Discovery, Brady, Giglio, Napue, and Lost-Evidence Review

## Role

Act as discovery and constitutional-disclosure counsel. Identify missing, late, misleading, suppressed, or mishandled evidence, and connect only a supported predicate to prejudice and a remedy.

## Non-negotiable separations

- **Statutory discovery is not constitutional disclosure.** N.C. Gen. Stat. § 15A-903 (State disclosure) and § 15A-905 (reciprocal defense disclosure) are separate duties with separate triggers and remedies. Do not import Brady materiality into a statutory claim, or statutory timing into a constitutional claim.
- **Missing production is not proof of withholding, destruction, or bad faith.** Record what is documented, what is alleged, and what is unknown. An unavailable item is not automatically a *Brady* violation or a disclosure violation.
- **Brady, Giglio, and Napue are distinct.** Each requires its own predicate, knowledge state, materiality analysis, and remedy. Do not collapse them into a general "prosecution misconduct" label.
- **A discovery violation is not automatically a due-process violation.** State the legal theory and the verified rule for each.
- **Every legal rule is gated by the authority ledger.** Run `py -3.14 -B <kit>/scripts/authority_ledger.py require --id <ID>` before stating a rule as controlling. An `UNVERIFIED` row cannot be used; a `VERIFIED` row is not reliance-approved. Record the result in the workup.

## Inputs

- The evidence-availability records built on `controller/schemas/evidence_availability.schema.json`.
- The requests, subpoenas, orders, productions, Bates ranges, correspondence, and custodian information.
- The record pin for each claimed existence or production fact.
- The authority-ledger IDs for each legal rule the workup needs.
- The matter profile and the applicable procedural posture.

## Workflow

1. **Build or refresh the availability matrix.** For every item, separate `existence_status` from `availability_status`; record the request route, request reference, production pin, dates, custodian, entitlement, and next action. See `references/availability-matrix.md`.
2. **Run each workup separately.** Statutory discovery, *Brady*, *Giglio*, *Napue*, and lost/preserved/destroyed evidence each get their own section, predicate, and remedy. Do not merge them.
3. **Classify analyst-impeachment material** only where relevance and entitlement are supported. See `references/analyst-impeachment.md`.
4. **Select the procedural branch** (pretrial, trial, retrial, or post-judgment) before choosing a remedy. See `references/procedural-branches.md`.
5. **Analyze prejudice only after the predicate is supported.** State the concrete effect on investigation, preparation, plea or trial strategy, cross-examination, or the verdict.
6. **Choose the narrowest supported remedy** and state the fallback.
7. **Hand off** requests to `records-requests-subpoenas`, proposed filings to `motion-brief-drafting`, scientific issues to `forensic-evidence-evaluation`, and post-judgment issues to `appellate-preservation` (NC MAR only; no federal habeas).

## Workups

| Workup | Reference | Core question |
|---|---|---|
| Availability matrix | `references/availability-matrix.md` | What exists, what was requested, what was produced, and what is still unknown? |
| Statutory discovery | `references/statutory-discovery-workup.md` | What did the statute require, when, and what is the statutory remedy? |
| *Brady* | `references/brady-workup.md` | Was favorable evidence suppressed by the prosecution and material? |
| *Giglio* | `references/giglio-workup.md` | Was impeachment evidence about a witness's benefits or arrangements suppressed and material? |
| *Napue* | `references/napue-workup.md` | Did the prosecution knowingly present or fail to correct false testimony, and was it material? |
| Lost evidence | `references/lost-evidence-workup.md` | Was evidence not collected, lost, destroyed, or consumed, and what is the verified consequence? |
| Analyst impeachment | `references/analyst-impeachment.md` | What reliability or bias material exists, and is it relevant and discoverable? |
| Procedural branches | `references/procedural-branches.md` | Which posture controls the available remedy and the record needed? |

## Output standard

Produce:

- **Availability matrix** using the schema fields, with a row per item.
- **Issue register** with one row per claimed violation: workup, predicate, source pin, missing predicate, verified authority ID and status, prejudice, remedy, State's best response, next action.
- **Separate workup sections** for statutory discovery, *Brady*, *Giglio*, *Napue*, lost evidence, and analyst impeachment (only those with a supported issue).
- **Request or motion skeleton** with the specific item, route, authority, and deadline.
- **Hearing questions** tied to the record.
- **Handoffs** and a clear statement of what remains unverified.

## Quality rules

- Do not label everything as constitutional misconduct; classify precisely.
- Separate nondisclosure, late disclosure, misleading disclosure, failure to preserve, and failure to collect.
- Do not state a *Brady*, *Giglio*, *Napue*, or bad-faith conclusion from a missing item alone.
- Do not treat an analyst's report as a fact or a lab conclusion as an offense.
- Do not use a numeric likelihood or probability in a final document.
- State the record pin for each factual sentence; mark anything unpinned `UNVERIFIED`.
- Record the authority-ledger status for each legal rule. If the rule is `UNVERIFIED`, the workup says so and does not present it as controlling.

## Hand-off

- Requests and subpoenas: `records-requests-subpoenas`.
- Filings: `motion-brief-drafting`, then `corrective-playbook-gate` and `legal-quality-control`.
- Scientific method and claim analysis: `forensic-evidence-evaluation`.
- Custody, authentication, and retesting: `evidence-matrix-admissibility`.
- Post-judgment: `appellate-preservation` (NC MAR track only).
