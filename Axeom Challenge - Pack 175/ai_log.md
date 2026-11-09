# AI Contributions & Human Decision Log (Pack 175)

**Candidate:** Muhammad Abu Huraira (Computer Science Graduate)  
**Project:** Axeom Challenge — Pack 175  
**Core Principle:** *Agent-Assisted Execution, 100% Human-Driven Architecture & Decision Making*

---

## 1. Executive Summary: The Human-in-the-Loop Philosophy

This platform was built through an active pairing model: **I served as the chief systems architect and ultimate decision maker, using Google Gemini (via Gemini Chat and the Antigravity Agent) as an accelerated engineering copilot.**

In complex data forensics, AI models easily hallucinate false relationships, average out subtle edge cases, or suggest naive shortcuts. From minute one, I enforced a strict rule: **the AI was never permitted to make business decisions, guess missing values, or unilaterally modify raw data.** 

Gemini handled high-velocity code scaffolding, regex parsing, test generation, and file manipulation. Every data model, entity graph, financial reconciliation rule, and UX decision was conceived, audited, and verified by me.

```
+-----------------------------------------------------------------------------+
|                           HUMAN ARCHITECT & LEAD                            |
|             (Muhammad Abu Huraira — Critical Thinking & Decisions)          |
|                                                                             |
|  - Conceived 3-tier entity model     - Disproved Blue Bonnet refund trap    |
|  - Caught European date corruption   - Enforced 'Suggest, Never Act Alone'  |
|  - Verified 30 real clients vs 72    - Directed TypeSafe Jev architecture   |
+-----------------------------------------------------------------------------+
                                      |
                     Strategic Direction & Exact Prompts
                                      v
+-----------------------------------------------------------------------------+
|                           AI AGENT & COPILOT                                |
|                   (Google Gemini / Antigravity Agent)                       |
|                                                                             |
|  - Automated file ingestion regex    - Wrote 31 unit test suites            |
|  - Rapid full-stack code scaffolding - Implemented responsive CSS layouts   |
|  - Fast multi-file schema validation - Sub-second Python execution engine   |
+-----------------------------------------------------------------------------+
                                      |
                      Draft Output & Technical Proposals
                                      v
+-----------------------------------------------------------------------------+
|                           HUMAN VERIFICATION GATE                           |
|  Line-by-line verification against raw files -> Approved or Overruled       |
+-----------------------------------------------------------------------------+
```

---

## 2. Tools Used & Division of Responsibilities

### Tooling Stack & Shared Chat Links
- **Interactive AI Chat:** Google Gemini (Gemini 2.5 Pro)  
  **Public Shared Chat Link:** [https://share.gemini.google/bOVsRyTtf8E5](https://share.gemini.google/bOVsRyTtf8E5)  
  *In this interactive session, I conducted exploratory data analysis across all 8 files, identified core data traps (European dates, entity boundaries, Blue Bonnet reschedule), and structured the business requirements into two master architectural prompt specifications.*
- **Primary AI Coding Agent:** Google Gemini (Antigravity Agent) — CLI execution, file editing, test execution, full-stack scaffolding driven directly by the generated prompt specifications.
- **Python Engine:** Python 3.12, Pandas, SQLite, SQLAlchemy.
- **Frontend Engine:** HTML5, Modern Vanilla JS, Tailwind CSS, Vercel Serverless.

### Division of Labor

| Engineering Dimension | Gemini AI Agent Role | Human Lead (Muhammad Abu Huraira) Role |
| :--- | :--- | :--- |
| **Data Ingestion** | Wrote parser scripts and CSV readers. | Discovered European DD/MM/YYYY dates; forbade raw file mutations; mandated quarantine log for spam. |
| **Entity Resolution** | Drafted fuzzy matching functions. | Caught false merges (Alana Ibarra, Tasha Torres); isolated Fieldhouse Marketing as third-party payer. |
| **Financial Reconciliation** | Computed invoice totals and sums. | Disproved $1,500 refund to Blue Bonnet; identified rescheduled shoot B154 and duplicate INV-1138 ($0 cash owed). |
| **TypeSafe Jev Job** | Generated API handler boilerplate. | Directed System One typed questions (choice, noul, score); stripped duration prefix tags to fix audio accuracy. |
| **UI / Dashboard** | Generated Tailwind HTML templates. | Enforced mobile 10-second test; mandated sticky bottom nav and hamburger drawer; eliminated empty void space. |
| **Automated Testing** | Generated unit test boilerplate. | Specified edge case scenarios (FIFO matching, calendar offsets, multi-invoice text memos). |

---

## 3. Key Prompts Used & Strategic Direction

### The Two Master Prompt Specifications Created from Gemini Chat
As documented in my public Gemini session ([https://share.gemini.google/bOVsRyTtf8E5](https://share.gemini.google/bOVsRyTtf8E5)), I used an interactive 2-stage prompt engineering workflow:
1. **Interactive Formulation:** In Gemini Chat, I explained the raw data quirks, defined the operational requirements, and directed Gemini to draft two formal architectural specification documents.
2. **Deterministic Agent Execution:** I then used these two specifications as master prompts for the Antigravity coding agent to implement the pipeline without inventing assumptions:
   - **Specification Prompt 1:** Architecture, Ingestion, Schema Normalization & 3-Tier Identity Resolution.
   - **Specification Prompt 2:** 4-Pass Dynamic Payment Reconciliation, Jev System One Revision Intake, and Pre-Invoice Balance Guards.

Below are the verbatim prompts and directives used throughout the project:

### Prompt 1: The "Zero Data Loss & Raw Integrity" Directive (Day 1)
```
"We are auditing Axeom Studio Pack 175. Rule #1: Never alter, overwrite, or delete any file 
in the data/ folder. Read leads.csv, bookings.csv, invoices.csv, payments.csv, and messages.txt. 
Do not guess or invent client counts. 

Notice that leads.csv contains foreign .ru domains and crypto scrapers. Do NOT silently drop 
them. Build a dedicated Spam Quarantine Audit Log that flags why they were isolated (e.g. 
t.me links, crypto pitch, foreign TLD) while keeping human leads intact. 

Check date columns in payments.csv carefully—do not assume US MM/DD/YYYY format. Look at the 
day values and verify if European DD/MM/YYYY formatting is present."
```
*Why this was human-driven:* Prevented the AI from cleaning data destructively and forced early detection of the European date bug before financial math was computed.

---

### Prompt 2: Entity Disambiguation & The Agency Payer Trap (Day 1 – Day 2)
```
"Look at bookings.csv and payments.csv. Booking names show over 70 raw variations, but many 
are simple typos or staff shortcuts. 

However, beware of two critical traps:
1. Alana Ibarra appears under Meridian Bridal Boutique AND Beacon Med Spa. Do NOT merge 
these into one client. They have completely different email domains (@meridianbridal.com 
vs @beaconmedspa.com) and phone numbers. They are separate legal businesses owned by the 
same person. Enforce this same boundary for Tasha Torres and Nolan Nguyen.
2. Fieldhouse Marketing paid $5,400 via bank wire P5088 for sessions B088, B096, and B120. 
Notice that the bookings belong to Vista Pediatrics and Parkside Chiropractic. Fieldhouse 
is an agency payer, NOT a creative studio client. 

Build a 3-tier identity graph linking transactions by verified domains, phone numbers, and 
bank payer names, isolating third-party payers into their own canonical table."
```
*Why this was human-driven:* AI models default to naive name deduplication. Without my domain boundary instructions, Gemini would have merged unrelated businesses and distorted client counts.

---

### Prompt 3: The Blue Bonnet $1,500 Refund Investigation (Day 2)
```
"The invoices and payments show a cancelled booking B142 for Blue Bonnet Realty and a $1,500 
wire P5121 received on Sept 28. 

Do not jump to the conclusion that Axeom owes Blue Bonnet a $1,500 refund. 
Search bookings.csv and messages.txt chronologically for Blue Bonnet between Sept 28 and 
Oct 6. Did they reschedule? Was another shoot booked and delivered?

If rescheduled shoot B154 was delivered on Oct 5, check invoice INV-1138. Did staff bill them 
twice? If P5121 already covered the session, what is the true accounting action? Prove 
whether Axeom owes cash, or if staff simply generated an erroneous duplicate invoice."
```
*Why this was human-driven:* Gemini initially drafted a report claiming Axeom owed $1,500 cash. My investigative prompt forced chronological cross-referencing that uncovered the duplicate invoice INV-1138 and proved $0.00 cash owed.

---

### Prompt 4: TypeSafe Jev System One Architecture (Day 2 – Day 3)
```
"We must integrate TypeSafe Jev (docs.typesafe.ai) for revision message intake. 

Do NOT write an unconstrained, free-form generative LLM chat prompt. That produces unpredictable 
tokens, high latency, and hallucinated classifications. 

Instead, construct a deterministic TypeSafe Jev System One pipeline using strictly typed questions:
1. Intent: choice('VIDEO_REVISION', 'NEW_BOOKING_INQUIRY', 'BILLING_PAYMENT_QUERY', 'GENERAL_FEEDBACK')
2. Category: choice('Cut/Trimming', 'Audio/Music', 'Brand/Color', 'Graphics/Text', 'General')
3. Voice Note Detected: noul()
4. Lost Directive Flag: noul()
5. Priority Score: score(1, 5)

Notice that messages with audio durations like '[VOICE NOTE 0:14]' might trigger the word 
'voice' and bias the audio category. Strip the duration marker before category evaluation. 
Benchmark on 40 real messages from messages.txt and log accuracy."
```
*Why this was human-driven:* Transformed a vague AI integration into a high-speed, sub-200ms deterministic classifier with 95% category precision.

---

### Prompt 5: Mobile Navigation & 10-Second Test Optimization (Day 3)
```
"Review the live web app on mobile viewport (375px - 414px). Currently, users must scroll 
through all top metric tiles to switch views, and there is no visible menu. 

Fix this immediately based on priority:
1. Add a desktop navigation bar in the header with active state indicators.
2. Add a mobile hamburger button (icon) that triggers a slide-over navigation drawer.
3. Add a persistent mobile bottom navigation bar (fixed bottom-0) with 1-tap switching 
between Videos, Clients, Invoices, Guards, and Audit.
4. Ensure switchTab(tabId) synchronizes the active highlight across all four navigation 
elements simultaneously.
5. Keep the design minimal, fast, and clean. No bloated dependencies."
```
*Why this was human-driven:* AI was content with the existing tile layout. I identified the mobile navigation friction and designed the full multi-tier navigation menu.

---

## 4. Key AI Mistakes Caught & Overruled

Here are concrete instances where the AI generated an incorrect answer, and how I caught and corrected it:

### Mistake 1: Merging Unrelated Businesses Under Shared Individual Names
- **What Gemini did:** When clustering clients, Gemini grouped Meridian Bridal Boutique and Beacon Med Spa into a single client record because Alana Ibarra's name appeared in both. It also merged Bluebonnet Realty Group and Brightwater Builders under Nolan Nguyen.
- **How I caught it:** I audited client count against registered corporate email domains and found `@meridianbridal.com` vs `@beaconmedspa.com`. 
- **How I fixed it:** I overruled the AI and mandated that legal entity boundaries take precedence over personal contact names. A single entrepreneur can own multiple distinct businesses; they must receive separate invoices and maintain separate retainer ledgers.

### Mistake 2: The Blue Bonnet $1,500 Cash Refund Hallucination
- **What Gemini did:** Flagged that Axeom owes USD 1,500 in cash to Blue Bonnet Realty under `we_owe` because booking `B142` was cancelled while wire `P5121` ($1,500) was banked.
- **How I caught it:** I reviewed the timeline of bookings and messages. On September 30, Blue Bonnet asked to move their shoot to October 5. Session `B154` took place on October 5 and was delivered.
- **How I fixed it:** I showed that wire `P5121` settled session `B154`. The true studio error was staff issuing duplicate invoice `INV-1138` ($1,500) for an already-paid session. I instructed the system to void `INV-1138` and record $0.00 cash owed.

### Mistake 3: European Date Format Transposition in Bank Payments
- **What Gemini did:** Parsed `payments.csv` using standard US date format (`%m/%d/%Y`). Because dates like `02/08/2026` were interpreted as February 8 instead of August 2, bank payments were chronologically displaced by 6 months, causing the reconciliation FIFO matcher to mislink payments to future invoices.
- **How I caught it:** I noticed that July invoice `INV-1080` was being matched against a payment parsed as February, which was impossible because the booking hadn't occurred yet.
- **How I fixed it:** Identified that `payments.csv` was exported in European `DD/MM/YYYY` format. Built explicit dual-format datetime parsers (`%d/%m/%Y` for payments vs `%Y-%m-%d` for invoices and bookings), immediately resolving all payment sequence anomalies.

### Mistake 4: Voice Note Prefix Category Skew in Jev
- **What Gemini did:** In initial test runs, Jev classified every voice note message as `Audio/Music`, even when the client was asking for a text edit or color correction.
- **How I caught it:** I hand-checked 40 messages and noticed that message line 142 (`[VOICE NOTE 0:14] Fix the lower third font`) was tagged as `Audio/Music` instead of `Graphics/Text`. The keyword `"voice"` inside the bracket was triggering the audio classifier.
- **How I fixed it:** I directed the agent to strip bracketed duration tags `[VOICE NOTE X:XX]` prior to evaluating category text, increasing category classification precision from 72% to 95%.

---

## 5. Candidate Conclusion

AI is an extraordinary accelerator when paired with an engineer who understands systems, data structures, and business context. 

Throughout this sprint, **I remained in the driver's seat**: questioning every total, verifying every match against raw receipts, and making the structural decisions that transformed messy data into a robust, deterministic operations platform.
