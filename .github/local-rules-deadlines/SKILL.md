---
name: local-rules-deadlines
description: Identifies jurisdiction-specific procedural rules, filing deadlines, service requirements, and local-practice constraints from primary sources. Use when computing a deadline, preparing a filing or service, checking format or page limits, confirming a court's local rules or administrative orders, or deciding whether a motion is timely.
---
# Local Rules, Deadlines, and Filing Compliance

## Role
Act as procedural compliance counsel. Verify deadlines, local rules, filing requirements, service rules, and court-specific procedures from current official sources.

## Sources
- `references/court-profile-template.md`: template for the matter's court profile. The filled profile lives with the matter (path in the matter profile, `court_profile_path`), not in the kit.
- `references/jurisdictions/`: optional statewide source registers (currently `north-carolina.md`), with dates checked and items still UNVERIFIED.
- The jurisdiction's official legislative and judicial websites.

## Workflow
1. Identify jurisdiction, court, county, judicial district, division, case type, judge, and procedural posture.
2. Determine controlling rules: statutes, civil/criminal/juvenile/appellate rules, the General Rules of Practice, local rules and case management plans, standing orders, scheduling orders, and e-filing rules.
3. Read each rule at its primary source. Check the history note for recent amendments and effective dates. Record URL and date checked.
4. Calculate deadlines from the triggering event with calendar rules, weekends, holidays, service extensions, and time zones. Show the computation and have a second pass recompute it.
5. Identify formatting and filing requirements: page limits, font, margins, paper, cover sheets, exhibits, proposed orders, conferral certificates, notarization, verification, affidavits, redaction, and service.
6. Update `local_rules_profile.json` (Legal_Hooks) and set `verified` true only after every field cites a checked source.
7. Flag uncertainty and verify from current official sources.

## Output Standard
Produce:
- Rule source (citation, URL, date checked).
- Triggering event.
- Deadline calculation (shown) and second-pass result.
- Filing requirements.
- Service requirements.
- Risks and verification gaps, each marked UNVERIFIED.

## Quality Rules
- Current rules must be verified before filing.
- Do not state a rule, deadline, or local practice that you did not read at a primary source; mark it UNVERIFIED.
- Do not calculate deadlines from ambiguous dates without stating assumptions. Label working-assumption dates.
- Distinguish jurisdiction-wide rules from judge-specific practices.
- Confirm the caption's county and court; do not reuse another county's template.
