# Fact-conflict resolution

Owner decision of 2026-10-02. Use whenever a stated fact conflicts with the evidence. A stated fact is a client or owner representation, a fact written in a work-product file, or a "core fact" given in instructions.

## Rules

- A stated fact does not override evidence, and neither version is dropped silently.
- Every conflict gets an ID and stays open until the owner resolves it.
- From then on, the owner's resolution controls in every document. It settles the point permanently unless the owner reopens it.
- Source records are never edited. Their text stays as it is. The resolution is recorded in the matter's logs, and work product cites the record accurately (K6, K12).

## Required sequence

1. **Flag.** Goal: a tracked conflict. Action: give the conflict the next ID in the matter's fact-conflict register (its location is in the matter instructions; if none is named, ask the owner). Record the stated fact and its source, the contrary evidence with source ID and pinpoint, the documents known to state the fact, and status `open`. Exit: the register row exists.
2. **Test the evidence.** Goal: rigorous scrutiny of every item on both sides. Action: run the critical-thinking scan and the competing-explanations comparison (`analysis-frameworks.md` sections 4 and 6) and, for testimony, `transcript-impeachment`. Record the defects found in each item. Exit: each item has a recorded assessment.
3. **Argue both sides.** Goal: the strongest case for each version. Action: write the strongest argument that the stated fact is right and the strongest argument that the evidence controls, each with cited evidence (Toulmin, `analysis-frameworks.md` section 2). Exit: both arguments are recorded in the register or in a linked worksheet.
4. **Owner resolves.** Goal: a decision. Action: give the owner both arguments and record the owner's answer word for word, with the date. Until then, work product shows both versions with their labels (R10) and marks the point unresolved. Exit: the resolution is recorded and the status is `resolved`.
5. **Log.** Action: record the resolution in the matter's correction log: who decided, when, the controlling version, and its basis. Exit: the log row exists.
6. **Propagate.** Goal: no copy of the superseded version in the local record. Action: correct every document, database row, generated block and index that states the superseded version. Use `purge-false-fact` for the search, the hit list and the fixes. Source records get a log note, not an edit. Exit: every hit is fixed or noted.
7. **Verify.** Action: repeat the search across every retrieval layer and with the occurrence finder. Record zero remaining work-product hits, with the coverage file, and set the status to `closed`. Exit: the verification is recorded.

## In filings

The controlling version still needs record support in a court paper (K6). If the record does not support it, the filing states what the record shows and attributes the position (K12), and the gap goes to the owner.

## Self-check

- Every conflict found has a register row.
- No `open` conflict is presented as settled.
- Every `closed` row has a recorded verification.
