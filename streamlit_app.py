"""Streamlit Operations & Financial Reconciliation App for Axeom (Pack 175).

Runs the exact same 5-Module Reactive Engine (`AxeomReactiveEngine`) and SQLite persistence
layer (`StateStorage`) as the Web/Vercel app, providing:
- 10-Second Monday Morning Command Center
- Multi-file CSV & messages.txt Upload with Row-Level Validation Errors
- Module 1: Ingestion, Date Normalization & Soft Spam Audit Log
- Module 2: 3-Tier Identity Resolution & Shared-Contact Review Cards
- Module 3: 4-Pass Dynamic Payment Reconciliation & Sync Discrepancies
- Module 4: Jev Structured Extraction, Voice Notes & Production Board Sync
- Module 5: Customer Balance Guards, Unbilled Work & Upsell Priority Queue
"""

from __future__ import annotations

import streamlit as st

from app.engine import DEFAULT_RAW_DATA_DIR, AxeomReactiveEngine
from app.ingestion import parse_csv_content, parse_messages_content
from app.storage import StateStorage


st.set_page_config(
    page_title="Axeom Operations Command Center (Pack 175)",
    page_icon="⚡",
    layout="wide",
)


@st.cache_resource
def get_engine() -> AxeomReactiveEngine:
    return AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, StateStorage())


def main() -> None:
    engine = get_engine()

    with st.sidebar:
        st.title("⚡ Axeom Pack 175")
        st.caption("Reference Date: **October 6, 2026** | Suggest, Never Act Alone")

        st.subheader("📤 Upload Updated Files")
        uploaded_files = st.file_uploader(
            "Upload CSVs or messages.txt to dynamically recompute all modules",
            type=["csv", "txt"],
            accept_multiple_files=True,
        )
        if uploaded_files and st.button("Ingest & Recalculate State", type="primary", use_container_width=True):
            errors_found = []
            saved_names = []
            for uf in uploaded_files:
                raw_text = uf.getvalue().decode("utf-8", errors="replace")
                fname = uf.name
                if fname.lower().endswith(".txt") or "message" in fname.lower():
                    msgs, errs = parse_messages_content(raw_text, source_filename=fname)
                    errors_found.extend(errs)
                    if msgs and not any(e.severity == "ERROR" for e in errs):
                        engine.storage.save_uploaded_file(fname, raw_text)
                        saved_names.append(fname)
                else:
                    _, rows, errs = parse_csv_content(raw_text, source_filename=fname)
                    errors_found.extend(errs)
                    if rows and not any(e.severity == "ERROR" for e in errs):
                        engine.storage.save_uploaded_file(fname, raw_text)
                        saved_names.append(fname)

            if saved_names:
                st.success(f"Saved & recalculated: {', '.join(saved_names)}")
            for err in errors_found:
                st.error(f"[{err.severity}] {err.filename} (Row {err.row_number}, `{err.field_name}`): {err.message}")

        if st.button("Reset to Baseline Dataset", use_container_width=True):
            engine.storage.reset_all_state()
            st.rerun()

    state = engine.run_pipeline()
    kpis = state["kpis"]

    st.title("Axeom Studio Operations & Financial Command Center")
    st.markdown(
        "**Pack ID:** `175` &nbsp;|&nbsp; **Reference Date:** `2026-10-06` &nbsp;|&nbsp; "
        "**Owner Policy:** *Propose Actions with Confidence Badges — Never Act Unilaterally*"
    )

    col1, col2, col3, col4, col5, col6 = st.columns(6)
    col1.metric("Overdue Receivables", f"${kpis['overdue_total_usd']:,.2f}", f"{kpis['overdue_invoices_count']} invoices")
    col2.metric("Never Billed Work", f"${kpis['never_billed_total_usd']:,.2f}", f"{kpis['never_billed_count']} items")
    col3.metric("Credits / We Owe", f"${kpis['credit_and_overpayment_audit_usd']:,.2f}", "3 client credits")
    col4.metric("Billing Sync Errors", str(kpis["billing_sync_errors_count"]), "Paid in bank, unpaid in tool")
    col5.metric("Unreplied Genuine Leads", str(kpis["never_replied_leads_count"]), f"{kpis['spam_leads_quarantined']} spam quarantined")
    col6.metric("Collected Cash", f"${kpis['total_collected_cash_usd']:,.2f}", f"{kpis['active_studio_clients']} active clients")

    tabs = st.tabs(
        [
            "🚨 10-Sec Command Center",
            "🛡️ Module 1: Ingestion & Spam",
            "🧬 Module 2: Identity Resolution",
            "💳 Module 3: Payment Reconciliation",
            "🎬 Module 4: Jev & Production Board",
            "⚖️ Module 5: Balance Guards & Upsells",
        ]
    )

    with tabs[0]:
        st.subheader("Top 3 Monday Morning Priorities (Oct 6, 2026)")
        st.warning(
            "**1. Save Hillcrest Physical Therapy ($2,500/mo Retainer Churn Risk):** Call Gloria Reed & Leah Reed today, "
            "assign senior editor Ali to fix the 'Hillcrest Physical Therapy' full-name compliance issue within 24h, and address INV-1116."
        )
        st.info(
            "**2. Recover $15,880.00 in Unbilled & Overdue Revenue:** Issue invoices for the 7 never-billed items ($8,210.00) "
            "and send reminders for the confirmed overdue invoices ($7,670.00+)."
        )
        st.success(
            "**3. Convert 15 Ignored Genuine Leads & Void Duplicate Invoice INV-1138:** Reply to existing client enquiries "
            "(L087 Mia Torres, L097 Leah Reed) and referral L086 Victor Vega; apply Blue Bonnet Realty's $1,500 prepaid credit (P5121) to B154."
        )

        c_left, c_right = st.columns(2)
        with c_left:
            st.markdown("#### Overdue Invoices (Relative to 2026-10-06)")
            st.dataframe(state["financial_action_queues"]["overdue_invoices"], use_container_width=True)
        with c_right:
            st.markdown("#### Completed Work Never Billed ($8,210.00)")
            st.dataframe(state["financial_action_queues"]["never_billed"], use_container_width=True)

    with tabs[1]:
        st.subheader("Module 1: Schema Validation & Soft Spam Quarantine")
        val_errs = state["module1_ingestion_and_spam"]["validation_errors"]
        if val_errs:
            st.markdown("#### Source Format & Typo Notices")
            st.dataframe(val_errs, use_container_width=True)
        st.markdown("#### Quarantined Spam Leads (`L052`, `L063`, `L081`, `L089`)")
        for s_item in state["module1_ingestion_and_spam"]["spam_audit_log"]:
            c1, c2, c3 = st.columns([5, 1, 1])
            c1.write(
                f"**{s_item['lead_id']}** | {s_item['contact_name']} (`{s_item['email']}`) — "
                f"*{s_item['spam_reason']}* | Status: `{s_item['status']}`"
            )
            if c2.button("Not Spam (Restore)", key=f"restore_{s_item['lead_id']}"):
                engine.storage.set_spam_override(s_item["lead_id"], "RESTORE")
                st.rerun()
            if c3.button("Confirm Spam", key=f"del_{s_item['lead_id']}"):
                engine.storage.set_spam_override(s_item["lead_id"], "DELETE")
                st.rerun()

    with tabs[2]:
        st.subheader("Module 2: 3-Tier Identity Resolution & Shared Contact Alerts")
        st.markdown("#### Third-Party Payers (Not Studio Clients)")
        st.dataframe(state["module2_identity_resolution"]["payers_not_clients"], use_container_width=True)
        st.markdown("#### Tier 2 Probabilistic Alerts: Shared Contact Names Across Separate Companies")
        for alert in state["module2_identity_resolution"]["tier2_identity_alerts"]:
            st.warning(f"**{alert['contact_name']}** ({', '.join(alert['businesses'])}) — {alert['warning_message']}")
        st.markdown("#### Canonical Studio Clients")
        st.dataframe(state["module2_identity_resolution"]["clients"], use_container_width=True)

    with tabs[3]:
        st.subheader("Module 3: 4-Pass Dynamic Payment Reconciliation")
        st.markdown("#### Billing Tool Discrepancies (`billing_tool_is_wrong`)")
        st.dataframe(state["module3_payment_reconciliation"]["billing_tool_discrepancies"], use_container_width=True)
        st.markdown("#### Reconciled Payment Ledger (Passes 1–4)")
        st.dataframe(state["module3_payment_reconciliation"]["reconciled_payments"], use_container_width=True)

    with tabs[4]:
        st.subheader("Module 4: Jev Structured Extraction & Production Board Sync")
        st.markdown("#### Editor Efficiency ('The Eli Effect')")
        st.dataframe(state["module4_revision_intake_and_jev"]["editor_stats"], use_container_width=True)
        st.markdown("#### Unsynced Client Revision Requests & Voice Notes")
        for rev in state["module4_revision_intake_and_jev"]["jev_summary"]["revision_sync_queue"]:
            r1, r2 = st.columns([5, 1])
            r1.write(
                f"**{rev['video_id']}** ({rev['client_name']} -> Editor **{rev['assigned_editor']}**) "
                f"via `{rev['channel']}` on `{rev['timestamp']}`: *{rev['actionable_instruction']}* "
                f"[Synced: `{rev['already_synced']}`]"
            )
            if not rev["already_synced"]:
                if r2.button("Sync to Board", key=f"sync_{rev['message_id']}"):
                    engine.storage.approve_revision_sync(rev["message_id"], True)
                    st.rerun()

    with tabs[5]:
        st.subheader("Module 5: Customer Balance Guards, Credits & Upsell Queue")
        st.markdown("#### Credit & Overpayment Audit (`we_owe` = $2,430.00)")
        st.dataframe(state["module5_balance_guards_and_upsells"]["credit_and_overpayment_audit"], use_container_width=True)
        for guard in state["module5_balance_guards_and_upsells"]["balance_guard_alerts"]:
            st.error(f"**Balance Guard ({guard['client']}):** {guard['explanation']}")
            if st.button(f"Void Duplicate {guard['duplicate_invoice_no']} & Apply Credit", key=guard["guard_id"]):
                engine.storage.set_owner_decision(guard["guard_id"], "VOID_DUPLICATE_AND_APPLY_CREDIT")
                st.rerun()
        st.markdown("#### 15 Unreplied Genuine Human Leads")
        st.dataframe(state["module5_balance_guards_and_upsells"]["never_replied_leads"], use_container_width=True)


if __name__ == "__main__":
    main()
