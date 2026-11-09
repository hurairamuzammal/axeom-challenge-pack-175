# Axeom Operations System: Architecture & Ingestion Module Spec

## Module 1: Dynamic File Ingestion & Soft Spam Filtering
### 1. Objective
Ingest raw CSV and text exports (`leads.csv`, `bookings.csv`, `invoices.csv`, `payments.csv`, `production_board.csv`, `messages.txt`) dynamically via an "Add New Files" interface without hardcoded assumptions, while protecting the operational database from junk leads and bot submissions.

### 2. Actions & Workflow Steps
1. **Multi-Format Normalization:** 
   - Automatically detect file types (`.csv`, `.txt`) and normalize column headers (strip whitespace, lowercase).
   - Normalize dates to ISO-8601 (`YYYY-MM-DD`) using per-file format rules: `bookings.csv` (`MM/DD/YYYY`), `payments.csv` (`DD/MM/YYYY`), and all others (`YYYY-MM-DD`).
2. **Soft Spam & Validity Scoring Filter:**
   - Instead of blocking form submissions with hard errors, evaluate incoming leads against a risk scoring matrix:
     - Missing phone number (`NaN`) + Missing business name (`NaN`) + Promotional/junk email domain or test keywords (`seo`, `followers`, `crypto`, `test@test.com`, `acct-dept.co`, `domain-renewals.net`, `insta.support.team`) $\rightarrow$ Flag as `Spam Review`.
     - Real client domains (including `.co`, `.fm`, `.build`, `.org`, `.biz` when accompanied by a valid phone and business name) $\rightarrow$ Bypass spam filter.
3. **Audit Log & Human Override:**
   - Place flagged spam records into a visible **Spam Audit Log** table. Provide a 1-click **[Restore as Valid Lead]** button for manual operator override.

### 4. Test Cases & Expected Responses
- **Test Case 1.1: Spam Form Submission**
  - *Input Data:* Lead with Name: "SEO Services", Email: "seo@rank1seo.biz", Phone: `NaN`, Business: `NaN`, Source: "Website form".
  - *Expected Response:* System assigns `status = Spam Review`, routes to audit log, and does not increment active lead pipeline counters. Operator clicks `[Delete Permanently]` or `[Restore]`.
- **Test Case 1.2: Valid International/Custom Domain Lead**
  - *Input Data:* Lead with Name: "Luis Sullivan", Email: "luis@maplefit.co", Phone: "972-555-0160", Business: "Maple Fitness".
  - *Expected Response:* System bypasses spam filter, calculates risk score as 0, and routes directly to the active lead pipeline.

---

## Module 2: Three-Tier Identity Resolution Engine
### 1. Objective
Unify client records across spelling variations and independent touchpoints without corrupting accounting ledgers or falsely merging distinct businesses owned by the same person (e.g., Alana Ibarra's Meridian Bridal vs. Beacon Med Spa).

### 2. Actions & Workflow Steps
1. **Tier 1: Deterministic Match (95–100% Confidence):**
   - Match incoming leads or bookings against existing records using exact verified phone number, unique custom email domain (ignoring generic `@gmail.com`), or exact business name.
   - *Third-Party Payer Check:* If email matches a known third-party payer (e.g., `tanya@fieldhousemktg.com`), automatically assign a `payer_id` while linking the transaction to the sub-client (`Vista Pediatrics` or `Parkside Chiropractic`) via booking memo/name parsing.
2. **Tier 2: Probabilistic Match / Ambiguous Identity (60–90% Confidence):**
   - Triggered when contact person names are identical but email domains differ (e.g., Alana Ibarra across two separate businesses), or phone numbers match an existing client under a new business name.
   - *Anti-Pattern Guard:* Prohibit automatic merging based solely on first/last names.
3. **Tier 3: New Distinct Entity (<60% Confidence):**
   - Unseen email, phone, and business name. Provision a new unique `client_id`.

### 4. Test Cases & Expected Responses
- **Test Case 2.1: Rebrand / Domain Update**
  - *Input Data:* Lead from `luis@mapleathletics.com` with phone "972-555-0160" (previously `luis@maplefit.co`).
  - *Expected Response:* Tier 1 matches via phone number "972-555-0160". System updates the existing client record with the new email alias and logs the rebrand event without creating a duplicate entity.
- **Test Case 2.2: Same Contact, Different Business (Ambiguous Match)**
  - *Input Data:* New contact matching "Alana Ibarra" with email `alana@beaconmedspa.com` (existing client is Alana at `alana@meridianbridal.com`).
  - *Expected Response:* Tier 2 flags as `Possible Entity Split / Rebrand` and prompts the owner with a 10-second action card: *"Alana Ibarra (alana@beaconmedspa.com) matches Meridian Bridal contact. Is this a new business account?"* with options: `[Create New Company Entity]`, `[Link to Existing]`, `[Dismiss]`.