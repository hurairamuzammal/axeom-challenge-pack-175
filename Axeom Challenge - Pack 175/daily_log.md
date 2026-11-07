# Daily Work Log: Axeom Challenge

## Day 1 (November 6, 2026)
- **Time spent:** 15:00 to 17:00
  - **What I did:** Understood the core challenge problem, reviewed the challenge brief and submission guidelines, and conducted initial sanity checks on raw dataset files.
  - **What I changed my mind about, and why:** Decided to deeply understand the data quality issues first through an interactive file-by-file investigation before writing code or building the application.
  - **What went wrong, and how I fixed it:** Nothing yet.
  - **Where the AI was wrong, and how I caught it:** None.

- **Time spent:** 18:00 to 23:00
  - **What I did:** Conducted full exploratory data analysis across all 8 files. Mapped relationships between leads, bookings, production cards, invoices, and payments.
  - **What I changed my mind about, and why:** Initially assumed 72 clients existed based on booking name strings; realized there are only 29-30 true clients once deduplicated by email domains and phone numbers. Also recognized Fieldhouse Marketing is an agency payer, not an operational client.
  - **What went wrong, and how I fixed it:** Standard date parsing distorted `payments.csv` dates because they were recorded in European DD/MM/YYYY format. Corrected by applying explicit `%d/%m/%Y` datetime formatters.
  - **Where the AI was wrong, and how I caught it:** AI initially reported Mia Torres had USD 900 in delinquent invoices. I caught this by inspecting bank deposits and locating Zelle payment P5076 for USD 900 marked "july sessions."

---

## Day 2 (November 7, 2026)
- **Time spent:** 10:00 to 18:30
  - **What I did:** Conducted deep cross-file data reconciliation, entity deduplication, and financial ledger audit. Analyzed client communication flows to diagnose revision breakdowns.
  - **What I changed my mind about, and why:** The AI suggested using email as the sole primary key for linking transactions. I changed my mind because I realized real-world clients frequently pay or book using alternative or personal emails (e.g., Mia Torres booking and paying via personal Gmail `mia.torres.mail@gmail.com` while registered under business email `mia@heartandhustle.fm`, and agency Fieldhouse Marketing paying for separate clinics). We must cross-check bank payer names, phone numbers, and payment references rather than relying on email alone.
  - **Operational Innovation Proposed:** To solve Problem 1 ("edits come back wrong") and Problem 3 ("lost requests"), proposed an automated intake bot on WhatsApp and Instagram. The client selects whether they are an existing client requesting an edit/update; they enter their registered email and video ID/number, allowing the system to verify their account, identify the specific assigned editor on the production board, and route the note directly to that editor's card—just like a mature studio.
  - **Where the AI was wrong, and how I caught it:** 
    1. AI initially assumed a simplistic email-only entity mapping model. I caught this by identifying edge cases where clients use multiple email accounts across bookings and payments, and instructed the AI to incorporate multi-attribute matching (phone numbers, payer names on bank deposits, and memo references).
    2. AI initially flagged that Axeom owes Blue Bonnet Realty USD 1,500 in cash for cancelled shoot `B142`. By checking payment and booking records, I caught that the cancelled shoot was actually rescheduled to October 5 (`B154`) and completed! Blue Bonnet had already paid the USD 1,500 on September 28 (`P5121`). Axeom's billing system mistakenly generated an extra invoice `INV-1138` (USD 1,500) for the rescheduled shoot instead of recognizing it was already paid. Rather than owing a cash refund, Axeom generated a redundant, extra invoice for an already-paid shoot.

- **Time spent:** 19:30 to 23:45
  - **What I did:** Designed and implemented the 5-Module Reactive Operations Engine (`ingestion.py`, `cleaning.py`, `reconciliation.py`, `jev_integration.py`, `business_logic.py`), multi-file upload pipeline, automated test suite, and web interface. Cross-verified `answers.json` line-by-line against raw data.
  - **What I changed my mind about, and why:** Decided to support both a zero-dependency Web/Vercel application and a Streamlit entry point backed by the same 5-module Python reconciliation engine so the owner can run or deploy it anywhere with persistent SQLite state.
  - **What went wrong, and how I fixed it:** Caught an arithmetic sum typo in draft `never_billed_total` (`8710.0` vs actual sum `8210.0` for the 2 May retainers + 5 unbilled shoots) and a phone number mixup between Reggie Ramirez (`Luna Roofing Co`, `469-555-0112`) and Reggie Adeyemi (`Adeyemi Law Firm`, `972-555-0119`). Fixed both in `answers.json` and added automated tests.

---

# AI Contributions and Verification Log

### Tooling Used
- Primary AI Assistant (Architecture & Data Analysis)
- Secondary AI Agent (Code Implementation & Automated Testing)

### Verification & Corrections
- **Mistake Caught:** AI initially merged distinct business entities (e.g., Meridian Bridal and Beacon Med Spa) solely because contact person Alana Ibarra shared a name.
- **Human Verification:** Verified business registration names and phone numbers; kept them as separate business client accounts owned by the same contact.
- **Financial Validation:** I asked AI not to delete any record and asked to quarantine spam-based lead data in a Spam Audit Log as it was artificially inflating lead counts.
- **Entity & Multi-Email Resolution:** AI initially proposed using primary email as the sole matching key. Human caught that clients frequently use secondary or personal emails to book or pay (e.g. Mia Torres paying via personal Gmail, Fieldhouse Marketing paying on behalf of external clinics). Human mandated multi-attribute cross-checks across bank payer names, phone numbers, and payment references.
- **Rescheduled Shoot vs. Cash Liability:** AI initially claimed Axeom owes Blue Bonnet Realty USD 1,500 for cancelled booking `B142`. Human verified that the shoot was rescheduled to October 5 (`B154`) and completed, with payment `P5121` (USD 1,500) received on September 28. Human identified that Axeom generated an extra redundant invoice `INV-1138` for an already-paid session.
- **Process Automation Architecture:** Human formulated an intake routing workflow for WhatsApp and Instagram to categorize existing client revision requests, capture video IDs, and automatically append notes directly to the assigned editor on the production board.
