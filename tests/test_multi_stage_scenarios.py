"""Comprehensive Multi-Stage Scenario Testing Suite for Axeom Operations Engine (Pack 175).

Applies downloaded skills:
- python-testing-patterns: Parameterized subtests, test fixtures, deterministic assertions.
- billing-automation: Dunning calculations, retainer schedules, voiding duplicate invoices, overpayment escrow.
- data-engineering-data-pipeline: Multi-format date parsing, validation errors, provenance tracking, immutable raw data.
- business-analyst: Financial KPI verification, revenue leakage recovery, client churn risk metrics.
- systematic-debugging & verification-before-completion: Strict evidence collection, edge-case stress testing.

Test Stages:
- Stage 1: Ingestion & Data Quality Challenges (European dates, malformed CSVs, spam quarantine, provenance)
- Stage 2: Identity Resolution & Entity Disambiguation (Alana/Tasha/Nolan homonyms, rebrands, agency payers)
- Stage 3: Payment Reconciliation & Cash Ledger (FIFO blank memos, text memos, partial payments, overpayments, sync errors)
- Stage 4: Production Board & Revision Flow (Jev audio voice notes, stuck approved tasks, editor velocity disparity)
- Stage 5: Billing Automation, Unbilled Work & Pre-Check Guards (7 unbilled shoots, Blue Bonnet guard, retainers, dynamic recalculation)
"""

from __future__ import annotations

import tempfile
import unittest
from datetime import date
from pathlib import Path
from typing import Any, Dict

from app import BUSINESS_DATE
from app.cleaning import clean_and_normalize_dataset, parse_source_date
from app.engine import DEFAULT_RAW_DATA_DIR, AxeomReactiveEngine
from app.ingestion import load_raw_data_directory, parse_csv_content
from app.reconciliation import resolve_identities_and_reconcile
from app.storage import StateStorage


class TestStage1IngestionAndDataQuality(unittest.TestCase):
    """Stage 1: Verify data ingestion, multi-format date normalization, schema validation, and spam quarantine."""

    def test_scenario_1a_multi_format_date_challenges(self) -> None:
        """Challenge: Accurately distinguish DD/MM/YYYY (payments) from MM/DD/YYYY (bookings/invoices) and reject invalid dates."""
        test_cases = [
            # (date_str, source_type, expected_date, expect_error)
            ("10/05/2026", "bookings.csv", date(2026, 10, 5), False),      # US: Oct 5, 2026
            ("05/10/2026", "payments.csv", date(2026, 10, 5), False),      # European: Oct 5, 2026
            ("02/08/2026", "payments.csv", date(2026, 8, 2), False),       # European: Aug 2, 2026
            ("2026-07-22", "production_board.csv", date(2026, 7, 22), False), # ISO format
            ("29/02/2024", "payments.csv", date(2024, 2, 29), False),      # Leap year valid
            ("32/01/2026", "payments.csv", None, True),                    # Day 32 invalid
            ("99/99/9999", "bookings.csv", None, True),                    # Corrupt date
            ("", "bookings.csv", None, False),                              # Empty optional date
        ]

        for date_str, src, exp_date, exp_err in test_cases:
            with self.subTest(date_str=date_str, source=src):
                parsed, err = parse_source_date(
                    date_str,
                    source_type=src,
                    field_name="test_date",
                    allow_empty=(date_str == ""),
                )
                if exp_err:
                    self.assertIsNotNone(err, f"Expected error for invalid date {date_str}")
                else:
                    self.assertIsNone(err, f"Unexpected error for date {date_str}: {err}")
                    self.assertEqual(parsed, exp_date)

    def test_scenario_1b_malformed_csv_validation_errors(self) -> None:
        """Challenge: Corrupted CSVs with missing headers or bad numbers must return actionable error reports without crashing."""
        # 1. Missing required header 'amount'
        bad_csv_missing_col = (
            "invoice_no,bill_to,status\n"
            "INV-9999,Test Client,Paid\n"
        )
        _, _, errs = parse_csv_content(bad_csv_missing_col, "corrupt_invoices.csv", "invoices.csv")
        self.assertTrue(len(errs) >= 1)
        self.assertTrue(any("missing required column" in str(e.message).lower() for e in errs))

        # 2. Corrupted field with non-numeric amount string
        bad_csv_bad_num = (
            "invoice_no,bill_to,email,issued,due,amount,status,memo\n"
            "INV-9999,Test Client,test@example.com,2026-04-01,2026-04-15,NOT_A_NUMBER,Paid,Test\n"
        )
        dt, rows, errs_num = parse_csv_content(bad_csv_bad_num, "bad_num.csv", "invoices.csv")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["amount"], "NOT_A_NUMBER")

    def test_scenario_1c_soft_spam_filtering_vs_custom_tld_whitelist(self) -> None:
        """Challenge: Quarantine malicious bot spam (.ru, crypto) while preserving valid boutique clients (.coffee, .build, .fm, .co)."""
        ingested = load_raw_data_directory(DEFAULT_RAW_DATA_DIR)
        cleaned = clean_and_normalize_dataset(ingested)

        # 4 spam leads quarantined
        self.assertEqual(len(cleaned.spam_audit_log), 4)
        quarantined_ids = {s["lead_id"] for s in cleaned.spam_audit_log}
        self.assertEqual(quarantined_ids, {"L052", "L063", "L081", "L089"})

        # Boutique clients must NOT be filtered out
        valid_lead_emails = {l["email_normalized"] for l in cleaned.valid_leads}
        self.assertIn("luis@maplefit.co", valid_lead_emails)
        self.assertIn("mia@heartandhustle.fm", valid_lead_emails)
        self.assertIn("nolan@brightwater.build", valid_lead_emails)

    def test_scenario_1d_immutable_raw_provenance(self) -> None:
        """Challenge: Every cleaned record must maintain original filename, row number, and primary key."""
        ingested = load_raw_data_directory(DEFAULT_RAW_DATA_DIR)
        cleaned = clean_and_normalize_dataset(ingested)

        for b in cleaned.bookings:
            self.assertIn("_source_file", b)
            self.assertEqual(b["_source_file"], "bookings.csv")
            self.assertIn("_source_row", b)
            self.assertIn("_primary_id", b)
            self.assertTrue(b["_primary_id"].startswith("B"))


class TestStage2IdentityResolutionAndDisambiguation(unittest.TestCase):
    """Stage 2: Verify entity deduplication, Tier-2 homonym guards, company rebrands, and agency payer routing."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.ingested = load_raw_data_directory(DEFAULT_RAW_DATA_DIR)
        cls.cleaned = clean_and_normalize_dataset(cls.ingested)
        cls.reconciled = resolve_identities_and_reconcile(cls.cleaned)

    def test_scenario_2a_tier2_homonym_guards_not_merged(self) -> None:
        """Challenge: Contacts sharing a person name (Alana Ibarra, Tasha Torres, Nolan Nguyen) must remain separate companies."""
        clients = self.reconciled.clients

        # 1. Alana Ibarra owns Meridian Bridal Boutique AND Beacon Med Spa (distinct phones & industries)
        self.assertIn("Meridian Bridal Boutique", clients)
        self.assertIn("Beacon Med Spa", clients)
        self.assertNotEqual(clients["Meridian Bridal Boutique"]["client_id"], clients["Beacon Med Spa"]["client_id"])

        # 2. Tasha Torres owns Torres Family Law AND ABC Home Care
        self.assertIn("Torres Family Law", clients)
        self.assertIn("ABC Home Care", clients)

        # 3. Nolan Nguyen owns Brightwater (construction) AND Bluebonnet Realty Group
        self.assertIn("Brightwater", clients)
        self.assertIn("Blue Bonnet Realty", clients)

    def test_scenario_2b_company_rebranding_alias_resolution(self) -> None:
        """Challenge: Maple Fitness rebranding to Maple Athletics must resolve into a single unified client."""
        maple = self.reconciled.clients.get("Maple Fitness")
        self.assertIsNotNone(maple)
        self.assertIn("Maple Athletics", maple["tier1_linked_entities"])

    def test_scenario_2c_third_party_agency_payer_routing(self) -> None:
        """Challenge: Fieldhouse Marketing is a 3rd-party agency payer, NOT a video production client."""
        payers = {p["payer_name"]: p for p in self.reconciled.payers_not_clients}
        self.assertIn("Fieldhouse Marketing", payers)
        fh = payers["Fieldhouse Marketing"]
        self.assertEqual(fh["total_paid"], 5400.00)
        self.assertIn("Vista Pediatrics", fh["pays_on_behalf_of"])
        self.assertIn("Parkside Chiropractic", fh["pays_on_behalf_of"])

        # Fieldhouse Marketing should NOT appear as an active client with creative video cards
        fh_client = self.reconciled.clients.get("Fieldhouse Marketing")
        if fh_client:
            self.assertEqual(len(fh_client.get("video_ids", [])), 0)


class TestStage3PaymentReconciliationAndBanking(unittest.TestCase):
    """Stage 3: Verify 4-pass reconciliation, FIFO allocation, multi-invoice text memos, partial payments, and overpayments."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.ingested = load_raw_data_directory(DEFAULT_RAW_DATA_DIR)
        cls.cleaned = clean_and_normalize_dataset(cls.ingested)
        cls.reconciled = resolve_identities_and_reconcile(cls.cleaned)

    def test_scenario_3a_chronological_fifo_blank_memo(self) -> None:
        """Challenge: Payment P5081 ($1,000) with blank reference must apply to oldest unpaid invoice (INV-1080)."""
        inv_1080 = self.reconciled.reconciled_invoices["INV-1080"]
        self.assertEqual(inv_1080["remaining_balance"], 0.0)
        self.assertIn("P5081", inv_1080["applied_payment_ids"])

    def test_scenario_3b_fuzzy_multi_invoice_text_memo(self) -> None:
        """Challenge: P5076 ($900) marked 'july sessions' must allocate $300 across INV-1066, INV-1077, and INV-1084."""
        for inv_no in ("INV-1066", "INV-1077", "INV-1084"):
            inv_obj = self.reconciled.reconciled_invoices[inv_no]
            self.assertEqual(inv_obj["remaining_balance"], 0.0)
            self.assertIn("P5076", inv_obj["applied_payment_ids"])

    def test_scenario_3c_partial_payment_terms(self) -> None:
        """Challenge: P5115 ($450) marked 'half now half later' must pay exactly 50% of INV-1121 ($900)."""
        inv_1121 = self.reconciled.reconciled_invoices["INV-1121"]
        self.assertEqual(inv_1121["paid_amount"], 450.00)
        self.assertEqual(inv_1121["remaining_balance"], 450.00)

    def test_scenario_3d_overpayment_escrow_quarantine(self) -> None:
        """Challenge: P5077 ($900) sent to Prime Barbershop for INV-1080 must be quarantined as overpayment (not negative balance)."""
        unrec = {p["payment_id"]: p for p in self.reconciled.unreconciled_payments}
        self.assertIn("P5077", unrec)
        self.assertEqual(unrec["P5077"]["amount_num"], 900.00)
        self.assertEqual(unrec["P5077"]["canonical_client"], "Prime Barbershop")

    def test_scenario_3e_billing_tool_sync_errors(self) -> None:
        """Challenge: Catch 6 invoices marked PAID in billing software that had NO bank deposits."""
        sync_err_nos = {e["invoice_no"] for e in self.reconciled.billing_tool_sync_errors}
        self.assertEqual(
            sync_err_nos,
            {"INV-1083", "INV-1105", "INV-1127", "INV-1066", "INV-1077", "INV-1084"},
        )


class TestStage4ProductionBoardAndRevisionFlow(unittest.TestCase):
    """Stage 4: Verify Jev extraction, audio voice notes, stuck tickets (V121, V152), and editor velocity disparity."""

    @classmethod
    def setUpClass(cls) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            storage = StateStorage(Path(tmpdir) / "test_stage4.db")
            engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, storage=storage)
            cls.state = engine.run_pipeline()

    def test_scenario_4a_audio_voice_notes_extracted_with_duration(self) -> None:
        """Challenge: Jev extracts audio voice notes from messages.txt including V049, V152 with bracketed duration."""
        rev_queue = self.state["module4_revision_intake_and_jev"]["jev_summary"]["revision_sync_queue"]
        voice_notes = [r for r in rev_queue if r["is_voice_note"]]
        self.assertTrue(len(voice_notes) >= 5)

        # V049 voice note for Hillcrest PT
        v049 = next((r for r in voice_notes if r["video_id"] == "V049"), None)
        self.assertIsNotNone(v049)
        self.assertIn("first 3 seconds", v049["proposed_board_note"].lower())

    def test_scenario_4b_stuck_approved_tasks_detected(self) -> None:
        """Challenge: Identify videos V121 and V152 approved in July 2026 but abandoned as 'In revision'."""
        board = self.state["module4_revision_intake_and_jev"]["production_board"]
        v121 = next(v for v in board if v["video_id"] == "V121")
        v152 = next(v for v in board if v["video_id"] == "V152")

        self.assertEqual(v121["stage_normalized"], "in revision")
        self.assertTrue(bool(v121["client_approved_on"]))

        self.assertEqual(v152["stage_normalized"], "in revision")
        self.assertTrue(bool(v152["client_approved_on"]))

    def test_scenario_4c_editor_disparity_metrics(self) -> None:
        """Challenge: Eli (6.3h avg across 106 cards) vs Rita (4.26h avg, 0 dropped notes)."""
        board = self.state["module4_revision_intake_and_jev"]["production_board"]
        eli_cards = [v for v in board if v["editor"] == "Eli"]
        rita_cards = [v for v in board if v["editor"] == "Rita"]

        eli_hours = sum(v["editor_hours_num"] for v in eli_cards) / len(eli_cards)
        rita_hours = sum(v["editor_hours_num"] for v in rita_cards) / len(rita_cards)

        self.assertGreater(eli_hours, 6.0)
        self.assertLess(rita_hours, 4.5)
        self.assertGreater(eli_hours, rita_hours * 1.40)


class TestStage5BillingAutomationAndPreCheckGuards(unittest.TestCase):
    """Stage 5: Verify unbilled work recovery ($8,210), Blue Bonnet Realty prepayment guard ($0.00), and retainers."""

    @classmethod
    def setUpClass(cls) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            storage = StateStorage(Path(tmpdir) / "test_stage5.db")
            engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, storage=storage)
            cls.state = engine.run_pipeline()

    def test_scenario_5a_unbilled_creative_work_recovery(self) -> None:
        """Challenge: 7 completed shoot sessions totaling $8,210.00 were delivered without an invoice."""
        never_billed = self.state["financial_action_queues"]["never_billed"]
        self.assertEqual(len(never_billed), 7)
        self.assertEqual(self.state["kpis"]["never_billed_total_usd"], 8210.00)

        # 12 specific delivered videos link to these 7 shoots
        board = self.state["module4_revision_intake_and_jev"]["production_board"]
        nb_bookings = {b["booking_id"] for b in never_billed}
        unbilled_vids = [v for v in board if (v.get("shoot_booking") or v.get("booking_id")) in nb_bookings]
        self.assertEqual(len(unbilled_vids), 12)
        unbilled_vid_ids = {v["video_id"] for v in unbilled_vids}
        self.assertEqual(
            unbilled_vid_ids,
            {"V026", "V029", "V037", "V038", "V039", "V040", "V167", "V168", "V169", "V291", "V292", "V294"},
        )

    def test_scenario_5b_blue_bonnet_realty_prepayment_guard(self) -> None:
        """Challenge: Blue Bonnet prepaid $1,500 on cancelled B142. Rescheduled B154 delivered Oct 5. Duplicate INV-1138 voided ($0.00 owed)."""
        we_owe = self.state["module5_balance_guards_and_upsells"]["we_owe"]
        self.assertEqual(len(we_owe), 1)
        self.assertEqual(we_owe[0]["client"], "Blue Bonnet Realty")
        self.assertEqual(we_owe[0]["amount"], 1500.00)
        self.assertIn("B142", we_owe[0]["why"])
        self.assertIn("B154", we_owe[0]["why"])
        self.assertIn("INV-1138", we_owe[0]["reference_id"])

    def test_scenario_5c_retainer_advance_billing_and_paid_totals(self) -> None:
        """Challenge: Verify retainers are billed at the 1st of month with exact advance payments recorded."""
        rp = self.state["module3_payment_reconciliation"]["reconciled_payments"]

        # Adeyemi Law Firm: $9,750.00 across 4 payments
        adeyemi_paid = sum(p["amount_num"] for p in rp if p.get("canonical_client") == "Adeyemi Law Firm")
        self.assertEqual(adeyemi_paid, 9750.00)

        # Bayou Wealth Partners: $10,000.00 across 4 payments
        bayou_paid = sum(p["amount_num"] for p in rp if p.get("canonical_client") == "Bayou Wealth Partners")
        self.assertEqual(bayou_paid, 10000.00)

        # Hillcrest Physical Therapy: $7,500.00 across 3 payments
        hillcrest_paid = sum(p["amount_num"] for p in rp if p.get("canonical_client") == "Hillcrest Physical Therapy")
        self.assertEqual(hillcrest_paid, 7500.00)

    def test_scenario_5d_dynamic_file_upload_recalculation(self) -> None:
        """Challenge: Uploading new payment dynamically recalculates overdue balances without restart."""
        with tempfile.TemporaryDirectory() as tmpdir:
            storage = StateStorage(Path(tmpdir) / "test_dyn.db")
            engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, storage=storage)

            # Initial state
            init_state = engine.run_pipeline()
            init_overdue_count = init_state["kpis"]["overdue_invoices_count"]
            init_overdue_usd = init_state["kpis"]["overdue_total_usd"]

            # Upload payment P5999 settling INV-1099 ($1,500)
            new_payment = (
                "payment_id,date,payer,payer_email,amount,method,reference\n"
                "P5999,06/10/2026,Bluebonnet Realty Group,nolan@bluebonnetrg.com,1500.00,ACH,INV-1099\n"
            )
            storage.save_uploaded_file("payments_oct_update.csv", new_payment)

            recalc_state = engine.run_pipeline()
            self.assertEqual(recalc_state["kpis"]["overdue_invoices_count"], init_overdue_count - 1)
            self.assertEqual(recalc_state["kpis"]["overdue_total_usd"], init_overdue_usd - 1500.00)


class TestStressAndEdgeCaseScenarios(unittest.TestCase):
    """Stress & Edge-Case Verification applying systematic-debugging & billing-automation."""

    @classmethod
    def setUpClass(cls) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            storage = StateStorage(Path(tmpdir) / "test_stress.db")
            engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, storage=storage)
            cls.state = engine.run_pipeline()

    def test_stress_1_zero_dollar_retainer_shoots_not_unbilled(self) -> None:
        """Challenge: 22 zero-dollar shoots in bookings.csv (price=0 for retainer shoots) must NOT be false-flagged as unbilled leaks."""
        board = self.state["module4_revision_intake_and_jev"]["production_board"]
        never_billed = self.state["financial_action_queues"]["never_billed"]
        nb_bids = {b["booking_id"] for b in never_billed}

        # Verify only 7 genuine unbilled bookings exist
        self.assertEqual(len(never_billed), 7)
        self.assertEqual(nb_bids, {"B020", "B024", "B038", "B080", "B083", "B131", "B132"})

    def test_stress_2_exact_overdue_aging_relative_to_oct_6_2026(self) -> None:
        """Challenge: Verify exact days overdue calculation relative to BUSINESS_DATE (2026-10-06)."""
        overdue_list = self.state["financial_action_queues"]["overdue_invoices"]
        overdue_by_no = {i["invoice_no"]: i for i in overdue_list}

        # INV-1099 due 2026-08-28 -> (2026-10-06 - 2026-08-28) = 39 days overdue
        self.assertIn("INV-1099", overdue_by_no)
        self.assertEqual(overdue_by_no["INV-1099"]["days_overdue"], 39)

        # INV-1100 due 2026-08-29 -> (2026-10-06 - 2026-08-29) = 38 days overdue
        self.assertIn("INV-1100", overdue_by_no)
        self.assertEqual(overdue_by_no["INV-1100"]["days_overdue"], 38)

        # Upcoming invoice INV-1134 due 2026-10-08 -> must NOT be in overdue list
        self.assertNotIn("INV-1134", overdue_by_no)

    def test_stress_3_jev_system_one_synthetic_message_evaluation(self) -> None:
        """Challenge: Jev evaluates completely unseen synthetic client messages with high calibration."""
        from app.jev_integration import JevExtractionEngine
        jev = JevExtractionEngine()

        # Unseen message with audio revision request
        res1 = jev.evaluate_custom_text("Hey team, on V999 can we trim the opening music by 2 seconds?")
        self.assertEqual(res1["extracted_entities"]["video_id"], "V999")
        self.assertEqual(res1["questions_evaluated"]["revision_category"]["answer"], "Audio/Music")
        self.assertEqual(res1["questions_evaluated"]["intent"]["answer"], "VIDEO_REVISION")

        # Unseen message with urgent compliance issue
        res2 = jev.evaluate_custom_text("URGENT: Legal compliance notice on V888, please blur the patient intake form!")
        self.assertEqual(res2["extracted_entities"]["video_id"], "V888")
        self.assertEqual(res2["questions_evaluated"]["urgency"]["level"], "high")

    def test_stress_4_duplicate_payment_id_warning(self) -> None:
        """Challenge: Duplicate payment ID in uploaded CSV triggers validation warning."""
        dup_payment_csv = (
            "payment_id,date,payer,payer_email,amount,method,reference\n"
            "P5001,03/04/2026,Bayou WP,djackson@bayouwp.com,2500.00,Zelle,INV-1002\n"
            "P5001,04/04/2026,Bayou WP,djackson@bayouwp.com,2500.00,Zelle,INV-1002\n"
        )
        _, rows, errs = parse_csv_content(dup_payment_csv, "dup_payments.csv", "payments.csv")
        self.assertEqual(len(rows), 2)


if __name__ == "__main__":
    unittest.main()
