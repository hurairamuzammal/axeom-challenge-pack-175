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

# SLIDE 7: AUTHORITATIVE ANSWERS TO THE 6 CHALLENGE QUESTIONS (WITH PROOF RECEIPTS)

```
========================================================================================
       QUESTION 1: WHO ARE OUR REAL CLIENTS? HOW MANY, AND WHO ARE THEY?
========================================================================================
```
### Total Real Clients: 29 Canonical Clients (+ 1 Third-Party Agency Payer)
Staff entered **72 surface name variants** across files. We resolved these into **29 genuine client businesses** and isolated **1 third-party agency payer**:

1. **Third-Party Agency Payer Isolation:**
   - `Fieldhouse Marketing` (`tanya@fieldhousemktg.com`) is **not a video client**. Fieldhouse is an agency payer that settles invoices on behalf of two distinct clinical clients:
     - `Vista Pediatrics` (`INV-1121`, USD 2,700.00)
     - `Parkside Chiropractic` (`INV-1126`, USD 2,700.00)
   - They settled previous invoices via single lump-sum wires (`P5088` USD 5,400.00).

2. **Shared Contacts Operating Distinct Businesses (Anti-Merge Safeguards):**
   - **Alana Ibarra** operates two separate businesses:
     - `Hillcrest Physical Therapy` (`alana@hillcrestpt.com`, Phone: 214-555-0144)
     - `Bayou Wealth Management` (`alana.ibarra@bayouwealth.com`, Phone: 214-555-0177)
   - **Tasha Torres** operates two separate businesses:
     - `Torres Dental PLLC` (`tasha@torresdental.com`, fixed `.con` typo on `B068`)
     - `Luna Roofing` (`tasha@lunaroofingdfw.com`)
   - **Nolan Nguyen** operates two separate businesses:
     - `Brightwater` (`nolan@brightwater.build`)
     - `Bluebonnet Realty Group` (`nolan@bluebonnetrealty.com`)
   - Naive string matching merges these into single entities; our relational entity engine maintains strict legal profile boundaries.

```
========================================================================================
       QUESTION 2: MONEY. WHO OWES US? DO WE OWE ANYONE? WORK NEVER BILLED?
                   WHERE IS THE BILLING TOOL WRONG? GIVE TOTALS.
========================================================================================
```
### Financial Reconciliation Radar Totals:
- **Total Invoiced:** USD 103,890.00 | **Total Bank Deposits:** USD 83,390.00
- **Delinquent Overdue Debt (Who Owes Us):** USD 15,850.00 (8 Invoices Past Net Terms; USD 8,570.00 strictly past invoice due dates)
- **Do We Owe Anyone:** **USD 0.00 Cash Owed.** (Blue Bonnet Realty B142 prepaid $1,500 via P5121; rescheduled B154 delivered Oct 5; duplicate INV-1138 voided)
- **Trapped Creative Work (Never Billed):** **USD 8,210.00** across 7 completed shoots / 12 delivered video cuts
- **Billing Tool Sync Errors:** 6 Invoices marked `unpaid` that are already settled, 1 invoice marked `paid` with $0 bank deposit, and 1 duplicate invoice.

#### 1. Delinquent Debt Breakdown (USD 15,850.00):
- `INV-1099`: Apex Fitness — USD 1,500.00 (Due 2026-08-21, 46 Days Overdue)
- `INV-1100`: Apex Fitness — USD 1,500.00 (Due 2026-08-29, 38 Days Overdue)
- `INV-1116`: Hillcrest Physical Therapy — USD 2,500.00 (Due 2026-09-15, 21 Days Overdue — Withheld)
- `INV-1121`: Vista Pediatrics (Fieldhouse) — USD 2,700.00 (Due 2026-09-28, 8 Days Overdue)
- `INV-1126`: Parkside Chiropractic (Fieldhouse) — USD 2,700.00 (Due 2026-10-05, 1 Day Overdue)
- `INV-1133`: Apex Fitness — USD 1,500.00 (Due 2026-10-06, Net Terms Expired)
- `INV-1134`: The Ridgeway Lab — USD 900.00 (Due 2026-10-08, Shoot B074)
- `INV-1144`: Hillcrest Physical Therapy — USD 2,500.00 (Due 2026-10-15, Withheld Retainer)

#### 2. Trapped Creative Work Receipts (USD 8,210.00 Never Billed):
- `B020`: Adeyemi Law Firm (May Retainer) — USD 2,500.00 (Cuts V026 & V029 delivered)
- `B024`: Hillcrest Physical Therapy (May Retainer) — USD 2,500.00 (Cuts V037-V040 delivered)
- `B080`: The Ridgeway Lab (Reels Pack) — USD 900.00 (Cuts V167-V169 delivered)
- `B038`: Crown Church (Podcast Shoot) — USD 270.00 (Cut V082 delivered)
- `B083`: Crown Church (Podcast Shoot) — USD 270.00 (Cut V175 delivered)
- `B131`: Crown Church (Podcast Shoot) — USD 270.00 (Cut V288 delivered)
- `B132`: Commercial Content Day — USD 1,500.00 (Cuts V291, V292, V294 delivered)

#### 3. Billing Tool Desynchronization Receipts:
- 6 Invoices marked `unpaid` in `invoices.csv` that were paid in `payments.csv`:
  `INV-1066` ($900 via P5047), `INV-1077` ($2,500 via P5071), `INV-1083` ($900 via P5079), `INV-1084` ($1,500 via P5083), `INV-1105` ($900 via P5099), `INV-1126`/`INV-1127` ($2,700 via P5118).
- 1 Invoice marked `paid` with zero bank deposit: `INV-1110` (Glow Coffee Roasters, USD 900.00).
- 1 Duplicate Invoice: `INV-1138` (Blue Bonnet Realty, USD 1,500.00 — voided).

```
========================================================================================
       QUESTION 3: WHY DO CLIENT REQUESTS GET LOST? SINCE WHEN? PROVE WITH DATA.
========================================================================================
```
### Root Causes:
1. **Unstructured Communication Channels:** Client revision directives sent via WhatsApp, Instagram DMs, Email, and 6 audio Voice Notes were never transcribed or linked to production board cards.
2. **The "Eli Breakdown":** Junior editor Eli joined on **July 3, 2026**. Eli logged **0 notes on the board across all 106 cards assigned to him**, averaging 6.30 hours per cut (+48% higher than Rita's 4.26h) and a 65.4% revision rate.
3. **Zombie Tasks:** Two fully approved cuts (`V121` approved July 17; `V152` approved July 25) were abandoned in `In revision` for 81 and 73 days because editors never updated board card statuses to `Delivered`.

### Since When:
- **July 2026** (specifically **July 3, 2026**, coinciding with Eli's onboarding date in `team.csv`).

### Data Proof Receipts:
- `production_board.csv`: 78.2% of all 202 cards have empty `notes_on_board`.
- Eli: 106 assigned cards, 0 notes recorded (0.0% coverage), 6.30 hours avg edit time, 65.4% revision rate.
- Rita: 96 assigned cards, 100% note coverage, 4.26 hours avg edit time, 15.2% revision rate.
- 6 Audio Voice Notes (`V049`, `V135`, `V132`, `V268`, `V274`) were completely absent from board cards until recovered by our Jev engine.

```
========================================================================================
       QUESTION 4: WHICH CLIENT IS MOST LIKELY TO LEAVE US?
                   WHAT WOULD YOU DO ABOUT IT THIS WEEK?
                   (ANSWERED EXCLUSIVELY VIA RECEIPT AUDIT TRAIL)
========================================================================================
```
### Target Client: Hillcrest Physical Therapy (Dr. Alana Ibarra & Leah Reed)

#### Forensic Proof Trail (Exact Receipt Numbers):
- **Receipt #1 (Audio Voice Note Ingestion):**
  - *Receipt ID:* Voice Note on Shoot `B024` / Video `V049`
  - *Timestamp:* `2026-09-02 14:15 CST`
  - *Receipt Content:* Dr. Alana Ibarra audio: *"Please make sure the title card says Hillcrest Physical Therapy, not Hillcrest PT. We have strict healthcare compliance rules."*
  - *Audit Finding:* Lost in transit. Note was never transcribed onto Eli's card `V049`.
- **Receipt #2 (Email Non-Compliance Notice):**
  - *Receipt ID:* Message in `messages.txt` line 142
  - *Sender:* `alana@hillcrestpt.com` | *Timestamp:* `2026-09-08 11:14 CST`
  - *Receipt Content:* *"I noticed the new render still says Hillcrest PT. We cannot publish this. Please fix it immediately."*
  - *Audit Finding:* Ignored; board card remained unedited.
- **Receipt #3 (Financial Retaliation / Delinquent Retainers):**
  - *Receipt ID:* `INV-1116` in `invoices.csv` (Amount: **USD 2,500.00**, Issued: `2026-09-01`, Due: `2026-09-15`). Status: **21 days overdue**. Client withheld payment!
  - *Receipt ID:* `INV-1144` in `invoices.csv` (Amount: **USD 2,500.00**, Issued: `2026-10-01`, Due: `2026-10-15`). Status: **Unpaid**.
  - *Financial Proof:* Total withheld cash = **USD 5,000.00**; annual retainer at stake = **USD 30,000.00**.
- **Receipt #4 (Contract Escalation Form):**
  - *Receipt ID:* Lead `L097` in `leads.csv` | *Timestamp:* `2026-09-29 16:45 CST`
  - *Contact:* Leah Reed (`leah@hillcrestpt.com`, Phone: `214-555-0144`)
  - *Receipt Content:* Inquiring to speak with studio ownership regarding contract terms.
- **Receipt #5 (Urgent Threat to Terminate / Churn Signal):**
  - *Receipt ID:* Email in `messages.txt` line 189
  - *Sender:* `alana@hillcrestpt.com` | *Timestamp:* `2026-10-03 14:22 CST`
  - *Receipt Content:* *"We need to talk about the contract this week."*

#### Action Protocol for This Week (Exact Execution Receipts):
- **Receipt 4a (Executive Conciliation):** Owner Zaid personally calls Dr. Alana Ibarra and Leah Reed on Monday morning at 9:00 AM. Acknowledge and apologize for the dropped revision notes and compliance errors.
- **Receipt 4b (Emergency Re-Render):** Reassign `V049` and `V135` from Eli to senior editor Ali to re-render compliant title cards reading `"Hillcrest Physical Therapy"` within 24 hours.
- **Receipt 4c (Contract Retention & Cash Release):** Deliver compliant 4K master renders by Tuesday; secure 12-month retainer renewal before releasing polite payment reminder for overdue invoices `INV-1116` ($2,500) and `INV-1144` ($2,500).

```
========================================================================================
       QUESTION 5: WHICH MARKETING CHANNEL BRINGS THE MOST PROFITABLE CLIENTS?
                   WHAT CAN'T YOU TELL FROM THIS DATA?
                   (ANSWERED EXCLUSIVELY VIA RECEIPT AUDIT TRAIL)
========================================================================================
```
### Most Profitable Channel: Referral (Word of Mouth / Direct Local Referrals)

#### Forensic Proof Trail (Exact Receipt Numbers):
- **Receipt #1 (Channel Win-Rate Audit across all 98 Leads in `leads.csv`):**
  - *Referral Receipt:* 12 Leads (`L003`, `L012`, `L019`, `L027`, `L034`, `L045`, `L058`, `L069`, `L074`, `L086`, `L091`, `L095`) -> **11 Won Bookings = 91.7% Conversion Win Rate**.
  - *Google Ads Receipt:* 28 Leads -> 8 Won Bookings = **28.6% Conversion Win Rate** (High drop-off and price resistance).
  - *Instagram Receipt:* 24 Leads -> 6 Won Bookings = **25.0% Conversion Win Rate**.
  - *Direct / Website Form Receipt:* 22 Leads -> 4 Won Bookings = **18.2% Conversion Win Rate**.
  - *Walk-In / Event Receipt:* 12 Leads -> 3 Won Bookings = **25.0% Conversion Win Rate**.
- **Receipt #2 (Revenue & LTV Receipts across `invoices.csv` & `payments.csv`):**
  - *Referral Revenue:* Generated **USD 41,400.00 Invoiced** and **USD 33,900.00 Collected Cash** (40.7% of all studio bank deposits!).
  - *Referral LTV Proof:* Referral clients convert into long-term monthly retainer contracts:
    - Lead `L003` (Dr. Adeyemi, referred by Dallas Bar Association) -> `B003` -> **USD 9,750.00 Paid to Date**.
    - Lead `L012` (Bayou Wealth Management, referred by client) -> `B012` -> **USD 10,000.00 Paid to Date**.
  - *Acquisition Cost Proof:* Referral Customer Acquisition Cost (CAC) = **USD 0.00**, delivering virtually 100% gross acquisition margin.

#### What This Data CANNOT Tell Us (Data Receipts of Missing Information):
- **Receipt 5a (Missing Paid Ad Spend):** `costs.csv` only records labor hourly rates (Director $60/hr, Audio $35/hr, Camera $40/hr, Editor $28-$45/hr). It contains **USD 0.00 ad spend data** for Google Ads or Meta Ads, making true paid CAC and ROAS uncomputable from files alone.
- **Receipt 5b (Missing Fixed Overhead):** `costs.csv` lacks studio facility rent, Dallas utility bills, gear depreciation (cameras, lenses, studio podcast mics), cloud storage, Adobe Creative Cloud software licenses, and insurance.
- **Receipt 5c (Missing Owner Non-Billable Time):** Non-billable administrative hours spent by owner Zaid on client sales calls, scheduling shoots, drafting invoices, and answering messages are completely unlogged.
- **Receipt 5d (Missing Structured Retention/CSAT):** Formal client contract terms, cancellation/reschedule penalty policies, and structured client satisfaction metrics (NPS/CSAT) do not exist in the files.

```
========================================================================================
       QUESTION 6: YOU'RE THE OWNER ON MONDAY MORNING.
                   WHAT ARE THE FIRST 3 THINGS YOU DO? WHY THOSE 3?
                   (ANSWERED EXCLUSIVELY VIA RECEIPT AUDIT TRAIL)
========================================================================================
```

#### Action 1: Client Rescue Call to Save USD 30,000 Annual Retainer & Collect USD 5,000 Delinquent Cash
- **Receipt Numbers:**
  - Message Receipt: `2026-10-03 14:22 CST` email (*"We need to talk about the contract this week"*).
  - Lead Receipt: `L097` (`2026-09-29 16:45 CST` by Leah Reed).
  - Withheld Invoice Receipts: `INV-1116` ($2,500.00, 21d overdue) and `INV-1144` ($2,500.00, unpaid).
  - Production Card Receipts: `V049` & `V135` (compliance title errors).
- **Execution:** Call Dr. Alana Ibarra and Leah Reed at 9:00 AM. Reassign `V049`/`V135` to senior editor Ali for 24-hour delivery of compliant title cards.
- **Why First:** Retention precedes acquisition. Losing a $2,500/month client destroys $30,000/year in annual recurring revenue.

#### Action 2: Issue Invoices for USD 8,210.00 in Delivered Work & Void Duplicate Invoice INV-1138
- **Receipt Numbers:**
  - Unbilled Shoot Receipts: Missed May retainers `B020` ($2,500) and `B024` ($2,500); plus completed delivered shoots `B080` ($900), `B038` ($270), `B083` ($270), `B131` ($270), `B132` ($1,500) = Total **USD 8,210.00**.
  - Prepayment Receipt: `P5121` ($1,500 wire on `2026-09-28` for cancelled `B142`) re-linked to completed rescheduled shoot `B154` (`2026-10-05`).
  - Void Receipt: Duplicate `INV-1138` ($1,500) voided to prevent double-billing.
- **Execution:** Dispatch 7 invoices immediately in the billing tool; apply credit memo to Blue Bonnet Realty.
- **Why Second:** Immediately unlocks USD 8,210.00 in cash flow for work already completed and delivered, with zero additional production labor, while eliminating customer friction on Blue Bonnet.

#### Action 3: Reply to 15 Unanswered Human Leads & Clear Production Board Zombie Tasks
- **Receipt Numbers:**
  - High-Intent Lead Receipts: `L087` (Existing client Mia Torres booking new session), `L097` (Leah Reed contract review), and `L086` (Victor Vega, warm client referral).
  - Zombie Board Task Receipts: `V121` (River City Auto, approved `2026-07-17`, stranded 81 days) and `V152` (The Ridgeway Lab, approved `2026-07-25`, stranded 73 days).
- **Execution:** Reply to `L087`, `L097`, and `L086` by 11:00 AM; move `V121` and `V152` cards from `In revision` to `Delivered`, triggering billing settlement.
- **Why Third:** Existing clients and warm referrals convert at over 90% win rate; clearing zombie tasks completes the production pipeline and unblocks accounting.

---

```
========================================================================================
                               END OF PRESENTATION DECK
                LIVE SYSTEM URL: https://axeom-challenge-five.vercel.app
========================================================================================
```


