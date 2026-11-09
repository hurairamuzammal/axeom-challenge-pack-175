# Axeom Operations System: Reconciliation & Operations Module Spec

## Module 3: 4-Pass Dynamic Payment Reconciliation Engine
### 1. Objective
Accurately connect bank payments (`payments.csv`) to invoices (`invoices.csv`) and bookings (`bookings.csv`), handling missing invoice references and bulk agency payments dynamically while flagging accounting anomalies.

### 2. Actions & Workflow Steps
Execute a strict 4-pass matching sequence upon data ingestion:
- **Pass 1 (Exact Invoice ID Match):** Extract `INV-\d+` strings from payment reference fields. Verify matching amount and client. Automatically flag billing tool discrepancies (e.g., invoice marked `unpaid` in tool but paid in bank).
- **Pass 2 (Text Note & Monthly Bulk Match):** For payments with text notes (e.g., `"july sessions"`, `"Fieldhouse Jul invoices"`), sum open invoices for that client/month and allocate across matching lines.
- **Pass 3 (Chronological FIFO for Blank References):** For payments with `reference = NaN`, match against the oldest unpaid/unlinked invoice for that client where `invoice.amount == payment.amount` and `invoice.issued <= payment.date`.
- **Pass 4 (Conflict & Anomaly Quarantine):** Route unresolvable payments or duplicates to an **Unreconciled Queue** rather than guessing. If a client overpays or pays for a cancelled/rescheduled session improperly, surface a credit adjustment card.

### 4. Test Cases & Expected Responses
- **Test Case 3.1: Billing Tool Discrepancy Detection**
  - *Input Data:* `INV-1083` ($1500) marked `unpaid` in `invoices.csv`, accompanied by payment `P5074` ($1500) with reference `"INV-1083"`.
  - *Expected Response:* Pass 1 successfully links payment to invoice, automatically updates invoice status to `paid`, and records a discrepancy finding in `billing_tool_is_wrong` for reporting.
- **Test Case 3.2: Duplicate Overpayment Detection**
  - *Input Data:* Prime Barbershop sends two $900 payments (`P5077` and `P5081`) for a single $900 invoice (`INV-1080`).
  - *Expected Response:* Pass 1 links `P5081`. Pass 4 catches that `P5077` has no remaining open invoice, quarantines it, and registers a $900 credit under `we_owe` (Client Overpayment).

---

## Module 4: Operational Revision Intake & Production Board Sync
### 1. Objective
Eliminate revision requests lost in informal channels (WhatsApp, Instagram DMs, Voice Notes) by creating structured intake routing that syncs directly to the production board and addresses editor onboarding gaps (such as Eli's missing note history).

### 2. Actions & Workflow Steps
1. **Structured Intake Menu:** Provide external and internal users with explicit routing options:
   - *1. Submit Video Revision*
   - *2. Book New Studio Session*
   - *3. Billing & Invoice Inquiries*
2. **Video Revision Pathway:**
   - Require explicit `video_id` (e.g., `V268`) and category (`Audio/Music`, `Text/Captions`, `Cut/Trimming`, `Brand/Color`).
   - Use **Jev (`docs.typesafe.ai`)** to parse unstructured `messages.txt` text/voice transcripts, match ambiguous references (*"the one we shot last week"*) to active batch sibling video IDs, and generate a sync preview card.
3. **Direct Board Sync:**
   - On owner approval, append feedback to `notes_on_board`, increment `revisions` count, assign priority flag, and notify the assigned editor (e.g., Ali, Rita, Eli, or Jules).

### 4. Test Cases & Expected Responses
- **Test Case 4.1: Unstructured Voice Note Parsing via Jev**
  - *Input Data:* Voice note transcript from Gloria at Hillcrest PT: *"For the walk-ins welcome video, cut the first 3 seconds."*
  - *Expected Response:* Jev parses the intent (`Cut/Trimming`), matches `video_id` `V274` via client history and title lookup, and displays a 1-click prompt: *"Sync revision to V274 (Hillcrest PT)? [Approve / Edit]"*.

---

## Module 5: Customer Balance Guards & Duplicate Invoice Prevention
### 1. Objective
Prevent billing confusion, duplicate invoices, and unnecessary collection chases when sessions are rescheduled or pre-paid (addressing the Blue Bonnet Realty reschedule scenario and active client account checks).

### 2. Actions & Workflow Steps
1. **Pre-Invoice Balance Check:**
   - Before generating any new invoice or billing reminder, the system queries the client's current ledger balance (`Total Invoiced - Total Paid + Credits`).
   - If the net balance is negative or zero (e.g., pre-paid for a rescheduled shoot like Blue Bonnet Realty's `B142` / `INV-1131`), invoice generation is blocked, and the duplicate invoice (e.g., `INV-1138`) is auto-flagged as `Void / Duplicate Billed`.
2. **Active Client Upsell Prioritization:**
   - When an existing client submits a website form or inquiry (e.g., Leah Reed at Hillcrest PT or Mia Torres), flag them immediately as an **Existing Client Retention Priority** rather than a cold lead.

### 4. Test Cases & Expected Responses
- **Test Case 5.1: Rescheduled Shoot Balance Guard**
  - *Input Data:* A rescheduled session (`B154`) attempts to trigger a new invoice generation for an already-paid booking date (`B142` / `INV-1131`).
  - *Expected Response:* Balance check detects that the client has a zero/positive credit balance covering the slot. The system blocks duplicate invoice creation and tags the generated draft as `Duplicate Check: Covered by Prior Payment`.