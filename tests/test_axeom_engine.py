"""Comprehensive Automated Unit & Integration Test Suite for Axeom Operations Engine (Pack 175).

Covers:
- Test Case 1.1: Multi-Format Date Normalization (MM/DD/YYYY in bookings vs DD/MM/YYYY in payments)
- Test Case 1.2: Soft Spam Filtering & Custom Business Domain Whitelist (.co, .fm, .build, .org, .coffee)
- Test Case 2.1: Shared Contact Name Across Separate Companies (Alana Ibarra, Tasha Torres, Nolan Nguyen Tier 2 Guard)
- Test Case 2.2: Domain Rebrand (Maple Fitness/Athletics) & Third-Party Payer Routing (Fieldhouse Marketing)
- Test Case 3.1: Chronological Blank Reference FIFO & Prime Barbershop P5077 ($900) Overpayment Detection
- Test Case 3.2: Multi-Invoice Text Memo Reconciliation (P5076 "july sessions", P5115 "half now half later")
                 and Billing Tool Sync Error Detection (INV-1083, INV-1105, INV-1127, INV-1066, INV-1077, INV-1084)
- Test Case 4.1: Jev Structured Extraction & Revision Routing to Assigned Editor (V049 voice note, V022, V149)
- Test Case 5.1: Customer Balance Guard for Rescheduled Pre-Paid Shoot (Blue Bonnet Realty B142->B154 / INV-1138)
                 and Active Client Upsell Prioritization + 15 Unreplied Genuine Leads
- Dynamic Upload Recalculation & Actionable Validation Error Reporting
"""

from __future__ import annotations

import tempfile
import unittest
from datetime import date
from pathlib import Path

from app.cleaning import clean_and_normalize_dataset, parse_source_date
from app.engine import DEFAULT_RAW_DATA_DIR, AxeomReactiveEngine
from app.ingestion import load_raw_data_directory, parse_csv_content
from app.reconciliation import resolve_identities_and_reconcile
from app.storage import StateStorage


class TestAxeomFiveModuleArchitecture(unittest.TestCase):
    """End-to-end verification of the 5-Module Specification and 10 Core Mandatory Rules."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.ingested = load_raw_data_directory(DEFAULT_RAW_DATA_DIR)
        cls.cleaned = clean_and_normalize_dataset(cls.ingested)
        cls.reconciled = resolve_identities_and_reconcile(cls.cleaned)

    def test_1_1_multi_format_date_normalization(self) -> None:
        """Test Case 1.1: Verify MM/DD/YYYY for bookings.csv and DD/MM/YYYY for payments.csv."""
        b_dt, b_err = parse_source_date("10/05/2026", source_type="bookings.csv", field_name="date")
        p_dt, p_err = parse_source_date("02/08/2026", source_type="payments.csv", field_name="date")
        self.assertIsNone(b_err)
        self.assertIsNone(p_err)
        self.assertEqual(b_dt, date(2026, 10, 5))
        self.assertEqual(p_dt, date(2026, 8, 2))

        b154 = next(b for b in self.cleaned.bookings if b["booking_id"] == "B154")
        p5077 = next(p for p in self.cleaned.payments if p["payment_id"] == "P5077")
        self.assertEqual(b154["shoot_date_iso"], "2026-10-05")
        self.assertEqual(p5077["paid_date_iso"], "2026-08-02")

        # Verify email typo B068 (.con -> .com) is cleaned while preserving raw provenance
        b068 = next(b for b in self.cleaned.bookings if b["booking_id"] == "B068")
        self.assertTrue(b068["has_email_typo"])
        self.assertEqual(b068["email_normalized"], "office@torresdental.com")

    def test_1_2_soft_spam_filtering_and_whitelist(self) -> None:
        """Test Case 1.2: Verify L052, L063, L081, L089 are quarantined in Spam Audit Log while .co/.fm/.build pass."""
        leads_by_id = {l["lead_id"]: l for l in self.cleaned.leads}
        self.assertEqual(len(self.cleaned.leads), 98, "Never delete raw lead rows during ingestion")
        self.assertEqual(len(self.cleaned.valid_leads), 94)
        self.assertEqual(len(self.cleaned.spam_audit_log), 4)

        for spam_id in ("L052", "L063", "L081", "L089"):
            self.assertTrue(leads_by_id[spam_id]["is_spam"])
            self.assertEqual(leads_by_id[spam_id]["spam_filter_status"], "Spam Review")

        # L023 (luis@maplefit.co), L001 (mia@heartandhustle.fm), L007 (nolan@brightwater.build) pass whitelist
        for valid_lid in ("L001", "L007", "L023"):
            self.assertFalse(leads_by_id[valid_lid]["is_spam"], f"Lead {valid_lid} must be whitelisted")
            self.assertEqual(leads_by_id[valid_lid]["spam_filter_status"], "Valid Lead")

    def test_2_1_tier2_shared_contact_name_guard(self) -> None:
        """Test Case 2.1: Alana Ibarra, Tasha Torres, and Nolan Nguyen must NOT be auto-merged across distinct companies."""
        self.assertEqual(len(self.reconciled.clients), 30)
        self.assertIn("Meridian Bridal Boutique", self.reconciled.clients)
        self.assertIn("Beacon Med Spa", self.reconciled.clients)
        self.assertIn("Torres Family Law", self.reconciled.clients)
        self.assertIn("ABC Home Care", self.reconciled.clients)

        alert_contacts = {a["contact_name"]: a for a in self.reconciled.tier2_identity_alerts}
        self.assertIn("Alana Ibarra", alert_contacts)
        self.assertIn("Tasha Torres", alert_contacts)
        self.assertIn("Nolan Nguyen", alert_contacts)

    def test_2_2_domain_rebrand_and_third_party_payer(self) -> None:
        """Test Case 2.2: Verify Maple Fitness/Athletics Tier 1 phone linkage and Fieldhouse Marketing payer role."""
        maple_fit = self.reconciled.clients["Maple Fitness"]
        self.assertIn("Maple Athletics", maple_fit["tier1_linked_entities"])

        payers = {p["payer_name"]: p for p in self.reconciled.payers_not_clients}
        self.assertIn("Fieldhouse Marketing", payers)
        fh = payers["Fieldhouse Marketing"]
        self.assertEqual(fh["total_paid"], 5400.00)
        self.assertIn("Vista Pediatrics", fh["pays_on_behalf_of"])
        self.assertIn("Parkside Chiropractic", fh["pays_on_behalf_of"])

    def test_3_1_blank_reference_fifo_and_prime_barbershop_overpayment(self) -> None:
        """Test Case 3.1: Verify P5081 pays INV-1080 and P5077 ($900) is quarantined as overpayment in Pass 4."""
        inv_1080 = self.reconciled.reconciled_invoices["INV-1080"]
        self.assertEqual(inv_1080["remaining_balance"], 0.0)
        self.assertIn("P5081", inv_1080["applied_payment_ids"])

        unrec_ids = {p["payment_id"]: p for p in self.reconciled.unreconciled_payments}
        self.assertIn("P5077", unrec_ids)
        self.assertEqual(unrec_ids["P5077"]["amount_num"], 900.00)
        self.assertEqual(unrec_ids["P5077"]["canonical_client"], "Prime Barbershop")

    def test_3_2_multi_invoice_text_memo_and_sync_errors(self) -> None:
        """Test Case 3.2: Verify P5076 ('july sessions' $900), P5115 ('half now half later' $450), and 6 sync errors."""
        for inv_no in ("INV-1066", "INV-1077", "INV-1084"):
            inv_obj = self.reconciled.reconciled_invoices[inv_no]
            self.assertIn("P5076", inv_obj["applied_payment_ids"])
            self.assertEqual(inv_obj["remaining_balance"], 0.0)

        inv_1121 = self.reconciled.reconciled_invoices["INV-1121"]
        self.assertEqual(inv_1121["paid_amount"], 450.00)
        self.assertEqual(inv_1121["remaining_balance"], 450.00)

        sync_err_invs = {e["invoice_no"] for e in self.reconciled.billing_tool_sync_errors}
        self.assertEqual(
            sync_err_invs,
            {"INV-1083", "INV-1105", "INV-1127", "INV-1066", "INV-1077", "INV-1084"},
        )

    def test_4_1_and_5_1_full_reactive_engine_and_owner_actions(self) -> None:
        """Test Cases 4.1 & 5.1: Verify overdue totals, never-billed bookings, Jev sync, and Balance Guards."""
        with tempfile.TemporaryDirectory() as tmpdir:
            storage = StateStorage(Path(tmpdir) / "test_state.db")
            engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, storage=storage)
            state = engine.run_pipeline()

            self.assertEqual(state["reference_date"], "2026-10-06")

            # Verify 7 overdue invoices totaling $7,670.00
            overdue = state["financial_action_queues"]["overdue_invoices"]
            self.assertEqual(len(overdue), 7)
            self.assertEqual(state["kpis"]["overdue_total_usd"], 7670.00)
            overdue_by_no = {i["invoice_no"]: i for i in overdue}
            self.assertEqual(overdue_by_no["INV-1099"]["days_overdue"], 39)
            self.assertEqual(overdue_by_no["INV-1121"]["amount_owed"], 450.00)

            # Verify 7 never-billed completed items (2 May retainers $5,000 + 5 shoots $3,210 = $8,210.00)
            never_billed = state["financial_action_queues"]["never_billed"]
            self.assertEqual(len(never_billed), 7)
            self.assertEqual(state["kpis"]["never_billed_total_usd"], 8210.00)
            self.assertEqual(
                [b["booking_id"] for b in never_billed],
                ["B020", "B024", "B038", "B080", "B083", "B131", "B132"],
            )

            # Verify 15 never-replied genuine human leads
            self.assertEqual(state["kpis"]["never_replied_leads_count"], 15)

            # Verify Module 5 Balance Guard catches Blue Bonnet Realty ($1,500) + Credit/Overpayment Audit ($2,430)
            we_owe = state["module5_balance_guards_and_upsells"]["we_owe"]
            self.assertEqual(len(we_owe), 1)
            self.assertEqual(state["kpis"]["we_owe_total_usd"], 1500.00)
            self.assertEqual(state["kpis"]["credit_and_overpayment_audit_usd"], 2430.00)

            # Verify Test Case 4.1: Jev extracts voice notes and lost revision requests (e.g. V049, V022)
            rev_queue = state["module4_revision_intake_and_jev"]["jev_summary"]["revision_sync_queue"]
            v049_revs = [r for r in rev_queue if r["video_id"] == "V049"]
            self.assertTrue(len(v049_revs) >= 1)
            self.assertTrue(v049_revs[0]["is_voice_note"])

            # Approve V049 revision sync and verify board updates reactively
            msg_id = v049_revs[0]["message_id"]
            storage.approve_revision_sync(msg_id, True)
            updated_state = engine.run_pipeline()
            board_v049 = next(
                v
                for v in updated_state["module4_revision_intake_and_jev"]["production_board"]
                if v["video_id"] == "V049"
            )
            self.assertIn("first 3 seconds", board_v049["notes_on_board"].lower())

            # Approve Module 5 Balance Guard voiding duplicate INV-1138 and applying P5121 credit
            storage.set_owner_decision("BALANCE_GUARD_INV-1131", "VOID_DUPLICATE_AND_APPLY_CREDIT")
            state_after_guard = engine.run_pipeline()
            open_upcoming_nos = {
                i["invoice_no"]
                for i in state_after_guard["financial_action_queues"]["upcoming_open_invoices"]
            }
            self.assertNotIn(
                "INV-1138",
                open_upcoming_nos,
                "Voided duplicate INV-1138 must be removed from open receivables",
            )

    def test_upload_validation_and_dynamic_recalculation(self) -> None:
        """Verify Rule 6, 7, 8: Uploading malformed CSV surfaces clear errors; uploading valid CSV recalculates KPIs."""
        bad_csv = "invoice_no,bill_to,amount\nINV-9999,Test Client,not_a_number\n"
        _, _, errs = parse_csv_content(bad_csv, source_filename="bad_invoices.csv", canonical_type="invoices.csv")
        self.assertTrue(len(errs) >= 1, "Missing columns in bad_invoices.csv must produce validation error")

        with tempfile.TemporaryDirectory() as tmpdir:
            storage = StateStorage(Path(tmpdir) / "test_upload.db")
            engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, storage=storage)
            new_payment_csv = (
                "payment_id,date,payer,payer_email,amount,method,reference\n"
                "P5999,06/10/2026,Bluebonnet Realty Group,nolan@bluebonnetrg.com,1500.00,ACH,INV-1099\n"
            )
            storage.save_uploaded_file("payments_update.csv", new_payment_csv)
            recalc = engine.run_pipeline()
            self.assertEqual(recalc["kpis"]["overdue_invoices_count"], 6)
            self.assertEqual(recalc["kpis"]["overdue_total_usd"], 6170.00)


if __name__ == "__main__":
    unittest.main()
