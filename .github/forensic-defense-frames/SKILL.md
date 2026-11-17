---
name: forensic-defense-frames
description: Blocks known-bad framing of forensic, medical, and DNA evidence in criminal-defense analysis dossiers and motion drafts, and gives the corrected defense frames. Use when writing, rewriting, or reviewing any analysis, dossier, memo, or motion that discusses SANE or medical findings, injuries, DNA or Y-STR results, biological-evidence disposition, or consent; and before delivering any forensic or medical analysis dossier.
---

# Forensic defense frames

Purpose: stop six recurring errors from reaching a deliverable, and require the corrected frame in their place. The owner's frame rules are in `references/owner-forensic-frame-rules.md`. The gate is `scripts/scan_defense_frames.py` (kit root).

## When this runs

- Before delivering any analysis dossier, memorandum, or motion draft that discusses medical findings, DNA or Y-STR, biological-evidence disposition, or consent.
- On every file in the matter's analysis dossier folder after any bulk edit (matter AGENTS.md names the folder; for the current matter, `02_Analysis\Dossiers\*.md`).
- It runs after drafting and before `corrective-playbook-gate` Stage A and `legal-quality-control`. It does not replace them.

## Limits and drafting collaboration

This skill is a **substantive review process plus a narrow static scanner**, not a replacement for a defense-framing agent. Invoke `defense-framing` for the inferential/legal significance of each forensic finding and `defense-writing-studio` to write the actual defense paper or note. `scan_defense_frames.py` is a regex-oriented gate: it cannot validate a laboratory method, source fact, chain-of-custody claim, scientific inference or law, and a PASS is not substantive approval. When a flagged quote is from the prosecution, use accurate attribution and controlled override only where permitted by owner rules. Source-supported expert opinions, alternatives and actual lab report language control over generic wording.

## Workflow

1. **Read the frame rules.** Read `references/owner-forensic-frame-rules.md`. Exit: you can state each of F1-F6 in one line.
2. **Draft with the corrected frames.** For each topic below, write the corrected frame, with a source path and pin for every factual sentence.
   - Injury: observed findings are stated; their cause is open; list alternative causes the record supports. Never write that there was no injury.
   - DNA/Y-STR: a paternal-line association; the defendant and paternal male relatives cannot be excluded. State that in the same or the next sentence as any match.
   - Disposition: destruction is a report (name who reported it) pending item-level inventory; cite any record that evidence or extracts were returned or preserved.
   - Consent: never a defense theory. The State's burden to prove force and lack of consent may be stated as an element.
   - Investigative omissions (non-collection, non-interview, non-testing): answer four points in order: (1) what was not done, with a pin; (2) whether the step is ordinary or required for this investigation type, citing a verified law-enforcement, crime-scene, or SANE standard, or UNVERIFIED with the exact source to check; (3) the element, competing explanation, or constitutional issue left untested; (4) the concrete next ask (inventory, subpoena, motion, expert). Never close on an empty disclaimer.
   - Physical mechanics: test the State's account against the record; mark anything not pinned as UNVERIFIED with the pages checked.
3. **Run the gate.** `py -3.14 -B <kit>\scripts\scan_defense_frames.py <file> [...] [--config <matter_terms.json>]`. The scanner contains no defendant, party, case, or resolution terms (V040-15): the subject comes from `--config` (`subject_names`/`subject_regex`), `--profile`, or `--subject-regex`; without configuration only generic terms ("the defendant", "the accused") are recognized, so a matter with named subjects must pass its terms file. A hit inside a quoted or attributed prosecution allegation, or a negated use, is a WARNING (context shown), not a BLOCKER. Every hit carries a suggested correction. Reviewed exceptions: `--exceptions` JSON (`[{rule, contains, reason, reviewer}]`, every field an actual non-blank string, with a specific passage selector of at least 4 characters that occurs in the matched text; missing, blank, overly broad, or non-string selectors are rejected) reports matching hits as OVERRIDDEN. The legacy inline override is honored only when the draft itself presents the flagged text as a quoted or attributed opposing passage and the comment states a non-negated rebuttal purpose; magic words alone, including "not quoting", never waive an affirmative assertion, and arbitrary inline comment text is not reviewed approval. Only balanced quotations create quoted scope; an unmatched opening quote fails closed. Exit 0 = PASS. Exit 1 = BLOCKER present (F1-F5, F7). Exit 2 = file error: report it, do not deliver. F8 (WARNING) flags the same flagged claim repeated.
4. **Fix, do not override.** If a BLOCKER fires, rewrite the sentence. An override (`<!-- frame-ok: F# reason -->` on the same line) is allowed only to quote an opposing claim in order to rebut it; list every override in the delivery report.
5. **Resolve F6 warnings.** Add paternal-line language to the paragraph, or state in the delivery report why it is not needed.
6. **Record the result.** Put the scanner result (PASS/FAIL, blocker and warning counts) in the change log or delivery report.

## Rules

| ID | Severity | Blocks |
|---|---|---|
| F1 | BLOCKER | Categorical no-injury claims ("no injury", "wholly normal", "devoid of injury", "examination found no injury") |
| F2 | BLOCKER | DNA/Y-STR tied to the defendant with no paternal-line / cannot-be-excluded language in the same or an adjacent sentence |
| F3 | BLOCKER | Total consumption or destruction of biological evidence stated as settled fact, with no verification, inventory, or counsel-report framing in the paragraph (matter-specific verification terms, if any, come from the config's `extra_ok_terms`; no resolution codes are recognized by default) |
| F4 | BLOCKER | Consent as a defense theory ("consent defense", "consensual sexual contact", "she consented") unless the line states the State's burden or element |
| F5 | BLOCKER | Pasted client corrections or abusive meta text left in the deliverable |
| F7 | BLOCKER | Empty-disclaimer conclusion about an investigative omission ("does not prove planting", "do not prove what the uncollected evidence would have shown", "does not alone establish", "do not affirmatively prove innocence") in a paragraph lacking (a) the standard/ordinary practice or UNVERIFIED marker, (b) the element, competing explanation, or constitutional issue left untested, and (c) a concrete next ask |
| F6 | WARNING | Paragraph discusses a DNA/Y-STR match to the defendant with no paternal-line language anywhere in it |

## Failure handling

- Source missing or pin not found: write UNVERIFIED and list the files and ranges checked. Never fill the gap.
- Scanner unavailable or errors: report it; the deliverable is not released.
- Rule conflict with the Corrective Playbook or `master-rules.md`: those control; record the conflict and ask the owner.
- Regex false positive: rephrase first; override only per step 4.

## Hand-off

PASS goes to `corrective-playbook-gate`, then `legal-quality-control`. Proposed rule changes go to the owner (propose only).

## Draft production integration (kit consolidation)
For substantive notes, drafts, letters, papers, motions, trial narratives and theory explanations, invoke `../defense-framing/references/drafting-engine.md` **before** final writing. Develop the full source-constrained draft, not just a checklist. Coordinate `defense-framing` proposition/countertheory packet with `motion-brief-drafting`, `case-theory-storytelling`, `motion-fact-verification`, and mandatory QC gates. Do not treat any lexical scanner as proof of legal or factual correctness. Preserve this skill's existing constraints and precedence.
