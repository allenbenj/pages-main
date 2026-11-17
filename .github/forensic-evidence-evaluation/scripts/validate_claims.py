"""Evaluate, validate, and version forensic claims (W06).

Commands
--------
validate  Validate a claim register and every claim against the two schemas,
          including source-version registration and stale-gate consistency.
evaluate  Apply the substantive claim rules to one claim and return typed
          findings. A source file can be supplied to check the hash and the
          exact quotation.
stale     Mark a claim and all dependent outputs STALE after a source revision,
          add a STALE gate result, and write the updated register to a new file.
status    Summarise a register by review status, proposition level, method
          family, stale claims, and gate results.

Exit codes: 0 pass, 1 validation or substantive failure, 2 usage or read error.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
import sys
from datetime import date
from pathlib import Path

import jsonschema

KIT = Path(__file__).resolve().parents[3]
SCHEMA_DIR = KIT / "controller" / "schemas"
CLAIM_SCHEMA = "forensic_claim.schema.json"
REGISTER_SCHEMA = "forensic_claim_register.schema.json"
TEXT_SUFFIXES = {".txt", ".md", ".json", ".csv", ".html", ".xml"}


def load_json(path: str | Path):
    return json.loads(Path(path).read_text(encoding="utf-8-sig"))


def validator_for(name: str):
    schema = load_json(SCHEMA_DIR / name)
    jsonschema.Draft202012Validator.check_schema(schema)
    return jsonschema.Draft202012Validator(schema)


def schema_errors(obj, name: str) -> list[str]:
    return [f"{list(error.absolute_path)}: {error.message}"
            for error in validator_for(name).iter_errors(obj)]


def load_claim(path: str | Path, claim_id: str | None = None) -> dict:
    data = load_json(path)
    if isinstance(data, dict) and isinstance(data.get("claims"), list):
        if not claim_id:
            raise ValueError("this file is a register; supply --claim-id")
        matches = [claim for claim in data["claims"]
                   if claim.get("claim_id") == claim_id]
        if not matches:
            raise ValueError(f"claim_id not found in register: {claim_id}")
        return matches[0]
    return data


def validate_register(register: dict) -> dict:
    errors: list[dict] = []
    if not isinstance(register, dict):
        return {"ok": False, "errors": [{"code": "REGISTER_NOT_OBJECT",
                                         "message": "register must be a JSON object"}]}
    for message in schema_errors(register, REGISTER_SCHEMA):
        errors.append({"code": "REGISTER_SCHEMA", "message": message})
    claims = register.get("claims") or []
    if not isinstance(claims, list):
        claims = []
    seen: set[str] = set()
    source_versions = register.get("source_versions") or []
    registered_hashes = {entry.get("source_SHA256") for entry in source_versions
                         if isinstance(entry, dict)}
    for index, claim in enumerate(claims):
        if not isinstance(claim, dict):
            errors.append({"code": "CLAIM_NOT_OBJECT", "claim_index": index,
                           "message": "each claim must be a JSON object"})
            continue
        claim_id = str(claim.get("claim_id") or f"<row {index}>")
        if claim_id in seen:
            errors.append({"code": "DUPLICATE_CLAIM_ID", "claim_id": claim_id,
                           "message": "claim_id appears more than once"})
        seen.add(claim_id)
        for message in schema_errors(claim, CLAIM_SCHEMA):
            errors.append({"code": "CLAIM_SCHEMA", "claim_id": claim_id,
                           "message": message})
        claim_hash = claim.get("source_SHA256")
        if claim_hash and registered_hashes and claim_hash not in registered_hashes:
            errors.append({"code": "SOURCE_VERSION_NOT_REGISTERED", "claim_id": claim_id,
                           "message": "claim source_SHA256 is not in source_versions"})
    stale_claims = [claim.get("claim_id") for claim in claims
                    if isinstance(claim, dict) and claim.get("review_status") == "stale"]
    gate_statuses = [gate.get("status") for gate in register.get("gate_results") or []
                     if isinstance(gate, dict)]
    if stale_claims and "STALE" not in gate_statuses:
        errors.append({"code": "STALE_GATE_MISSING",
                       "message": "a stale claim requires at least one STALE gate result"})
    return {
        "ok": not errors,
        "claims": len(claims),
        "stale_claims": stale_claims,
        "gate_results": gate_statuses,
        "errors": errors,
    }


def _finding(findings: list[dict], claim_id: str, code: str, severity: str,
             message: str, suggestion: str = "") -> None:
    findings.append({
        "finding_id": f"F-{len(findings) + 1:03d}",
        "claim_id": claim_id,
        "code": code,
        "severity": severity,
        "message": message,
        "suggestion": suggestion,
    })


def evaluate_claim(claim: dict, source_file: str | None = None) -> dict:
    findings: list[dict] = []
    claim_id = str(claim.get("claim_id") or "<unknown>")
    for message in schema_errors(claim, CLAIM_SCHEMA):
        _finding(findings, claim_id, "SCHEMA_INVALID", "critical", message,
                 "Correct the claim record before relying on it.")

    proposition = claim.get("proposition_level")
    support = claim.get("inference_support_status")
    questions = claim.get("open_scientific_questions") or []
    if proposition in {"activity", "offense"}:
        if support != "supported_by_qualified_source":
            _finding(findings, claim_id, "INFERENCE_UNSUPPORTED", "critical",
                     f"{proposition}-level proposition is not supported by a qualified source.",
                     "Obtain qualified support or record the inference as unresolved.")
        if support == "unresolved" and not questions:
            _finding(findings, claim_id, "UNRESOLVED_WITHOUT_QUESTION", "high",
                     "The inference is unresolved but no expert question is stated.",
                     "State the specific question a qualified expert must answer.")

    statistic = str(claim.get("source_statistic_verbatim") or "").strip()
    assumptions = str(claim.get("statistic_type_and_assumptions") or "").strip()
    if statistic and not assumptions:
        _finding(findings, claim_id, "STATISTIC_WITHOUT_ASSUMPTIONS", "high",
                 "A reported statistic is quoted without its type and assumptions.",
                 "Record the statistic type, proposition pair, database, and assumptions verbatim.")

    method_family = claim.get("method_family")
    exact = str(claim.get("exact_report_language") or "").lower()
    if method_family == "y_str":
        if ("unique" in exact or "individual" in exact) and "cannot" not in exact:
            _finding(findings, claim_id, "YSTR_UNIQUE_IDENTIFICATION", "critical",
                     "Y-STR language appears to claim unique individual identification.",
                     "State the paternal-line limits and the cannot-be-excluded framing.")
        if proposition in {"activity", "offense"} and support != "supported_by_qualified_source":
            _finding(findings, claim_id, "YSTR_OVERREACH", "critical",
                     "A Y-STR result is being used for an activity or offense proposition without qualified support.",
                     "Limit the claim to the paternal-line association or obtain qualified support.")

    fields = claim.get("method_fields_and_applicability") or []
    field_names = " ".join(str(item.get("field", "")).lower() for item in fields
                           if isinstance(item, dict))
    if method_family == "mixture" and not ("mixture" in field_names or "contributor" in field_names):
        _finding(findings, claim_id, "MIXTURE_FIELD_MISSING", "medium",
                 "A mixture claim does not record a mixture or contributor field.",
                 "Record the mixture interpretation and number-of-contributors decision.")

    if method_family in {"autosomal_str", "mixture", "probabilistic_genotyping"}:
        if ("likelihood" in exact or "lr" in statistic.lower()) and "likelihood" not in assumptions.lower():
            _finding(findings, claim_id, "STATISTIC_TYPE_UNCLEAR", "medium",
                     "Likelihood-ratio language is used without a stated LR proposition pair or assumptions.",
                     "Record the proposition pair, model, database, and assumptions.")

    statistic_type = str(claim.get("statistic_type") or "unverified")
    search_type = str(claim.get("genetic_search_type") or "unverified")
    database_name = str(claim.get("database_name") or "").strip()
    database_size = str(claim.get("database_size") or "").strip()
    assumptions_lower = assumptions.lower()
    exact_and_result = exact + " " + str(claim.get("reported_result") or "").lower()

    if statistic and statistic_type == "unverified":
        _finding(findings, claim_id, "STATISTIC_TYPE_NOT_RECORDED", "medium",
                 "A reported statistic is not classified by type.",
                 "Record whether it is a CPI, RMP, LR, frequency, count, or other type.")

    if statistic_type in {"frequency", "count"}:
        if "database" not in assumptions_lower and "count" not in assumptions_lower:
            _finding(findings, claim_id, "DATABASE_BASIS_MISSING", "high",
                     "A database count or frequency is reported without the database basis.",
                     "Record the database name, size, population data, and whether the value is a count or a frequency.")

    if statistic_type == "LR":
        if "proposition" not in assumptions_lower and "hypothesis" not in assumptions_lower:
            _finding(findings, claim_id, "LR_PROPOSITION_MISSING", "high",
                     "A likelihood ratio is reported without its proposition pair.",
                     "State the prosecution and defense propositions and the conditioning assumptions.")
        if not database_name:
            _finding(findings, claim_id, "LR_DATABASE_MISSING", "medium",
                     "A likelihood ratio is reported without a named database or population data.",
                     "Record the database and population data used for the calculation.")
        if not database_size:
            _finding(findings, claim_id, "LR_DATABASE_SIZE_MISSING", "medium",
                     "A likelihood ratio is reported without the database size.",
                     "Record the database size and any theta or FST adjustment.")

    if method_family == "probabilistic_genotyping":
        if not any(term in field_names for term in ("software", "model", "version")):
            _finding(findings, claim_id, "PG_MODEL_FIELD_MISSING", "medium",
                     "A probabilistic-genotyping claim does not record a software, model, or version field.",
                     "Record the model, software version, settings, and validation.")

    if method_family == "y_str" and statistic_type in {"frequency", "count"}:
        if not database_name or not database_size:
            _finding(findings, claim_id, "YSTR_DATABASE_BASIS_MISSING", "high",
                     "A Y-STR frequency or count is reported without the database name and size.",
                     "Record the haplotype count, database name and size, and how any frequency was derived.")

    if search_type == "deliberate_familial":
        process_text = exact_and_result + " " + str(claim.get("notes") or "").lower()
        if "policy" not in process_text and "authorization" not in process_text:
            _finding(findings, claim_id, "FAMILIAL_SEARCH_POLICY_MISSING", "medium",
                     "A deliberate familial search is claimed without a stated policy or authorization.",
                     "Record the written policy, the authorization, the search parameters, and the confirmation testing.")

    if "familial" in exact_and_result and search_type not in {"deliberate_familial", "unverified"}:
        _finding(findings, claim_id, "FAMILIAL_SEARCH_ASSUMED", "high",
                 "The source language mentions a familial search but the recorded search type is not deliberate_familial.",
                 "Record the documented search process and policy; do not infer a familial search from a comparison result.")

    if search_type == "y_str_comparison" and method_family != "y_str":
        _finding(findings, claim_id, "SEARCH_TYPE_METHOD_MISMATCH", "low",
                 "A Y-STR comparison is recorded for a non-Y-STR method.",
                 "Correct the search type or the method family.")

    transfer_terms = ("deposited during", "transferred during", "at the time of the offense", "during the offense")
    if any(term in exact_and_result for term in transfer_terms) and support != "supported_by_qualified_source":
        _finding(findings, claim_id, "TRANSFER_ANSWER_UNSUPPORTED", "high",
                 "The source language asserts transfer or timing without qualified support.",
                 "Limit the claim to the source-level result and route the transfer question to a qualified expert.")

    if method_family == "medical_sane":
        if any(term in exact_and_result for term in (
                "no injury", "no injuries", "wholly normal", "devoid of injury",
                "normal examination", "unremarkable examination")):
            caveats = ("documented", "not documented", "no documented",
                       "absence of documentation", "does not establish")
            if not any(term in exact for term in caveats):
                _finding(findings, claim_id, "INJURY_ABSENCE_EQUIVOCATION", "critical",
                         "The language equates an absent finding with proof that no injury existed.",
                         "State the exact documented findings and the absence of documentation separately; do not assert that no injury occurred.")
        if any(term in exact_and_result for term in (
                "caused by", "inflicted by", "resulted from", "produced by")) and support != "supported_by_qualified_source":
            _finding(findings, claim_id, "FINDING_CAUSE_OVERSERTED", "high",
                     "The language asserts a cause without qualified support.",
                     "State the finding and route causation to a qualified medical expert.")
        if any(term in exact_and_result for term in ("photograph", "photo", "image")):
            if not any(term in field_names for term in ("photograph", "photo", "image")):
                _finding(findings, claim_id, "PHOTOGRAPH_FIELD_MISSING", "medium",
                         "The claim references photographs or images but does not record a photography field.",
                         "Record the photographs, their metadata, and their custody with pins.")
        if any(term in exact_and_result for term in (
                "injury", "injuries", "finding", "findings", "abrasion", "laceration",
                "bruise", "erythema")):
            if not any(term in field_names for term in ("anatomic", "anatomy", "site", "location")):
                _finding(findings, claim_id, "ANATOMIC_SITE_FIELD_MISSING", "medium",
                         "A medical finding is recorded without an anatomic-site field.",
                         "Record the site, the examination method, and the pin for each finding.")
        if not any(term in field_names for term in ("time", "timing", "interval", "elapsed")):
            _finding(findings, claim_id, "EXAM_TIMING_FIELD_MISSING", "medium",
                     "The medical claim does not record the time from the reported event to the examination.",
                     "Record the interval and its source; timing is material to the interpretation.")
        if any(term in exact_and_result for term in (
                "diagnostic of", "confirms", "establishes")) and support != "supported_by_qualified_source":
            _finding(findings, claim_id, "DIAGNOSTIC_OVERSERTED", "high",
                     "The language treats a finding as diagnostic without qualified support.",
                     "State the finding's limits and route the diagnostic conclusion to a qualified expert.")

    if method_family == "digital":
        has_hash = any(term in field_names for term in ("hash", "checksum", "sha"))
        has_tool = any(term in field_names for term in ("tool", "version", "software"))
        has_custody = any(term in field_names for term in ("custody", "chain", "transfer", "seal"))
        has_timezone = any(term in field_names for term in ("timezone", "time zone", "time", "clock", "drift"))
        has_limits = any(term in field_names for term in ("limit", "redaction", "filter", "export", "cloud"))
        has_bwc = any(term in field_names for term in (
            "bwc", "body-worn", "body worn", "cad", "dispatch", "activation", "retention", "audit"))
        if not has_hash:
            _finding(findings, claim_id, "DIGITAL_HASH_FIELD_MISSING", "medium",
                     "A digital claim does not record a hash or verification field.",
                     "Record the hash, the verification method, and the result where the method uses one.")
        if not has_tool:
            _finding(findings, claim_id, "DIGITAL_TOOL_VERSION_MISSING", "medium",
                     "A digital claim does not record a tool, software, or version field.",
                     "Record the tool, version, settings, and any validation.")
        if not has_custody:
            _finding(findings, claim_id, "DIGITAL_CUSTODY_FIELD_MISSING", "medium",
                     "A digital claim does not record a custody or chain field.",
                     "Record the original media, custodian, transfers, and storage.")
        if any(term in exact_and_result for term in (
                "timestamp", "time stamp", "clock", "video", "recording", "call log", "message time")):
            if not has_timezone:
                _finding(findings, claim_id, "TIMEZONE_FIELD_MISSING", "medium",
                         "A time-based digital claim does not record a time-zone or clock field.",
                         "Record the time zone, daylight-saving handling, and any known drift or synchronization.")
        if any(term in exact_and_result for term in (
                "body-worn", "body worn", "bwc", "cad", "dispatch", "recording gap")):
            if not has_bwc:
                _finding(findings, claim_id, "BWC_POLICY_FIELD_MISSING", "medium",
                         "A body-worn or CAD claim does not record an activation, retention, or audit field.",
                         "Record the policy, event and audit logs, the gap, and its source.")
        if any(term in exact_and_result for term in (
                "complete extraction", "entire device", "full extraction", "all messages",
                "entire account", "all files")):
            if not has_limits:
                _finding(findings, claim_id, "COLLECTION_LIMIT_UNSTATED", "high",
                         "The claim asserts a complete collection without recording the collection boundary.",
                         "Record what was collected, what was outside the boundary, and the export limits.")
        if any(term in exact_and_result for term in (
                "altered", "tampered", "manipulated", "fabricated", "edited to")):
            if support != "supported_by_qualified_source":
                _finding(findings, claim_id, "ALTERATION_OVERSERTED", "high",
                         "The claim asserts alteration without qualified support.",
                         "Record the time basis, the known drift, the collection boundary, and the evidence of alteration before drawing that conclusion.")

    context_exposure = claim.get("context_exposure") or []
    statement_map = claim.get("statement_map") or []
    confrontation = claim.get("confrontation_review") or {}

    if any(term in exact_and_result for term in ("biased", "bias", "tunnel vision", "contextual bias")):
        caveats = ("no evidence of bias", "not biased", "does not establish bias",
                   "no bias", "without evidence of bias")
        if not any(term in exact_and_result for term in caveats) and not context_exposure:
            _finding(findings, claim_id, "CONTEXT_BIAS_UNSUPPORTED", "high",
                     "The claim asserts bias without a recorded exposure timeline or qualified support.",
                     "Record the date, source, information, and analyst response; treat exposure as an inquiry, not proof.")

    if any(term in exact_and_result for term in ("surrogate", "another analyst", "reviewing analyst")):
        caveats = ("no surrogate", "not a surrogate", "no surrogate issue")
        if not any(term in exact_and_result for term in caveats):
            if not statement_map:
                _finding(findings, claim_id, "STATEMENT_MAP_MISSING", "medium",
                         "The claim discusses a surrogate or another analyst without a statement-and-actor map.",
                         "Record who handled the sample, performed each analysis, made each statement, reviewed it, and sponsored the result.")
            elif any(not item.get("personal_knowledge") for item in statement_map
                     if isinstance(item, dict)):
                if not confrontation:
                    _finding(findings, claim_id, "SURROGATE_RELIANCE_WITHOUT_CONFRONTATION_REVIEW", "high",
                             "The claim relies on another analyst's statements without a confrontation review.",
                             "Record the testimonial status, the witness's personal knowledge, and the verified confrontation authority.")

    if any(term in exact_and_result for term in ("crawford", "confrontation", "testimonial")):
        caveats = ("no confrontation", "not a confrontation issue", "nontestimonial")
        if not any(term in exact_and_result for term in caveats):
            if not confrontation:
                _finding(findings, claim_id, "CONFRONTATION_REVIEW_MISSING", "high",
                         "A confrontation or testimonial issue is raised without a confrontation review.",
                         "Record the statement, the testimonial status, the surrogate issue, the forfeiture issue, and the verified authority.")
            elif confrontation.get("authority_status") != "RELIANCE_APPROVED":
                _finding(findings, claim_id, "CONFRONTATION_AUTHORITY_UNVERIFIED", "medium",
                         "The confrontation review does not rely on a RELIANCE_APPROVED authority.",
                         "Run the authority-ledger gate and record the status; do not state an unverified confrontation rule.")

    outputs = claim.get("dependent_outputs") or []
    stale_outputs = [item for item in outputs if isinstance(item, dict)
                     and item.get("status") == "stale"]
    if claim.get("review_status") != "stale" and stale_outputs:
        _finding(findings, claim_id, "STALE_OUTPUT_NOT_MARKED", "high",
                 "A dependent output is stale while the claim is not marked stale.",
                 "Mark the claim stale and revalidate before relying on the output.")
    if claim.get("review_status") == "stale":
        current = [item for item in outputs if isinstance(item, dict)
                   and item.get("status") != "stale"]
        if current:
            _finding(findings, claim_id, "STALE_CLAIM_WITH_CURRENT_OUTPUT", "high",
                     "The claim is stale but a dependent output remains current.",
                     "Mark every dependent output stale until revalidation.")

    if source_file:
        source_path = Path(source_file)
        if not source_path.is_file():
            _finding(findings, claim_id, "SOURCE_FILE_MISSING", "high",
                     f"Source file does not exist: {source_file}",
                     "Supply the original source before relying on the claim.")
        else:
            digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
            if digest.lower() != str(claim.get("source_SHA256", "")).lower():
                _finding(findings, claim_id, "SOURCE_HASH_MISMATCH", "critical",
                         "The source file hash does not match the claim's source_SHA256.",
                         "Re-pin the source and revalidate every dependent output.")
            if source_path.suffix.lower() in TEXT_SUFFIXES:
                text = source_path.read_text(encoding="utf-8", errors="replace")
                exact_language = str(claim.get("exact_report_language") or "").strip()
                if exact_language and exact_language not in text:
                    _finding(findings, claim_id, "QUOTE_NOT_IN_SOURCE", "high",
                             "The exact report language was not found in the supplied source.",
                             "Correct the quotation or supply the correct source.")
                stat_verbatim = str(claim.get("source_statistic_verbatim") or "").strip()
                stat_type = str(claim.get("statistic_type") or "").strip().lower()
                text_lower = text.lower()
                if stat_type in {"lr", "likelihood_ratio", "likelihood ratio"} or "likelihood ratio" in stat_verbatim.lower() or stat_verbatim.upper().startswith("LR"):
                    if "no likelihood ratio" in text_lower or ("likelihood ratio" not in text_lower and not re.search(r"\blr\b", text_lower)):
                        _finding(findings, claim_id, "FABRICATED_STATISTIC", "critical",
                                 "A likelihood ratio statistic is claimed, but the source reports no likelihood ratio.",
                                 "Do not invent a likelihood ratio; reproduce the reported statistic and its method.")
                    elif stat_verbatim and stat_verbatim not in text:
                        _finding(findings, claim_id, "FABRICATED_STATISTIC", "critical",
                                 f"The reported statistic '{stat_verbatim}' does not appear in the source text.",
                                 "Do not invent or alter a statistic; quote the exact reported statistic from the source.")
                elif stat_verbatim and stat_verbatim not in text and exact_language and exact_language not in text:
                    _finding(findings, claim_id, "FABRICATED_STATISTIC", "critical",
                             f"The reported statistic '{stat_verbatim}' was not found in the source document.",
                             "Record only the statistic actually reported in the source.")
    else:
        _finding(findings, claim_id, "SOURCE_FILE_NOT_CHECKED", "info",
                 "No source file was supplied; the hash and quotation were not checked.",
                 "Supply --source-file to verify the source hash and exact quotation.")

    blocking = [item for item in findings if item["severity"] in {"critical", "high"}]
    return {
        "ok": not blocking,
        "claim_id": claim_id,
        "findings": findings,
        "blocking": [item["finding_id"] for item in blocking],
        "counts": {
            "critical": sum(1 for item in findings if item["severity"] == "critical"),
            "high": sum(1 for item in findings if item["severity"] == "high"),
            "medium": sum(1 for item in findings if item["severity"] == "medium"),
            "info": sum(1 for item in findings if item["severity"] == "info"),
        },
    }


def stale_update(register: dict, claim_id: str, new_sha256: str,
                 new_version: str | None = None) -> dict:
    updated = copy.deepcopy(register)
    claim = next((item for item in updated.get("claims", [])
                  if item.get("claim_id") == claim_id), None)
    if claim is None:
        raise ValueError(f"claim_id not found: {claim_id}")
    today = date.today().isoformat()
    old_sha = claim.get("source_SHA256")
    old_version = claim.get("source_version")
    claim["source_SHA256"] = new_sha256
    if new_version:
        claim["source_version"] = new_version
    claim["review_status"] = "stale"
    claim["last_checked"] = today
    for output in claim.get("dependent_outputs") or []:
        output["status"] = "stale"
        output["last_checked"] = today

    source_versions = updated.setdefault("source_versions", [])
    matched = False
    for entry in source_versions:
        if entry.get("source_SHA256") == old_sha and entry.get("source_version") == old_version:
            entry["source_SHA256"] = new_sha256
            if new_version:
                entry["source_version"] = new_version
            entry["last_checked"] = today
            matched = True
            break
    if not matched:
        source_versions.append({
            "source_path": claim.get("source_path_Bates_page_or_timestamp", ""),
            "source_version": new_version or old_version or "UNVERIFIED",
            "source_SHA256": new_sha256,
            "last_checked": today,
        })

    gates = updated.setdefault("gate_results", [])
    stale_gate = next((gate for gate in gates if gate.get("status") == "STALE"), None)
    if stale_gate is None:
        gates.append({"gate": "revalidation_required", "status": "STALE",
                      "last_checked": today})
    else:
        stale_gate["last_checked"] = today
    return updated


def status_report(register: dict) -> dict:
    claims = [claim for claim in register.get("claims", []) if isinstance(claim, dict)]

    def count(key):
        result: dict[str, int] = {}
        for claim in claims:
            value = str(claim.get(key, "UNVERIFIED"))
            result[value] = result.get(value, 0) + 1
        return result

    stale_claims = [claim.get("claim_id") for claim in claims
                    if claim.get("review_status") == "stale"]
    stale_outputs = [
        {"claim_id": claim.get("claim_id"), "output_id": output.get("output_id")}
        for claim in claims for output in claim.get("dependent_outputs") or []
        if isinstance(output, dict) and output.get("status") == "stale"
    ]
    return {
        "register_id": register.get("register_id"),
        "claims": len(claims),
        "by_review_status": count("review_status"),
        "by_proposition_level": count("proposition_level"),
        "by_method_family": count("method_family"),
        "stale_claims": stale_claims,
        "stale_outputs": stale_outputs,
        "gate_results": register.get("gate_results", []),
    }


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    validate = sub.add_parser("validate", help="validate a claim register")
    validate.add_argument("--register", required=True)
    validate.add_argument("--json", action="store_true")

    evaluate = sub.add_parser("evaluate", help="evaluate one claim")
    evaluate.add_argument("--claim", required=True)
    evaluate.add_argument("--claim-id")
    evaluate.add_argument("--source-file")
    evaluate.add_argument("--json", action="store_true")

    stale = sub.add_parser("stale", help="mark a claim and outputs stale")
    stale.add_argument("--register", required=True)
    stale.add_argument("--claim-id", required=True)
    stale.add_argument("--new-sha256", required=True)
    stale.add_argument("--new-version")
    stale.add_argument("--out")
    stale.add_argument("--json", action="store_true")

    status = sub.add_parser("status", help="summarise a register")
    status.add_argument("--register", required=True)
    status.add_argument("--json", action="store_true")

    args = parser.parse_args(argv)
    try:
        if args.command == "validate":
            report = validate_register(load_json(args.register))
            print(json.dumps(report, indent=2, ensure_ascii=False) if args.json
                  else f"claims={report['claims']} ok={report['ok']} errors={len(report['errors'])}")
            return 0 if report["ok"] else 1

        if args.command == "evaluate":
            claim = load_claim(args.claim, args.claim_id)
            report = evaluate_claim(claim, args.source_file)
            if args.json:
                print(json.dumps(report, indent=2, ensure_ascii=False))
            else:
                print(f"{report['claim_id']}: {'PASS' if report['ok'] else 'FAIL'} "
                      f"findings={len(report['findings'])}")
                for finding in report["findings"]:
                    print(f"{finding['severity']:8} {finding['code']}: {finding['message']}")
            return 0 if report["ok"] else 1

        if args.command == "stale":
            register = load_json(args.register)
            updated = stale_update(register, args.claim_id, args.new_sha256, args.new_version)
            out = Path(args.out) if args.out else Path(args.register).with_suffix(".stale.json")
            out.write_text(json.dumps(updated, indent=2, ensure_ascii=False) + "\n",
                           encoding="utf-8")
            report = {"ok": True, "claim_id": args.claim_id, "out": str(out),
                      "review_status": "stale"}
            print(json.dumps(report, indent=2) if args.json
                  else f"stale: {args.claim_id} -> {out}")
            return 0

        report = status_report(load_json(args.register))
        print(json.dumps(report, indent=2, ensure_ascii=False) if args.json
              else f"claims={report['claims']} stale={len(report['stale_claims'])} "
                   f"outputs={len(report['stale_outputs'])}")
        return 0
    except Exception as exc:
        print(f"ERROR {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
