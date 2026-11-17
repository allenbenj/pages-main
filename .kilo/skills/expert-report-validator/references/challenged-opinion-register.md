# Challenged-opinion register

Use this register for every opinion the review challenges. Do not write a general critique of the expert; tie each entry to a specific opinion and a specific deficiency.

## Fields

| Field | Meaning |
|---|---|
| `opinion_id` | Stable ID (`EO-…`). |
| `opinion` | The exact opinion, quoted or closely paraphrased with a pin. |
| `proposition_level` | `source`, `activity`, `offense`, or `other`. |
| `method` | The actual method or discipline. |
| `qualification_fit` | Whether the expert is qualified on this precise method. |
| `reliability_facts` | The file or report facts bearing on reliability. |
| `disclosure_status` | `disclosed`, `not_disclosed`, `partial`, or `unknown`. |
| `deficiency` | The specific defect: qualification, method, data, application, disclosure, or overstatement. |
| `authority_id` | The ledger ID for the governing standard. |
| `authority_status` | `UNVERIFIED`, `VERIFIED`, or `RELIANCE_APPROVED`. |
| `state_best_response` | The strongest opposing response. |
| `remedy` | Compel, continue, limit, exclude, or hearing. |
| `expert_questions` | Only the questions the inference actually needs. |

## Deficiency categories

- **Qualification:** the expert lacks the specific method or application experience.
- **Method:** the method is not reliable for the question, or the report does not explain it.
- **Data:** the underlying data are missing, incomplete, or inconsistent with the opinion.
- **Application:** the method was not reliably applied to these facts.
- **Disclosure:** the report or file is incomplete under the governing rule.
- **Overstatement:** a source-level finding is presented as an activity or offense conclusion.
- **Foundation:** the exhibit or report lacks authentication.
- **Statistical:** the reported statistic is misread, unsupported, or presented without its assumptions.

## Proposition-level discipline

- **Source:** what the item or result is, as reported.
- **Activity:** what happened, who did it, or how it was deposited. Requires qualified support beyond the source.
- **Offense:** the legal elements. Requires evidence and legal analysis beyond the source; a laboratory result cannot carry it alone.
- **Other:** a defined intermediate proposition.

If the proposition is activity or offense, record the qualified support or mark the inference `UNRESOLVED`. Do not add a token question and call it supported.

## State's best response

State the strongest response the offering party could make, not a straw man:

- the expert is qualified;
- the method is reliable and applied;
- the data are sufficient;
- the report complies;
- the defense had the information;
- the challenge goes to weight, not admissibility;
- the remedy is disproportionate.

## Expert questions

Write a question only when:

- the inference depends on an untested assumption;
- the file or report is silent on a material method step;
- the expert's personal knowledge or review is unclear;
- a concession would narrow the opinion.

Do not write a generic question to fill a template. A supported opinion may need no question.

## Example row

| Field | Example |
|---|---|
| `opinion_id` | `EO-001` |
| `opinion` | "The profile is consistent with Sample A." |
| `proposition_level` | `source` |
| `method` | autosomal STR |
| `qualification_fit` | Qualified on autosomal STR; verify the specific interpretation training. |
| `reliability_facts` | Report states a single-source profile and a CPI; the underlying interpretation worksheet is missing. |
| `disclosure_status` | `partial` |
| `deficiency` | Data: the interpretation worksheet and thresholds are not produced. |
| `authority_id` | `NC-RE-702` |
| `authority_status` | `UNVERIFIED` |
| `state_best_response` | The report is sufficient; the worksheet is work product or not required. |
| `remedy` | Compel the worksheet; if unavailable, limit the opinion. |
| `expert_questions` | "What thresholds were applied, and where are they recorded?" |
