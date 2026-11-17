# North Carolina criminal expert review

Keep the State's disclosure duty and the defense's reciprocal duty separate. Keep the criminal framework separate from civil Rule 26.

## Candidate authorities

| ID | Citation | Status in the kit ledger | Use |
|---|---|---|---|
| `NC-GS-15A-903` | N.C. Gen. Stat. § 15A-903 | `UNVERIFIED` | State disclosure of specified material and information. |
| `NC-GS-15A-905` | N.C. Gen. Stat. § 15A-905 | `UNVERIFIED` | Reciprocal defense disclosure. |
| `NC-RE-702` | N.C. R. Evid. 702 | `UNVERIFIED` | Expert qualification, reliability, and fit; verify the post-2011 text and effective date. |
| `NC-RE-901` | N.C. R. Evid. 901 | `UNVERIFIED` | Authentication of the report or underlying item. |
| `NC-EXPERT-DISCLOSURE-RESEARCH` | To be identified | `UNVERIFIED` | Research placeholder for any NC expert-disclosure or notice-and-demand provision. |

Run the gate before stating any of these as controlling:

```
py -3.14 -B <kit>/scripts/authority_ledger.py require --id NC-GS-15A-903
py -3.14 -B <kit>/scripts/authority_ledger.py require --id NC-RE-702
```

## State branch

1. **Duty.** Identify the verified disclosure requirement, its subsection, and its timing.
2. **Report.** Identify the exact report or proffer and whether it is complete on its face.
3. **Underlying file.** Identify the laboratory or professional file, raw data, bench notes, quality records, and communications that support the report.
4. **Gap.** State the specific missing category, not a general complaint.
5. **Remedy.** Compel, continue, limit, exclude, or a hearing; state the verified basis and the fallback.
6. **State's best response.** The report is sufficient; the item is not within the duty; the production was complete; the defense was not prejudiced; the remedy is unavailable.

## Defense branch

1. **State duty.** Confirm what the State must disclose under § 15A-903.
2. **Reciprocal duty.** Confirm whether the defense has a disclosure obligation under § 15A-905 and what triggered it.
3. **Work product and consulting.** Identify the consulting role, the work-product basis, and any verified trigger that requires production.
4. **Report.** Confirm the defense expert's report and disclosure status if the expert will testify.
5. **Remedy and consequence.** Identify the consequence of non-disclosure or disclosure, and the narrowest remedy.
6. **State's best response.** The defense did not disclose; the reciprocal duty was triggered; the consulting protection does not apply; the report is late or incomplete.

## Rule 702 review

Check:

- **Qualification.** Does the expert have the specific training or experience for the precise method?
- **Reliability.** Are the principles and methods reliable, and is there a reliable application to the facts?
- **Fit.** Does the opinion actually address the disputed proposition?
- **Basis.** What facts or data did the expert rely on, and are they disclosed?
- **Limits.** What does the method not establish?

Verify the current text and the post-2011 construction. Do not assume the federal *Daubert* formulation applies verbatim.

## Notice-and-demand

The exact NC provision is a research placeholder (`NC-EXPERT-DISCLOSURE-RESEARCH`). Do not assert a notice-and-demand requirement until the section or rule is identified and verified. If the record suggests one, state the research task and the source to check.

## Remedies

- compel production;
- continue or reopen;
- limit the opinion or the testimony;
- exclude the opinion (extraordinary; verify the standard);
- evidentiary hearing;
- a preservation order for the underlying file or data.

## Rules

- Do not import civil Rule 26 into an NC criminal case.
- Do not treat the State's duty and the defense's reciprocal duty as one duty.
- Do not state an expert conclusion as a fact or a source-level association as proof of an offense.
- Do not label a missing document as concealed or destroyed; use the availability matrix.
- Record the ledger status for every legal standard.
