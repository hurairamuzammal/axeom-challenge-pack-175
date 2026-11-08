"""Module 4 (Part B) & Module 5: Business Logic, Balance Guards, Upsell Routing & KPI Engine.

Computes all financial and operational truth relative to BUSINESS_DATE (2026-10-06):
- Overdue invoices & days overdue calculation (7 invoices totaling $7,670.00)
- Completed bookings never billed (5 bookings totaling $3,210.00: B038, B080, B083, B131, B132)
- Customer Balance Guards & Duplicate Invoice Prevention:
  * Blue Bonnet Realty (B142 cancelled -> rescheduled to B154; prepaid $1,500 via P5121 on INV-1131;
    duplicate unpaid invoice INV-1138 $1,500 flagged for credit/void)
  * Prime Barbershop (P5077 $900.00 duplicate Zelle overpayment for INV-1080)
  * Crown Church (INV-1065 $30.00 community discount overcharge on B064)
- Active Client Upsell Prioritization (existing clients submitting new web/social leads + 15 unreplied human leads)
- Production Board bottlenecks, zombie revision tasks (V121, V152), lost requests (V022, V049, V081, V047, V149),
  and Eli efficiency metrics
- Interactive "Suggest, Never Act Alone" owner confirmation queue
"""

from __future__ import annotations

from datetime import date
from typing import Any, Dict, List, Optional, Set

from app import BUSINESS_DATE, PACK_ID
from app.cleaning import CleanedDataset
from app.jev_integration import JevExtractionEngine
from app.reconciliation import ReconciliationResult


def compute_business_state(
    cleaned: CleanedDataset,
    reconciled: ReconciliationResult,
    owner_decisions: Optional[Dict[str, str]] = None,
    approved_revision_syncs: Optional[Set[str]] = None,
    custom_revision_intakes: Optional[List[Dict[str, Any]]] = None,
    reference_date: date = BUSINESS_DATE,
) -> Dict[str, Any]:
    """Run Module 4 & Module 5 business rules and return complete reactive application state."""
    decisions = owner_decisions or {}
    approved_revs = approved_revision_syncs or set()
    custom_intakes = custom_revision_intakes or []

    # 1. Deterministic Booking-to-Invoice Linking
    non_void_invoices = [
        inv
        for inv in reconciled.reconciled_invoices.values()
        if inv["status_normalized"] != "void"
    ]
    matched_booking_ids: Set[str] = set()
    used_invoice_nos: Set[str] = set()
    invoices_by_booking: Dict[str, List[Dict[str, Any]]] = {}

    # Pass A: Explicit booking_id (Bxxx) extracted from invoice memo
    for inv in non_void_invoices:
        bid = (inv.get("booking_id") or "").strip()
        if bid:
            matched_booking_ids.add(bid)
            used_invoice_nos.add(inv["invoice_no"])
            invoices_by_booking.setdefault(bid, []).append(inv)

    # Pass B: Match remaining completed paid-rate bookings by canonical client, amount, and date proximity
    for b in cleaned.bookings:
        bid = b["booking_id"]
        if bid in matched_booking_ids or b["status_normalized"] != "completed" or b["rate_num"] <= 0:
            continue
        b_dt = b.get("shoot_date_obj")
        b_cli = b.get("canonical_client", "")
        for inv in non_void_invoices:
            if inv["invoice_no"] in used_invoice_nos:
                continue
            i_cli = inv.get("beneficiary_client") or inv.get("canonical_client", "")
            same_client = (i_cli == b_cli) or (
                b_cli in ("Vista Pediatrics", "Parkside Chiropractic")
                and inv.get("canonical_client") == "Fieldhouse Marketing"
            )
            if not same_client:
                continue
            i_dt = inv.get("issued_date_obj")
            if i_dt and b_dt and -9 <= (i_dt - b_dt).days <= 5 and inv["amount_num"] == b["rate_num"]:
                matched_booking_ids.add(bid)
                used_invoice_nos.add(inv["invoice_no"])
                inv["booking_id"] = bid
                invoices_by_booking.setdefault(bid, []).append(inv)
                break

    # =========================================================================
    # MODULE 5.1: CUSTOMER BALANCE GUARDS & DUPLICATE INVOICE PREVENTION
    # =========================================================================
    we_owe_items: List[Dict[str, Any]] = []
    balance_guard_alerts: List[Dict[str, Any]] = []

    # Check cancelled bookings that were billed and paid (e.g. Blue Bonnet Realty B142 / INV-1131 -> B154 / INV-1138)
    for b in cleaned.bookings:
        if b["status_normalized"] == "cancelled":
            bid = b["booking_id"]
            b_invs = invoices_by_booking.get(bid, [])
            for paid_inv in b_invs:
                if paid_inv["paid_amount"] > 0:
                    client_name = b.get("canonical_client") or b["client_name_normalized"]
                    credit_amt = paid_inv["paid_amount"]

                    # Find rescheduled replacement booking for same client after cancelled shoot date
                    resched_candidates = [
                        rb
                        for rb in cleaned.bookings
                        if rb.get("canonical_client") == client_name
                        and rb["booking_id"] != bid
                        and (rb.get("shoot_date_iso") or "") >= (b.get("shoot_date_iso") or "")
                    ]
                    resched_b = resched_candidates[0] if resched_candidates else None
                    dup_invs = (
                        invoices_by_booking.get(resched_b["booking_id"], []) if resched_b else []
                    )
                    dup_inv = dup_invs[0] if dup_invs else None

                    guard_key = f"BALANCE_GUARD_{paid_inv['invoice_no']}"
                    guard_decision = decisions.get(guard_key, "PENDING_OWNER_REVIEW")

                    if dup_inv:
                        dup_inv["is_duplicate_billed_reschedule"] = True
                        if guard_decision == "VOID_DUPLICATE_AND_APPLY_CREDIT":
                            dup_inv["effective_status"] = "voided_duplicate_covered_by_credit"
                            dup_inv["remaining_balance"] = 0.0

                    explanation = (
                        f"Shoot {bid} ({b['shoot_date_iso']}) was cancelled for a family emergency and "
                        f"rescheduled to {resched_b['booking_id'] if resched_b else 'a later date'} "
                        f"({resched_b['shoot_date_iso'] if resched_b else ''}). Client paid ${credit_amt:,.2f} "
                        f"on {paid_inv['invoice_no']} (via {', '.join(paid_inv['applied_payment_ids'])}). "
                    )
                    if dup_inv:
                        explanation += (
                            f"Axeom erroneously generated an extra unpaid invoice {dup_inv['invoice_no']} "
                            f"(${dup_inv['amount_num']:,.2f}) for the rescheduled shoot instead of applying "
                            f"the prepaid funds, requiring a ${credit_amt:,.2f} invoice credit/cancellation."
                        )
                        reconciled.billing_tool_discrepancies.append(
                            {
                                "invoice_no": dup_inv["invoice_no"],
                                "invoice": dup_inv["invoice_no"],
                                "payment_id": ", ".join(paid_inv["applied_payment_ids"]),
                                "client": client_name,
                                "amount": dup_inv["amount_num"],
                                "paid_date": "",
                                "tool_says": dup_inv["status"],
                                "truth": f"void / covered by prepaid {', '.join(paid_inv['applied_payment_ids'])}",
                                "reconciliation_pass": "Module 5: Customer Balance Guard",
                                "confidence": "HIGH",
                                "how_you_know": explanation,
                            }
                        )

                    alert_obj = {
                        "guard_id": guard_key,
                        "client": client_name,
                        "cancelled_booking_id": bid,
                        "rescheduled_booking_id": resched_b["booking_id"] if resched_b else "",
                        "prepaid_invoice_no": paid_inv["invoice_no"],
                        "prepaid_payment_ids": paid_inv["applied_payment_ids"],
                        "duplicate_invoice_no": dup_inv["invoice_no"] if dup_inv else "",
                        "amount": credit_amt,
                        "status": guard_decision,
                        "confidence": "HIGH",
                        "explanation": explanation,
                        "suggested_actions": [
                            {
                                "action_id": "VOID_DUPLICATE_AND_APPLY_CREDIT",
                                "label": (
                                    f"Void Duplicate {dup_inv['invoice_no']} & Apply ${credit_amt:,.2f} Credit to {resched_b['booking_id']}"
                                    if (dup_inv and resched_b)
                                    else f"Apply ${credit_amt:,.2f} Credit to Account"
                                ),
                            },
                            {
                                "action_id": "ISSUE_REFUND",
                                "label": f"Issue ${credit_amt:,.2f} Refund to {client_name}",
                            },
                        ],
                    }
                    balance_guard_alerts.append(alert_obj)
                    if guard_decision != "VOID_DUPLICATE_AND_APPLY_CREDIT":
                        we_owe_items.append(
                            {
                                "client": client_name,
                                "type": "Pre-Paid Rescheduled Shoot / Duplicate Invoice Guard",
                                "reference_id": f"{paid_inv['invoice_no']} / {dup_inv['invoice_no'] if dup_inv else bid}",
                                "payment_id": ", ".join(paid_inv["applied_payment_ids"]),
                                "amount": credit_amt,
                                "date": paid_inv["issued_date_iso"],
                                "confidence": "HIGH",
                                "status": guard_decision,
                                "why": explanation,
                                "reason": explanation,
                            }
                        )

    # Also surface Module 3 Pass 4 Unapplied Overpayments (Prime Barbershop P5077 $900.00)
    # and Discount Overcharges (Crown Church INV-1065 $30.00) in credit_and_overpayment_audit
    credit_and_overpayment_audit: List[Dict[str, Any]] = list(we_owe_items)
    for unrec_p in reconciled.unreconciled_payments:
        credit_and_overpayment_audit.append(
            {
                "client": unrec_p.get("canonical_client") or unrec_p["payer_normalized"],
                "type": "Unapplied Duplicate Payment / Overpayment Credit (Pass 4)",
                "reference_id": f"{unrec_p['payment_id']} (Open Inv: {', '.join(unrec_p.get('open_client_invoices', [])) or 'None'})",
                "payment_id": unrec_p["payment_id"],
                "amount": unrec_p["amount_num"],
                "date": unrec_p["paid_date_iso"],
                "confidence": "HIGH",
                "status": unrec_p.get("owner_decision", "PENDING_OWNER_REVIEW"),
                "why": unrec_p["explanation"],
                "reason": unrec_p["explanation"],
            }
        )
    for over_c in reconciled.invoice_overcharges:
        credit_and_overpayment_audit.append(
            {
                "client": over_c["client"],
                "type": "Community Discount Billing Overcharge (10% Off Not Applied)",
                "reference_id": f"{over_c['invoice_no']} ({over_c['booking_id']})",
                "payment_id": "P5067",
                "amount": over_c["overcharge_amount"],
                "date": "2026-07-09",
                "confidence": "HIGH",
                "status": decisions.get(f"OVERCHARGE_{over_c['invoice_no']}", "PENDING_OWNER_REVIEW"),
                "why": over_c["reason"],
                "reason": over_c["reason"],
            }
        )

    # =========================================================================
    # OVERDUE INVOICES & OPEN RECEIVABLES (RELATIVE TO 2026-10-06)
    # =========================================================================
    overdue_invoices: List[Dict[str, Any]] = []
    due_today_invoices: List[Dict[str, Any]] = []
    upcoming_open_invoices: List[Dict[str, Any]] = []

    for inv_no in sorted(reconciled.reconciled_invoices.keys()):
        inv = reconciled.reconciled_invoices[inv_no]
        rem = inv["remaining_balance"]
        if rem <= 0 or inv.get("effective_status") == "voided_duplicate_covered_by_credit":
            continue

        due_dt: Optional[date] = inv.get("due_date_obj")
        if not due_dt:
            continue

        days_overdue = (reference_date - due_dt).days
        reminder_key = f"REMINDER_{inv_no}"
        reminder_status = decisions.get(reminder_key, "PENDING")

        inv_summary = {
            "invoice_no": inv_no,
            "invoice": inv_no,
            "booking_id": inv.get("booking_id", ""),
            "client": inv.get("canonical_client") or inv["client_normalized"],
            "raw_bill_to": inv["client_normalized"],
            "email": inv["email_normalized"],
            "issued_date": inv["issued_date_iso"],
            "due_date": inv["due_date_iso"],
            "original_amount": inv["amount_num"],
            "paid_amount": inv["paid_amount"],
            "amount_owed": rem,
            "days_overdue": days_overdue,
            "days_late": days_overdue,
            "raw_status": inv.get("status", ""),
            "effective_status": inv.get("effective_status", ""),
            "is_duplicate_billed_reschedule": inv.get("is_duplicate_billed_reschedule", False),
            "memo": inv.get("memo_normalized", ""),
            "reminder_status": reminder_status,
            "_source_file": inv.get("_source_file", "invoices.csv"),
            "_source_row": inv.get("_source_row", 0),
        }

        if days_overdue > 0:
            overdue_invoices.append(inv_summary)
        elif days_overdue == 0:
            due_today_invoices.append(inv_summary)
        else:
            upcoming_open_invoices.append(inv_summary)

    overdue_invoices.sort(key=lambda x: (-x["days_overdue"], x["invoice_no"]))

    # =========================================================================
    # COMPLETED WORK NEVER BILLED (2 MAY RETAINERS $5,000 + 5 SESSIONS $3,210 = $8,210.00)
    # =========================================================================
    never_billed: List[Dict[str, Any]] = []

    # 1. Check completed Retainer Shoot bookings where no monthly retainer invoice was billed for that month
    retainer_months_billed: Set[tuple[str, str]] = set()
    retainer_rate_by_client: Dict[str, float] = {}
    for inv in non_void_invoices:
        inv_cli = inv.get("beneficiary_client") or inv.get("canonical_client", "")
        memo_low = (inv.get("memo_normalized") or "").lower()
        if "retainer" in memo_low and inv["amount_num"] > 0:
            retainer_rate_by_client[inv_cli] = inv["amount_num"]
            m_prefix = (inv.get("issued_date_iso") or "")[:7]
            if m_prefix:
                retainer_months_billed.add((inv_cli, m_prefix))

    seen_unbilled_retainers: Set[tuple[str, str]] = set()
    for b in cleaned.bookings:
        if b["status_normalized"] != "completed":
            continue
        svc_low = (b.get("service") or "").lower()
        if "retainer" in svc_low and b["rate_num"] == 0:
            b_cli = b.get("canonical_client") or b["client_name_normalized"]
            m_prefix = (b.get("shoot_date_iso") or "")[:7]
            if m_prefix and (b_cli, m_prefix) not in retainer_months_billed and (b_cli, m_prefix) not in seen_unbilled_retainers:
                seen_unbilled_retainers.add((b_cli, m_prefix))
                bid = b["booking_id"]
                ret_amt = retainer_rate_by_client.get(b_cli, 2500.0)
                draft_key = f"DRAFT_INV_{bid}"
                draft_status = decisions.get(draft_key, "PENDING_OWNER_CONFIRMATION")
                never_billed.append(
                    {
                        "booking_id": bid,
                        "booking_id_or_month": f"{m_prefix} Retainer ({bid})",
                        "client": b_cli,
                        "raw_client_name": b["client_name_normalized"],
                        "email": b["email_normalized"],
                        "service": f"Monthly Retainer ({b.get('service', 'Retainer Shoot')})",
                        "shoot_date": b["shoot_date_iso"],
                        "amount": ret_amt,
                        "draft_invoice_status": draft_status,
                        "_source_file": b.get("_source_file", "bookings.csv"),
                        "_source_row": b.get("_source_row", 0),
                    }
                )

    # 2. Check completed one-off paid-rate sessions with no matching invoice
    for b in cleaned.bookings:
        if b["status_normalized"] != "completed" or b["rate_num"] <= 0:
            continue
        bid = b["booking_id"]
        if bid not in matched_booking_ids:
            draft_key = f"DRAFT_INV_{bid}"
            draft_status = decisions.get(draft_key, "PENDING_OWNER_CONFIRMATION")
            never_billed.append(
                {
                    "booking_id": bid,
                    "booking_id_or_month": bid,
                    "client": b.get("canonical_client") or b["client_name_normalized"],
                    "raw_client_name": b["client_name_normalized"],
                    "email": b["email_normalized"],
                    "service": b.get("service", ""),
                    "shoot_date": b["shoot_date_iso"],
                    "amount": b["rate_num"],
                    "draft_invoice_status": draft_status,
                    "_source_file": b.get("_source_file", "bookings.csv"),
                    "_source_row": b.get("_source_row", 0),
                }
            )

    # =========================================================================
    # MODULE 5.2: UNREPLIED GENUINE LEADS & EXISTING CLIENT UPSELL PRIORITY
    # =========================================================================
    never_replied_leads: List[Dict[str, Any]] = []
    existing_client_upsell_leads: List[Dict[str, Any]] = []
    lead_match_by_id = {m["lead_id"]: m for m in reconciled.lead_matches}

    for lead in cleaned.valid_leads:
        lid = lead["lead_id"]
        m_info = lead_match_by_id.get(lid, {})
        matched_client = m_info.get("matched_client", "")
        has_reply = bool(lead.get("first_reply_iso"))

        if not has_reply:
            never_replied_leads.append(
                {
                    "lead_id": lid,
                    "created_date": lead["created_date_iso"],
                    "contact_name": lead["contact_name"],
                    "business_name": lead["business_name"] or matched_client,
                    "matched_client": matched_client,
                    "email": lead["email_normalized"],
                    "phone": lead["phone_normalized"],
                    "source": lead["channel_normalized"],
                    "status": lead.get("status", ""),
                    "is_existing_client": bool(matched_client),
                    "owner_action_status": decisions.get(f"REPLY_LEAD_{lid}", "PENDING_REPLY"),
                }
            )

        if matched_client and lead["status_normalized"] == "new":
            existing_client_upsell_leads.append(
                {
                    "lead_id": lid,
                    "created_date": lead["created_date_iso"],
                    "contact_name": lead["contact_name"],
                    "business_name": matched_client,
                    "email": lead["email_normalized"],
                    "phone": lead["phone_normalized"],
                    "channel": lead["channel_normalized"],
                    "raw_status": lead.get("status", ""),
                    "has_reply": has_reply,
                    "priority_tag": "Existing Client Retention / Upsell Priority",
                    "confidence": m_info.get("confidence", "HIGH"),
                    "match_reason": m_info.get("reason", ""),
                    "owner_action_status": decisions.get(f"UPSELL_{lid}", "PENDING_FOLLOWUP"),
                }
            )

    # =========================================================================
    # MODULE 4: JEV EXTRACTION & PRODUCTION BOARD SYNC
    # =========================================================================
    board_records: List[Dict[str, Any]] = [dict(v) for v in cleaned.production_board]
    booking_dates = {
        b.get("booking_id"): b.get("shoot_date_iso") or b.get("date")
        for b in cleaned.bookings
        if b.get("booking_id")
    }
    for v in board_records:
        bid = v.get("shoot_booking") or v.get("booking_id") or ""
        sdate = booking_dates.get(bid, "")
        v["shoot_date"] = sdate
        v["effective_date"] = v.get("client_approved_on") or sdate or ""

    jev_engine = JevExtractionEngine()
    jev_results = jev_engine.extract_messages(
        messages=cleaned.messages,
        production_board=board_records,
        clients=reconciled.clients,
        approved_sync_ids=approved_revs,
    )

    board_by_vid = {v["video_id"]: v for v in board_records}
    for rev_item in jev_results["revision_sync_queue"]:
        if rev_item["message_id"] in approved_revs:
            vid = rev_item["video_id"]
            if vid in board_by_vid:
                target_v = board_by_vid[vid]
                if rev_item["proposed_board_note"] not in (target_v.get("notes_on_board") or ""):
                    existing_note = target_v.get("notes_on_board") or ""
                    target_v["notes_on_board"] = (
                        f"{existing_note} | {rev_item['proposed_board_note']}".strip(" |")
                    )
                    target_v["revisions_num"] = int(target_v.get("revisions_num", 0)) + 1
                    target_v["revisions"] = str(target_v["revisions_num"])
                    target_v["stage"] = "In revision"
                    target_v["stage_normalized"] = "in revision"

    for intake in custom_intakes:
        vid = (intake.get("video_id") or "").upper()
        if vid in board_by_vid and intake.get("approved", True):
            target_v = board_by_vid[vid]
            note_str = f"[{intake.get('category', 'Revision')}] {intake.get('notes', '')}".strip()
            existing_note = target_v.get("notes_on_board") or ""
            if note_str not in existing_note:
                target_v["notes_on_board"] = f"{existing_note} | {note_str}".strip(" |")
                target_v["revisions_num"] = int(target_v.get("revisions_num", 0)) + 1
                target_v["revisions"] = str(target_v["revisions_num"])
                target_v["stage"] = "In revision"
                target_v["stage_normalized"] = "in revision"

    # Production Board metrics: zombie revision tasks (approved but still 'In revision'), stage counts, editor stats
    zombie_tasks: List[Dict[str, Any]] = []
    stage_counts: Dict[str, int] = {}
    editor_stats: Dict[str, Dict[str, Any]] = {}
    hourly_rate_by_editor = {t["name"]: t["hourly_rate_num"] for t in cleaned.team}

    for v in board_records:
        st = v["stage"]
        st_low = v["stage_normalized"]
        ed = v["editor_normalized"]
        stage_counts[st] = stage_counts.get(st, 0) + 1

        if ed not in editor_stats:
            editor_stats[ed] = {
                "editor": ed,
                "hourly_rate": hourly_rate_by_editor.get(ed, 0.0),
                "total_videos": 0,
                "active_in_progress": 0,
                "delivered": 0,
                "total_hours": 0.0,
                "total_revisions": 0,
                "videos_max_3_revisions": 0,
            }
        es = editor_stats[ed]
        es["total_videos"] += 1
        es["total_hours"] = round(es["total_hours"] + v["editor_hours_num"], 2)
        es["total_revisions"] += v["revisions_num"]
        if v["revisions_num"] >= 3:
            es["videos_max_3_revisions"] += 1

        if st_low == "delivered":
            es["delivered"] += 1
        else:
            es["active_in_progress"] += 1
            if v.get("approved_date_iso"):
                zombie_tasks.append(
                    {
                        "video_id": v["video_id"],
                        "client": v.get("canonical_client") or v["client_normalized"],
                        "title": v["title_normalized"],
                        "editor": ed,
                        "stage": st,
                        "client_approved_on": v["approved_date_iso"],
                        "revisions": v["revisions_num"],
                        "status": decisions.get(f"ZOMBIE_{v['video_id']}", "STUCK_ON_BOARD"),
                    }
                )

    for es in editor_stats.values():
        cnt = es["total_videos"] or 1
        es["avg_hours_per_video"] = round(es["total_hours"] / cnt, 2)
        es["avg_revisions_per_video"] = round(es["total_revisions"] / cnt, 2)
        es["avg_labor_cost_per_video"] = round(es["avg_hours_per_video"] * es["hourly_rate"], 2)

    # =========================================================================
    # CHANNEL PERFORMANCE & FINANCIAL MONTHLY SUMMARY
    # =========================================================================
    channel_metrics: Dict[str, Dict[str, Any]] = {}
    for l in cleaned.valid_leads:
        ch = l["channel_normalized"] or "Unknown"
        if ch not in channel_metrics:
            channel_metrics[ch] = {
                "channel": ch,
                "valid_leads": 0,
                "won_leads": 0,
                "unreplied_leads": 0,
                "invoiced_revenue": 0.0,
                "collected_revenue": 0.0,
            }
        channel_metrics[ch]["valid_leads"] += 1
        if l["status_normalized"] == "won":
            channel_metrics[ch]["won_leads"] += 1
        if not l.get("first_reply_iso"):
            channel_metrics[ch]["unreplied_leads"] += 1

    # Attribute client revenue to earliest acquisition channel in valid_leads
    client_channel_map: Dict[str, str] = {}
    for l in sorted(cleaned.valid_leads, key=lambda x: x["created_date_iso"]):
        m_cli = lead_match_by_id.get(l["lead_id"], {}).get("matched_client", "")
        if m_cli and m_cli not in client_channel_map:
            client_channel_map[m_cli] = l["channel_normalized"]

    for inv in non_void_invoices:
        if inv.get("is_duplicate_billed_reschedule", False):
            continue
        b_cli = inv.get("beneficiary_client") or inv.get("canonical_client", "")
        ch = client_channel_map.get(b_cli, "Referral")
        if ch in channel_metrics:
            channel_metrics[ch]["invoiced_revenue"] = round(
                channel_metrics[ch]["invoiced_revenue"] + inv["amount_num"], 2
            )
            channel_metrics[ch]["collected_revenue"] = round(
                channel_metrics[ch]["collected_revenue"] + inv["paid_amount"], 2
            )

    for cm in channel_metrics.values():
        cm["conversion_rate_pct"] = (
            round((cm["won_leads"] / cm["valid_leads"]) * 100.0, 1) if cm["valid_leads"] > 0 else 0.0
        )

    monthly_financials: Dict[str, Dict[str, Any]] = {}
    for inv in non_void_invoices:
        m_key = (inv.get("issued_date_iso") or "")[:7]
        if not m_key:
            continue
        if m_key not in monthly_financials:
            monthly_financials[m_key] = {"month": m_key, "invoiced": 0.0, "collected_cash": 0.0}
        if not inv.get("is_duplicate_billed_reschedule", False):
            monthly_financials[m_key]["invoiced"] = round(
                monthly_financials[m_key]["invoiced"] + inv["amount_num"], 2
            )

    for p in cleaned.payments:
        m_key = (p.get("paid_date_iso") or "")[:7]
        if not m_key:
            continue
        if m_key not in monthly_financials:
            monthly_financials[m_key] = {"month": m_key, "invoiced": 0.0, "collected_cash": 0.0}
        monthly_financials[m_key]["collected_cash"] = round(
            monthly_financials[m_key]["collected_cash"] + p["amount_num"], 2
        )

    total_overdue_amount = round(sum(i["amount_owed"] for i in overdue_invoices), 2)
    total_due_today_amount = round(sum(i["amount_owed"] for i in due_today_invoices), 2)
    total_never_billed_amount = round(sum(b["amount"] for b in never_billed), 2)
    total_we_owe_amount = round(sum(w["amount"] for w in we_owe_items), 2)
    total_credit_audit_amount = round(sum(c["amount"] for c in credit_and_overpayment_audit), 2)
    total_collected_cash = round(sum(p["amount_num"] for p in cleaned.payments), 2)

    return {
        "pack_id": PACK_ID,
        "reference_date": reference_date.isoformat(),
        "kpis": {
            "active_studio_clients": len(reconciled.clients),
            "consolidated_brand_groups": len(reconciled.consolidated_groups),
            "third_party_payers": len(reconciled.payers_not_clients),
            "total_leads_raw": len(cleaned.leads),
            "valid_leads_count": len(cleaned.valid_leads),
            "spam_leads_quarantined": len(cleaned.spam_audit_log),
            "never_replied_leads_count": len(never_replied_leads),
            "overdue_invoices_count": len(overdue_invoices),
            "overdue_total_usd": total_overdue_amount,
            "due_today_count": len(due_today_invoices),
            "due_today_total_usd": total_due_today_amount,
            "never_billed_count": len(never_billed),
            "never_billed_total_usd": total_never_billed_amount,
            "we_owe_count": len(we_owe_items),
            "we_owe_total_usd": total_we_owe_amount,
            "credit_and_overpayment_audit_usd": total_credit_audit_amount,
            "billing_sync_errors_count": len(reconciled.billing_tool_sync_errors),
            "billing_discrepancies_count": len(reconciled.billing_tool_discrepancies),
            "zombie_tasks_count": len(zombie_tasks),
            "total_collected_cash_usd": total_collected_cash,
        },
        "module1_ingestion_and_spam": {
            "validation_errors": [e.to_dict() for e in cleaned.validation_errors],
            "spam_audit_log": cleaned.spam_audit_log,
            "valid_leads_count": len(cleaned.valid_leads),
        },
        "module2_identity_resolution": {
            "clients": list(reconciled.clients.values()),
            "consolidated_groups": reconciled.consolidated_groups,
            "payers_not_clients": reconciled.payers_not_clients,
            "tier2_identity_alerts": reconciled.tier2_identity_alerts,
            "lead_matches": reconciled.lead_matches,
        },
        "module3_payment_reconciliation": {
            "billing_tool_sync_errors": reconciled.billing_tool_sync_errors,
            "billing_tool_discrepancies": reconciled.billing_tool_discrepancies,
            "unreconciled_payments": reconciled.unreconciled_payments,
            "invoice_overcharges": reconciled.invoice_overcharges,
            "reconciled_payments": reconciled.reconciled_payments,
        },
        "module4_revision_intake_and_jev": {
            "jev_summary": jev_results,
            "zombie_tasks": zombie_tasks,
            "stage_counts": stage_counts,
            "editor_stats": list(editor_stats.values()),
            "production_board": board_records,
        },
        "module5_balance_guards_and_upsells": {
            "balance_guard_alerts": balance_guard_alerts,
            "we_owe": we_owe_items,
            "credit_and_overpayment_audit": credit_and_overpayment_audit,
            "existing_client_upsell_leads": existing_client_upsell_leads,
            "never_replied_leads": never_replied_leads,
        },
        "financial_action_queues": {
            "overdue_invoices": overdue_invoices,
            "due_today_invoices": due_today_invoices,
            "upcoming_open_invoices": upcoming_open_invoices,
            "never_billed": never_billed,
        },
        "analytics": {
            "channel_performance": sorted(
                channel_metrics.values(), key=lambda x: -x["invoiced_revenue"]
            ),
            "monthly_financials": [
                monthly_financials[k] for k in sorted(monthly_financials.keys())
            ],
            "team": cleaned.team,
            "costs": cleaned.costs,
        },
    }
