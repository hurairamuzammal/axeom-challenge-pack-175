# AXEOM STUDIO: SYSTEMS ENGINEERING & FINANCIAL RECOVERY
## EXECUTIVE PRESENTATION DECK & SCREENCAST GUIDE (PACK 175)

```
========================================================================================
PRESENTER:             Muhammad Abu Huraira (Computer Science Graduate)
CONTACT EMAIL:         huraira.eqeel@gmail.com
CHALLENGE PACK:        Pack 175
BUSINESS "TODAY":      Tuesday, October 6, 2026
LIVE PRODUCTION APP:   https://axeom-challenge-five.vercel.app
SOURCE CODE REPOSITORY: https://github.com/hurairamuzammal/axeom-challenge-pack-175
TARGET DURATION:       6 to 8 Minutes
========================================================================================
```

---

# SLIDE 1: INTRO & THE AXEOM OPERATIONAL CONUNDRUM

```
+--------------------------------------------------------------------------------------+
|                                 AXEOM STUDIO OVERVIEW                                |
|                      Creative Production Studio - Dallas, Texas                      |
+--------------------------------------------------------------------------------------+
|                                                                                      |
|   TOTAL INVOICED REVENUE:       USD 103,890.00   (138 Invoices Across 2026)          |
|   BANK DEPOSITS COLLECTED:      USD  83,390.00   (122 Reconciled Ledger Payments)    |
|   DELINQUENT OVERDUE DEBT:      USD  15,850.00   (8 Invoices Exceeding Net Terms)    |
|   TRAPPED CREATIVE WORK:        USD   8,210.00   (12 Delivered Videos Never Billed!) |
|   BLUE BONNET CASH REFUND OWED: USD       0.00   (Completed Rescheduled Shoot B154)  |
|                                                                                      |
+--------------------------------------------------------------------------------------+
```

### The Core Problem:
Axeom is expanding fast, but **growth has broken its operational and billing nervous system**:
1. **Disconnected Silos:** Production schedules in `bookings.csv`, video revisions in `production_board.csv`, invoices in `invoices.csv`, bank deposits in `payments.csv`, and client communication in scattered emails, Instagram DMs, and WhatsApp voice notes.
2. **Invisible Revenue Leaks:** 12 completed, delivered video cuts were never invoiced because no automated trigger links production sign-offs to finance.
3. **Ghost Invoicing & Customer Friction:** Invoices generated for sessions already paid for in advance (e.g., Blue Bonnet Realty), while clients who already paid are chased for money due to billing tool sync errors.
4. **The Revision Black Hole:** Client feedback sent via WhatsApp voice notes never reaches editor cards, leading to 7.5-hour bloated editing sessions and frustrated clients.

---

# SLIDE 2: 72-HOUR SPRINT BREAKDOWN (ENGINEERING TIMELINE)

```
========================================================================================
                 HOW I DIVIDED THE 72-HOUR SPRINT: AN ENGINEERING ROADMAP
========================================================================================

  HOURS 00 - 24 | DAY 1: FORENSIC INGESTION, DATA HYGIENE & IDENTITY RESOLUTION
  +----------------------------------------------------------------------------------+
  | [x] Audited all 8 raw data files line-by-line without altering raw originals     |
  | [x] Solved DD/MM/YYYY European date formatting in payments.csv vs MM/DD/YYYY     |
  | [x] Quarantined 4 bot/crypto spam leads (.ru / Telegram) with whitelist filters  |
  | [x] Collapsed 72 fragmented surface names into 29 canonical client accounts      |
  | [x] Separated third-party agency payer (Fieldhouse) from studio clients          |
  +----------------------------------------------------------------------------------+
                                        |
                                        v
  HOURS 24 - 48 | DAY 2: FINANCIAL RECONCILIATION & PRODUCTION BOARD SYNC
  +----------------------------------------------------------------------------------+
  | [x] Built 4-pass reconciliation engine matching 122 bank payments to invoices   |
  | [x] Uncovered USD 8,210.00 in unbilled delivered shoots (B020, B024, B080, etc.) |
  | [x] Solved Blue Bonnet duplicate invoice mystery (INV-1138 voided; USD 0.00 owed)|
  | [x] Integrated TypeSafe AI Jev (docs.typesafe.ai) for voice note triage          |
  | [x] Diagnosed "Eli Effect" (106 cards with 0 notes; 6.30h average edit time)     |
  +----------------------------------------------------------------------------------+
                                        |
                                        v
  HOURS 48 - 72 | DAY 3: REACTIVE WEB APP, MOBILE-TO-ULTRAWIDE UI & STRESS TESTS
  +----------------------------------------------------------------------------------+
  | [x] Engineered dynamic reactive state engine with SQLite persistence & Alembic   |
  | [x] Deployed live full-stack app on Vercel with REST API endpoints               |
  | [x] Crafted 6-stage sequential operational drawer (Booked -> Ledger)            |
  | [x] Engineered responsive grid with zero wasted void space (250px to 1920px)     |
  | [x] Implemented multi-file drag-and-drop live re-upload & dynamic recalculation  |
  | [x] Authored automated test suite: 31 unit/stress tests passing in 1.1 seconds   |
  +----------------------------------------------------------------------------------+
```

---

# SLIDE 3: THE IDEAL 6-PILLAR SYSTEM ARCHITECTURE

```
========================================================================================
         THE IDEAL AXEOM OPERATIONS ARCHITECTURE: 6 PILLARS TO ELIMINATE CHAOS
========================================================================================

  [1. INBOUND LEAD SPAM GATEKEEPER]
  Automated regex & domain reputation filter runs at intake.
  Quarantines .ru domains, crypto scrapers, and Telegram solicitations into an audit log.
  Safely whitelists genuine local boutique domains (.co, .fm, .build, .coffee, .org).
                                        |
                                        v
  [2. UNIFIED RELATIONAL PRIMARY KEY ARCHITECTURE]
  Enforces immutable relational keys across all operational touchpoints:
  lead_id (L001) -> booking_id (B001) -> video_id (V001) -> invoice_no (INV-1001) -> payment_id (P5001)
  Prevents orphaned records, unlinked bank deposits, and untracked studio hours.
                                        |
                                        v
  [3. WHATSAPP & INSTAGRAM REVISION BOTS WITH AUTO-ROUTING (TYPESAFE AI JEV)]
  When a client messages via WhatsApp or Instagram requesting video revisions:
  Automated bot prompts: "Please reply with your Invoice No or Video ID (e.g. INV-1134 or V152)".
  TypeSafe AI Jev transcribes audio voice notes and extracts color/pacing directives.
  Directly injects revision notes onto the assigned editor's board card in real time!
  Permanently eliminates lost feedback (e.g. Carmen's orange brand note on V152).
                                        |
                                        v
  [4. CENTRALIZED CLIENT ONBOARDING & MANDATORY DROPDOWN SELECTION]
  Every new client is registered ONCE in the central ledger with verified tax & email info.
  Anyone entering data at ANY stage (sales, shoots, editing, invoicing) MUST select from
  a validated dropdown list.
  Permanently stops typos (torresdental.con) and collapses 72 surface variations to zero!
                                        |
                                        v
  [5. PRE-INVOICE BALANCE CHECK GUARD (PREVENTS OVERBILLING)]
  Automated guard checks client ledger and deposit credits BEFORE generating an invoice.
  If a shoot already has prepaid funds (like Blue Bonnet's B142 $1,500 deposit), the
  system automatically applies it to the completed shoot B154 instead of generating a duplicate.
  Eliminates embarrassing double-billing right from the start!
                                        |
                                        v
  [6. AUTOMATED PAYMENT REMINDERS & DUNNING ESCALATION]
  Smart schedule triggers polite reminders 3 days before net terms expire.
  Escalates overdue notices at 7 days, 14 days, and 30 days past due with payment links.
  Includes "Suggest, Never Act Alone" confirmation guard so owner verifies before sending.
```

---

# SLIDE 4: STUDIO FINANCIAL RADAR (OCTOBER 6, 2026)

```
========================================================================================
                          FINANCIAL HEALTH RECONCILIATION RADAR
========================================================================================

  FINANCIAL METRIC             RECORDED AMOUNT     RECONCILED STATUS / DETAILS
  --------------------------------------------------------------------------------------
  Total Invoiced Revenue        USD 103,890.00     138 Invoices issued across 2026
  Total Bank Cash Collected     USD  83,390.00     122 Payments settled via ACH/Card
  Delinquent Overdue Debt       USD  15,850.00     8 Invoices past net payment terms
  Trapped Creative Work (Leak)  USD   8,210.00     12 Delivered videos / 7 unbilled shoots
  Cash Refund Owed (Blue Bonnet)USD       0.00     B154 delivered Oct 5; INV-1138 voided
  --------------------------------------------------------------------------------------
```

### The 8 Overdue Invoices ($15,850.00):
```
+------------+-------------------------------+-------------+------------+-------------+
| INVOICE NO | CLIENT ACCOUNT                | AMOUNT OWED | ISSUE DATE | DAYS OVERDUE|
+------------+-------------------------------+-------------+------------+-------------+
| INV-1099   | Apex Apex Fitness             | USD 1,500.00| 2026-08-01 | 46 Days     |
| INV-1100   | Apex Apex Fitness             | USD 1,500.00| 2026-08-08 | 38 Days     |
| INV-1116   | Hillcrest Physical Therapy    | USD 2,500.00| 2026-09-01 | 15 Days     |
| INV-1121   | Vista Pediatrics              | USD 2,700.00| 2026-09-08 | 8 Days      |
| INV-1126   | Parkside Chiropractic         | USD 2,700.00| 2026-09-15 | 1 Day       |
| INV-1133   | Apex Apex Fitness             | USD 1,500.00| 2026-09-22 | Overdue     |
| INV-1134   | The Ridgeway Lab              | USD   900.00| 2026-09-24 | Overdue     |
| INV-1144   | Hillcrest Physical Therapy    | USD 2,500.00| 2026-10-01 | Retainer Due|
+------------+-------------------------------+-------------+------------+-------------+
```

### Monthly Retainer Contracts (Advance Billing on 1st of Month):
- **Dr. Adeyemi Law Firm:** USD 2,500/mo billed on 1st of month. **Total Paid to Date: USD 9,750.00** across 15 shoots.
- **Bayou Wealth Management:** USD 2,500/mo billed on 1st of month. **Total Paid to Date: USD 10,000.00** across 10 shoots.
- **Hillcrest Physical Therapy:** USD 2,500/mo billed on 1st of month. **Total Paid to Date: USD 7,500.00** across 15 shoots. (September & October retainers withheld due to name dispute).

---

# SLIDE 5: PRODUCTION BOARD CRISIS & THE "ELI BREAKDOWN"

```
========================================================================================
                  PRODUCTION TEAM AUDIT: RITA VS. ELI (JULY - OCT 2026)
========================================================================================

  METRIC                         SENIOR EDITOR RITA           JUNIOR EDITOR ELI
  --------------------------------------------------------------------------------------
  Assigned Video Board Cards     96 Video Cuts                106 Video Cuts
  Revision Notes on Cards        100% Documented              0 Notes Documented (106 blank!)
  Average Production Hours/Cut   4.26 Hours                   6.30 Hours (+48% higher!)
  Card Revision Rate             15.2% of cuts                65.4% of cuts
  Dropped Client Feedback        0 Dropped Notes              6 Voice Notes / DMs lost
  Cost per Delivered Cut         USD 191.70 (@ $45/hr)        USD 176.40 (@ $28/hr)
  --------------------------------------------------------------------------------------
```

### The Anatomy of the 2 Zombie Tasks:
1. **V121 (River City Auto):** Approved on **July 17, 2026**. Eli finished the cut, client signed off, but Eli left the card marked `In revision`. It remained frozen in production for **81 days**, preventing billing.
2. **V152 (The Ridgeway Lab - Happy Hour Promo):**
   - Ingested from shoot B074. Eli logged **7.5 hours** (6.0h first cut + 1.5h revision).
   - Carmen sent revision instructions via email: *"On happy hour promo, use our brand color orange, not the one you used."*
   - Eli's board card had **zero notes**. Carmen's instruction was lost in transit!
   - Client approved the master render on **July 25, 2026**, but card remained stranded `In revision` for **73 days**.

---

# SLIDE 6: LIVE APPLICATION DEMO & SCREENTOUR MAP

```
========================================================================================
             LIVE PRODUCT WALKAROUND: WHAT TO SHOW ON SCREEN (2:00 - 5:00)
========================================================================================

  STEP 1: THE 6 TOP HERO METRIC CARDS (HIGH-LEVEL STUDIO STATUS)
  [Screen: Top Metric Banner at https://axeom-challenge-five.vercel.app]
  - Card 1: 198 Total Videos in production pipeline
  - Card 2: 24 Canonical Client Accounts (collapsed from 72 messy names)
  - Card 3: $15,850 Delinquent Overdue Debt (8 action-needed invoices)
  - Card 4: $8,210 Never Billed Work (12 delivered cuts waiting for invoices)
  - Card 5: Pre-Check & Guards (Blue Bonnet $0 owed; duplicate INV-1138 voided)
  - Card 6: Audit & Relational Graph (Jev voice note triage & spam quarantine)

  STEP 2: ULTRA-COMPACT RESPONSIVE VIDEO GRID (NO WASTED SPACE)
  - Works seamlessly from 250px mobile screens up to 1920px ultrawide displays.
  - Shows Video ID, Edit Hours logged (e.g. "6.2h edit"), Revision count, Client & Date.
  - Clear amber badges: "Action Needed: Unbilled ($900)" for unbilled delivered cuts.
  - Purple badges: "Voice Note" for cuts with audio revision directives.

  STEP 3: THE 6-STAGE SEQUENTIAL OPERATIONS LIFECYCLE DRAWER
  - Click any video card (e.g. V152 or V001) to open the interactive slide-over drawer:
    Stage 1: Booked Shoot Session (Ref, Date, Crew, Raw Raws Ingestion)
    Stage 2: Assigned Lead Editor & Hours Logged (Eli/Rita, Cut Turnaround)
    Stage 3: Revision Intake & Voice Notes (Jev extraction, Brand colors)
    Stage 4: Quality Inspection & Client Sign-off (Approval Timestamp)
    Stage 5: Finance & Invoicing (Linked Invoice No, Due Date, Balance)
    Stage 6: Bank Ledger Settlement (ACH / Wire Reconciliation Status)

  STEP 4: RETAINER ADVANCE BILLING VISIBILITY
  - Click on Adeyemi Law Firm, Bayou Wealth, or Hillcrest Physical Therapy.
  - Highlights retainer advance schedule: "Billed on 1st of month".
  - Shows total payments settled to date (e.g. Adeyemi $9,750 / 15 shoots).

  STEP 5: DYNAMIC FILE UPLOAD & REAL-TIME RECALCULATION
  - Click "Add new files" button in header.
  - Upload replacement CSVs or updated messages.txt.
  - Engine dynamically recomputes all financial metrics and board statuses in 1.1s!
```

---

# SLIDE 7: AUTHORITATIVE ANSWERS TO THE 5 CHALLENGE QUESTIONS

```
========================================================================================
            QUESTION 1: HOW MUCH MONEY IS OWED TO AXEOM, BY WHOM, AND FOR WHAT?
========================================================================================
```
### Total Money Owed to Axeom: USD 24,060.00
This consists of two distinct operational categories:

1. **Delinquent Overdue Invoices: USD 15,850.00 (8 Invoices Past Net Terms)**
   - **Apex Fitness (USD 4,500.00):** Three overdue invoices (`INV-1099` $1,500 46d overdue; `INV-1100` $1,500 38d overdue; `INV-1133` $1,500). High collection risk.
   - **Hillcrest Physical Therapy (USD 5,000.00):** September retainer (`INV-1116` $2,500 15d overdue) and October retainer (`INV-1144` $2,500). Payment deliberately withheld due to unresolved name dispute on video title cards.
   - **Vista Pediatrics (USD 2,700.00):** `INV-1121` issued Sept 8, 8 days overdue. Billed to third-party agency payer Fieldhouse Marketing.
   - **Parkside Chiropractic (USD 2,700.00):** `INV-1126` issued Sept 15, 1 day overdue. Billed to third-party agency payer Fieldhouse Marketing.
   - **The Ridgeway Lab (USD 900.00):** `INV-1134` issued Sept 24 for shoot B074. Past net terms.

2. **Trapped Creative Work (Never Billed): USD 8,210.00 (7 Shoots / 12 Delivered Cuts)**
   - `B020` (Adeyemi Law Firm): May monthly retainer allocation (`USD 2,500.00`)
   - `B024` (Hillcrest Physical Therapy): May monthly retainer allocation (`USD 2,500.00`)
   - `B080` (The Ridgeway Lab): Shoot completed July 3, delivered (`USD 900.00`)
   - `B038`, `B083`, `B131` (Various one-off shoots): Completed and delivered (`USD 810.00`)
   - `B132` (Commercial Project): Completed and delivered (`USD 1,500.00`)

3. **Blue Bonnet Realty Prepayment Clarification: USD 0.00 Cash Owed**
   - Cancelled shoot `B142` was rescheduled to `B154` and successfully completed on Oct 5.
   - Client paid `USD 1,500.00` on Sept 28 (`P5121`). Axeom mistakenly generated duplicate invoice `INV-1138`.
   - Resolution: Void `INV-1138` and link prepaid funds to `B154`. **Axeom owes USD 0.00 in refunds.**

```
========================================================================================
     QUESTION 2: WHAT ARE THE BIGGEST OPERATIONAL BOTTLENECK & PRODUCTION INEFFICIENCIES?
========================================================================================
```
1. **Unstructured Communication & Feedback Loss (The "Eli Black Hole"):**
   - 78% of production cards had empty revision notes.
   - Junior editor Eli logged 0 notes on all 106 cards, averaging 6.30 hours per cut and a 65% revision rate.
   - Client instructions sent via WhatsApp voice notes and DMs were lost in transit, causing client frustration and inflated editing costs.
2. **Zombie Tasks Blocking Invoicing:**
   - Completed and approved videos (`V121` and `V152`) remained marked `In revision` for 81 and 73 days because editors never updated card statuses to `Delivered`.
   - Because billing relied on manual card inspection, invoices were never triggered.
3. **No Centralized Client Master:**
   - 72 surface variations of client names across forms caused severe reconciliation failures, duplicate invoicing, and misapplied payments.

```
========================================================================================
     QUESTION 3: HOW SHOULD AXEOM PRIORITIZE CLIENT OUTREACH AND COLLECTION EFFORTS?
========================================================================================
```
Axeom must execute an **Executive 3-Tier Outreach Strategy**:

1. **Tier 1: Immediate Account Rescue (Within 24 Hours) - Hillcrest Physical Therapy**
   - **Stake: USD 5,000.00 delinquent + USD 30,000.00 annual retainer contract.**
   - Action: Owner personally calls Dr. Alana Ibarra. Confirm all video graphic title cards have been updated to the full compliance name `"Hillcrest Physical Therapy"`. Release revised renders and request release of withheld retainers `INV-1116` and `INV-1144`.
2. **Tier 2: Single-Point Agency Settlement (Within 48 Hours) - Fieldhouse Marketing**
   - **Stake: USD 5,400.00 across Vista Pediatrics (`INV-1121`) & Parkside Chiropractic (`INV-1126`).**
   - Action: Send consolidated agency statement to Tanya at Fieldhouse Marketing. Fieldhouse previously settled four invoices in single lump sums; a single point of contact recovers $5,400 immediately.
3. **Tier 3: Immediate Cash Unlock (Within 72 Hours) - Issue Never-Billed Invoices**
   - **Stake: USD 8,210.00 in trapped revenue.**
   - Action: Automatically generate invoices for the 7 completed, delivered shoots (`B020`, `B024`, `B080`, `B038`, `B083`, `B131`, `B132`).
4. **Tier 4: Formal Dunning & Production Hold - Apex Fitness**
   - **Stake: USD 4,500.00 across 3 overdue invoices (up to 46 days overdue).**
   - Action: Issue formal notice and freeze future shoot bookings until delinquent balance is cleared.

```
========================================================================================
     QUESTION 4: WHAT SYSTEM IMPROVEMENTS OR AUTOMATIONS DELIVER THE HIGHEST ROI?
========================================================================================
```
1. **Pillar 3: WhatsApp/Instagram Revision Intake Bots with TypeSafe AI Jev (ROI: Immediate)**
   - Prompts clients for Invoice No or Video ID when submitting changes.
   - Transcribes voice notes and auto-injects revision tasks directly onto editor board cards.
   - Saves ~2 hours per video, reduces revision rate from 65% to 15%, and prevents lost feedback.
2. **Pillar 5: Automated Pre-Invoice Balance Check Guard (ROI: High)**
   - Cross-checks client prepayments and credits before invoice generation.
   - Eliminates duplicate billing (e.g. Blue Bonnet Realty), preventing customer trust erosion.
3. **Pillar 4: Single-Source Client Master with Strict Dropdown UI (ROI: Permanent)**
   - Mandates client selection from validated dropdown at every pipeline step.
   - Eliminates all typos (`torresdental.con`) and prevents data fragmentation.
4. **Pillar 1: Inbound Lead Gatekeeper & Spam Quarantine (ROI: Time-Saving)**
   - Filters bot scrapers and .ru spam at intake, ensuring sales staff focus only on verified local leads.

```
========================================================================================
     QUESTION 5: WHAT SPECIFIC DATA DISCREPANCIES DID YOU IDENTIFY & RESOLVE?
========================================================================================
```
1. **European Date Parsing in Bank Ledger:**
   - `payments.csv` stored dates in European `DD/MM/YYYY` format, while `bookings.csv` used `MM/DD/YYYY`.
   - Standardized via deterministic parsing, preventing 30-day temporal misalignments.
2. **Third-Party Agency Payer vs. Clients:**
   - Identified that `Fieldhouse Marketing` (`tanya@fieldhousemktg.com`) is an agency payer settling invoices on behalf of `Vista Pediatrics` and `Parkside Chiropractic`, not a production client.
3. **Shared Contacts Operating Distinct Businesses:**
   - Discovered that Alana Ibarra manages both *Hillcrest Physical Therapy* and *Bayou Wealth Management*, while Tasha Torres manages both *Torres Dental* and *Luna Roofing*.
   - Maintained clean separation of company profiles rather than erroneously merging them.
4. **Billing Tool Desynchronization:**
   - Uncovered 6 invoices marked `unpaid` in `invoices.csv` that were already settled in `payments.csv`.
   - Identified `INV-1110` marked `paid` without any bank deposit record.
5. **Zombie Tasks Rescued from the Production Board:**
   - Detected `V121` and `V152` stranded in `In revision` despite recorded client sign-offs on July 17 and July 25.
   - Recovered both cuts, updated status to `Delivered`, and queued them for financial settlement.

---

```
========================================================================================
                               END OF PRESENTATION DECK
                LIVE SYSTEM URL: https://axeom-challenge-five.vercel.app
========================================================================================
```
