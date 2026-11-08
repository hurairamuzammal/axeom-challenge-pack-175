# AXEOM STUDIO: SYSTEMS ENGINEERING & FINANCIAL RECOVERY
## MINIMAL 5-SLIDE EXECUTIVE PRESENTATION DECK (PACK 175)

```
========================================================================================
PRESENTER:             Muhammad Abu Huraira (Computer Science Graduate)
EMAIL:                 huraira.eqeel@gmail.com
CHALLENGE PACK:        Pack 175 (Creative Video & Podcast Studio, Dallas)
BUSINESS "TODAY":      Tuesday, October 6, 2026
LIVE PRODUCTION APP:   https://axeom-challenge-five.vercel.app
SOURCE CODE REPOSITORY: https://github.com/hurairamuzammal/axeom-challenge-pack-175
FORMAT:                Clean Minimal Light Theme • Max 5 Slides • Fast Jump to App
========================================================================================
```

---

# SLIDE 1: INTRO & THE STUDIO CONTEXT

```
+--------------------------------------------------------------------------------------+
|                     AXEOM STUDIO OVERVIEW • DALLAS, TEXAS                            |
+--------------------------------------------------------------------------------------+
|                                                                                      |
|   TOTAL INVOICED REVENUE:       USD 103,890.00   (138 Invoices Across 2026)          |
|   BANK CASH COLLECTED:          USD  83,390.00   (122 Reconciled Ledger Deposits)    |
|   DELINQUENT OVERDUE DEBT:      USD  15,850.00   (8 Invoices Past Net Terms)         |
|   TRAPPED CREATIVE WORK:        USD   8,210.00   (12 Delivered Cuts Never Billed!)   |
|   CASH REFUND OWED:             USD       0.00   (Completed Rescheduled Shoot B154)  |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```

### Presenter & Mission:
- **Presenter:** Muhammad Abu Huraira, Computer Science Graduate (`huraira.eqeel@gmail.com`).
- **Challenge Pack:** Pack 175.
- **Reference Date:** Strictly **Tuesday, October 6, 2026**.
- **The Situation:** Axeom is a high-demand creative video and podcast studio in Dallas with ~30 clients. Business is profitable on the surface, but its growth has outpaced its manual spreadsheet-and-chat workflow. Disconnected silos across bookings, revisions, invoices, and bank statements have caused massive revenue leaks and client communication failures.

---

# SLIDE 2: HOW I DIVIDED THE 72 HOURS (THE PLAN)

```
========================================================================================
                 HOW I DIVIDED THE 72-HOUR SPRINT: AN ENGINEERING ROADMAP
========================================================================================

  DAY 1 (HOURS 00 - 24): FORENSIC INGESTION, DATA HYGIENE & IDENTITY RESOLUTION
  +----------------------------------------------------------------------------------+
  | • Audited all 8 raw files line-by-line without modifying original raw data.     |
  | • Resolved European DD/MM/YYYY date formatting in payments.csv vs MM/DD/YYYY.    |
  | • Quarantined 4 bot/crypto spam leads (.ru / Telegram) into audit log safely.    |
  | • Collapsed 72 raw surface names into 29 canonical client accounts.              |
  | • Separated third-party agency payer (Fieldhouse) from clinical clients.         |
  +----------------------------------------------------------------------------------+
                                        |
                                        v
  DAY 2 (HOURS 24 - 48): MULTI-WAY RECONCILIATION & PRODUCTION AUDIT
  +----------------------------------------------------------------------------------+
  | • Reconciled 122 bank payments ($83,390) against 138 invoices with FIFO logic.   |
  | • Uncovered USD 8,210.00 in completed, delivered shoots never invoiced.          |
  | • Proved USD 0.00 cash owed to Blue Bonnet Realty; voided duplicate INV-1138.    |
  | • Integrated TypeSafe AI Jev (docs.typesafe.ai) for voice notes & messages.      |
  | • Audited 106 cards with 0 notes on board cards under junior editor Eli.         |
  +----------------------------------------------------------------------------------+
                                        |
                                        v
  DAY 3 (HOURS 48 - 72): FULL-STACK REACTIVE APP & MULTI-STAGE STRESS TESTING
  +----------------------------------------------------------------------------------+
  | • Engineered dynamic reactive state engine with SQLite persistence & REST API.   |
  | • Crafted ultra-compact UI fitting 250px mobile to 1920px without wasted space. |
  | • Built 6-stage lifecycle drawer: Booked -> Editor -> Intake -> Approval -> Bill.|
  | • Implemented live multi-file drag-and-drop instant recalculation (1.1s).       |
  | • Authored automated test suite: 31 unit/stress tests passing in 0.92 seconds.   |
  +----------------------------------------------------------------------------------+
```

---

# SLIDE 3: WHAT ARE THE MAJOR ISSUES? (THE DIAGNOSIS)

```
========================================================================================
                          THE 3 SYSTEMIC OPERATIONAL FAILURES
========================================================================================
```

### 1. Financial Chaos & Revenue Leaks:
* **USD 15,850.00 Delinquent Debt:** 8 invoices past net payment terms (Apex Fitness $4,500, Hillcrest PT $5,000 withheld, Fieldhouse $5,400 across two clinics).
* **USD 8,210.00 Trapped Work:** 12 delivered video cuts across 7 shoots completed with zero invoices sent (missed May retainers B020 & B024, reels pack B080, podcast shoots B038, B083, B131, B132).
* **Billing Tool Desync:** 6 invoices marked `unpaid` were already settled in `payments.csv`; `INV-1110` marked `paid` with $0 deposit; duplicate invoice `INV-1138` ($1,500) mistakenly billed to Blue Bonnet for prepaid shoot B154.

### 2. The Communication Black Hole & "The Eli Effect":
* **78.2% Blank Cards:** Junior editor Eli joined July 3, 2026, and logged **0 revision notes across all 106 cards** assigned to him!
* **Inflated Production Overhead:** Eli averages **6.30 hours per cut** (+48% higher than senior editor Rita's 4.26h) with a **65.4% revision rate**.
* **Lost Feedback Directives:** 6 Audio Voice Notes and Instagram DMs lost in transit before reaching editor cards.
* **Zombie Tasks:** `V121` and `V152` left stranded `In revision` for 81 and 73 days despite recorded client approvals.

### 3. Identity Fragmentation & Imminent Churn:
* **72 Surface Names:** Staff entered messy aliases across forms, causing severe tracking and accounting failures.
* **Imminent Account Churn (Hillcrest Physical Therapy):** Withholding $5,000 in retainers ($30,000 annual contract at risk) after ignored voice notes (Sept 2) and emails (Sept 8) demanding compliance branding. October 3 email: *"We need to talk about the contract this week."*

---

# SLIDE 4: HOW I SOLVED IT (THE 6-PILLAR ARCHITECTURE)

```
========================================================================================
         THE IDEAL AXEOM OPERATIONS ARCHITECTURE: 6 PILLARS TO ELIMINATE CHAOS
========================================================================================

  [1. INBOUND LEAD SPAM GATEKEEPER]
  Regex & domain reputation filters run at intake. Quarantines .ru bot scrapers while
  safely whitelisting genuine local boutique domains (.co, .fm, .build, .coffee, .org).
                                        |
                                        v
  [2. UNIFIED RELATIONAL PRIMARY KEY SCHEMA]
  Immutable keys: lead_id -> booking_id -> video_id -> invoice_no -> payment_id.
  Permanently prevents orphaned payments, unlinked shoots, and untracked studio hours.
                                        |
                                        v
  [3. WHATSAPP & INSTAGRAM REVISION BOTS (TYPESAFE AI JEV)]
  Prompts clients: "Please reply with your Invoice No or Video ID (e.g. INV-1134 or V152)".
  Jev transcribes voice notes and auto-injects directives directly onto editor cards.
                                        |
                                        v
  [4. CENTRALIZED CLIENT MASTER & MANDATORY DROPDOWNS]
  New clients registered once in master ledger; all users must select from dropdowns
  at every stage to permanently eliminate typos (torresdental.con) and 72 variants.
                                        |
                                        v
  [5. PRE-INVOICE BALANCE CHECK GUARD]
  Verifies prepaid balances and deposits before issuing invoices.
  Applies Blue Bonnet's $1,500 deposit to completed shoot B154; voids duplicate INV-1138.
  Confirms exactly USD 0.00 cash owed!
                                        |
                                        v
  [6. AUTOMATED PAYMENT REMINDERS & DUNNING ESCALATION]
  Smart schedule triggers polite notices 3d before due date, with 7d/14d/30d aging.
  Enforces a strict "Suggest, Never Act Alone" confirmation guard before dispatch.
```

---

# SLIDE 5: LIVE APP WALKAROUND & ACTION ROADMAP (JUMP TO APP!)

```
========================================================================================
     LIVE PRODUCT WALKAROUND & MONDAY ACTION PLAN (NOW JUMPING TO LIVE APPLICATION)
========================================================================================
```

### What to Explore in the Live Application (`axeom-challenge-five.vercel.app`):
1. **6 Top Hero Metric Cards:** Instant high-level radar: 198 Videos, 24 Clients, $15.8k Overdue, $8.2k Never Billed, $0 Cash Owed, and Audit Graph.
2. **Compact Responsive Video Grid:** Ultra-compact cards fitting 250px mobile to 1920px ultrawide screens with zero wasted void space.
3. **Amber Action Badges:** Pulsing *"Action Needed: Unbilled ($900)"* tags on 12 unbilled delivered video cuts.
4. **6-Stage Operational Stepper Drawer:** Click any card (e.g. V152) to trace `Booked -> Editor -> Intake -> Approval -> Billing -> Ledger`.
5. **Retainer Contract Visibility:** 1st of month advance billing schedule with verified total paid-to-date figures.
6. **Dynamic Multi-File Upload:** Click *"Add new files"* to drag-and-drop CSVs and watch the engine recompute state in 1.1s.

### Monday Morning Top 3 Actions (Backed by Exact Receipts):
* **Action 1: Save Hillcrest PT ($30,000 ARR Retainer):**
  * *Proof Receipts:* October 3 email (*"We need to talk about the contract this week"*), Lead `L097`, withheld retainers `INV-1116` ($2,500) and `INV-1144` ($2,500), and title errors on `V049`/`V135`.
  * *Execution:* Owner Zaid calls Dr. Alana Ibarra & Leah Reed at 9:00 AM; assigns 24h compliant re-renders via senior editor Ali.
* **Action 2: Issue USD 8,210.00 Unbilled Invoices & Void Duplicate INV-1138:**
  * *Proof Receipts:* Completed shoots `B020` ($2,500), `B024` ($2,500), `B080` ($900), `B038` ($270), `B083` ($270), `B131` ($270), `B132` ($1,500). Wire `P5121` linked to completed `B154`, duplicate `INV-1138` voided ($0.00 cash owed).
  * *Execution:* Dispatch 7 invoices immediately in billing tool; apply credit memo to Blue Bonnet Realty.
* **Action 3: Reply to 15 Unanswered Human Leads & Clear Zombie Tasks:**
  * *Proof Receipts:* Leads `L087` (Mia Torres booking new shoot), `L097` (Leah Reed), `L086` (Victor Vega warm referral); zombie tasks `V121` and `V152`.
  * *Execution:* Reply to `L087`, `L097`, `L086` by 11:00 AM; move `V121` and `V152` from `In revision` to `Delivered`, unlocking billing.

---

```
========================================================================================
      LET'S JUMP INTO THE LIVE DEMO NOW: https://axeom-challenge-five.vercel.app
========================================================================================
```
