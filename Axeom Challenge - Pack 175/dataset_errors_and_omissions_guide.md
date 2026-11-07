# Axeom Dataset Errors, Omissions & Discrepancies Master Guide

> **Purpose:** This document is your comprehensive operational handbook detailing every missing value, data format conflict, duplicate record, accounting error, and cross-file breakdown identified across the 8 Axeom raw data files.  
> **Reference Date:** October 6, 2026  
> **Core Rule:** Raw data files remain strictly read-only and immutable. All fixes are applied in Cleaned and Reconciled layers.

---

## Quick Reference Summary Table

| Dataset | Total Records | Primary Key | Key Deficiencies & Missing Fields | Business Severity |
|---|---|---|---|---|
| **`leads.csv`** | 98 rows | `lead_id` | 4 bot spams; 19 unreplied leads; 1 future date (`L098`); 1 status contradiction (`L068`); 11 blank businesses; 4 blank phones. | **Critical** (Lost revenue, distorted channel conversion) |
| **`bookings.csv`** | 168 rows | `booking_id` | Mixed currency formats ($ / commas); US date format (`MM/DD/YYYY`); 72 name variants across 33 emails; 1 email typo (`.con`); 22 $0 retainer shoots; 1 cancelled shoot (`B142`); 5 unbilled sessions. | **Critical** (Unbilled labor, agency payer confusion) |
| **`invoices.csv`** | 151 rows | `invoice_no` | 41 missing memos (27.2%); 6 false "unpaid" invoices; 1 out-of-order void (`INV-1151`); 1 paid invoice for cancelled shoot (`INV-1131`); 1 partial invoice (`INV-1121`). | **Critical** (Misstated receivables, false debt claims) |
| **`payments.csv`** | 122 rows | `payment_id` | European date format (`DD/MM/YYYY`); 2 missing payer emails; 23 blank references; 6 text-memo/bulk payments; $2,830 surplus cash unaccounted by billing tool. | **Critical** (Date corruption risk, unlinked bank deposits) |
| **`production_board.csv`** | 344 rows | `video_id` | 269 blank board notes (78.2%); 84 unlinked shoot bookings (24.4%); 126 delivered without client sign-off (41.3%); 2 zombie revision tasks (`V121`, `V152`); Eli 65% labor penalty. | **Critical** (Root cause of "edits come back wrong" and lost notes) |
| **`messages.txt`** | 200 entries | Line Index | 4 fragmented inboxes; 1 phishing scam; 6 unreviewed audio voice notes; client churn notice (`Bayou Wealth`); prepaid shoot cancellation (`Blue Bonnet`). | **High** (Client churn, unaddressed emergencies) |
| **`team.csv`** | 5 rows | `name` | Blank owner compensation; Eli onboarding date (`2026-07-03`) correlates with revision crisis; Jules hired at $40/hr surge rate. | **Medium** (Labor cost inflation) |
| **`costs.csv`** | 2 rows | `item` | Missing external ad spend data (Google/Meta/LinkedIn); inability to compute Net CAC or ROAS. | **Medium** (Blind marketing attribution) |

---

## 1. `leads.csv` Deep Dive

### 1.1 Structural Profile
- **File:** `Axeom Challenge - Pack 175/data/leads.csv`
- **Dimensions:** 98 rows x 9 columns
- **Date Range:** `2026-03-29 10:57` to `2026-09-30 14:30`
- **Columns:** `lead_id`, `created`, `name`, `business`, `email`, `phone`, `source`, `first_reply`, `status`

### 1.2 Missing Fields
- **`phone` (4 blank rows):** `L052`, `L063`, `L081`, `L089`.  
  *Finding:* Every legitimate human inquiry submitted a phone number. Exactly 4 rows lack a phone number, and all 4 are confirmed web-form bot spam.
- **`business` (11 blank rows):** `L012`, `L050`, `L052`, `L063`, `L065`, `L078`, `L081`, `L087`, `L088`, `L089`, `L095`.  
  *Finding:* 4 are bot spam; 7 are individuals or existing clients submitting personal inquiries (e.g., `L087` = Mia Torres).
- **`first_reply` (19 blank rows):** `L003`, `L007`, `L020`, `L021`, `L026`, `L030`, `L043`, `L046`, `L052`, `L060`, `L063`, `L064`, `L070`, `L075`, `L081`, `L086`, `L087`, `L089`, `L097`.  
  *Finding:* 4 are spam. The remaining **15 records are genuine prospective clients who were never answered** (including referral lead Victor Vega `L086` and existing client Mia Torres `L087`).

### 1.3 Confirmed Web-Form Spam Submissions
1. `L052`: Name: `"SEO Services"`, Email: `seo@rank1seo.biz`, Phone: `""`, Source: `Website form`
2. `L063`: Name: `"Free followers"`, Email: `promo@fastfollowers.io`, Phone: `""`, Source: `Website form`
3. `L081`: Name: `"test test"`, Email: `test@test.com`, Phone: `""`, Source: `Website form`
4. `L089`: Name: `"Crypto Deals"`, Email: `deals@coin-x.io`, Phone: `""`, Source: `Website form`

### 1.4 Date and Status Inconsistencies
- **Future Reply Date (`L098`):** Darnell Cho (`Cho Family Dentistry`).  
  `created`: `2026-09-30 14:30` | `first_reply`: **`2026-10-07`**  
  *Error:* `first_reply` is dated tomorrow relative to the challenge reference date (`2026-10-06`).
- **Status Contradiction (`L068`):** Erin Tran (`Juniper Med Spa - Frisco`).  
  `created`: `2026-07-27 10:40` | `first_reply`: `2026-07-28` | `status`: **`New`**  
  *Error:* Reply was sent on July 28, but staff forgot to advance the pipeline status from `New` to `Won`/`Talking`.
- **Timestamp vs Date Formatting:** `created` includes hours/minutes (`YYYY-MM-DD HH:MM`), whereas `first_reply` only logs the date (`YYYY-MM-DD`), preventing exact hourly response latency calculations.

### 1.5 Duplicate Inquiries from Existing Clients
- **Nina Torres:** `L006` (Instagram, April 1, Won) and `L040` (Website form, June 1, Won). Same client, repeat inquiry.
- **Mia Torres:** `L001` (H&H Radio, Google, Won) and `L087` (Personal Gmail, Website form, New, unreplied).
- **Luis Sullivan:** `L023` (Maple Fitness, Referral, Won) and `L075` (Maple Athletics, Website form, New, unreplied).
- **Erin Tran:** `L018` (Juniper Med Spa, Referral, Won) and `L068` (Juniper Med Spa - Frisco, Website form, New).

---

## 2. `bookings.csv` Deep Dive

### 2.1 Structural Profile
- **File:** `Axeom Challenge - Pack 175/data/bookings.csv`
- **Dimensions:** 168 rows x 7 columns
- **Date Range:** `04/01/2026` to `10/19/2026`
- **Columns:** `booking_id`, `date`, `client_name`, `email`, `service`, `status`, `price`
- **Completeness:** 0 null cells across all 168 rows.

### 2.2 Formatting Conflicts
- **Date Format Conflict:** Dates are formatted as **`MM/DD/YYYY`** (US slash format, e.g., `04/01/2026`). Differs from `leads.csv` (`YYYY-MM-DD`) and `payments.csv` (`DD/MM/YYYY`).
- **Price Format Inconsistency:**
  - Plain integer: `300`, `900`, `550`, `0` (73 rows)
  - Dollar prefixed: `$300`, `$900`, `$270` (83 rows)
  - Comma formatted: `$1,500` and `1,500` (12 rows)

### 2.3 Surface Name Sprawl (72 Strings vs. 33 Emails)
Staff manually entered names into the calendar, creating massive surface variation:
- `media@crowndfw.org` entered as: `Crown Church`, `Crown DFW`, `Crown Media Team`.
- `greed@hillcrestptdallas.com` entered as: `Hillcrest PT`, `Hillcrest PT Dallas`, `Hillcrest Physical Therapy`.
- `david@priceinsures.com` entered as: `David Price`, `Price Insurance`, `Price Insurance Group`.
- `djackson@bayouwp.com` entered as: `Bayou Wealth`, `Bayou Wealth Partners`, `Bayou WP`.
- `imran@torressautospa.com` entered as: `Torress Auto`, `Torres's Auto`, `Torres's Auto Spa`.

### 2.4 Critical Record Errors
- **Email Typo (`B005`):** `office@torresdental.con` (ends in `.con` instead of `.com`). Must be sanitized to prevent orphaned records.
- **Cancelled Shoot (`B142`):** `09/22/2026`, `Blue Bonnet Realty LLC`, `Content Day`, `price: $1,500`. Client cancelled for family emergency, but invoice `INV-1131` was paid and never credited.
- **Zero-Dollar Retainer Shoots:** 22 records logged with `price = 0` (all service type `Retainer Shoot`). Must not be treated as free services or unbilled errors; they are covered under flat $2,500/month recurring retainer invoices.
- **Completed Work Never Billed (5 Sessions totaling $3,210.00):**
  1. `B038` (2026-06-08): Crown Media Team, 2hr Podcast — **$270.00**
  2. `B080` (2026-07-20): Reggie Ramirez / Luna Roofing, Reels Pack — **$900.00**
  3. `B083` (2026-07-22): Crown DFW, 2hr Podcast — **$270.00**
  4. `B131` (2026-09-10): Crown DFW, 2hr Podcast — **$270.00**
  5. `B132` (2026-09-11): Brightwater & Co Builders, Content Day — **$1,500.00**

---

## 3. `invoices.csv` Deep Dive

### 3.1 Structural Profile
- **File:** `Axeom Challenge - Pack 175/data/invoices.csv`
- **Dimensions:** 151 rows x 8 columns
- **Date Range:** `2026-04-01` to `2026-10-05`
- **Total Invoiced:** $156,080.00 ($122,860 paid, $30,820 unpaid, $900 partial, $1,500 void)
- **Payment Terms:** 100% strict Net-14 terms (`due = issued + 14 days`).

### 3.2 Missing & Defective Fields
- **Missing Memos (41 blank rows / 27.2%):** 41 invoices have no memo string, preventing automated regex-based booking matching.
- **Out-of-Order Void Record (`INV-1151`):** Issued `2026-06-01` for $1,500.00 (Dr. Priya Haddad), but placed at the very end of the file. Status is `void`; must be excluded from receivables.
- **Billed Cancelled Shoot (`INV-1131`):** Memo cites `B142 Content Day` ($1,500.00) for Blue Bonnet Realty. Marked `paid` despite shoot being cancelled. Axeom owes this client $1,500.00.
- **Ambiguous Partial Invoice (`INV-1121`):** Will Moore ($900.00 original). Marked `partial` with no remaining balance listed in billing tool. Bank payment `P5115` confirms $450 received, leaving **$450.00 true overdue balance**.

### 3.3 The 6 False "Overdue" Invoices (Billing Tool Errors)
The billing tool claims 13 invoices are overdue. Bank records prove **6 are already paid in full**:
1. `INV-1083` (Brightwater, $1,500): Tool says *unpaid*; paid via ACH `P5074` on 2026-08-02 (ref: `INV-1083`).
2. `INV-1105` (Crown, $270): Tool says *unpaid*; paid via Zelle `P5100` on 2026-08-29 (ref: `INV-1105`).
3. `INV-1127` (Fieldhouse, $900): Tool says *unpaid*; paid via ACH `P5123` on 2026-10-04 (ref: `'Fieldhouse Sep invoices'`).
4. `INV-1066` (Mia Torres, $300): Tool says *unpaid*; paid via Zelle `P5076` on 2026-08-02 (ref: `'july sessions'`).
5. `INV-1077` (Mia Torres, $300): Tool says *unpaid*; paid via Zelle `P5076` on 2026-08-02 (ref: `'july sessions'`).
6. `INV-1084` (Mia Torres, $300): Tool says *unpaid*; paid via Zelle `P5076` on 2026-08-02 (ref: `'july sessions'`).

### 3.4 The 7 Genuine Overdue Invoices ($7,670.00 True Total)
1. `INV-1099`: Bluebonnet Realty Group, Due 2026-08-28 (39 days late) — **$1,500.00**
2. `INV-1100`: Startup Texas Podcast, Due 2026-08-29 (38 days late) — **$550.00**
3. `INV-1116`: Hillcrest Physical Therapy, Due 2026-09-15 (21 days late) — **$2,500.00**
4. `INV-1117`: ABC Home Care, Due 2026-09-16 (20 days late) — **$1,500.00**
5. `INV-1121`: Will's Roofing, Due 2026-09-21 (15 days late) — **$450.00** (remaining balance)
6. `INV-1122`: Stonebridge Gym TX, Due 2026-09-22 (14 days late) — **$900.00**
7. `INV-1132`: Crown Church, Due 2026-10-03 (3 days late) — **$270.00**

---

## 4. `payments.csv` Deep Dive

### 4.1 Structural Profile
- **File:** `Axeom Challenge - Pack 175/data/payments.csv`
- **Dimensions:** 122 rows x 7 columns
- **Date Range:** `03/04/2026` to `04/10/2026`
- **Total Deposited in Bank:** **$125,690.00** (vs $122,860.00 claimed paid by billing tool = **$2,830.00 cash surplus**)

### 4.2 Date Inversion Hazard (`DD/MM/YYYY`)
- 100% of payment dates are recorded as **Day/Month/Year** (e.g. `16/04/2026` = April 16, 2026).
- *Critical Hazard:* Defaulting to US date parsing (`MM/DD/YYYY`) will crash on days > 12 or silently invert dates (e.g. October 4 `04/10/2026` becoming April 10).

### 4.3 Missing Fields & Unreferenced Deposits
- **Missing Payer Email (2 rows):**
  1. `P5076` (`02/08/2026`, Zelle, $900.00, Payer: `MIA TORRES`, Memo: `'july sessions'`).
  2. `P5115` (`19/09/2026`, Zelle, $450.00, Payer: `WILL MOORE`, Memo: `'half now half later'`).
- **Blank Reference String (23 rows / 18.9%):** Clients paying via Zelle and ACH omitted invoice numbers. Requires deterministic multi-attribute matching (email + exact amount + date proximity).
- **Lump-Sum Multi-Invoice Payments:**
  - `P5076`: $900.00 Zelle payment covering 3x $300 July sessions for Mia Torres.
  - `P5080`: $1,800.00 ACH payment from Fieldhouse Marketing covering two $900 clinic shoots.
  - `P5105`: $1,800.00 ACH payment from Fieldhouse Marketing covering two $900 clinic shoots.

---

## 5. `production_board.csv` Deep Dive

### 5.1 Structural Profile
- **File:** `Axeom Challenge - Pack 175/data/production_board.csv`
- **Dimensions:** 344 rows x 10 columns
- **Total Workload:** 1,614.4 hours across 4 editors (`Ali`, `Rita`, `Eli`, `Jules`).

### 5.2 Critical Data Quality Failures
- **Empty Board Notes (269 rows / 78.2%):** Over 78% of video cards have a completely blank `notes_on_board` field. This is the **primary operational root cause** of client complaints that edits "come back wrong."
- **Unlinked Shoot Bookings (84 rows / 24.4%):** A quarter of all video deliverables have no linking `shoot_booking` identifier.
- **Delivered Without Client Sign-Off (126 rows / 41.3% of Delivered):** Staff moved 126 video cards into `Delivered` without any client approval date recorded.
- **Zombie Revision Tasks (`V121` & `V152`):**
  - `V121` (Nolan Cho): Approved on `2026-07-18`, still marked `In revision`.
  - `V152` (Ridgeway Lab): Approved on `2026-07-25`, still marked `In revision`.
  - Both cards have been stuck on the board for 2.5 months, cluttering the owner's active task screen.

### 5.3 Junior Editor Efficiency Drain (The "Eli Effect")
- **Eli** was hired at $22/hour on July 3, 2026.
- Eli averages **6.30 hours per video** (compared to 3.76h for Ali and 4.26h for Rita).
- Eli averages **1.05 revisions per video** and accounts for **9 out of the 14 videos with maximum 3 revisions (64.3%)**.
- Despite a lower hourly wage, Eli costs **$138.60 per video** vs. Ali's **$131.60 per video**, representing a major productivity and margin drain.

---

## 6. `messages.txt` Deep Dive

### 6.1 Structural Profile
- **File:** `Axeom Challenge - Pack 175/data/messages.txt`
- **Dimensions:** 200 chronological entries across 4 channels (Email: 100, WhatsApp: 84, DMs: 8, Voice Notes: 6, Web Form: 2).
- **Date Range:** `2026-04-18 09:40` to `2026-10-05 11:16`

### 6.2 Key Operational Breakdowns & Evidence
- **Lost Requests Timeline:** Sentiment was positive in April/May. First missed notes appeared in **June 2026** (`2026-06-07`: Derek: *"Did anyone see my message about college savings? It's not fixed"*). Escalated in **July 2026** following Eli's onboarding.
- **Phishing Security Attack:** `2026-05-17 15:17` — Fake Instagram support DM phishing for login credentials (`bit.ly/insta-verify-now`).
- **Unreviewed Audio Voice Notes:** 6 audio voice notes sent by clients (David Price, Reggie Ramirez, Nina Torres, Gloria Reed) containing critical edit instructions that editors never transcribed.
- **Client Churn (Bayou Wealth Partners):** `2026-07-19 18:47` — Derek Jackson paused their $2,500/month retainer: *"Too many rounds of fixes, and my notes keep getting missed. Nothing personal."*
- **Imminent Churn (Hillcrest Physical Therapy):** `2026-09-08 11:47` — Gloria Reed furious about regulatory compliance branding: *"The videos say 'Hillcrest PT' again. I asked for the full name. Not happy."* September invoice `INV-1116` ($2,500) is currently withheld unpaid.
- **Prepaid Shoot Cancellation (Blue Bonnet Realty):** `2026-09-22 09:22` — Ivy Haddad cancelled shoot `B142` for a family emergency: *"We have to cancel today's shoot, family emergency. Can we move it? We already paid."* Axeom never rescheduled or credited the $1,500.

---

## 7. `team.csv` & `costs.csv` Deep Dive

### 7.1 Structural Profile
- `team.csv`: 5 rows (Zaid, Ali, Rita, Eli, Jules)
- `costs.csv`: 2 rows (Studio time $40/hr, Editor time hourly)

### 7.2 Missing Elements & Operational Observations
- **Missing Administrative Labor:** Zaid (Owner) compensation is blank. Owner administrative overhead (intake, billing, customer calls) is unrecorded.
- **Emergency Freelance Surge:** Jules brought on as freelance surge editor at **$40/hour** on September 1, 2026 to rescue the studio from Eli's revision backlog.
- **Missing External Ad Spend:** `costs.csv` has zero advertising expense records for Google Ads, Meta Ads, or sponsorships. Consequently, Net CAC and ROAS cannot be calculated from this data.

---

## 8. Master Entity Resolution & Answers Summary

### 8.1 Client Count Reconciliation
- Free-text booking names: **72 strings**
- Distinct booking emails: **33 accounts**
- Third-party agency payer: **Fieldhouse Marketing** (paying for Vista Pediatrics and Parkside Chiropractic)
- Secondary personal emails unified: **Mia Torres** (`mia.torres.mail@gmail.com` + `mia@heartandhustle.fm`)
- Email typo unified: **Torres Dental** (`office@torresdental.con` -> `.com`)
- **True Unique Business Clients:** **EXACTLY 30** (matches brief's *"about 30 clients"*).

### 8.2 Financial Balances Summary
- **Total Invoiced:** $156,080.00
- **Total Deposited in Bank:** $125,690.00
- **True Overdue Debt:** **$7,670.00** (7 invoices)
- **Studio Liability ("We Owe"):** **$1,500.00** (Blue Bonnet Realty)
- **Completed Never-Billed Work:** **$3,210.00** (5 sessions)
- **Billing Tool Discrepancies:** **8 concrete errors** documented with bank proof.
- **Never Replied Inbound Leads:** **15 genuine human leads** (4 bot spams excluded).
- **Most Likely to Leave:** **Hillcrest Physical Therapy** ($2,500/month retainer at immediate risk).
- **Best Marketing Channel:** **Referral** (91.7% conversion, $41,400 revenue, $0 CAC).

