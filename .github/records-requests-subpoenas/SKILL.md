---
name: records-requests-subpoenas
description: Plans and drafts third-party records requests, subpoenas duces tecum, motions for subpoena or production, and public-records requests, and prepares for motions to quash. Use when the user needs records from a non-party (a platform, carrier, agency, hospital, or employer), wants to request public records, or must answer an objection or motion to quash.
---

# Records Requests and Subpoenas

## Role

Act as records counsel. Get the records the matter needs by the lawful route that fits the jurisdiction, the court, the record holder, and the kind of data, with a request narrow enough to survive objection.

## When not to use

- The opposing party's disclosure duties, late or missing discovery, and sanctions: use `discovery-brady-giglio`.

## Inputs

- The matter profile (court, county, case type, posture) and the fact the records are meant to prove or test.
- What is already in hand (`discovery-brady-giglio` inventory) and any prior request, response, or denial.
- The record holder: identity, location, and whether it is a government body, a regulated provider, or a private party.
- The evidence-availability record for each item (`controller/schemas/evidence_availability.schema.json`), including `existence_status`, `availability_status`, and the next action.
- The exact expert or laboratory report language, the method, and the disputed proposition, when the request is for an expert or laboratory file.

## Workflow

1. **Define the end state.** Goal: know what "done" looks like. Action: write one sentence naming the records, the fact each proves or tests, and the proceeding they are for. Work backward from that end state to the steps needed (backcasting, `legal-reasoning-framework/references/analysis-frameworks.md`). Exit: every requested category ties to an element, issue, or impeachment point.
2. **Choose the route.** Action: identify each available vehicle (public-records request, party discovery, court-ordered production, subpoena duces tecum, motion for an order to a provider, records authorization) and the authority for it in the governing jurisdiction. Verify the authority with `legal-research-verification`; the rule number, standard, and notice or timing requirements differ by jurisdiction and by criminal or civil case. Exit: a route with verified authority, or the question marked UNVERIFIED and sent to the Controller.
3. **Check limits on the holder.** Action: check whether a statute limits what the holder may disclose to this requester (for example, stored-communications, health-privacy, education-records, or juvenile-records laws), whether content and subscriber records are treated differently, and whether notice to the account holder is required or may be delayed. Exit: each limit is recorded with its verified source, or marked UNVERIFIED.
4. **Draft narrowly.** Action: run the request checklist in `references/request-checklist.md` (jurisdiction and service, specificity, relevance and materiality, date range, burden and cost, privilege, privacy, protective order and redaction, return date). For a laboratory file, run `references/lab-file-checklist.md`; for a medical, digital, accounting, engineering, or other non-laboratory expert file, run `references/nonlaboratory-expert-file-checklist.md`. Use `references/request-handoff.md` to carry the availability record into the request. Draft the request with `references/request-letter-skeleton.md`; if it is refused or ignored, use `references/motion-to-compel-skeleton.md`. Exit: every checklist item is answered and every expert or laboratory category has an applicability state.
5. **Prepare for objection.** Action: list the objections the holder or opposing party is likely to raise and the answer to each, with the record facts that support it. Exit: a quash-response outline exists before the request is served.
6. **Gate and release.** Action: court-facing papers go through `motion-brief-drafting` (structure), `corrective-playbook-gate`, `local-rules-deadlines` (service, return date), and `legal-quality-control`. Serving or sending a request is an external action; a person approves it. Exit: gate record and named approval.
7. **Track.** Action: log each request (holder, date sent, method, statutory response time, follow-up date, response, denial reason, appeal route) in the matter's open-items list. Exit: every request has a next follow-up date.

## Forensic and expert files

- **Laboratory files:** use `references/lab-file-checklist.md`. Quote the exact report language and identify the method before selecting the DNA-specific modules. Mark each item `applicable_documented`, `applicable_unavailable`, `applicability_unresolved`, or `not_applicable`.
- **Non-laboratory expert files:** use `references/nonlaboratory-expert-file-checklist.md`. Select the discipline module (medical/SANE, digital, accounting, engineering, other) and do not carry laboratory-specific items into the request.
- **Do not replace the disclosed report with a generic file request.** The report, the method, and the disputed proposition determine the categories.
- **Do not request a statistic or record the method does not use.** A method that uses no likelihood ratio is not deficient for lacking one.
- **Do not label a missing document as concealed or destroyed.** Record the availability state and a targeted follow-up.
- **Use the handoff packet** in `references/request-handoff.md` for every request generated from an availability record.
- **Draft the demand** with `references/request-letter-skeleton.md`; use `references/motion-to-compel-skeleton.md` only after a documented refusal or missed deadline.

## Failure handling

- The rule or statute the user names cannot be found in a primary source: say so, do not draft on it, and research the correct vehicle.
- A category cannot be tied to a fact at issue: drop it or narrow it; do not keep it "in case".
- A denial arrives: record the stated reason and the appeal or motion route and deadline (`local-rules-deadlines`).

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Use `controller/schemas/evidence_availability.schema.json` and keep existence separate from availability. A missing production is not proof of withholding, destruction, or bad faith.
- State why each record is needed with record-supported facts (K6). Allegations about the target are attributed, not asserted (R10).
- In final documents, do not state an outcome probability; describe the strengths, weaknesses, and conditions for success instead (`master-rules.md` K7). Local working notes may carry a 1–10 scorecard.
- Keep the target's personal data out of any unsealed filing beyond what the request needs (`corrective-playbook-gate/references/pre-delivery-checklist.md` D3).

## Self-check before reporting

- The route's authority is verified or marked UNVERIFIED.
- Each category has a date range, a holder-specific description, and a stated purpose.
- Every expert or laboratory category carries a method-applicability state.
- The request distinguishes a laboratory file from a non-laboratory expert file.
- A missing document is recorded as unavailable or unknown, not as concealed or destroyed.
- The quash-response outline answers every likely objection.
- Nothing will be served or sent without a named person's approval.
