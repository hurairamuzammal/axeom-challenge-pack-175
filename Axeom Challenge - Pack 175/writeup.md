# Axeom Studio Operations & Financial Recovery Writeup (Pack 175)

**Prepared by:** Muhammad Abu Huraira (`huraira.eqeel@gmail.com`)  
**Reference Date ("Today"):** Tuesday, October 6, 2026  

---

## 1. Executive Summary: What Is Actually Happening at Axeom

Axeom is a profitable, high-demand creative studio (`USD 103,890.00` invoiced, `USD 83,390.00` cash collected in the bank), but its growth has outpaced its manual spreadsheet-and-chat workflow. By reconciling all 8 raw files across a 5-Module Reactive Operations Engine, we uncovered four systemic leaks:

1. **Fragmented Identity & Payer Confusion (72 Raw Names -> 29 True Clients + 1 Agency Payer):**
   - Staff enter client names differently across files (`Torres Dental` vs. `Dr. Nina Torres` vs. `Torres Dental PLLC`, plus a `.con` email typo on `B068`).
   - Clients pay from personal or secondary accounts (`Mia Torres` paying `Heart & Hustle Radio` invoices via `mia.torres.mail@gmail.com`), and `Fieldhouse Marketing` (`tanya@fieldhousemktg.com`) is a **third-party agency payer** settling invoices on behalf of `Vista Pediatrics` and `Parkside Chiropractic` (`USD 5,400.00` total)—not a studio client.
   - Conversely, three contacts (`Alana Ibarra`, `Tasha Torres`, and `Nolan Nguyen`) manage **two separate businesses each** with distinct domains and phone numbers; naive name-based deduplication would falsely merge their legal accounts.

2. **Billing Tool Desynchronization & Revenue Leakage (`USD 8,210.00` Unbilled + `USD 8,570.00` Overdue):**
   - **Never Billed (`USD 8,210.00`):** Two May 2026 monthly retainers (`Adeyemi Law Firm` `B020` and `Hillcrest Physical Therapy` `B024` at `USD 2,500.00` each = `USD 5,000.00`) and 5 completed one-off shoots (`B038` `USD 270`, `B080` `USD 900`, `B083` `USD 270`, `B131` `USD 270`, `B132` `USD 1,500` = `USD 3,210.00`) were completed and delivered without an invoice ever being generated.
   - **Billing Tool Sync Errors:** Six invoices marked `unpaid` in `invoices.csv` (`INV-1066`, `INV-1077`, `INV-1083`, `INV-1084`, `INV-1105`, and one of the two September Fieldhouse invoices `INV-1126`/`INV-1127`) were already paid in `payments.csv`. Sending delinquent notices to these clients damages trust. Conversely, `INV-1110` (`Glow Coffee Roasters`, `USD 900.00`) is marked `paid` in `invoices.csv` with zero corresponding deposit in `payments.csv`.
   - **Customer Credits & Duplicate Invoicing (`USD 2,430.00` Owed/Credit):**
     - `Blue Bonnet Realty` (`USD 1,500.00`): Cancelled shoot `B142` (`2026-09-22`, family emergency) was rescheduled to `B154` (`2026-10-05`). The client already paid `USD 1,500.00` (`P5121` on `INV-1131`), yet Axeom issued a duplicate unpaid invoice `INV-1138` (`USD 1,500.00`) for the rescheduled shoot.
     - `Prime Barbershop` (`USD 900.00`): Paid `INV-1080` twice (`P5077` via Zelle on `2026-08-02` with blank reference and `P5081` via card on `2026-08-05`).
     - `Crown Church` (`USD 30.00`): Billed `USD 300.00` on `INV-1065` instead of their `USD 270.00` 10% community-discounted rate on `B064`.

3. **Unstructured Revision Intake & The "Eli Effect":**
   - **78.2%** of cards on `production_board.csv` have empty `notes_on_board`. Client revision requests arrive via WhatsApp, Instagram DMs, Email, and **6 audio Voice Notes** (`V049`, `V135`, `V132`, `V268`, `V274`) that are never transcribed onto the board.
   - Revision loss spiked in **July 2026** when junior editor **Eli** joined (`2026-07-03`). Eli has **0 revision notes logged across all 106 of his assigned videos**, averages **2.14 revisions and 7.36 hours per video** (vs. Ali's 0.90 revisions and 4.44 hours), and costs more per delivered video (`USD 206.10` vs. Ali's `USD 199.65`) despite a lower hourly rate (`USD 28/hr` vs. `USD 45/hr`).
   - Two client-approved videos (`V121` approved `2026-07-23` and `V152` approved `2026-08-08`) remain stuck in `In revision` as zombie tasks.

4. **Ignored High-Intent Leads & Account Churn Risk:**
   - Out of 98 raw leads, 4 are bot/solicitation spam (`L052`, `L063`, `L081`, `L089`), leaving **94 genuine leads**—of which **15 have never received a reply**, including existing clients trying to book or escalate (`L087` Mia Torres, `L097` Leah Reed) and referral `L086` (`Victor Vega`).
   - **Immediate Churn Alert (`Hillcrest Physical Therapy`):** After their `2026-09-02` voice note and `2026-09-08` email demanding the full compliance name `"Hillcrest Physical Therapy"` (instead of `"Hillcrest PT"`) were ignored, they withheld `USD 5,000.00` in September/October retainers (`INV-1116` and `INV-1144`) and emailed `"We need to talk about the contract this week"` (`2026-10-03`).

---

## 2. How the 5-Module Reactive Application Solves This

We built a dynamic, multi-file reactive operations platform (available both as a **Vercel Web App + REST API** and an **Interactive Streamlit App** sharing the same Python engine and SQLite persistence layer):

- **Module 1 (Ingestion, Date Normalization & Soft Spam Quarantine):** Validates all 7 CSV schemas and `messages.txt`, normalizes mixed date formats (`MM/DD/YYYY` in `bookings.csv` vs. `DD/MM/YYYY` in `payments.csv`), fixes `.con` -> `.com` email typos, and quarantines spam leads (`L052`, `L063`, `L081`, `L089`) with one-click owner override while whitelisting `.co`, `.fm`, `.build`, `.org`, and `.coffee` domains.
- **Module 2 (3-Tier Identity Resolution):** Resolves 72 surface names into canonical client profiles, links rebrands (`Maple Fitness` -> `Maple Athletics`), isolates third-party payers (`Fieldhouse Marketing`), and flags shared-contact separate companies (`Alana Ibarra`, `Tasha Torres`, `Nolan Nguyen`) with `HIGH`/`MEDIUM`/`LOW` confidence badges.
- **Module 3 (4-Pass Payment Reconciliation):** Matches payments via (1) Exact `INV-xxxx` regex, (2) Text memo & bulk sum solver (`P5076` `"july sessions"`, `P5115` `"half now half later"`), (3) Chronological FIFO for 22 blank references, and (4) Overpayment & discrepancy quarantine (`P5077` `USD 900`, `INV-1110` `USD 900`, `INV-1065` `USD 30`).
- **Module 4 (Jev Structured Extraction & Editor Bot Routing):** Parses all 200 messages and 6 voice notes into typed revision requests (`Audio`, `Color`, `Pacing`, `Text/Graphics`) and lets the owner sync missed notes directly onto the assigned editor's card on `production_board.csv`.
- **Module 5 (Balance Guards & Monday Action Queue):** Flags prepaid rescheduled shoots (`Blue Bonnet Realty` `B142` -> `B154` / duplicate `INV-1138`), prioritizes existing-client upsell leads, and enforces a **"Suggest, Never Act Alone"** confirmation workflow.
