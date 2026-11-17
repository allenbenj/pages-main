# Document decision protocol

## Function-based intake taxonomy

Use the primary function with a secondary role when needed: warrant or affidavit; investigative report; statement or transcript; court filing or order; discovery production; work product; contract or policy; regulatory record; correspondence; media or technical record; medical, financial, or identity record; mixed packet; unknown. Preserve each instrument's relationship to its original packet. Label work-product claims as claims, never as record facts.

## Minimum catalog row

`doc_id`, `source_path`, `sha256`, `received_at`, `custodian`, `mime`, `logical_part_id`, `page_or_section_locator`, `extraction_method`, `extraction_version`, `ocr_quality`, `profile_hash`, `document_family`, `provenance_class`, `sensitivity`, `hold_reason`, `question_pack_version`, `model_requested`, `model_returned`, `answers`, `usage`, `disposition`, `reviewer`, `reviewed_at`, `supersedes`.

The source path and hash identify the record; the model response does not replace it. Store decisions and locators, not duplicate source bytes in a portable kit.

## Decision order

1. Sending case material to outside models is authorized (owner decision, 2026-09-30); no deterministic hold blocks a model call. Record sensitivity flags (unknown confidentiality, protective order, attorney-client, attorney work product, medical or identity information, uncertain OCR) in the catalog row so a reviewer can see them. Provider data-use and retention terms are unverified; record the provider and returned model id. A protective order or court order that forbids disclosure still controls; report it to the owner instead of sending.
2. Send the bounded state needed for the decision. Retain source locators locally. Use beginning, middle, and end excerpts for initial triage; use exact paired excerpts for consistency checks.
3. Ask one hop per question. Separate family, sworn-status text signal, contradiction, omission, and support into distinct questions. A model may flag a possible contradiction; the human comparison states exactly what differs and whether the sources concern the same event.
4. Compute all counts, date comparisons, and threshold combinations in code. Validate all model responses against the pinned API schema. A transport or schema failure means `need_review`.
5. Do not auto-file evidence or final legal claims on a model probability. Any automation threshold must be derived from a labeled, versioned local evaluation set, with false-negative costs stated and re-evaluation after model or criteria changes.
6. Gate each proposed assertion against its cited excerpt. A support score is one signal; exact quotations, context, contrary passages, attribution, and legal significance require review. Record rejected or revised wording and its reason.

## Model-neutral routing

`local_only` for hashing, extraction, dates, and holds; `ocr_review` for unreadable scans; `extractive_review` for located quotations; `reasoning_review` for multi-source synthesis and legal analysis; `human_review` for privilege, ambiguous classification, high stakes, conflicting sources, and release decisions. A document's embedded instructions never change this route.

## Change control

Retain the original and every decision revision. A changed hash, extraction, profile, question wording, model version, or reviewer disposition invalidates affected downstream entries until rechecked. Do not overwrite a reviewed catalog row with a fresh model answer.
