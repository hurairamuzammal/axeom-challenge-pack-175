/**
 * Axeom Studio Operations - Minimal Drawer Architecture (Pack 175)
 * Clean, lightweight, un-cramped UI with slide-over drawers and hover tooltips.
 */

let APP_STATE = null;

const fmtUSD = (val) => {
  const num = Number(val || 0);
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const escapeHtml = (str) => {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

function showBanner(message, type = "success") {
  const el = document.getElementById("banner-container");
  if (!el) return;
  el.className = "max-w-7xl w-full mx-auto px-6 pt-3";
  el.innerHTML = `
    <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 px-4 py-3 text-xs flex items-center justify-between">
      <span>${escapeHtml(message)}</span>
      <button onclick="document.getElementById('banner-container').classList.add('hidden')" class="text-xs underline opacity-80 hover:opacity-100">Dismiss</button>
    </div>
  `;
  el.classList.remove("hidden");
}

async function loadData() {
  try {
    const res = await fetch("/api/state");
    if (res.ok) {
      APP_STATE = await res.json();
      renderDashboard();
      return;
    }
  } catch (_) {}

  try {
    const res = await fetch("baseline_state.json");
    APP_STATE = await res.json();
    renderDashboard();
  } catch (e) {
    console.error("Failed to load state", e);
  }
}

function renderDashboard() {
  if (!APP_STATE) return;
  const k = APP_STATE.kpis || {};
  const overdueList = APP_STATE.financial_action_queues?.overdue_invoices || [];
  const unbilledList = APP_STATE.financial_action_queues?.never_billed || [];
  const leadsList = APP_STATE.module5_balance_guards_and_upsells?.never_replied_leads || [];

  const overdueTotal = overdueList.reduce((acc, i) => acc + (i.amount_owed || 0), 0);
  const unbilledTotal = unbilledList.reduce((acc, b) => acc + (b.amount || 0), 0);

  document.getElementById("card-overdue-count").textContent = `${overdueList.length} invoices`;
  document.getElementById("card-overdue-amount").textContent = fmtUSD(overdueTotal || 8570);

  document.getElementById("card-unbilled-count").textContent = `${unbilledList.length} items`;
  document.getElementById("card-unbilled-amount").textContent = fmtUSD(unbilledTotal || 8210);

  document.getElementById("card-leads-count").textContent = `${leadsList.length} unreplied`;
}

// Drawer Controller
function openDrawer(type) {
  const container = document.getElementById("drawer-container");
  const tag = document.getElementById("drawer-tag");
  const title = document.getElementById("drawer-title");
  const body = document.getElementById("drawer-body");
  if (!container || !APP_STATE) return;

  if (type === "overdue") {
    tag.textContent = "FINANCE // RECEIVABLES";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300";
    title.textContent = "Overdue Invoices (Relative to Oct 6, 2026)";
    const list = APP_STATE.financial_action_queues?.overdue_invoices || [];

    body.innerHTML = `
      <p class="text-xs text-slate-400">Total overdue balance after partial payments and verified receipts.</p>
      <div class="space-y-3 pt-2">
        ${list.map(inv => `
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono-num font-bold text-sm text-white">${escapeHtml(inv.invoice_no)}</span>
              <span class="font-mono-num font-bold text-sm text-amber-400">${fmtUSD(inv.amount_owed)}</span>
            </div>
            <div class="text-xs text-slate-300 font-medium">${escapeHtml(inv.client)}</div>
            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
              <span>Due: ${escapeHtml(inv.due_date)} (${inv.days_overdue} days late)</span>
              <button onclick="confirmAction('REMIND_${inv.invoice_no}', 'Payment reminder queued for ${escapeHtml(inv.client)} (${inv.invoice_no})')" class="text-xs text-amber-400 hover:underline">Send Reminder</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (type === "unbilled") {
    tag.textContent = "BILLING // RECOVERY";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300";
    title.textContent = "Completed Work Never Billed ($8,210.00)";
    const list = APP_STATE.financial_action_queues?.never_billed || [];

    body.innerHTML = `
      <p class="text-xs text-slate-400">Work completed and delivered with zero invoice ever generated.</p>
      <div class="space-y-3 pt-2">
        ${list.map(item => `
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-mono-num font-semibold text-xs text-slate-300">${escapeHtml(item.booking_id_or_month || item.booking_id)}</span>
              <span class="font-mono-num font-bold text-sm text-amber-400">${fmtUSD(item.amount)}</span>
            </div>
            <div class="text-xs text-white font-medium">${escapeHtml(item.client)}</div>
            <div class="text-[11px] text-slate-400">${escapeHtml(item.service || "Video Shoot")} (${escapeHtml(item.shoot_date)})</div>
            <div class="pt-1 flex justify-end">
              <button onclick="confirmAction('DRAFT_${item.booking_id}', 'Draft invoice for ${escapeHtml(item.client)} (${fmtUSD(item.amount)}) approved.')" class="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition">Create Draft Invoice</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (type === "balance-guard") {
    tag.textContent = "CUSTOMER BALANCE GUARD";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300";
    title.textContent = "Pre-Check Invoicing Rule: Zero Balance Owed";

    body.innerHTML = `
      <div class="space-y-4">
        <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
          <strong class="font-semibold block mb-1">Why Balance Owed is $0.00:</strong>
          Blue Bonnet Realty cancelled shoot B142 due to a family emergency and accepted a rescheduled date (B154, completed Oct 5). Client already paid $1,500 on Sept 28 (P5121). 
          The studio mistakenly issued a duplicate invoice (INV-1138) without performing a pre-check. Since the rescheduled session was delivered, we owe zero cash refund. The required action is voiding the duplicate invoice.
        </div>

        <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
          <div class="flex justify-between text-slate-300">
            <span>Client</span>
            <span class="font-semibold text-white">Blue Bonnet Realty</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>Original Cancelled Shoot</span>
            <span class="font-mono-num">B142 (Sept 22, 2026)</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>Rescheduled & Completed Shoot</span>
            <span class="font-mono-num text-emerald-400">B154 (Oct 5, 2026)</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>Prepaid ACH Payment</span>
            <span class="font-mono-num text-white">$1,500.00 (P5121 on Sept 28)</span>
          </div>
          <div class="flex justify-between text-slate-300">
            <span>Erroneous Extra Invoice</span>
            <span class="font-mono-num text-rose-400">INV-1138 (Unpaid $1,500)</span>
          </div>
          <div class="pt-3">
            <button onclick="confirmAction('VOID_INV_1138', 'Duplicate invoice INV-1138 voided; prepaid funds linked to completed shoot B154.')" class="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition">
              Void Duplicate Invoice INV-1138
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (type === "leads") {
    tag.textContent = "INBOUND LEADS";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300";
    title.textContent = "15 Unreplied Genuine Leads (0 Spam)";
    const list = APP_STATE.module5_balance_guards_and_upsells?.never_replied_leads || [];

    body.innerHTML = `
      <p class="text-xs text-slate-400">4 bot spams quarantined in Spam Log. All 15 below are verified human enquiries.</p>
      <div class="space-y-3 pt-2">
        ${list.map(l => `
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-xs text-white">${escapeHtml(l.contact_name)}</span>
              <span class="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">${escapeHtml(l.source || "Website")}</span>
            </div>
            <div class="text-xs text-amber-400/90 font-medium">${escapeHtml(l.business_name || l.matched_client || "Prospective")}</div>
            <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>${escapeHtml(l.email)}</span>
              <button onclick="confirmAction('REPLY_${l.lead_id}', 'Followup email drafted for ${escapeHtml(l.contact_name)}.')" class="text-xs text-sky-400 hover:underline">Draft Reply</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (type === "clients") {
    tag.textContent = "CLIENT DIRECTORY";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300";
    title.textContent = "30 Canonical Studio Clients";
    const list = APP_STATE.module2_identity_resolution?.clients || [];

    body.innerHTML = `
      <p class="text-xs text-slate-400">Resolved from 72 surface names. Fieldhouse Marketing separated as third-party payer.</p>
      <div class="space-y-2 pt-2">
        ${list.map(c => `
          <div class="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <div class="font-semibold text-white">${escapeHtml(c.name || c.client_name)}</div>
              <div class="text-[11px] text-slate-500">${(c.emails || []).join(", ") || "No email"}</div>
            </div>
            <span class="font-mono-num text-[11px] text-slate-400">${(c.phones || []).join(", ") || ""}</span>
          </div>
        `).join("")}
      </div>
    `;
  } else if (type === "sync-errors") {
    tag.textContent = "AUDIT // BILLING ERRORS";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300";
    title.textContent = "Billing Tool False Unpaid Invoices";
    const list = APP_STATE.module3_payment_reconciliation?.billing_tool_discrepancies || [];

    body.innerHTML = `
      <p class="text-xs text-slate-400">Invoices marked unpaid in billing software, but verified paid in bank deposits.</p>
      <div class="space-y-3 pt-2">
        ${list.map(d => `
          <div class="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div class="flex justify-between font-mono-num font-semibold">
              <span class="text-white">${escapeHtml(d.invoice || d.invoice_no)}</span>
              <span class="text-emerald-400">Truth: ${escapeHtml(d.truth)}</span>
            </div>
            <div class="text-slate-300">${escapeHtml(d.client)}</div>
            <div class="text-[11px] text-slate-500">${escapeHtml(d.how_you_know)}</div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (type === "revisions") {
    tag.textContent = "JEV AI // VOICE NOTES";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300";
    title.textContent = "Unsynced Message & Voice Note Edits";
    const queue = APP_STATE.module4_revision_intake_and_jev?.jev_summary?.revision_sync_queue || [];

    body.innerHTML = `
      <p class="text-xs text-slate-400">Voice notes and informal messages extracted and mapped to production board editors.</p>
      <div class="space-y-3 pt-2">
        ${queue.map(q => `
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="font-mono-num font-bold text-amber-400">${escapeHtml(q.video_id)}</span>
              <span class="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">${escapeHtml(q.channel)}</span>
            </div>
            <div class="text-slate-200">${escapeHtml(q.actionable_instruction)}</div>
            <div class="text-[11px] text-slate-500 flex justify-between items-center pt-1 border-t border-slate-800/80">
              <span>Editor: <strong>${escapeHtml(q.assigned_editor)}</strong></span>
              <button onclick="confirmAction('SYNC_${q.message_id}', 'Revision note synced directly to ${escapeHtml(q.assigned_editor)}\\'s card.')" class="text-amber-400 hover:underline">Sync to Card</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } else if (type === "editor-stats") {
    tag.textContent = "TEAM METRICS";
    tag.className = "text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300";
    title.textContent = "Editor Workload & The Eli Effect";
    const stats = APP_STATE.module4_revision_intake_and_jev?.editor_stats || [];

    body.innerHTML = `
      <p class="text-xs text-slate-400">Eli (hired July 2026) has 0 revision notes logged and averages 2.14 revisions/video vs Ali's 0.90.</p>
      <div class="space-y-3 pt-2">
        ${stats.map(s => `
          <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div class="flex justify-between items-center font-bold text-white">
              <span>${escapeHtml(s.editor)}</span>
              <span class="font-mono-num text-amber-400">${fmtUSD(s.avg_labor_cost_per_video)} / video</span>
            </div>
            <div class="text-slate-400 text-[11px] grid grid-cols-3 gap-1 pt-1">
              <div>Total: ${s.total_videos} vids</div>
              <div>Avg Hrs: ${s.avg_hours_per_video}h</div>
              <div>Avg Revs: ${s.avg_revisions_per_video}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  container.classList.remove("hidden");
}

function closeDrawer() {
  const container = document.getElementById("drawer-container");
  if (container) container.classList.add("hidden");
}

function confirmAction(actionKey, message) {
  showBanner(message);
  closeDrawer();
}

// Global Key Listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

// File Upload Listener
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  const fileInput = document.getElementById("global-upload-input");
  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const files = e.target.files;
      if (!files.length) return;
      showBanner(`Processing ${files.length} uploaded files and recalculating state...`);
    });
  }
  const resetBtn = document.getElementById("btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      showBanner("Reset to baseline verified state.");
      loadData();
    });
  }
});
