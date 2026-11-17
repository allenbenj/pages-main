# Defense frame packet and handoff contract

## JSON structure

The structural auditor consumes JSON with `schema_version`, `objective`, `stage`, `audience`, `sources`, `authorities`, `claims`, `frames`, `review`. See `../examples/defense_frame_packet.example.json` for a concrete **fictional** demonstration. Maintain a live-matter packet in work product outside the kit.

The V040-14 bundle in `v04014-argument-packet.md` is the packet Defense Writing Studio consumes. Keep that bundle and this legacy shape. Do not feed the V040-08 objects to `scripts/audit_defense_framing.py`, and do not treat a clean audit of the legacy example as validation of the V040-08 bundle.

- `sources[]`: `id`, `path` (relative to `--source-root` for hash verification), `sha256` (64 hex), `kind`, `status`. Live-matter paths, hashes, and locators stay outside the distributable kit. The labeled synthetic files under `../examples/synthetic/` are the V040-14 demonstration, not a live matter.
- `authorities[]`: `id`, `citation`, `status` (`reliance_approved`, `unverified`, `superseded`), `verified_as_of` (ISO date when approved), `jurisdiction`, `proposition`. Never guess that an authority is good law.
- `claims[]`: `id`, `text`, `kind` (`verified_fact`, `attributed_statement`, `disputed_allegation`, `inference`, `legal_rule`, `conclusion`, `unknown`), `source_refs[]` (objects with `source_id`, `locator`, and optional `exact_quote`), `authority_ids[]` for rules, `conflict_id` as applicable.
- `frames[]`: `id`, `thesis`, `state_best_case`, `theory_type`, `element`, `claim_ids`, `adverse_claim_ids`, `authority_ids`, `inferences[]` (each `from_claim_ids`, `to_claim_id`, `warrant`, `alternative`), `next_proof_step`, `remedy`, `risk`, `weakest_link`, `falsifier`. The frame must contain a State account and adverse claim(s), not just supporting excerpts.
- `review`: `conflicts_open[]`, `reviewer`, `playbook_status`, `qc_status`, `law_currency_status`; manual statuses are documentary only and **not independently validated** by the script.

## Audit philosophy

`audit_defense_framing.py` validates identifiers/references, completeness, evidence-class rules, authority metadata, adverse-proof and countertheory presence, audit trace and optionally SHA-256/exact-text availability. It also runs `scan_defense_frames.py` on a specified draft. It **cannot** verify contested factual truth, medical diagnoses, good law, jury effects, procedural deadlines, admissibility, or the reviewer's actual sign-off. A clean result is **audit passed**, not **litigation-ready**.

`BLOCKER` denotes a structurally unsound proposed deliverable, including unsupported "verified" claims and failed forensic scan. `REVIEW` means a human must verify a substantive point. `WARNING` points to an improvement. With `--court-facing` an unverified rule used in a frame blocks that proposed filing. A draft must be checked separately by the kit's mandatory Playbook/QC and official quote verifier.

## Structured Controller handoff

```text
Objective / court / procedural posture / deadline:
Defendant's pleaded position and legal elements:
Defense one-sentence theory:
Strongest State theory and supporting pin:
Claims and source provenance (ID -> pin -> R10 class):
Key causal warrants and alternatives:
Unhelpful record and response:
Investigative omissions (what, standard, issue, next proof):
Discovery/admissibility/candor/privilege risks:
Relief and preservation vehicle (verified authority):
What would falsify or force narrowing this theory:
Open conflicts / proof gaps / owner questions:
Automated audit (with JSON path and exit status):
Mandatory forensic, Playbook, quote and QC gate results:
Counsel sign-off status / next action / responsible skill:
```
