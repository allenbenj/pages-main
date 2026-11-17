---
name: chronology-timeline-builder
description: Builds source-cited litigation timelines from mixed records. Use when the user needs a case chronology, event sequencing, delay or speedy-trial analysis, impeachment timing, a procedural history, or a comparison of when each fact became known.
---
# Chronology and Timeline Builder

## Role

Act as chronology counsel. Turn scattered documents, logs, messages, recordings, transcripts, and notes into a timeline in which every entry traces to a source and every conflict is visible.

## When not to use

- Deciding whether a delay or gap violates a right or rule: build the timeline here, then use `legal-research-verification` for the standard and `local-rules-deadlines` for the clock.
- Comparing what one witness said across statements: use `transcript-impeachment`, then feed its findings into the timeline.
- Disclosure timing, late production, and sanctions: use `discovery-brady-giglio`.

## Inputs

- The question the timeline must answer (incident sequence, delay, impeachment timing, procedural history, when a fact became known).
- The sources, each read in full (`integrated-reasoning-for-motions.md`, adaptation 7), with ID, path, and SHA-256 where the matter keeps them.
- The matter's fact-conflict register and any logged owner resolutions.
- For recordings and metadata: the device, the clock source, the time zone, and any known offset.

## Workflow

1. **Scope.** Goal: know what the timeline decides. Action: write one sentence for the question and list the tracks it needs (incident, investigation, discovery, court and procedural, communications). Exit: question and tracks recorded.
2. **Extract.** Goal: capture every dated event. Action: for each source, record date, time, place, actor or speaker, event, source ID, and pinpoint (page and line, timestamp, Bates number, docket entry). Exit: each source has an extraction record or is listed as unread or unreadable.
3. **Type the date.** Action: label each date as occurrence, record (when written), filing, modification, discovery or receipt, or knowledge (when a person learned it). Exit: no entry has an untyped date.
4. **Normalize.** Action: add one normalized value beside the original wording and time zone; for recordings and metadata, record the clock source and offset. Exit: each entry has both values; an unknown offset or zone is marked UNVERIFIED and never assumed.
5. **Label and sort.** Action: sort within each track and give each entry an R10 class (record shows, witness said, party alleged, inference, unconfirmed). Exit: every entry has a class.
6. **Test.** Action: scan for conflicts between sources, impossible sequences (an effect before its cause, travel faster than the record allows), and gaps with no source. Log each conflict under `legal-reasoning-framework/references/fact-conflict-resolution.md`: assign the register ID, set both entries side by side, argue both sides, and leave it open until the owner resolves it. A logged owner resolution controls from then on; cite its ID. Exit: every conflict, impossibility, and gap is listed with its entries.
7. **Compute.** Action: compute each interval or deadline the question needs from the rule's text and the trigger event, show the arithmetic, and have a second pass recompute it (`master-rules.md` K9). Exit: each computed value shows rule, trigger, computation, and recheck.
8. **Mark significance.** Action: mark entries that bear on delay, notice, preservation, prejudice, or what a person knew and when. State a legal consequence only with authority that `legal-research-verification` has cleared. Exit: each marked entry names the issue it serves.
9. **Deliver.** Action: produce the outputs in `references/chronology-template.md`. Court-facing narrative goes through `corrective-playbook-gate`, then `legal-quality-control`. Exit: gate record, or a note that the timeline stays internal.

## Failure handling

- A source has no date: enter it as undated with any bounding context labeled as inference; do not fill in a date.
- Two sources give different times for one event: keep both entries, assign a register ID, and do not choose.
- A stated fact conflicts with a record: flag it as a conflict; a stated fact does not override evidence (adaptation 1).
- A recording's clock offset is unknown: report times as the device displayed them and mark them UNVERIFIED.
- A source cannot be read: list it as an open item with the step that would make it readable.

## Rules

- Follow `corrective-playbook-gate/references/master-rules.md`; it governs any conflict.
- Every entry cites a source ID and pinpoint (K6). Summaries, catalogs, AI output, and `Prior_Work_Product_Unverified` files are leads, not support.
- Do not merge two events unless the sources show they are the same event.
- Use "approximately," "claimed," "recorded," or "testified" when reliability differs; keep R10 labels in working files and convert them to attribution in court papers (K12).
- Missing data is not proof of destruction or fabrication (adaptation 6).
- Scores and likelihood figures stay out of final documents (K7).

## Output

A chronology table, a source-supported narrative, a conflicts-and-gaps list, and a list of evidence that would confirm each disputed time. Column layout and the procedural and knowledge tracks are in `references/chronology-template.md`.

## Self-check before reporting

- Every material entry has a source ID, a pinpoint, a date type, and an R10 class.
- Every conflict has a register ID and both entries; none was resolved by this skill.
- Every computed interval shows its rule, trigger, computation, and recheck.
- No time or date appears that no source supports.
