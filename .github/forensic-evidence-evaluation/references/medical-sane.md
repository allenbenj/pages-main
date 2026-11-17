# Medical and SANE interpretation

Use this reference for medical, sexual-assault, injury, and clinical findings. Keep the recorded observation, the absence of a record, the examiner's interpretation, and a party's narrative separate.

## What to capture

- the exact examination notes, including negative and positive findings;
- each anatomic site and the examination position or method;
- the instrument, kit, protocol, and edition in force on the examination date;
- photographs and their metadata, including timestamps, custody, and whether the image was produced;
- the time from the reported event to the examination;
- the examiner's credentials, training, and role;
- laboratory tests and their collection and handling;
- supplemental, peer, or supervisory review.

## Documentation versus fact

| Statement | What it means |
|---|---|
| "No injury was documented at [site]." | The record does not contain an injury finding at that site. |
| "The examination was unremarkable." | The examiner recorded no abnormal finding; it does not prove no injury existed. |
| "No photograph was produced." | The image is absent from the production; it does not prove the image never existed. |
| "The findings are nonspecific." | The finding has more than one possible cause; it is not diagnostic of one event. |
| "The finding is consistent with [cause]." | The finding does not exclude other causes. |

Never convert an absent documentation into proof that an injury, event, or contact did not occur.

## Findings and causation

- Identify which findings have a documented, qualified interpretation and which are nonspecific.
- Distinguish the examiner's conclusion from a party's characterization, the literature, and a defense hypothesis.
- Treat timing, alternative causes, documentation completeness, and examiner qualifications as review questions grounded in the record.
- Do not supply a medical causation conclusion without a qualified source.
- Do not treat a "consistent with" statement as a diagnosis.

## Photographs and charts

- Identify the image or chart by exhibit, Bates, path, or timestamp.
- Record the metadata and the chain of custody.
- Compare the narrative claim about the image with the image actually produced.
- If an image is missing, record the availability state and a targeted follow-up; do not infer that it never existed or that it was destroyed.
- Pin every discrepancy to the page, image, or chart location.

## Method fields

- `anatomic_site`
- `photography`
- `timing`
- `examiner_credentials`
- `instrument_protocol`
- `tests`
- `findings`
- `review`

Mark each `applicable_documented`, `applicable_unavailable`, `applicability_unresolved`, or `not_applicable`.

## Review questions

- What exactly was observed, and where?
- What was not documented, and does the record explain why?
- Was the examination timely, and how does the interval affect the interpretation?
- What alternative causes does the record support or leave open?
- Are the photographs present, and do they match the written findings?
- Is the examiner qualified on the specific finding?
- Does the claim move from a finding to a diagnosis or a cause without qualified support?

## Rules

- Do not write "no injury" or "normal examination" as proof that no injury occurred.
- Do not treat an absent record as an absent fact.
- Do not state a cause or diagnosis without a qualified source.
- Do not use a numeric probability of an event or an injury.
- Do not ignore a photograph, chart, or note that contradicts the narrative.
- Do not disclose privileged or private medical information beyond what the record requires.

## Claim fields

- `method_family`: `medical_sane`.
- `method_fields_and_applicability`: at least the site, photography, timing, and findings fields.
- `limits_stated`: what the examination does not establish.
- `open_scientific_questions`: the timing, alternative-cause, or documentation questions that need a qualified expert.
