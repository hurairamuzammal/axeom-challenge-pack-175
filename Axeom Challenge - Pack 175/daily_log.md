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
  - **What went wrong, and how I fixed it:** Voice note prefix tags in `messages.txt` were initially matching the keyword "voice" and misclassifying audio files. Fixed by parsing duration tags before category matching.
  - **Where the AI was wrong, and how I caught it:** 
    1. AI initially assumed a simplistic email-only entity mapping model. I caught this by identifying edge cases where clients use multiple email accounts across bookings and payments, and instructed the AI to incorporate multi-attribute matching (phone numbers, payer names on bank deposits, and memo references).
    2. AI initially flagged that Axeom owes Blue Bonnet Realty USD 1,500 in cash for cancelled shoot `B142`. By checking payment and booking records, I caught that the cancelled shoot was actually rescheduled to October 5 (`B154`) and completed! Blue Bonnet had already paid the USD 1,500 on September 28 (`P5121`). Axeom's billing system mistakenly generated an extra invoice `INV-1138` (USD 1,500) for the rescheduled shoot instead of recognizing it was already paid. Rather than owing any cash refund or balance, Axeom simply needs to void the duplicate `INV-1138`.

- **Time spent:** 19:30 to 23:45
  - **What I did:** Built the full application engine and connected all 8 raw files into the reactive reconciliation pipeline. Built the multi-file upload engine, automated test suite, and web dashboard. Cross-verified `answers.json` line-by-line against raw data.
  - **What I changed my mind about, and why:** Decided to support both a zero-dependency Web/Vercel application and a Streamlit entry point backed by the same Python engine so the owner can run or deploy it anywhere.
  - **What went wrong, and how I fixed it:** None.
  - **Where the AI was wrong, and how I caught it:** None.

---

## Day 3 (November 8, 2026)
- **Time spent:** 09:00 to 18:00
  - **What I did:** Completed the TypeSafe Jev message triage integration and verified it against the 40-message benchmark. Deployed the reactive web dashboard to Vercel and built a complete navigation menu (desktop header navbar, mobile hamburger drawer, and sticky bottom navigation bar). Implemented the 31-test automated suite verifying all financial logic, duplicate handling, and aging offsets. Prepared the compressed ~4.5-minute video transcript for Loom.
  - **What I changed my mind about, and why:** 
    1. Decided to add a persistent navigation menu and mobile bottom bar instead of relying solely on the top metric tiles for navigation.
    2. Decided to compress the Loom video script from 7+ minutes down to 618 words (~4.5 minutes) so it never hits Loom's 5:00 recording cut-off.
  - **What went wrong, and how I fixed it:** 
    1. The dashboard on mobile didn't have an easily discoverable navigation menu to switch between views; fixed by building a desktop navbar, a mobile hamburger menu drawer, and a sticky bottom navigation bar.
    2. The initial Loom script was paced too long (~7 minutes). Fixed by trimming the introduction and sprints down to under 45 seconds to keep the recording strictly under Loom's 5:00 limit.
  - **Where the AI was wrong, and how I caught it:** None. The AI followed instructions directly today; my focus was on layout improvements, navigation menu wiring, test execution, and script pacing.
