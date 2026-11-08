# Video Walkthrough Script & Transcript (Pack 175)

**Presenter:** Muhammad Abu Huraira (`huraira.eqeel@gmail.com`)  
**Pack ID:** 175  
**Reference Date ("Today"):** Tuesday, October 6, 2026  
**Target Duration:** 6 to 8 minutes  
**Format:** Uncut single-take recording, screen-share demonstrating the live app, followed by camera-on answering the 3 core questions.

---

## Part 1: Live System Walkthrough (0:00 – 4:00)

**[Camera on / Screen Share: https://axeom-challenge-five.vercel.app]**

"Hi everyone, I'm Muhammad Abu Huraira. Today, I'm presenting the operations and financial recovery platform I built for Axeom Studio, Pack 175.

Our reference date today is Tuesday, October 6, 2026. 

Axeom is a high-volume Dallas video and podcast studio. They invoiced $103,890.00 and collected $83,390.00 in cash. But behind that growth, manual communication and messy spreadsheets caused serious leaks.

Let me walk you through the live system running on Vercel.

### 1. The 10-Second Test & Top Square Tiles
At the top of the screen, we have 5 clean square tiles designed for quick mobile scanning:
- **Videos Tile (344):** Every single video on the production board, tracked with hours, revisions, and status.
- **Clients Tile (30):** 30 tracked client entities representing 29 true client accounts plus Fieldhouse Marketing, who is a third-party payer.
- **Overdue Tile ($8,570.00):** 8 overdue invoices aged relative to today, October 6, 2026.
- **Pre-Check Guard Tile ($0.00 Owed):** Shows that we do not owe any cash refund. Our pre-check guard links prepaid deposits to rescheduled shoots.
- **Audit & Decisions Tile:** Gives a complete file-by-file breakdown of every mistake caught, decision made, and business reason.

### 2. Video Explorer: Search, Sorting & 3 View Modes
With 344 videos, endless scrolling is frustrating on a phone. So we added:
- **Instant Search:** As you type 'V049', 'Nina', or 'Hillcrest', it filters immediately.
- **Filters & Sorting:** You can filter by date (like July 2026 when editor Eli joined), by editor (Ali, Rita, Eli, Jules), or by stage (like voice notes or zombie tasks).
- **3 Scannable Views:**
  1. *Square Tiles Grid* with large icons.
  2. *Dense List Mode* for rapid row-by-row scanning.
  3. *Grouped by Client Accordion* to see all videos under each client account.

### 3. File Dependency Graph & Hover Inspector
When you click **Audit & Decisions**, you see an interactive dependency graph covering all 8 files.
Hovering over or tapping any card—like `payments.csv` or `production_board.csv`—shows:
- The exact mistake caught (for example, European DD/MM/YYYY date formats, or 41% of delivered videos missing client sign-off).
- The decision taken.
- The financial justification.
Below that, we document the full 5-step methodology from raw ingestion to verified balances.

### 4. Jev System One Integration (docs.typesafe.ai)
To fix lost revision requests, we integrated TypeSafe Jev. Unlike generic LLMs that take 3 seconds and hallucinate video numbers, Jev is a System One decision model. It evaluates typed questions in under 200 milliseconds.
On our live dashboard, you can see all 6 audio voice notes rescued from `messages.txt` with their 1:28 duration logs, and an interactive tester where you can type any message to see Jev's typed JSON verdict."

---

## Part 2: The Three Core Questions (4:00 – 7:30)

**[Camera on presenter, no notes, no cuts]**

### Question 1: What was the hardest part, and how did you solve it?

"The hardest part was **multi-channel entity resolution without creating false merges**.

In the raw files, staff recorded 72 different surface names for what turned out to be 29 true clients. But the data had two dangerous traps:
1. First, clients pay and book using different names and emails. For example, Mia Torres booked under `Heart & Hustle Radio` with her business email `mia@heartandhustle.fm`, but paid through personal Zelle from `mia.torres.mail@gmail.com`. And `Fieldhouse Marketing` was paying for two completely separate clinics (`Vista Pediatrics` and `Parkside Chiropractic`) without being a client themselves.
2. Second, three individuals—Alana Ibarra, Tasha Torres, and Nolan Nguyen—each manage two distinct legal businesses with different phone numbers and websites. If you do simple name matching, you merge separate companies into one mess.

I solved this by building a **3-tier identity graph**:
- Tier 1: Verified contact identifiers (phone numbers, domains, company registrations).
- Tier 2: Guardrails that separate contacts sharing a name across different legal entities.
- Tier 3: Third-party payer isolation so agency payments route to the correct client balance."

---

### Question 2: What did you get wrong at first?

"I got two main things wrong at first:

1. **The Blue Bonnet Realty Cash Refund Trap:**  
   At first, looking at cancelled shoot `B142` and the $1,500 wire payment `P5121`, it looked like Axeom owed Blue Bonnet a $1,500 cash refund.  
   When I looked closer at the messages and bookings, I realized the shoot had been rescheduled to October 5 as `B154`—and it was already filmed and delivered! Blue Bonnet had already paid. The real problem was that Axeom generated a second, duplicate invoice `INV-1138` for $1,500 without checking if the client had already paid.  
   Axeom does not owe any cash. We simply need to void the duplicate invoice `INV-1138` and apply the prepayment to the delivered shoot.

2. **Date Format Transposition:**  
   At first, standard date parsers read `payments.csv` using US formatting (`MM/DD/YYYY`). This scrambled payments from July and August into non-existent months or future dates because `payments.csv` was recorded in European `DD/MM/YYYY` format. I caught this when payments appeared out of chronological order against bank deposits, and I solved it by enforcing strict dual-format date parsing."

---

### Question 3: What would you tell the owner to stop doing?

"I would tell Zaid to stop doing three things immediately:

1. **Stop sending invoices without a Pre-Check Balance Guard:**  
   Sending duplicate invoice `INV-1138` to Blue Bonnet for a shoot they already paid for looks amateur and damages client trust. Every invoice draft must check prepaid balances first.

2. **Stop accepting client revisions across fragmented personal chats:**  
   Client requests arrive on WhatsApp, Instagram DMs, personal emails, and 6 audio voice notes. 78% of production cards had empty notes. Junior editor Eli had zero notes logged across 106 videos. And Gloria Reed at Hillcrest Physical Therapy is withholding $5,000 because her compliance naming revisions were ignored twice. Axeom must mandate a single typed intake channel powered by Jev so revisions automatically sync to the assigned editor.

3. **Stop delivering work without billing it:**  
   Axeom completed 2 May retainers worth $5,000 and 5 completed video shoots worth $3,210 that were never invoiced. That is $8,210.00 of completed studio work left on the table simply because nobody checked unbilled bookings."

---

## Conclusion & Outro (7:30 – 8:00)

"All numbers, test cases, and code are verified and running live on Vercel at `axeom-challenge-five.vercel.app` and on GitHub. Thank you for your time and for reviewing my submission."

