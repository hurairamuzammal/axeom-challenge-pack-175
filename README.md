# Axeom Studio Operations & Financial Reconciliation Engine (Pack 175)

**Author:** Muhammad Abu Huraira (`huraira.eqeel@gmail.com`)  
**Pack ID:** `175` | **Reference Date ("Today"):** `2026-10-06`  
- **Live Vercel Application:** [axeom-challenge-five.vercel.app](https://axeom-challenge-five.vercel.app)
- **Official Loom Video Recording:** [loom.com/share/95afc8c20a8c4ace9f56af0ed60c0618](https://www.loom.com/share/95afc8c20a8c4ace9f56af0ed60c0618)
- **GitHub Repository:** [github.com/hurairamuzammal/axeom-challenge-pack-175](https://github.com/hurairamuzammal/axeom-challenge-pack-175)
- **Interactive Gemini Brainstorming Chat:** [share.gemini.google/bOVsRyTtf8E5](https://share.gemini.google/bOVsRyTtf8E5)

---

## 1. Architecture Overview (5-Module Reactive Pipeline)

This application implements a strict 5-layer modular architecture backed by SQLite state persistence (`app/storage.py`):

1. **Module 1 — Ingestion, Date Normalization & Soft Spam Quarantine (`app/ingestion.py`, `app/cleaning.py`):**
   - Validates all 7 CSV schemas (`leads.csv`, `bookings.csv`, `invoices.csv`, `payments.csv`, `production_board.csv`, `team.csv`, `costs.csv`) and `messages.txt` while preserving original record IDs (`lead_id`, `booking_id`, `invoice_no`, `payment_id`, `video_id`) and file/row provenance.
   - Normalizes heterogeneous date formats (`MM/DD/YYYY` in `bookings.csv` vs. `DD/MM/YYYY` in `payments.csv`) to `YYYY-MM-DD`.
   - Sanitizes `.con` -> `.com` email typos (`B068`) and quarantines bot/solicitation spam leads (`L052`, `L063`, `L081`, `L089`) in a reviewable Spam Audit Log while whitelisting custom business domains (`.co`, `.fm`, `.build`, `.org`, `.coffee`).
2. **Module 2 — 3-Tier Identity Resolution (`app/reconciliation.py`):**
   - Resolves 72 surface name strings and 33 emails into canonical client entities, links rebrands (`Maple Fitness` -> `Maple Athletics`), isolates third-party agency payers (`Fieldhouse Marketing`), and flags shared-contact separate companies (`Alana Ibarra`, `Tasha Torres`, `Nolan Nguyen`) with `HIGH`/`MEDIUM`/`LOW` confidence badges.
3. **Module 3 — 4-Pass Dynamic Payment Reconciliation (`app/reconciliation.py`):**
   - **Pass 1:** Exact regex `INV-\d+` match (including cross-domain personal payer emails).
   - **Pass 2:** Text memo & bulk sum solver (`P5076` `"july sessions"` covering `INV-1066`, `INV-1077`, `INV-1084`; `P5115` `"half now half later"` partial payment on `INV-1121`).
   - **Pass 3:** Chronological FIFO solver for 22 blank-reference payments.
   - **Pass 4:** Overpayment & discrepancy quarantine (`Prime Barbershop` `P5077` `USD 900.00`, `Glow Coffee Roasters` `INV-1110` `USD 900.00`, `Crown Church` `INV-1065` `USD 30.00` overcharge).
4. **Module 4 — Jev Structured Extraction & Editor Bot Routing (`app/jev_integration.py`):**
   - Extracts revision notes from all 200 messages and 6 voice notes (`V049`, `V135`, `V132`, `V268`, `V274`) and syncs approved instructions directly to the assigned editor on `production_board.csv`.
5. **Module 5 — Customer Balance Guards & Monday Action Queue (`app/business_logic.py`):**
   - Prevents duplicate invoicing on rescheduled prepaid shoots (`Blue Bonnet Realty` `B142` -> `B154` / `INV-1138`), surfaces the 7 never-billed items (`USD 8,210.00`) and overdue receivables, and prioritizes the 15 unreplied genuine human leads.

---

## 2. Running Locally (Web Server, Vercel, or Streamlit)

### Option A: Zero-Dependency Web App & REST API (Vercel-Compatible)
```bash
python3 -m app.server
# Open http://localhost:8501
```

### Option B: Streamlit Dashboard
```bash
pip install streamlit pandas
streamlit run streamlit_app.py
```

### Running the Automated Test Suite
```bash
python3 -m unittest discover -s tests -v
```

---

## 3. Submission Deliverables (`Axeom Challenge - Pack 175/`)

- `Axeom Challenge - Pack 175/answers.json` — Verified structured answers
- `Axeom Challenge - Pack 175/writeup.md` — Executive summary and operational recommendations
- `Axeom Challenge - Pack 175/assumptions.md` — Documented reconciliation and business rules
- `Axeom Challenge - Pack 175/daily_log.md` & `daily-log.txt` — Chronological engineering & AI verification log
- `Axeom Challenge - Pack 175/ai_log.md` — AI mistakes caught and human verification log
- `Axeom Challenge - Pack 175/data/` — Original raw dataset (strictly untouched)

