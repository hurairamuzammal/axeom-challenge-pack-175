# AI Contributions and Verification Log

### Tooling Used
- Primary AI Assistant (Architecture & Data Analysis)
- Secondary AI Agent (Code Implementation)

### Verification & Corrections
- **Mistake Caught:** AI initially merged distinct business entities (e.g., Meridian Bridal and Beacon Med Spa) solely because contact person Alana Ibarra shared a name.
- **Human Verification:** Verified business registration names and phone numbers; kept them as separate business client accounts owned by the same contact.
- **Financial Validation:** I asked AI not to delete any record and asked to skip spam-based lead data as it was artificially inflating lead counts.
- **Entity & Multi-Email Resolution:** AI initially proposed using primary email as the sole matching key. Human caught that clients frequently use secondary or personal emails to book or pay (e.g. Mia Torres paying via personal Gmail, Fieldhouse Marketing paying on behalf of external clinics). Human mandated multi-attribute cross-checks across bank payer names, phone numbers, and payment references.
- **Rescheduled Shoot vs. Cash Liability:** AI initially claimed Axeom owes Blue Bonnet Realty $1,500 for cancelled booking `B142`. Human verified that the shoot was rescheduled to October 5 (`B154`) and completed, with payment `P5121` ($1,500) received on September 28. Human identified that Axeom generated an extra redundant invoice `INV-1138` for an already-paid session.
- **Process Automation Architecture:** Human formulated an intake routing workflow for WhatsApp and Instagram to categorize existing client revision requests, capture video IDs, and automatically append notes directly to the assigned editor on the production board.
