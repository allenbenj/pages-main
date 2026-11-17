# Judicial Grantability Rubric & Predicate Evaluation Guide

**Module:** `skills/judicial-procedural-review/references/grantability-rubric.md`  
**Purpose:** Formal evaluation standards for the 16 judicial and procedural predicates, disposition logic, and bounded cure conditions.

---

## 1. The 16 Mandatory Judicial Predicates

| # | Predicate | Category | Binding Requirement | Failure Mode & Disposition Consequence |
|---|---|---|---|---|
| 1 | `jurisdiction` | Legal | Verified statutory or constitutional jurisdictional grant (`basis_authority_ids`) | If absent or unverified, state is `legal_check_required`; defeats `grantable`. |
| 2 | `posture` | Legal | Procedural posture match under governing rules of criminal procedure | If wrong procedural vehicle, state is `unsupported` or `barred`. |
| 3 | `court_power_remedy` | Legal | Express court authority to award specific requested remedy | If power does not exist, state is `barred` or `unsupported`. |
| 4 | `timeliness` | Legal | Proof of timely filing under statute or scheduling order | If late without good cause showing, state is `unsupported` or `barred`. |
| 5 | `preservation` | Legal | Specific objection or motion preserving issue for review | If issue forfeited or waived, state is `unsupported`. |
| 6 | `standing` | Legal | Legal standing and aggrieved status of the accused | If no standing, state is `unsupported` or `barred`. |
| 7 | `burden_standard` | Legal | Allocation of proof burden and governing review standard | Must cite controlling precedent; cannot be satisfied by assumption. |
| 8 | `relief_element` | Factual | Direct connection to a charged statutory or constitutional element | Must link to charged offense or specific constitutional guarantee. |
| 9 | `record_support` | Factual | Dispatched source pin cite (`basis_source_ids`) | If absent from record, state is `unsupported`. |
| 10 | `foundation_admissibility` | Factual | Evidentiary foundation and competency | If based on inadmissible hearsay or unauthenticated exhibit, state is `open_question`. |
| 11 | `materiality` | Factual | Substantive consequence of the fact | Must demonstrate that fact affects outcome; otherwise `unsupported`. |
| 12 | `prejudice` | Factual | Legally cognizable injury or constitutional harm | Conclusory assertions of harm remain `open_question`. |
| 13 | `causation` | Factual | Nexus showing requested relief redresses injury | Relief that does not remedy prejudice is `unsupported`. |
| 14 | `fit_narrowness` | Both | Narrow tailoring of proposed remedy to the established defect | Overbroad relief is `open_question` or `unsupported`. |
| 15 | `adverse_authority` | Legal | Identification and substantive answer to adverse precedent | Omission of adverse authority defeats `grantable` (`UNDECLARED_AUTHORITY_REFERENCE`). |
| 16 | `proposed_order` | Legal | Enforceable operational order language | Missing or vague order terms remain `open_question`. |

---

## 2. Predicate States

1. `supported`: All legal and evidentiary elements satisfied with valid pinpoint citations. Requires label `(a)`.
2. `open_question`: Evidentiary gap to be addressed through investigation or evidentiary hearing. Label `(b)`.
3. `legal_check_required`: Legal basis requires research and verification against primary authority. Label `(c)`.
4. `unsupported`: Record or legal foundation is affirmatively absent.
5. `barred`: Request is legally or procedurally prohibited under controlling authority.

---

## 3. Dispositions & Cures

- **`grantable`**: Permitted ONLY when all 16 predicates are `supported` (label `a`), all authorities are verified, and no defects exist.
- **`grantable_if_cured`**: Permitted when non-supported predicates can be cured by a specific, identified procedural step, evidence, or verified rule. Every unmet predicate must be enumerated in `missing_predicates` and paired with an operational, concrete cure in `cure_conditions`.
- **`not_grantable`**: Required when any predicate is `unsupported` or `barred`. The `reason_type` must match the failing predicate state.
