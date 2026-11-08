# Official Video Presentation Script & System Walkthrough Guide (Pack 175)

- **Presenter:** Muhammad Abu Huraira (Computer Science Graduate)
- **Email:** `huraira.eqeel@gmail.com`
- **Challenge Pack ID:** Pack 175
- **Business Reference Date ("Today"):** Tuesday, October 6, 2026
- **Live Production URL:** `https://axeom-challenge-five.vercel.app`
- **GitHub Repository:** `https://github.com/hurairamuzammal/axeom-challenge-pack-175`
- **Target Video Duration:** 6 to 8 minutes
- **Recording Format:** Single-take recording. Screen share showing the live app on Vercel, followed by camera-on answering the core challenge questions.

---

## Part 1: Introduction of Presenter & Problem Statement (0:00 – 1:00)

**[Screen: Title Slide / Face Camera on Screen]**

"Hello everyone. My name is Muhammad Abu Huraira. I am a Computer Science graduate, and today I am presenting the operations, data reconciliation, and financial recovery platform I engineered for Axeom Studio, Pack 175.

Our business reference date today is strictly Tuesday, October 6, 2026.

Axeom is a high-demand creative video and podcast studio in Dallas, Texas. On the surface, the business looks successful: they generated USD 103,890.00 in invoices and collected USD 83,390.00 in bank deposits. 

However, behind that rapid growth, the studio is suffering from severe operational breakdowns. Creative work is delivered without being billed, invoices are sent for shoots clients already paid for, and client feedback sent through WhatsApp, Instagram, and audio voice notes gets lost in transit before reaching the editing room.

As a computer science graduate, I treated this not as a static accounting report, but as a systems engineering challenge: unifying disconnected operational silos into an automated, deterministic pipeline."

---

## Part 2: How I Divided the 72 Hours (1:00 – 2:00)

**[Screen: 72-Hour Timeline Diagram or Slide]**

```
72-HOUR TIMELINE & DEVELOPMENT BREAKDOWN
════════════════════════════════════════════════════════════════════════════════
DAY 1 (Hours 0 – 24): Ingestion, Data Hygiene & Identity Resolution
┌──────────────────────────────────────────────────────────────────────────────┐
│ • Audited all 8 raw files line-by-line without modifying original files.    │
│ • Diagnosed European DD/MM/YYYY date formatting in payments.csv.             │
│ • Quarantined 4 bot/crypto spam leads in an audit log without data loss.     │
│ • Deduplicated 72 raw names into 29 true client accounts + 1 agency payer.   │
└──────────────────────────────────────────────────────────────────────────────┘

DAY 2 (Hours 24 – 48): Financial Reconciliation & Production Board Sync
┌──────────────────────────────────────────────────────────────────────────────┐
│ • Reconciled 122 bank payments (USD 83,390) against 138 invoices.           │
│ • Discovered USD 8,210.00 in unbilled work across 7 completed shoot sessions.│
│ • Solved the Blue Bonnet Realty prepayment guard (USD 0.00 cash owed).       │
│ • Integrated TypeSafe AI Jev (docs.typesafe.ai) for System One message sync. │
└──────────────────────────────────────────────────────────────────────────────┘

DAY 3 (Hours 48 – 72): Reactive Web Platform, UI Architecture & Automated Tests
┌──────────────────────────────────────────────────────────────────────────────┐
│ • Built the reactive web app with 6 top hero tiles and 0 wasted void space.  │
│ • Designed compact, responsive video cards (250px mobile to 1920px desktop). │
│ • Added 6-stage sequential lifecycle drawers with exact timestamps.          │
│ • Wrote 31 automated unit and stress tests (100% passing) and deployed live. │
└──────────────────────────────────────────────────────────────────────────────┘
```

"I divided my 72 hours into three disciplined 24-hour sprints:

1. **Day 1 (Hours 0 to 24): Ingestion, Data Hygiene & Identity Resolution**  
   I conducted an exhaustive audit of all 8 raw CSV and text files. I identified that `payments.csv` was recorded in European DD/MM/YYYY format, quarantined 4 spam leads, resolved `.con` email typos, and deduplicated 72 inconsistent client names down to 29 true client accounts plus 1 third-party agency payer.

2. **Day 2 (Hours 24 to 48): Financial Reconciliation & Production Board Sync**  
   I reconciled 122 bank deposits against invoices using a 4-pass engine. I uncovered USD 8,210.00 in completed shoots that were delivered but never invoiced, caught 6 billing tool sync errors, and integrated TypeSafe AI Jev as a System One decision model to automatically rescue lost voice notes.

3. **Day 3 (Hours 48 to 72): Reactive Web Platform, UI Architecture & Testing**  
   I engineered the production web application. I eliminated empty void space on video cards across all screen resolutions (250px to 1920px), built the 6-stage operational stepper drawer, wrote 31 automated test cases, and deployed the live app to Vercel."

---

## Part 3: The Proposed Ideal System Architecture (2:00 – 3:30)

**[Screen: Architectural Flowchart or Bullet Points]**

"To ensure Axeom never suffers from these operational crises again, I architected an **Ideal 6-Pillar System** to prevent errors right at the point of entry:

### Pillar 1: Automated Spam Detector at Lead Intake
- **The Problem:** Russian bot spam (`.ru`) and crypto solicitations entered the CRM, inflating lead counts and wasting sales time.
- **The Solution:** A gatekeeping spam detector at form submission that quarantines malicious bots into a Spam Review queue, while whitelisting valid boutique client domains like `.coffee`, `.build`, `.fm`, and `.co`.

### Pillar 2: Unified Primary ID Architecture
- **The Problem:** Records were linked by loose text names, causing cross-file confusion.
- **The Solution:** Every entity receives an immutable primary key right from creation: `lead_id`, `booking_id`, `video_id`, `invoice_no`, and `payment_id`. All downstream actions must inherit this ID.

### Pillar 3: WhatsApp & Instagram Bots for Revision Intake
- **The Problem:** Clients sent revision requests across WhatsApp, Instagram DMs, personal emails, and audio voice notes. 78% of production cards had blank notes, and editor Eli had 0 notes logged on 106 videos!
- **The Solution:** An automated intake bot on WhatsApp and Instagram. When a client requests an edit:
  1. The bot asks for their **Invoice No, Video ID, or verified email**.
  2. The bot verifies their account and checks who the assigned editor is.
  3. Powered by TypeSafe AI Jev, the bot transcribes audio voice notes and routes the instruction **directly onto that editor's card on the production board**. No instructions are ever lost in transit again.

### Pillar 4: Standardized Onboarding & Strict Dropdown Selection
- **The Problem:** Staff entered 72 different surface names for 29 clients (`Torres Dental` vs `Torres Dental PLLC` vs `Nina Torres`, plus email typos like `torresdental.con`).
- **The Solution:** Clients are onboarded once in the master directory. From that point forward, anyone using the system—sales, booking, editing, or billing—**must select the client from a validated dropdown menu**. Free-text client name typing is disabled, eliminating typos forever.

### Pillar 5: Pre-Invoice Balance Check Guard (Zero Overbilling)
- **The Problem:** Blue Bonnet Realty prepaid USD 1,500 for cancelled shoot B142. The shoot was rescheduled to B154 and delivered, but staff issued duplicate invoice INV-1138 for USD 1,500 without checking if they had already paid!
- **The Solution:** A mandatory pre-billing guard. Before any invoice draft can be sent, the system automatically checks the client's ledger for unapplied credits and prepaid funds. If prepaid, the balance is linked and invoice is marked settled at USD 0.00, preventing embarrassing double-billing.

### Pillar 6: Automated Dunning & Payment Reminders
- **The Problem:** USD 15,850 in invoices was sitting past due for up to 57 days because nobody followed up systematically.
- **The Solution:** Automated dunning workflows. Polite reminders are sent 3 days before net-terms expire, on the due date, and structured dunning notices are triggered at 7, 14, and 30 days past due."

---

## Part 4: Live Application Walkaround (3:30 – 5:30)

**[Screen Share: `https://axeom-challenge-five.vercel.app`]**

"Now, let us switch over to the live application running on Vercel at `axeom-challenge-five.vercel.app`.

### 1. The 6 Top Hero Metric Tiles
Look at the top of the screen. In under 10 seconds, the studio owner can read the entire operational radar:
- **Videos (344):** All 344 videos on our production board.
- **Clients (30):** 29 true operational clients plus agency payer Fieldhouse Marketing.
- **Overdue Debt (USD 15,850):** Total delinquent cash from 8 overdue invoices past their net terms.
- **Never Billed (USD 8,210):** Trapped creative work from 7 completed shoots that were never invoiced!
- **Pre-Check Guard (USD 0.00 Owed):** Confirms Axeom owes zero cash to Blue Bonnet Realty because the rescheduled shoot was already delivered and paid.
- **Decisions & Audit (8 Files):** Interactive dependency graph tracking every decision made across all 8 files.

### 2. Compact Video Cards & Unbilled Work Detection
[CLICK 'NEVER BILLED' HERO TILE]
When I click the **Never Billed** tile, the system immediately switches to our video view and filters down to the 12 delivered unbilled videos!

Notice the design of these video cards:
- They are compact and dense—no wasted black void space.
- On a 1920px screen, it renders 6 clean columns (`2xl:grid-cols-6`). On mobile, it adjusts seamlessly.
- Each card displays the video ID (e.g. `V167`), editor hours (`⏱ 3.8h edit`), client name (`Luna Roofing`), and shoot date.
- Crucially, notice the warning badge: **`Action Needed: Unbilled (USD 900)`** with an amber border! The owner immediately knows this work was delivered for free until an invoice is issued.

### 3. The 6-Stage Operations Drawer Stepper
[CLICK VIDEO CARD V167]
When I click on video `V167`, the operational drawer opens, displaying our complete 6-stage sequential stepper:
- **Stage 1 (Booked):** Location shoot `B080` booked July 20, 2026.
- **Stage 2 (Editor Cut):** Assigned to Rita, 3.8 hours logged.
- **Stage 3 (Client Intake):** Client feedback synced directly to the card.
- **Stage 4 (Approval):** Client sign-off confirmed.
- **Stage 5 (Billing):** Displays `[MISSING INVOICE DATE - NEVER BILLED]` with a 3-column ledger: Total Invoiced (USD 900), Amount Received (USD 0.00), Net Outstanding (USD 900). With one click, the owner can click **`Generate Draft Invoice (USD 900.00)`**!
- **Stage 6 (Ledger Settlement):** Tracks bank settlement status.

### 4. Stuck Task Detection (V121 & V152)
[CLICK 'STUCK (2)' FILTER PILL]
Notice videos `V121` and `V152`. Clients officially signed off and approved these cuts back in July 2026, but the board cards were abandoned in 'In revision' for over 70 days! Our system detects this bottleneck and provides a one-click button: **`Resolve: Mark Delivered & Close Ticket`**.

### 5. Retainer Advance Billing & Exact Paid-to-Date
[CLICK 'CLIENTS' TAB -> SELECT 'ADEYEMI LAW FIRM']
For monthly retainer clients like Adeyemi Law Firm, Bayou Wealth Partners, and Hillcrest PT, our system clearly displays:
- **Schedule:** Billed in advance at the **start of each calendar month (1st of month)**.
- **Exact Amount Paid to Date:** Computed dynamically from verified bank receipts:
  - **Adeyemi Law Firm:** Total Paid = **USD 9,750.00** (4 advance payments)
  - **Bayou Wealth Partners:** Total Paid = **USD 10,000.00** (4 advance payments)
  - **Hillcrest Physical Therapy:** Total Paid = **USD 7,500.00** (3 advance payments)

### 6. Pre-Check Balance Guard for Blue Bonnet Realty
[CLICK 'PRE-CHECK' TAB]
Here is our Pre-Check Balance Guard. Blue Bonnet Realty prepaid USD 1,500 via bank wire P5121 for shoot B142. The shoot was rescheduled to B154 and delivered October 5. Staff mistakenly generated duplicate invoice INV-1138. Our guard voids INV-1138, links the prepaid funds to B154, and confirms **USD 0.00 cash owed**!"

---

## Part 5: Direct Answers to the 6 Core Challenge Questions (5:30 – 7:30)

**[Camera on Presenter — Clear, Confident Delivery]**

"Now, I will directly answer the 6 core questions from the challenge brief, backing every finding with explicit data receipts:

### Question 1: Who are our real clients? How many, and who are they?
**Answer:**  
Axeom has **29 real client businesses** (+ 1 third-party agency payer). Staff recorded 72 different surface name variants across the CSVs. 
- **The Agency Payer Receipt:** `Fieldhouse Marketing` (`tanya@fieldhousemktg.com`) is not a video client. Fieldhouse is a third-party payer settling invoices for two separate medical clinics: `Vista Pediatrics` (`INV-1121`, USD 2,700) and `Parkside Chiropractic` (`INV-1126`, USD 2,700).
- **Anti-Merge Guard Receipts:** Three individuals operate multiple distinct legal entities:
  1. Alana Ibarra operates `Hillcrest Physical Therapy` (medical) AND `Bayou Wealth Management` (finance).
  2. Tasha Torres operates `Torres Dental PLLC` AND `Luna Roofing`.
  3. Nolan Nguyen operates `Brightwater` (construction) AND `Bluebonnet Realty Group` (real estate).
  Our relational engine prevents naive deduplication from falsely merging these distinct legal accounts.

---

### Question 2: Money. Who owes us? Do we owe anyone? Did we do work we never billed? Where is the billing tool wrong? Give totals.
**Answer:**  
Here is our reconciled financial audit as of October 6, 2026:
- **Who Owes Us (Overdue Invoices): USD 15,850.00** across 8 invoices (with USD 8,570.00 strictly past invoice due dates). Key receipts: `INV-1099` & `INV-1100` ($3,000, Apex Fitness, 46 and 38 days overdue); `INV-1116` & `INV-1144` ($5,000 withheld by Hillcrest PT); `INV-1121` ($2,700 Vista Pediatrics); `INV-1126` ($2,700 Parkside Chiropractic); `INV-1133` ($1,500 Apex Fitness); and `INV-1134` ($900 The Ridgeway Lab).
- **Do We Owe Anyone: USD 0.00 Cash Owed.** Cancelled shoot `B142` for Blue Bonnet Realty was rescheduled to `B154` and successfully delivered October 5. Blue Bonnet's prepaid USD 1,500 wire `P5121` was applied to `B154`, and duplicate invoice `INV-1138` was voided. Axeom owes zero cash refunds.
- **Work We Never Billed: USD 8,210.00** across 7 completed shoots (12 delivered cuts): missed May retainers `B020` ($2,500) and `B024` ($2,500); delivered reels pack `B080` ($900); delivered podcast shoots `B038` ($270), `B083` ($270), `B131` ($270); and commercial content shoot `B132` ($1,500).
- **Billing Tool Sync Errors:** 6 invoices marked `unpaid` that were already settled in bank receipts (`INV-1066`, `INV-1077`, `INV-1083`, `INV-1084`, `INV-1105`, `INV-1126`), 1 invoice marked `paid` with $0 bank deposit (`INV-1110`), and duplicate invoice `INV-1138`.

---

### Question 3: Why do client requests get lost? Since when? Prove it with the data.
**Answer:**  
- **Root Causes:** Unstructured messages (WhatsApp, Instagram DMs, email, and 6 audio voice notes) arrive outside the production board; onboarding failure with junior editor Eli who logged 0 notes on cards; and zombie tasks left in `In revision` despite client approval.
- **Since When:** **July 2026** (specifically July 3, 2026, when Eli joined).
- **Data Proof Receipts:** 78.2% of all 202 board cards have completely empty notes. Eli logged 0 notes across all 106 assigned cards (0.0% coverage), averaging 6.30 hours per cut (+48% higher than Rita's 4.26h) and a 65.4% revision rate. In contrast, senior editor Rita maintained 100% note coverage and a 15.2% revision rate.

---

### Question 4: Which client is most likely to leave us? What would you do about it this week?
**Answer (Backed Exclusively by Data Receipts):**  
**Client:** **Hillcrest Physical Therapy** (Dr. Alana Ibarra & Leah Reed).
**Data Receipts Proving Churn Risk:**
- **Receipt #1 (Audio Voice Note):** On `2026-09-02 14:15 CST`, Dr. Alana Ibarra left a voice note on `B024` / `V049`: *"Please make sure the title card says Hillcrest Physical Therapy, not Hillcrest PT. We have strict healthcare compliance rules."* Lost in transit; never entered on Eli's card.
- **Receipt #2 (Email Non-Compliance Notice):** Message line 142 on `2026-09-08 11:14 CST`: *"I noticed the new render still says Hillcrest PT. We cannot publish this. Please fix it immediately."* Ignored.
- **Receipt #3 (Financial Retaliation):** `INV-1116` ($2,500, 21d overdue) and `INV-1144` ($2,500, unpaid). Client deliberately stopped paying retainer! USD 5,000 cash withheld; USD 30,000 annual contract at stake.
- **Receipt #4 (Escalation Lead Form):** Lead `L097` submitted `2026-09-29 16:45 CST` by Leah Reed requesting contract discussion.
- **Receipt #5 (Urgent Churn Signal):** Email line 189 on `2026-10-03 14:22 CST`: *"We need to talk about the contract this week."*
**Action This Week (Execution Receipts):**
- Owner Zaid calls Dr. Alana Ibarra and Leah Reed Monday at 9:00 AM to apologize.
- Reassign `V049` and `V135` to senior editor Ali to re-render compliant title cards within 24 hours.
- Deliver compliant masters by Tuesday; secure contract renewal before releasing payment reminders.

---

### Question 5: Which marketing channel brings the most profitable clients? What can't you tell from this data?
**Answer (Backed Exclusively by Data Receipts):**  
**Most Profitable Channel:** **Referral** (Word of Mouth / Direct Local Referrals).
**Data Receipts Proving Profitability:**
- **Receipt #1 (Lead Conversion Audit across 98 Leads in `leads.csv`):**
  - **Referral:** 12 leads (`L003`, `L012`, `L019`, `L027`, `L034`, `L045`, `L058`, `L069`, `L074`, `L086`, `L091`, `L095`) -> **11 Won Bookings = 91.7% Conversion Win Rate**.
  - Compared to Google Ads (28.6% win rate), Instagram (25.0%), and Website Forms (18.2%).
- **Receipt #2 (Revenue & LTV Receipts across `invoices.csv` & `payments.csv`):**
  - Referrals generated **USD 41,400.00 invoiced** and **USD 33,900.00 collected bank cash** (40.7% of all studio cash collected).
  - Referral clients convert into high-LTV retainer accounts: Dr. Adeyemi (`L003`) = USD 9,750.00 paid to date; Bayou Wealth (`L012`) = USD 10,000.00 paid to date.
  - Referral Customer Acquisition Cost (CAC) = **USD 0.00**, delivering ~100% gross acquisition margin.
**What This Data CANNOT Tell Us (Receipts of Missing Data):**
- **Receipt 5a (Zero Ad Spend Recorded):** `costs.csv` only logs labor rates; it contains **USD 0.00 ad spend** for Google Ads or Meta Ads, making true paid CAC and ROAS impossible to calculate from data alone.
- **Receipt 5b (Missing Fixed Overhead):** Facility rent, studio utility bills, Sony FX3 gear depreciation, cloud storage, Adobe CC licenses, and insurance are unrecorded.
- **Receipt 5c (Missing Owner Hours):** Non-billable administrative hours spent by owner Zaid on sales, scheduling, and billing are unlogged.
- **Receipt 5d (Missing Formal Contracts & CSAT):** Formal cancellation penalties and NPS satisfaction scores do not exist in the files.

---

### Question 6: You're the owner on Monday morning. What are the first 3 things you do? Why those 3?
**Answer (Backed Exclusively by Data Receipts):**  
**Action 1: Client Rescue Call to Save USD 30,000 Retainer & Recover USD 5,000 Delinquent Cash.**
- *Receipts:* `2026-10-03` email (*"We need to talk about the contract this week"*), Lead `L097`, withheld invoices `INV-1116` ($2,500) and `INV-1144` ($2,500), and card errors on `V049`/`V135`.
- *Execution:* Call Dr. Alana Ibarra and Leah Reed at 9:00 AM; dispatch 24-hour compliant re-renders via senior editor Ali.
- *Why First:* Retention precedes acquisition. Saving a $2,500/month retainer protects $30,000 ARR.

**Action 2: Issue Invoices for USD 8,210.00 in Delivered Work & Void Duplicate Invoice INV-1138.**
- *Receipts:* Unbilled shoot receipts `B020` ($2,500), `B024` ($2,500), `B080` ($900), `B038` ($270), `B083` ($270), `B131` ($270), `B132` ($1,500); prepayment `P5121` linked to completed `B154`; duplicate `INV-1138` ($1,500) voided.
- *Execution:* Dispatch 7 invoices immediately in billing tool; apply credit memo to Blue Bonnet Realty.
- *Why Second:* Immediately captures USD 8,210.00 in cash flow for work already completed, with zero incremental production cost.

**Action 3: Reply to 15 Unanswered Human Leads & Clear Production Board Zombie Tasks.**
- *Receipts:* High-intent lead receipts `L087` (Mia Torres booking new session), `L097` (Leah Reed), and `L086` (Victor Vega, warm referral); zombie board tasks `V121` (approved July 17) and `V152` (approved July 25).
- *Execution:* Reply to `L087`, `L097`, and `L086` by 11:00 AM; move `V121` and `V152` from `In revision` to `Delivered`, unlocking billing.
- *Why Third:* Existing clients and warm referrals convert at over 90% win rate; clearing zombie tasks completes the production pipeline.

---

### Camera-On Reflection Questions:
- **Hardest Part:** Multi-channel identity resolution without creating false merges (separating shared contacts Alana Ibarra, Tasha Torres, Nolan Nguyen operating separate companies, while isolating agency payer Fieldhouse Marketing).
- **What I Got Wrong at First:** The Blue Bonnet Realty cash refund trap (mistaking cancelled B142 for a refund liability, when it was rescheduled and delivered as B154, with duplicate INV-1138 needing voiding) and European `DD/MM/YYYY` date format transpositions in `payments.csv`.

---

## Part 6: Outro & Conclusion (7:30 – 8:00)

**[Screen: Live App & GitHub Repository]**

"All test cases, automated pipelines, and financial models are verified with 31 passing unit tests and deployed live to production on Vercel at `axeom-challenge-five.vercel.app`.

Thank you for your time and consideration."
