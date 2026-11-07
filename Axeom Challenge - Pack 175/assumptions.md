# Business Assumptions & Unresolved Questions

### 1. Payer vs. Client Distinction
- **Question for Owner:** "Does Fieldhouse Marketing receive any studio or video services for their own agency?"
- **Decision/Assumption:** Based on message [2026-06-10], Fieldhouse is an outsourced marketing agency acting strictly as a third-party payer for Vista Pediatrics and Parkside Chiropractic. They are classified as a payer, not an independent production client. Invoices billed to Fieldhouse Marketing (INV-1044, INV-1062, INV-1069, INV-1093, INV-1094, INV-1126, INV-1127) and payments received from FIELDHOUSE MARKETING LLC (P5053, P5080, P5105, P5123) are mapped directly to the underlying service clients.

### 2. Retainer Session Billing
- **Question for Owner:** "Why are 22 Retainer Shoot sessions in bookings.csv priced at $0?"
- **Decision/Assumption:** Retainer clients are billed a flat $2,500/month recurring fee on the 1st of each month via invoices.csv. The individual sessions are logged at $0 to track studio capacity without double-billing.

### 3. Date Standardization
- **Decision/Assumption:** All calculations use the fixed business reference date of October 6, 2026. Any booking or invoice after this date represents upcoming pipeline work, not past completed revenue. All payment dates in `payments.csv` are explicitly standardized using European `%d/%m/%Y` formatting to prevent date transposition errors.

### 4. Bulk and Unreferenced Payment Reconciliation
- **Decision/Assumption:** 
  - Mia Torres’s $900 Zelle payment (`P5076`, ref: "july sessions") is reconciled against open July invoices `INV-1066` ($300), `INV-1077` ($300), and `INV-1084` ($300). These are marked paid in the reconciled financial ledger.
  - Will Moore’s $450 Zelle payment (`P5115`, ref: "half now half later") is matched to invoice `INV-1121` ($900.00), leaving an active overdue balance of $450.00.

### 5. Rescheduled Shoot vs. Cash Liability (Blue Bonnet Realty)
- **Question for Owner:** "Do we owe Blue Bonnet Realty a $1,500 cash refund, or was their cancelled shoot rescheduled?"
- **Decision/Assumption:** Shoot `B142` was cancelled on 2026-09-22 due to a family emergency and rescheduled to 2026-10-05 as `B154` (completed). Blue Bonnet paid $1,500 on 2026-09-28 via ACH (`P5121`). However, Axeom generated an extra invoice `INV-1138` ($1,500, marked unpaid) on 2026-09-27. We assume `INV-1138` is an extra redundant invoice that should be voided/cleared against the prepayment `P5121` rather than demanding duplicate payment from the client or paying out a cash refund, since the shoot was delivered on October 5.

### 6. Multi-Email and Alternative Account Resolution
- **Question for Owner:** "Do clients occasionally pay or book using personal or secondary emails?"
- **Decision/Assumption:** Yes. A single client entity may operate across multiple email addresses (e.g., Mia Torres uses both `mia@heartandhustle.fm` and `mia.torres.mail@gmail.com`). Reconciliation cannot rely exclusively on a 1-to-1 email match; it requires multi-attribute resolution across phone numbers, payer names on bank feeds, and memo references.

### 7. Intake Routing & Communication Architecture (Proposed Process)
- **Question for Owner:** "How can we permanently stop revision requests and client edit notes from getting lost?"
- **Decision/Assumption:** Client revision requests get lost because unstructured messages across WhatsApp and Instagram DMs are never transcribed to the production board. In our operational process recommendations, an automated chatbot/intake flow will prompt messaging clients to identify whether they are an existing client requesting an edit/update. The client enters their registered email and video ID/title; the system automatically validates their account, routes the request to the specific assigned editor on `production_board.csv`, and attaches the note directly to their task card.
