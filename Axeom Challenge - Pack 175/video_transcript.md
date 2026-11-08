# Official 5-Minute Loom Video Script & Teleprompter (Pack 175)

- **Presenter:** Muhammad Abu Huraira (Computer Science Graduate)
- **Challenge Pack ID:** Pack 175
- **Business Reference Date ("Today"):** Tuesday, October 6, 2026
- **Live Vercel Application:** `https://axeom-challenge-five.vercel.app`
- **GitHub Repository:** `https://github.com/hurairamuzammal/axeom-challenge-pack-175`
- **Total Word Count:** 618 words
- **Estimated Speaking Time:** 4 minutes 15 seconds to 4 minutes 30 seconds (Guaranteed strictly under Loom's 5:00 limit)

---

## Part 1: Presenter Introduction & The Situation (0:00 – 0:20 | 69 words)

**[Camera: Face Camera or App Dashboard Header]**

"Hi everyone. My name is Muhammad Abu Huraira, a Computer Science graduate presenting the operational and financial engine for Axeom Studio, Pack 175. Our business reference date is strictly **Tuesday, October 6, 2026**.

Axeom has about 30 Dallas clients, invoiced $103,890, and banked $83,390. But disconnected silos created $8,870 in overdue debt, $8,210 in finished work never billed, and lost voice notes. 

Here is how I unified this into an automated system."

---

## Part 2: How I Divided the 72 Hours (0:20 – 0:45 | 78 words)

**[Screen: Quick Overview / App Architecture]**

"I divided the 72 hours into three 24-hour engineering sprints:

- **Day 1 — Ingestion & Identity Resolution:** Fixed European `DD/MM/YYYY` dates, quarantined 4 spam leads, and collapsed 72 raw names into 29 canonical clients plus agency payer Fieldhouse Marketing.
- **Day 2 — Reconciliation & The Jev Job:** Reconciled 122 payments across 138 invoices, uncovered $8,210 in unbilled delivered shoots, proved $0 cash owed to Blue Bonnet, and integrated TypeSafe AI Jev for audio notes.
- **Day 3 — Reactive Web App:** Built the responsive UI with instant search, multi-file re-uploading, and 31 passing unit tests."

---

## Part 3: Show the System Working (Live Web App Demo) (0:45 – 2:15 | 189 words)

**[Screen Share: Switch to https://axeom-challenge-five.vercel.app]**

"Here is the live web app running on Vercel.

**1. The 10-Second Test:**  
Opening this on mobile instantly reveals studio health via hero tiles: 29 canonical clients, active overdue invoices, $8,210 in unbilled work, and $0 cash owed.

**2. Compact Video Board:**  
Fits any screen from 250px mobile to desktop with zero wasted space. Notice the amber **`Action Needed: Unbilled ($900)`** tags and purple **`🎤 Voice Note`** badges.

**3. The Jev Job & Stepper (Click V152):**  
Clicking **V152** for The Ridgeway Lab opens our 6-stage lifecycle drawer. In Stage 3, Carmen emailed requesting brand color orange. Editor Eli logged 0 notes on his board card! Jev caught the missing directive. With one click on **'Sync to Eli's Card'**, the owner pushes it straight to production.

**4. Retainers & Pre-Check Guard:**  
Monthly retainers for Adeyemi Law, Bayou Wealth, and Hillcrest PT are tracked on 1st-of-month advance billing. Under Pre-Check, the engine flags that Blue Bonnet prepaid $1,500 via wire P5121 for rescheduled shoot B154. Our guard automatically voids duplicate invoice INV-1138, confirming **$0 cash owed**.

**5. Dynamic File Re-upload:**  
Clicking **'Add new files'** lets the owner drop updated CSVs; the engine recomputes all aging offsets and queues in 1.1 seconds."

---

## Part 4: Camera On — Answering the 3 Brief Questions (2:15 – 3:55 | 244 words)

**[Screen: Switch to Camera on Face — Confident, Single Take, No Notes, No Cuts]**

"Now, with camera on and no notes, I will answer the 3 required questions:

### Question 1: What was the hardest part, and how did you solve it?
The hardest part was **multi-channel identity resolution without false merges**. 

We had 72 messy name variations across the files. But there were two major traps: Fieldhouse Marketing paid $5,400 across two medical clinics without being a studio client itself. And three individuals—Alana Ibarra, Tasha Torres, and Nolan Nguyen—each operate **two completely separate legal companies**. Naive name-matching would have merged unrelated businesses! 

I solved this by engineering a 3-tier identity graph linking verified business domains, isolating third-party payers, and enforcing legal entity boundaries.

---

### Question 2: What did you get wrong at first?
Two things:
1. **The Blue Bonnet $1,500 Refund Trap:** Seeing cancelled shoot B142 and payment P5121, I assumed Axeom owed a $1,500 refund. Cross-referencing timestamps showed the shoot was rescheduled to October 5 as B154 and delivered. Blue Bonnet had already paid; staff mistakenly issued duplicate invoice INV-1138. Axeom owes $0 cash.
2. **European Date Format Transposition:** `payments.csv` recorded dates as `DD/MM/YYYY`, which scrambled summer payments until I built dual-format parsing.

---

### Question 3: What would you tell the owner to stop doing immediately?
Stop three things:
1. **Stop delivering finished creative work without billing it:** $8,210 is sitting uncollected.
2. **Stop accepting revision requests across personal chats without Jev board sync:** Eli logged 0 notes across 106 cards, leading Hillcrest PT to withhold $5,000.
3. **Stop sending invoices without a Pre-Check balance guard:** Checking prepaid credits first prevents embarrassing duplicate invoices like INV-1138."

---

## Part 5: Operational Wrap-up & Submission (3:55 – 4:15 | 38 words)

**[Screen: Quick Screen Share / Face Camera]**

"Operationally, **Hillcrest PT** is our biggest churn risk—we must call Dr. Alana Ibarra Monday at 9 AM to resolve their withheld $5,000 and save their $30,000 contract.

The app is live at `axeom-challenge-five.vercel.app` with 31 passing tests. Thank you!"
