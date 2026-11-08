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

## Part 5: Direct Answers to the Core Challenge Questions (5:30 – 7:30)

**[Camera on Presenter — Clear, Confident Delivery]**

"Now, I will directly answer the core questions posed in the challenge brief:

### Question 1: What was the hardest part of the challenge, and how did you solve it?
**Answer:**  
The hardest part was **multi-channel identity resolution without creating false merges**.

In the raw files, staff entered 72 different surface names for what turned out to be 29 true clients. But the data contained two deceptive traps:
1. First, clients pay and book under different names and emails. Mia Torres booked under `Heart & Hustle Radio` with her work email, but paid via personal Zelle from `mia.torres.mail@gmail.com`. And `Fieldhouse Marketing` was paying on behalf of two separate medical clinics (`Vista Pediatrics` and `Parkside Chiropractic`) without being a video client themselves.
2. Second, three individuals—Alana Ibarra, Tasha Torres, and Nolan Nguyen—each manage **two completely separate legal companies** with different phone numbers and websites. If you use naive name-matching, you accidentally merge Brightwater Builders and Bluebonnet Realty into one company!

I solved this by building a **3-tier identity graph**:
- **Tier 1:** Verified contact anchors (phone numbers, web domains, business registries).
- **Tier 2:** Strict entity guardrails that isolate individuals operating multiple businesses.
- **Tier 3:** Agency payer isolation, ensuring Fieldhouse Marketing's wire transfers route directly to the respective clinic balances.

---

### Question 2: What did you get wrong at first?
**Answer:**  
I got two significant things wrong at first:

1. **The Blue Bonnet Realty Cash Refund Trap:**  
   Initially, seeing cancelled shoot B142 and the USD 1,500 wire payment P5121, it looked like Axeom owed Blue Bonnet a USD 1,500 cash refund.  
   When I examined the messages and bookings chronologically, I realized the shoot was rescheduled to October 5 as B154 and delivered! Blue Bonnet had already paid. The true error was that Axeom generated a second, duplicate invoice `INV-1138` for USD 1,500 without checking their prepaid status. Axeom owes USD 0.00 in cash. We simply needed to void duplicate invoice INV-1138 and apply the prepayment to B154.

2. **European Date Format Transposition:**  
   Standard US date parsers read `payments.csv` using MM/DD/YYYY formatting. This scrambled payments from July and August into non-existent months or future dates because `payments.csv` was recorded in European DD/MM/YYYY format. I caught this when bank deposits appeared out of order, and solved it by enforcing strict dual-format date parsing across file types.

---

### Question 3: What would you tell the studio owner to stop doing immediately?
**Answer:**  
I would tell Zaid to stop doing three things immediately:

1. **Stop issuing invoices without a Pre-Check Balance Guard:**  
   Sending duplicate invoice INV-1138 to Blue Bonnet for a shoot they already paid for damages client trust. Every invoice must automatically verify prepaid deposits first.
2. **Stop accepting client revisions across fragmented personal chats:**  
   Allowing revisions across WhatsApp, Instagram, and voice notes meant 78% of production cards had empty notes. Junior editor Eli had 0 notes logged across 106 videos, and Gloria Reed at Hillcrest PT withheld USD 5,000 because compliance branding was ignored twice. Axeom must mandate a single automated intake bot powered by Jev.
3. **Stop delivering finished creative work without billing it:**  
   Axeom delivered 2 May retainers worth USD 5,000 and 5 completed video shoots worth USD 3,210 that were never invoiced. That is USD 8,210.00 in free labor simply because nobody checked unbilled bookings.

---

### Question 4: What is the total overdue debt owed to Axeom as of October 6, 2026?
**Answer:**  
As of October 6, 2026, clients owe Axeom a total of **USD 15,850.00** across 8 delinquent invoices:
- `INV-1099` (USD 900.00) & `INV-1100` (USD 2,500.00) — Torres Dental (57 days past due)
- `INV-1116` (USD 2,500.00) & `INV-1117` (USD 2,500.00) — Hillcrest Physical Therapy (43 days past due)
- `INV-1121` (USD 1,500.00) — Brightwater (29 days past due)
- `INV-1122` (USD 1,450.00) — Beacon Med Spa (29 days past due)
- `INV-1127` (USD 2,500.00) — Dr. Priya Haddad (22 days past due)
- `INV-1132` (USD 2,000.00) — Prime Barbershop (15 days past due)

---

### Question 5: What is the unbilled revenue leak, and which shoots were delivered?
**Answer:**  
Axeom completed 7 shoot sessions totaling **USD 8,210.00** that were delivered but NEVER invoiced:
- `B020` (USD 2,500.00 May retainer shoot for Adeyemi Law Firm) — Videos `V026` & `V029` delivered.
- `B024` (USD 2,500.00 May retainer shoot for Hillcrest PT) — Videos `V037`, `V038`, `V039`, `V040` delivered.
- `B080` (USD 900.00 Reels Pack for Luna Roofing) — Videos `V167`, `V168`, `V169` delivered.
- `B132` (USD 1,500.00 Content Day for Brightwater) — Videos `V291`, `V292`, `V294` delivered.
- `B038`, `B083`, `B131` (USD 270.00 each for Crown Church podcast studio sessions).

By deploying our platform, Axeom immediately recovers USD 8,210.00 in unbilled work, collects USD 15,850.00 in overdue debt, and eliminates duplicate billing forever."

---

## Part 6: Outro & Conclusion (7:30 – 8:00)

**[Screen: Live App & GitHub Repository]**

"All test cases, automated pipelines, and financial models are verified with 31 passing unit tests and deployed live to production on Vercel at `axeom-challenge-five.vercel.app`.

Thank you for your time and consideration."
