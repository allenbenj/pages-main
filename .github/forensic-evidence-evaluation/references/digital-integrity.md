# Digital evidence integrity

Use this reference for device extractions, audio, video, body-worn camera, CAD, dispatch, and other digital records. Keep the collection boundary, the integrity check, the time basis, and the interpretation separate.

## Device extractions

Record:

- extraction type and scope: logical, file-system, physical, cloud, or a filtered export;
- tool, version, and settings;
- hash and verification method;
- write-blocking and original-media custody;
- acquisition and analysis logs;
- file-system, application, or cloud collection limits;
- redaction or filtered exports;
- examiner notes and peer review.

An incomplete extraction is not an alteration. A missing file is not proof of deletion. A collection boundary is not a finding of concealment.

## Audio and video

Record:

- the original versus a derivative copy;
- frame and time display;
- embedded metadata;
- time zone and daylight-saving handling;
- known clock drift or synchronization;
- edits, transcoding, and export settings;
- gaps and their source;
- whether the copy is demonstrative or evidentiary.

A timestamp difference is not, by itself, tampering. Identify the time basis and any known drift before drawing an alteration inference.

## Body-worn camera, CAD, and dispatch

Record:

- the activation and retention policy;
- event and audit logs;
- recording gaps and their source;
- timestamps and the time basis;
- the source of an alleged omission;
- the custodian and the production path.

A missing segment may reflect a policy, a technical limit, a late activation, or a retention rule. Do not infer intentional deletion without evidence.

## Chain and preservation

- Identify the original media and its custodian.
- Record the hash and the verification method.
- Record every transfer, storage location, and access.
- Preserve the original; work from a verified copy.
- Link an unproduced file or complete-device dump to the availability schema and a scoped request, not to an automatic *Brady* finding.

## Method fields

- `extraction_scope`
- `hash_verification`
- `tool_version`
- `custody`
- `timezone`
- `collection_limits`
- `bwc_policy`
- `audit_log`

Mark each `applicable_documented`, `applicable_unavailable`, `applicability_unresolved`, or `not_applicable`.

## Review questions

- What exactly was collected, and what was outside the collection boundary?
- Was the extraction verified by a hash, and against what?
- What tool and version were used?
- Who held the original, and where is the chain?
- What time zone and clock basis govern the timestamps?
- Is the apparent gap a policy, a technical limit, a late activation, or an unknown?
- Does the claim move from a timestamp difference or a missing file to an alteration or deletion finding without support?

## Rules

- Do not treat a clock difference as alteration.
- Do not treat an incomplete extraction as a complete record.
- Do not treat a missing segment as intentional deletion.
- Do not infer a retention-policy violation without the policy and the audit log.
- Do not state an alteration or fabrication finding without a qualified source.
- Do not convert a missing digital file into an automatic *Brady* violation.
- Pin every timestamp and metadata claim to the exhibit, frame, file, or log.
