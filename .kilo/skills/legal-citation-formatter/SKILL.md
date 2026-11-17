---
name: legal-citation-formatter
description: Formats and validates legal citations in Bluebook (or ALWD) style, checks pin cites, and flags incomplete or non-standard citations. Use when preparing or revising any brief, motion, memorandum, or research note that contains citations, or when the user asks for citation cleanup or Bluebook compliance.
---
# Legal Citation Formatter

## Role
Act as citation counsel. Convert raw case names, statutes, rules, and secondary sources into consistent Bluebook (21st ed. default) or ALWD form, verify pin cites against available sources, and produce a clean citation list or in-text corrections.

## When to Use
- Before finalizing any court filing or research note that contains citations.
- When the user pastes a draft and asks to "fix the citations," "Bluebook this," or "check pin cites."
- As a final pass after `motion-brief-drafting` and before `legal-quality-control`.

## Inputs
- Draft text containing citations (or a list of raw cites).
- Preferred style: Bluebook (default) or ALWD. Note the edition if specified.
- Available primary sources or the matter’s authority ledger (for pin-cite verification).
- Jurisdiction signal if local citation rules apply (check `local-rules-deadlines`).

## Workflow
1. Identify every citation in the text (cases, statutes, rules, constitutions, secondary sources, record cites).
2. Normalize each to the chosen style:
   - Cases: full case name, volume, reporter, page, court, year, and pinpoint if available.
   - Statutes: code title, section, year or supplement.
   - Rules: full rule number and source.
3. For each case citation with a claimed pinpoint, verify the page exists in the available opinion or transcript (coordinate with `verify_quotes.py` / `tr_lookup.py` when present). Flag any pin that cannot be confirmed.
4. Apply short-form rules after the first full citation of a source.
5. Flag signals: missing pin, incomplete case name, non-standard reporter, unverified authority (hand to `legal-research-verification`), or local-rule deviation.
6. Produce a corrected version of the text (or a side-by-side correction list) and a summary of remaining issues.

## Output Standard
- Corrected citations in place (or a marked-up list).
- Summary table: Original | Corrected | Status (OK / Pin unverified / Authority unverified / Style issue).
- Any items that must go to `legal-research-verification` before reliance.
- Note that citation form does not equal authority validity; authority status remains governed by the ledger and `legal-research-verification`.

## Rules
- Follow `corrective-playbook-gate/references/master-rules.md`. Exact quotation and pin rules still apply.
- Do not invent volume, page, or year numbers. If a component is missing, leave a clear placeholder and flag it.
- Prefer the official reporter when available. Note parallel citations only when useful or required.
- Record cites (transcript, affidavit, exhibit) follow the matter’s existing convention; do not force Bluebook form on them unless requested.
- Keep citation work separate from argument rewriting. Do not change the surrounding prose except to insert or correct the citation itself.

## Integration
- Run after drafting and before the final quality-control gate.
- Hand any authority that is not already `reliance_approved` to `legal-research-verification`.
- Coordinate with `motion-fact-verification` and the quote/pin verifier for record and opinion pins.

## References
- `references/bluebook-quick-patterns.md` — common patterns and short forms (load when formatting).
