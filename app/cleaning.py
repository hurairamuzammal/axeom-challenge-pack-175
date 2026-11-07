"""Module 1 (Part B): Multi-Format Date Normalization, Text Cleaning & Soft Spam Filtering.

Implements:
- Source-aware date parsing (MM/DD/YYYY for bookings.csv, DD/MM/YYYY for payments.csv,
  YYYY-MM-DD for leads.csv, invoices.csv, production_board.csv).
- Email typo sanitization (e.g., office@torresdental.con -> office@torresdental.com).
- Soft Spam Filtering & Audit Log: flags suspicious leads (L052, L063, L081, L089) as
  'Spam Review' without deleting records, while whitelisting legitimate business domains
  (.co, .fm, .build, .org, .coffee) that have valid phone numbers or business names.
"""

from __future__ import annotations

import copy
import re
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any, Dict, List, Optional, Set, Tuple

from app.ingestion import IngestedDataset, ValidationErrorItem


GENERIC_EMAIL_DOMAINS: Set[str] = {
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
}

SUSPICIOUS_SPAM_DOMAINS: Set[str] = {
    "test.com",
    "rank1seo.biz",
    "fastfollowers.io",
    "coin-x.io",
    "acct-dept.co",
    "domain-renewals.net",
    "insta.support.team",
    "growthhackz.io",
    "rankboosters.biz",
}

SPAM_KEYWORDS: List[str] = [
    "seo services",
    "free followers",
    "buy followers",
    "50k followers",
    "backlinks",
    "crypto deals",
    "crypto",
    "test test",
    "test@test.com",
    "google rank",
    "page 1 in 48 hours",
    "final notice",
    "listing expires",
    "flagged for copyright",
    "verify immediately",
    "invoice #88412",
]


@dataclass
class CleanedDataset:
    """Normalized dataset produced by the Cleaning & Soft Spam Filtering layer."""

    leads: List[Dict[str, Any]] = field(default_factory=list)
    valid_leads: List[Dict[str, Any]] = field(default_factory=list)
    spam_audit_log: List[Dict[str, Any]] = field(default_factory=list)
    bookings: List[Dict[str, Any]] = field(default_factory=list)
    invoices: List[Dict[str, Any]] = field(default_factory=list)
    payments: List[Dict[str, Any]] = field(default_factory=list)
    production_board: List[Dict[str, Any]] = field(default_factory=list)
    team: List[Dict[str, Any]] = field(default_factory=list)
    costs: List[Dict[str, Any]] = field(default_factory=list)
    messages: List[Dict[str, Any]] = field(default_factory=list)
    validation_errors: List[ValidationErrorItem] = field(default_factory=list)


def normalize_email(raw_email: str) -> str:
    """Normalize email to lowercase stripped string and fix known '.con' typo."""
    if not raw_email:
        return ""
    cleaned = raw_email.strip().lower()
    if cleaned.endswith(".con"):
        cleaned = cleaned[:-4] + ".com"
    return cleaned


def extract_email_domain(email: str) -> str:
    """Return domain portion of normalized email, or empty string."""
    norm = normalize_email(email)
    if "@" not in norm:
        return ""
    return norm.split("@", 1)[1].strip()


def normalize_phone(raw_phone: str) -> str:
    """Standardize US phone numbers to XXX-XXX-XXXX while preserving digits."""
    if not raw_phone:
        return ""
    digits = re.sub(r"\D", "", raw_phone)
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    if len(digits) == 10:
        return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
    return raw_phone.strip()


def normalize_name_text(raw_text: str) -> str:
    """Collapse internal whitespace and strip surrounding spaces."""
    if not raw_text:
        return ""
    return re.sub(r"\s+", " ", raw_text.strip())


def parse_source_date(
    raw_date: str,
    source_type: str,
    filename: str = "",
    row_number: int = 0,
    field_name: str = "",
    allow_empty: bool = False,
) -> Tuple[Optional[date], Optional[ValidationErrorItem]]:
    """Parse date according to file-specific specification rules into ISO YYYY-MM-DD.

    Specification rules:
    - bookings.csv: MM/DD/YYYY (e.g., 10/05/2026 -> 2026-10-05)
    - payments.csv: DD/MM/YYYY (e.g., 02/08/2026 -> 2026-08-02)
    - leads.csv, invoices.csv, production_board.csv: YYYY-MM-DD
    """
    val = (raw_date or "").strip()
    if not val:
        if allow_empty:
            return None, None
        return None, ValidationErrorItem(
            filename=filename or source_type,
            row_number=row_number,
            field_name=field_name,
            severity="ERROR",
            message=f"Missing date value in '{field_name}' at row {row_number}.",
            raw_value=raw_date,
        )

    date_part = val.split(" ")[0].strip()

    if re.match(r"^\d{4}-\d{2}-\d{2}$", date_part):
        try:
            return datetime.strptime(date_part, "%Y-%m-%d").date(), None
        except ValueError as exc:
            return None, ValidationErrorItem(
                filename=filename or source_type,
                row_number=row_number,
                field_name=field_name,
                severity="ERROR",
                message=f"Invalid ISO date '{raw_date}' in '{field_name}': {exc}",
                raw_value=raw_date,
            )

    if "/" in date_part:
        if source_type == "payments.csv":
            primary_fmt = "%d/%m/%Y"
            fallback_fmt = "%m/%d/%Y"
        elif source_type == "bookings.csv":
            primary_fmt = "%m/%d/%Y"
            fallback_fmt = "%d/%m/%Y"
        else:
            primary_fmt = "%m/%d/%Y"
            fallback_fmt = "%d/%m/%Y"

        for fmt in (primary_fmt, fallback_fmt):
            try:
                return datetime.strptime(date_part, fmt).date(), None
            except ValueError:
                continue

    return None, ValidationErrorItem(
        filename=filename or source_type,
        row_number=row_number,
        field_name=field_name,
        severity="ERROR",
        message=f"Malformed date '{raw_date}' in '{field_name}' at row {row_number}.",
        raw_value=raw_date,
    )


def evaluate_lead_spam_risk(lead: Dict[str, Any]) -> Tuple[bool, int, List[str]]:
    """Risk-score an incoming lead under Module 1.2 Soft Spam Filtering rules.

    Returns (is_spam_flagged, risk_score_0_to_100, reasons_list).
    Whitelists legitimate business domains (.co, .fm, .build, .org, .coffee, .com)
    when backed by a valid phone number or explicit business name.
    """
    contact_name = normalize_name_text(lead.get("name", ""))
    business_name = normalize_name_text(lead.get("business", ""))
    email = normalize_email(lead.get("email", ""))
    domain = extract_email_domain(email)
    phone = normalize_phone(lead.get("phone", ""))
    status_raw = (lead.get("status") or "").strip().lower()

    reasons: List[str] = []
    risk_score = 0

    if status_raw == "spam":
        risk_score += 50
        reasons.append("Marked as 'spam' status in raw lead source")

    missing_phone = not bool(phone)
    missing_business = not bool(business_name)
    if missing_phone and missing_business:
        risk_score += 40
        reasons.append("Missing both phone number and business entity name")
    elif missing_phone:
        risk_score += 25
        reasons.append("Missing callback phone number")

    if domain in SUSPICIOUS_SPAM_DOMAINS:
        risk_score += 45
        reasons.append(f"Suspicious sender domain '{domain}'")

    combined_text = f"{contact_name.lower()} {business_name.lower()} {email}"
    matched_keywords = [kw for kw in SPAM_KEYWORDS if kw in combined_text]
    if matched_keywords:
        risk_score += 40
        reasons.append(f"Spam/bot keywords detected: {', '.join(matched_keywords[:3])}")

    # WHITELIST GUARD (Test Case 1.2):
    # Custom business domains (.co, .fm, .build, .org, .coffee, .com) with a valid phone
    # or explicit business name that are NOT in SUSPICIOUS_SPAM_DOMAINS bypass spam filtering.
    has_valid_phone = bool(re.match(r"^\d{3}-\d{3}-\d{4}$", phone))
    is_custom_business_domain = (
        bool(domain)
        and (domain not in GENERIC_EMAIL_DOMAINS)
        and (domain not in SUSPICIOUS_SPAM_DOMAINS)
    )
    if (has_valid_phone or bool(business_name)) and is_custom_business_domain and status_raw != "spam":
        return False, 0, ["Whitelisted: Verified custom business domain with valid phone/business"]

    is_spam = risk_score >= 50
    return is_spam, min(risk_score, 100), reasons


def clean_and_normalize_dataset(
    ingested: IngestedDataset,
    restored_lead_ids: Optional[Set[str]] = None,
    deleted_lead_ids: Optional[Set[str]] = None,
) -> CleanedDataset:
    """Execute Module 1 cleaning, date normalization, and soft spam filtering."""
    restored_ids = restored_lead_ids or set()
    deleted_ids = deleted_lead_ids or set()

    cleaned = CleanedDataset()
    cleaned.validation_errors.extend(ingested.validation_errors)

    # 1. Clean & Soft-Filter Leads
    for raw_lead in ingested.leads:
        lead = copy.deepcopy(raw_lead)
        lead_id = lead.get("lead_id", "")
        src_file = lead.get("_source_file", "leads.csv")
        src_row = lead.get("_source_row", 0)

        dt, err = parse_source_date(
            lead.get("created", ""),
            source_type="leads.csv",
            filename=src_file,
            row_number=src_row,
            field_name="created",
        )
        if err:
            cleaned.validation_errors.append(err)
        reply_dt, _ = parse_source_date(
            lead.get("first_reply", ""),
            source_type="leads.csv",
            filename=src_file,
            row_number=src_row,
            field_name="first_reply",
            allow_empty=True,
        )

        lead["created_date_iso"] = dt.isoformat() if dt else ""
        lead["created_date_obj"] = dt
        lead["first_reply_iso"] = reply_dt.isoformat() if reply_dt else ""
        lead["first_reply_obj"] = reply_dt

        lead["contact_name"] = normalize_name_text(lead.get("name", ""))
        lead["business_name"] = normalize_name_text(lead.get("business", ""))
        lead["email_normalized"] = normalize_email(lead.get("email", ""))
        lead["email_domain"] = extract_email_domain(lead["email_normalized"])
        lead["phone_normalized"] = normalize_phone(lead.get("phone", ""))
        lead["channel_normalized"] = normalize_name_text(lead.get("source", ""))
        lead["status_normalized"] = (lead.get("status") or "").strip().lower()

        is_spam, risk_score, reasons = evaluate_lead_spam_risk(lead)

        if lead_id in deleted_ids:
            lead["spam_filter_status"] = "Deleted Permanently"
            lead["is_spam"] = True
            lead["spam_risk_score"] = risk_score
            lead["spam_reasons"] = reasons + ["Owner action: Deleted permanently from active pipeline"]
            cleaned.spam_audit_log.append(lead)
            cleaned.leads.append(lead)
            continue

        if lead_id in restored_ids:
            lead["spam_filter_status"] = "Restored Valid Lead"
            lead["is_spam"] = False
            lead["spam_risk_score"] = risk_score
            lead["spam_reasons"] = reasons + ["Owner action: Restored as Valid Lead"]
            cleaned.valid_leads.append(lead)
            cleaned.leads.append(lead)
            continue

        if is_spam:
            lead["spam_filter_status"] = "Spam Review"
            lead["is_spam"] = True
            lead["spam_risk_score"] = risk_score
            lead["spam_reasons"] = reasons
            cleaned.spam_audit_log.append(lead)
        else:
            lead["spam_filter_status"] = "Valid Lead"
            lead["is_spam"] = False
            lead["spam_risk_score"] = risk_score
            lead["spam_reasons"] = reasons
            cleaned.valid_leads.append(lead)

        cleaned.leads.append(lead)

    # 2. Clean & Normalize Bookings (MM/DD/YYYY -> YYYY-MM-DD)
    for raw_b in ingested.bookings:
        b = copy.deepcopy(raw_b)
        src_file = b.get("_source_file", "bookings.csv")
        src_row = b.get("_source_row", 0)

        dt, err = parse_source_date(
            b.get("date", ""),
            source_type="bookings.csv",
            filename=src_file,
            row_number=src_row,
            field_name="date",
        )
        if err:
            cleaned.validation_errors.append(err)

        b["shoot_date_iso"] = dt.isoformat() if dt else ""
        b["shoot_date_obj"] = dt
        b["client_name_normalized"] = normalize_name_text(b.get("client_name", ""))
        b["email_raw"] = (b.get("email") or "").strip()
        b["email_normalized"] = normalize_email(b.get("email", ""))
        b["has_email_typo"] = b["email_raw"].lower().endswith(".con")
        b["email_domain"] = extract_email_domain(b["email_normalized"])
        b["status_normalized"] = (b.get("status") or "").strip().lower()

        try:
            b["rate_num"] = round(
                float(str(b.get("price", "0") or "0").replace("$", "").replace(",", "").strip()),
                2,
            )
        except ValueError:
            b["rate_num"] = 0.0

        cleaned.bookings.append(b)

    # 3. Clean & Normalize Invoices (YYYY-MM-DD)
    for raw_inv in ingested.invoices:
        inv = copy.deepcopy(raw_inv)
        src_file = inv.get("_source_file", "invoices.csv")
        src_row = inv.get("_source_row", 0)

        issued_dt, err1 = parse_source_date(
            inv.get("issued", ""),
            source_type="invoices.csv",
            filename=src_file,
            row_number=src_row,
            field_name="issued",
        )
        due_dt, err2 = parse_source_date(
            inv.get("due", ""),
            source_type="invoices.csv",
            filename=src_file,
            row_number=src_row,
            field_name="due",
        )
        if err1:
            cleaned.validation_errors.append(err1)
        if err2:
            cleaned.validation_errors.append(err2)

        inv["issued_date_iso"] = issued_dt.isoformat() if issued_dt else ""
        inv["issued_date_obj"] = issued_dt
        inv["due_date_iso"] = due_dt.isoformat() if due_dt else ""
        inv["due_date_obj"] = due_dt
        inv["client_normalized"] = normalize_name_text(inv.get("bill_to", ""))
        inv["email_normalized"] = normalize_email(inv.get("email", ""))
        inv["email_domain"] = extract_email_domain(inv["email_normalized"])
        inv["status_normalized"] = (inv.get("status") or "").strip().lower()
        inv["memo_normalized"] = normalize_name_text(inv.get("memo", ""))

        try:
            inv["amount_num"] = round(
                float(str(inv.get("amount", "0") or "0").replace("$", "").replace(",", "").strip()),
                2,
            )
        except ValueError:
            inv["amount_num"] = 0.0

        cleaned.invoices.append(inv)

    # 4. Clean & Normalize Payments (DD/MM/YYYY -> YYYY-MM-DD)
    for raw_p in ingested.payments:
        p = copy.deepcopy(raw_p)
        src_file = p.get("_source_file", "payments.csv")
        src_row = p.get("_source_row", 0)

        paid_dt, err = parse_source_date(
            p.get("date", ""),
            source_type="payments.csv",
            filename=src_file,
            row_number=src_row,
            field_name="date",
        )
        if err:
            cleaned.validation_errors.append(err)

        p["paid_date_iso"] = paid_dt.isoformat() if paid_dt else ""
        p["paid_date_obj"] = paid_dt
        p["payer_normalized"] = normalize_name_text(p.get("payer", ""))
        p["email_normalized"] = normalize_email(p.get("payer_email", ""))
        p["email_domain"] = extract_email_domain(p["email_normalized"])
        p["method_normalized"] = (p.get("method") or "").strip().lower()
        p["reference_normalized"] = (p.get("reference") or "").strip()
        p["status_normalized"] = "succeeded"

        try:
            p["amount_num"] = round(
                float(str(p.get("amount", "0") or "0").replace("$", "").replace(",", "").strip()),
                2,
            )
        except ValueError:
            p["amount_num"] = 0.0

        cleaned.payments.append(p)

    # 5. Clean & Normalize Production Board
    for raw_v in ingested.production_board:
        v = copy.deepcopy(raw_v)
        src_file = v.get("_source_file", "production_board.csv")
        src_row = v.get("_source_row", 0)

        approved_dt, _ = parse_source_date(
            v.get("client_approved_on", ""),
            source_type="production_board.csv",
            filename=src_file,
            row_number=src_row,
            field_name="client_approved_on",
            allow_empty=True,
        )

        v["approved_date_iso"] = approved_dt.isoformat() if approved_dt else ""
        v["approved_date_obj"] = approved_dt
        v["client_normalized"] = normalize_name_text(v.get("client", ""))
        v["title_normalized"] = normalize_name_text(v.get("title", ""))
        v["editor_normalized"] = normalize_name_text(v.get("editor", ""))
        v["stage_normalized"] = (v.get("stage") or "").strip().lower()
        v["booking_id"] = (v.get("shoot_booking") or "").strip()
        try:
            v["revisions_num"] = int(float(str(v.get("revisions", "0") or "0")))
        except ValueError:
            v["revisions_num"] = 0
        try:
            v["editor_hours_num"] = round(float(str(v.get("editor_hours", "0") or "0")), 2)
        except ValueError:
            v["editor_hours_num"] = 0.0

        cleaned.production_board.append(v)

    # 6. Clean Team & Costs
    for raw_t in ingested.team:
        t = copy.deepcopy(raw_t)
        pay_str = (t.get("pay") or "").strip()
        rate_match = re.search(r"\$?(\d+(?:\.\d+)?)", pay_str)
        t["hourly_rate_num"] = float(rate_match.group(1)) if rate_match else 0.0
        cleaned.team.append(t)

    for raw_c in ingested.costs:
        c = copy.deepcopy(raw_c)
        cleaned.costs.append(c)

    cleaned.messages = copy.deepcopy(ingested.messages)
    return cleaned
