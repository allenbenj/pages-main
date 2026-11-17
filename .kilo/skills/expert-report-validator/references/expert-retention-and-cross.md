# Defense-expert retention and expert cross-examination

Use this reference after the expert-review mode is selected. Scope the expert to the precise disputed proposition, not to a generic discipline.

## Scoping

Identify:

- the precise proposition the expert must address, in one sentence;
- the bounded questions the expert must answer;
- the method or discipline actually needed;
- the qualifications required for that method;
- the independence and any conflict;
- the documents, data, and exhibits to review;
- the version and SHA-256 of each source;
- the limits on the opinion;
- the deadline and the review protocol.

Do not retain a "DNA expert" for a transfer question, a "medical expert" for a chain-of-custody question, or a "digital expert" for a statistical question. Match the expertise to the proposition.

## Consulting versus testifying

| Question | Consulting | Testifying |
|---|---|---|
| Purpose | Advise counsel, test theories, review the file. | Offer an opinion in a report or testimony. |
| Privilege / work product | Potentially protected; verify the jurisdiction and communication. | Protection may be reduced or lost; verify the trigger. |
| Disclosure | No automatic disclosure; identify the verified trigger. | The report and disclosure rules apply; verify them. |
| Funding | Identify the verified funding or ex parte route. | Same, plus the disclosure consequence. |
| Role change | The disclosure consequence may change. | Confirm the report and disclosure before testimony. |

A consulting label does not automatically resolve privilege, and a testifying designation does not automatically waive it. Do not assume that a consulting expert's work is discoverable or protected without the verified rule.

## Funding and access

- For an indigent defendant, identify the verified expert-assistance route and any ex parte procedure.
- *Ake v. Oklahoma* is a candidate authority (`US-AKE`, `UNVERIFIED`); verify the opinion and the NC implementation route.
- Record the request, the order, the funding source, and the scope.
- Do not assume a request is granted or that a particular ex parte route exists.

## Engagement letter

Use `references/engagement-letter-template.md`. The letter must state:

- the precise disputed proposition and the bounded questions;
- the documents, data, and exhibits to review;
- the versioned hash list;
- the method and the limits;
- the deadline and the review protocol;
- the role (consulting or testifying) and the disclosure consequence;
- the compensation and independence terms;
- the preservation and retesting condition.

Before any sample is consumed, complete the preservation/retesting review in `evidence-matrix-admissibility/references/preservation-retesting.md`.

## Source-driven expert cross

Use `witness-examination/references/expert-cross.md`. The outline must be tied to the report, the file, the raw data, and the claim register.

Cover:

- qualifications within the precise method;
- the expert's actual personal work;
- reliance on other analysts or sources;
- the method and its validation;
- the data and assumptions;
- the stated and additional limits;
- withheld or missing materials;
- controls, contamination, and proficiency;
- contextual information and its timing;
- the concessions that narrow a source-level finding.

Use `transcript-impeachment` commit/credit/confront/control steps with exact line and exhibit pins. Do not fabricate an admission or a contradiction. Integrate `witness-examination` rather than writing a competing cross outline.

## Post-judgment expert failures

If the issue is a post-judgment expert failure, route the narrow ineffective-assistance candidate to `appellate-preservation` under the verified *Strickland* / *Hinton* framework. Do not merge it into a pretrial expert challenge.

## Output

A scoping memo, an engagement letter, a bounded question list, a versioned source list, a cross-examination outline, the concessions sought, and the handoffs.
