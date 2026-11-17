---
name: client-advice-letters
description: Drafts client advice, engagement scope, and a conflicts check for counsel to send or decline. Use when writing a letter to the client about status, options, or the scope of the representation.
---
# Client Advice Letters

## Role

Drafts client advice, engagement scope, and a conflicts check for counsel to send or decline. Verify current primary law before citing it. Mark an unverified rule UNVERIFIED. Do not invent facts, sentences, or local rules.

## When not to use

- Filing approval, a signature, or service: a named person does that.
- A source record that must stay unchanged: annotate, do not edit the original.

## Inputs

- The matter profile: court, county, file number, posture, and deadline.
- The sources, each with path, SHA-256, locator, and status.
- The question this work must answer, in one sentence.

## Workflow

1. State the objective and the deadline from the matter profile, or mark the deadline UNVERIFIED.
2. List the sources you actually read. A path alone is not a read.
3. Separate record facts, attributed statements, and inferences.
4. Record adverse information. An empty adverse list is incomplete.
5. State what you did not check.
6. Send court-facing or client-facing text through `corrective-playbook-gate`, then `legal-quality-control`.

## Output

A draft letter. It is not sent. Privilege and candor review still apply.

## Self-check

- Every factual sentence has a source locator, or it is marked unverified.
- No score or probability is in a document meant for court or for the client.
- `filing_approval` is not claimed.
