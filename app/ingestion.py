"""Module 1 (Part A): Dynamic File Ingestion & Schema Validation Layer.

Strictly separates raw file loading and schema validation from cleaning,
reconciliation, business logic, and UI. Never alters raw files on disk.
Preserves original record IDs and source provenance (_source_file, _source_row).
"""

from __future__ import annotations

import csv
import io
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


REQUIRED_SCHEMAS: Dict[str, List[str]] = {
    "leads.csv": [
        "lead_id",
        "created",
        "name",
        "business",
        "email",
        "phone",
        "source",
        "first_reply",
        "status",
    ],
    "bookings.csv": [
        "booking_id",
        "date",
        "client_name",
        "email",
        "service",
        "status",
        "price",
    ],
    "invoices.csv": [
        "invoice_no",
        "bill_to",
        "email",
        "issued",
        "due",
        "amount",
        "status",
        "memo",
    ],
    "payments.csv": [
        "payment_id",
        "date",
        "payer",
        "payer_email",
        "amount",
        "method",
        "reference",
    ],
    "production_board.csv": [
        "video_id",
        "client",
        "title",
        "editor",
        "stage",
        "notes_on_board",
        "revisions",
        "editor_hours",
        "client_approved_on",
        "shoot_booking",
    ],
    "team.csv": [
        "name",
        "role",
        "joined",
        "pay",
    ],
    "costs.csv": [
        "item",
        "cost",
        "note",
    ],
}

PRIMARY_KEY_MAP: Dict[str, str] = {
    "leads.csv": "lead_id",
    "bookings.csv": "booking_id",
    "invoices.csv": "invoice_no",
    "payments.csv": "payment_id",
    "production_board.csv": "video_id",
    "team.csv": "name",
    "costs.csv": "item",
}


@dataclass
class ValidationErrorItem:
    """Actionable validation error identifying filename, row index, and field."""

    filename: str
    row_number: int
    field_name: str
    severity: str  # "ERROR" or "WARNING"
    message: str
    raw_value: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return {
            "filename": self.filename,
            "row_number": self.row_number,
            "field_name": self.field_name,
            "severity": self.severity,
            "message": self.message,
            "raw_value": self.raw_value,
        }


@dataclass
class IngestedDataset:
    """Container holding raw ingested records with provenance and validation results."""

    leads: List[Dict[str, Any]] = field(default_factory=list)
    bookings: List[Dict[str, Any]] = field(default_factory=list)
    invoices: List[Dict[str, Any]] = field(default_factory=list)
    payments: List[Dict[str, Any]] = field(default_factory=list)
    production_board: List[Dict[str, Any]] = field(default_factory=list)
    team: List[Dict[str, Any]] = field(default_factory=list)
    costs: List[Dict[str, Any]] = field(default_factory=list)
    messages: List[Dict[str, Any]] = field(default_factory=list)
    validation_errors: List[ValidationErrorItem] = field(default_factory=list)
    loaded_files: List[str] = field(default_factory=list)


def detect_file_type(filename: str, headers: Optional[List[str]] = None) -> Optional[str]:
    """Identify canonical dataset file type from filename or CSV headers."""
    base = os.path.basename(filename).lower().strip()
    if base in REQUIRED_SCHEMAS:
        return base
    if base.endswith(".txt") or "message" in base:
        return "messages.txt"

    for canonical_name in REQUIRED_SCHEMAS:
        stem = canonical_name.replace(".csv", "")
        if stem in base:
            return canonical_name

    if headers:
        header_set = {h.strip().lower() for h in headers if h}
        for canonical_name, req_cols in REQUIRED_SCHEMAS.items():
            req_set = {c.lower() for c in req_cols}
            if req_set.issubset(header_set):
                return canonical_name

    return None


def parse_csv_content(
    content: str,
    source_filename: str,
    canonical_type: Optional[str] = None,
) -> Tuple[Optional[str], List[Dict[str, Any]], List[ValidationErrorItem]]:
    """Parse CSV text, validate schema and fields, and attach row provenance."""
    errors: List[ValidationErrorItem] = []
    if not content or not content.strip():
        errors.append(
            ValidationErrorItem(
                filename=source_filename,
                row_number=0,
                field_name="FILE",
                severity="ERROR",
                message="Uploaded CSV file is empty.",
            )
        )
        return None, [], errors

    reader = csv.reader(io.StringIO(content.strip()))
    try:
        raw_headers = next(reader)
    except StopIteration:
        errors.append(
            ValidationErrorItem(
                filename=source_filename,
                row_number=0,
                field_name="HEADER",
                severity="ERROR",
                message="Uploaded CSV file contains no header row.",
            )
        )
        return None, [], errors

    clean_headers = [h.strip().lstrip("\ufeff") for h in raw_headers]
    detected_type = canonical_type or detect_file_type(source_filename, clean_headers)

    if not detected_type or detected_type not in REQUIRED_SCHEMAS:
        errors.append(
            ValidationErrorItem(
                filename=source_filename,
                row_number=1,
                field_name="HEADER",
                severity="ERROR",
                message=(
                    f"Unrecognized CSV schema in '{source_filename}'. "
                    f"Found columns: {', '.join(clean_headers)}"
                ),
            )
        )
        return None, [], errors

    expected_cols = REQUIRED_SCHEMAS[detected_type]
    header_lookup = {h.lower(): h for h in clean_headers}
    missing_cols = [col for col in expected_cols if col.lower() not in header_lookup]
    if missing_cols:
        errors.append(
            ValidationErrorItem(
                filename=source_filename,
                row_number=1,
                field_name=",".join(missing_cols),
                severity="ERROR",
                message=(
                    f"Missing required column(s) in '{source_filename}' "
                    f"for {detected_type}: {', '.join(missing_cols)}"
                ),
            )
        )
        return detected_type, [], errors

    pk_col = PRIMARY_KEY_MAP[detected_type]
    records: List[Dict[str, Any]] = []

    for row_idx, row_values in enumerate(reader, start=2):
        if not any(cell.strip() for cell in row_values):
            continue

        if len(row_values) < len(clean_headers):
            errors.append(
                ValidationErrorItem(
                    filename=source_filename,
                    row_number=row_idx,
                    field_name="ROW_LENGTH",
                    severity="WARNING",
                    message=(
                        f"Row {row_idx} has {len(row_values)} columns, "
                        f"expected {len(clean_headers)}. Padding missing cells."
                    ),
                )
            )
            row_values = list(row_values) + [""] * (len(clean_headers) - len(row_values))

        raw_map = dict(zip(clean_headers, row_values))
        normalized_record: Dict[str, Any] = {}
        for expected_col in expected_cols:
            actual_col = header_lookup[expected_col.lower()]
            normalized_record[expected_col] = raw_map.get(actual_col, "").strip()

        pk_val = normalized_record.get(pk_col, "")
        if not pk_val:
            errors.append(
                ValidationErrorItem(
                    filename=source_filename,
                    row_number=row_idx,
                    field_name=pk_col,
                    severity="ERROR",
                    message=f"Missing primary identifier '{pk_col}' at row {row_idx}.",
                )
            )

        # Numeric field validation checks
        for num_field in ("amount", "price", "revisions", "editor_hours"):
            if num_field in normalized_record and normalized_record[num_field] != "":
                val_str = normalized_record[num_field].replace("$", "").replace(",", "").strip()
                try:
                    float(val_str)
                except ValueError:
                    errors.append(
                        ValidationErrorItem(
                            filename=source_filename,
                            row_number=row_idx,
                            field_name=num_field,
                            severity="ERROR",
                            message=f"Invalid numeric value '{normalized_record[num_field]}' in '{num_field}' at row {row_idx}.",
                            raw_value=normalized_record[num_field],
                        )
                    )

        normalized_record["_source_file"] = source_filename
        normalized_record["_source_row"] = row_idx
        normalized_record["_primary_id"] = pk_val
        records.append(normalized_record)

    return detected_type, records, errors


# Matches:
# [2026-04-18 09:40] EMAIL from reggie@lunaroofingco.com: Free estimate promo...
# [2026-06-05 14:03] VOICE NOTE from +1 972-555-0135 (David), 1:28. Transcript: "Can you..."
MESSAGE_LINE_RE = re.compile(
    r"^\[(?P<timestamp>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})\]\s+"
    r"(?P<channel_and_sender>[^:]+):\s*(?P<body_text>.*)$"
)


def parse_messages_content(
    content: str,
    source_filename: str = "messages.txt",
) -> Tuple[List[Dict[str, Any]], List[ValidationErrorItem]]:
    """Parse unstructured messages.txt log while preserving line provenance."""
    errors: List[ValidationErrorItem] = []
    messages: List[Dict[str, Any]] = []

    if not content or not content.strip():
        errors.append(
            ValidationErrorItem(
                filename=source_filename,
                row_number=0,
                field_name="FILE",
                severity="ERROR",
                message="Uploaded messages file is empty.",
            )
        )
        return messages, errors

    lines = content.splitlines()
    msg_seq = 0
    for line_idx, raw_line in enumerate(lines, start=1):
        stripped = raw_line.strip()
        if not stripped:
            continue

        match = MESSAGE_LINE_RE.match(stripped)
        if not match:
            errors.append(
                ValidationErrorItem(
                    filename=source_filename,
                    row_number=line_idx,
                    field_name="MESSAGE_FORMAT",
                    severity="WARNING",
                    message=f"Line {line_idx} has non-standard timestamp header format.",
                    raw_value=stripped[:120],
                )
            )
            msg_seq += 1
            messages.append(
                {
                    "message_id": f"MSG-{msg_seq:03d}",
                    "timestamp": "",
                    "date": "",
                    "channel": "unknown",
                    "direction": "from",
                    "sender": "Unknown",
                    "body": stripped,
                    "is_voice_note": "VOICE NOTE" in stripped.upper(),
                    "_source_file": source_filename,
                    "_source_row": line_idx,
                    "_primary_id": f"MSG-{msg_seq:03d}",
                }
            )
            continue

        msg_seq += 1
        ts = match.group("timestamp").strip()
        header_part = match.group("channel_and_sender").strip()
        body = match.group("body_text").strip()

        # Special handling for VOICE NOTE lines where colon appears after '1:28. Transcript:'
        is_voice = "VOICE NOTE" in stripped.upper()
        if is_voice and "Transcript:" in stripped:
            after_ts = stripped.split("]", 1)[1].strip()
            parts_tr = after_ts.split("Transcript:", 1)
            header_part = parts_tr[0].strip().rstrip(".")
            body = parts_tr[1].strip().strip('"')

        channel = "EMAIL"
        direction = "from"
        sender = header_part
        for ch_prefix in ("VOICE NOTE", "INSTAGRAM DM", "WHATSAPP", "WEB FORM", "EMAIL", "SMS"):
            if header_part.upper().startswith(ch_prefix):
                channel = ch_prefix
                rest = header_part[len(ch_prefix) :].strip()
                if rest.lower().startswith("from "):
                    direction = "from"
                    sender = rest[5:].strip()
                elif rest.lower().startswith("to "):
                    direction = "to"
                    sender = rest[3:].strip()
                else:
                    sender = rest
                break

        messages.append(
            {
                "message_id": f"MSG-{msg_seq:03d}",
                "timestamp": ts,
                "date": ts.split(" ")[0] if " " in ts else ts[:10],
                "channel": channel.lower(),
                "direction": direction,
                "sender": sender,
                "body": body,
                "is_voice_note": is_voice,
                "_source_file": source_filename,
                "_source_row": line_idx,
                "_primary_id": f"MSG-{msg_seq:03d}",
            }
        )

    return messages, errors


def load_raw_data_directory(
    data_dir: str | Path,
    extra_uploaded_files: Optional[Dict[str, str]] = None,
) -> IngestedDataset:
    """Load baseline raw files from data_dir without modifying them, plus any uploaded overrides/additions."""
    dataset = IngestedDataset()
    base_path = Path(data_dir)

    file_contents: Dict[str, Tuple[str, str]] = {}
    for canonical_file in list(REQUIRED_SCHEMAS.keys()) + ["messages.txt"]:
        fpath = base_path / canonical_file
        if fpath.exists():
            file_contents[canonical_file] = (canonical_file, fpath.read_text(encoding="utf-8"))

    for canonical_file, (src_name, text) in file_contents.items():
        _ingest_single_file_into_dataset(dataset, src_name, text, canonical_hint=canonical_file, merge_mode="replace")

    if extra_uploaded_files:
        for up_name, up_text in extra_uploaded_files.items():
            _ingest_single_file_into_dataset(dataset, up_name, up_text, canonical_hint=None, merge_mode="upsert")

    return dataset


def _ingest_single_file_into_dataset(
    dataset: IngestedDataset,
    source_filename: str,
    content: str,
    canonical_hint: Optional[str] = None,
    merge_mode: str = "upsert",
) -> None:
    """Ingest a single CSV or messages.txt content string into IngestedDataset."""
    detected = canonical_hint or detect_file_type(source_filename)
    if detected == "messages.txt" or source_filename.lower().endswith(".txt"):
        msgs, errs = parse_messages_content(content, source_filename=source_filename)
        dataset.validation_errors.extend(errs)
        if msgs:
            dataset.loaded_files.append(source_filename)
            if merge_mode == "replace" or not dataset.messages:
                dataset.messages = msgs
            else:
                existing_keys = {(m["timestamp"], m["sender"], m["body"]) for m in dataset.messages}
                next_seq = len(dataset.messages) + 1
                for m in msgs:
                    key = (m["timestamp"], m["sender"], m["body"])
                    if key not in existing_keys:
                        m["message_id"] = f"MSG-{next_seq:03d}"
                        m["_primary_id"] = m["message_id"]
                        next_seq += 1
                        dataset.messages.append(m)
                        existing_keys.add(key)
        return

    detected_csv, rows, errs = parse_csv_content(
        content,
        source_filename=source_filename,
        canonical_type=canonical_hint,
    )
    dataset.validation_errors.extend(errs)
    if not detected_csv or not rows:
        return

    dataset.loaded_files.append(source_filename)
    attr_name = detected_csv.replace(".csv", "")
    target_list: List[Dict[str, Any]] = getattr(dataset, attr_name)
    pk_col = PRIMARY_KEY_MAP[detected_csv]

    if merge_mode == "replace" or not target_list:
        setattr(dataset, attr_name, rows)
    else:
        index_by_pk = {r.get(pk_col): idx for idx, r in enumerate(target_list) if r.get(pk_col)}
        for r in rows:
            pk_val = r.get(pk_col)
            if pk_val and pk_val in index_by_pk:
                target_list[index_by_pk[pk_val]] = r
            else:
                if pk_val:
                    index_by_pk[pk_val] = len(target_list)
                target_list.append(r)
