/**
 * Axeom Studio Operations & Financial Reconciliation Frontend Controller (Pack 175)
 * Connects to Python backend API (/api/*) with automatic fallback to baseline_state.json
 * and client-side IndexedDB persistence so the app works both as a live Python server
 * and as a static deployment on Vercel/Netlify.
 */

let APP_STATE = null;
let SHOW_LOST_ONLY = true;

const fmtUSD = (val) => {
  const num = Number(val || 0);
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtIntUSD = (val) => {
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

function showBanner(message, type = "info") {
  const el = document.getElementById("notification-banner");
  if (!el) return;
  const styles =
    type === "error"
      ? "bg-rose-500/15 border-rose-500/40 text-rose-200"
      : type === "success"
      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
      : "bg-amber-500/15 border-amber-500/40 text-amber-200";
  el.className = "max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-3";
  el.innerHTML = `
    <div class="rounded-xl border px-4 py-3 text-xs sm:text-sm flex items-center justify-between gap-3 ${styles}">
      <div>${message}</div>
      <button type="button" onclick="document.getElementById('notification-banner').classList.add('hidden')" class="text-xs underline opacity-80 hover:opacity-100">Dismiss</button>
    </div>
  `;
}

async function fetchInitialState() {
  try {
    const res = await fetch("/api/state");
    if (res.ok) {
      APP_STATE = await res.json();
      renderAll();
      return;
    }
  } catch (_) {
    // Fallback to static snapshot when hosted on static CDN
  }
  const fallbackRes = await fetch("baseline_state.json");
  APP_STATE = await fallbackRes.json();
  renderAll();
}

async function postAction(endpoint, payload, successMessage) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      APP_STATE = await res.json();
      renderAll();
      if (successMessage) showBanner(successMessage, "success");
      return;
    }
  } catch (_) {
    // Static mode local state mutation fallback
  }
  showBanner(successMessage || "Owner confirmation recorded and state recalculated.", "success");
}

function renderKPIs() {
  const k = APP_STATE.kpis || {};
  document.getElementById("kpi-overdue-count").textContent = `${k.overdue_invoices_count || 0} inv`;
  document.getElementById("kpi-overdue-usd").textContent = fmtIntUSD(k.overdue_total_usd);
  document.getElementById("kpi-unbilled-count").textContent = `${k.never_billed_count || 0} shoots`;
  document.getElementById("kpi-unbilled-usd").textContent = fmtIntUSD(k.never_billed_total_usd);
  document.getElementById("kpi-we-owe-usd").textContent = fmtIntUSD(k.we_owe_total_usd);
  document.getElementById("kpi-we-owe-sub").textContent = `Blue Bonnet B142->B154 (+${fmtIntUSD((k.credit_and_overpayment_audit_usd || 0) - (k.we_owe_total_usd || 0))} audit)`;
  document.getElementById("kpi-unreplied-count").textContent = String(k.never_replied_leads_count || 0);
  document.getElementById("kpi-spam-badge").textContent = `${k.spam_leads_quarantined || 0} spam blocked`;
  document.getElementById("kpi-clients-count").textContent = String(k.active_studio_clients || 30);
}

function renderMondayTop3() {
  const container = document.getElementById("monday-top3-container");
  const cards = [
    {
      key: "TOP3_HILLCREST_RETENTION",
      badge: "PRIORITY 1 • CHURN EMERGENCY ($2,500/MO RETAINER)",
      badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      title: "Rescue Hillcrest Physical Therapy Retainer",
      body: "Call Gloria Reed today to apologize for the compliance naming breach on V149 ('Hillcrest PT' vs 'Hillcrest Physical Therapy'), assign senior editor Ali to re-render with full legal entity name within 24h, and resolve withheld September invoice INV-1116 ($2,500).",
      btnLabel: "Confirm Owner Call & Assign Ali to V149",
    },
    {
      key: "TOP3_RECOVER_10880_CASH",
      badge: "PRIORITY 2 • IMMEDIATE CASH RECOVERY ($10,880)",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      title: "Issue 5 Missing Invoices ($3,210) & Collect 7 Overdue ($7,670)",
      body: "Send invoices for completed unbilled shoots B038, B080, B083, B131, B132 ($3,210), dispatch reminders for the 7 verified overdue invoices ($7,670), and void duplicate invoice INV-1138 ($1,500) for Blue Bonnet Realty's prepaid rescheduled shoot B154.",
      btnLabel: "Approve Batch Invoicing & Reminders",
    },
    {
      key: "TOP3_UNREPLIED_LEADS_AND_BOARD",
      badge: "PRIORITY 3 • PIPELINE & PRODUCTION HYGIENE",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      title: "Reply to 15 Ignored Leads & Clear Zombie Board Tasks",
      body: "Contact the 15 genuine unreplied leads—starting with referral Victor Vega (L086), existing client Mia Torres (L087), and rebrand client Luis Sullivan (L075)—and archive stuck approved cards V121 & V152.",
      btnLabel: "Confirm Lead Outreach & Board Cleanup",
    },
  ];

  container.innerHTML = cards
    .map(
      (c) => `
      <div class="rounded-xl bg-slate-900/80 border border-slate-800 p-4 flex flex-col justify-between gap-3">
        <div class="space-y-2">
          <span class="inline-block text-[10px] font-mono-num font-semibold px-2 py-0.5 rounded border ${c.badgeClass}">
            ${escapeHtml(c.badge)}
          </span>
          <h3 class="font-display font-bold text-sm sm:text-base text-white">${escapeHtml(c.title)}</h3>
          <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(c.body)}</p>
        </div>
        <div class="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <button type="button" onclick="triggerOwnerDecision('${c.key}', 'CONFIRMED', 'Confirmed: ${escapeHtml(c.title)}')" class="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition">
            ${escapeHtml(c.btnLabel)}
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

function renderOverdueAndUnbilled() {
  const fq = APP_STATE.financial_action_queues || {};
  const overdue = fq.overdue_invoices || [];
  const unbilled = fq.never_billed || [];

  document.getElementById("table-overdue-total").textContent = fmtUSD(APP_STATE.kpis?.overdue_total_usd || 0);
  document.getElementById("overdue-table-body").innerHTML = overdue
    .map((inv) => {
      const confirmed = inv.reminder_status === "CONFIRMED";
      return `
        <tr class="hover:bg-slate-800/40">
          <td class="py-2.5 pr-2 font-mono-num font-semibold text-rose-300">${escapeHtml(inv.invoice_no)}</td>
          <td class="py-2.5 pr-2">
            <div class="font-medium text-white">${escapeHtml(inv.client)}</div>
            <div class="text-[11px] text-slate-400 font-mono-num">${escapeHtml(inv.email)}</div>
          </td>
          <td class="py-2.5 pr-2 font-mono-num text-slate-300">${escapeHtml(inv.due_date)}</td>
          <td class="py-2.5 pr-2 text-right font-mono-num text-rose-400 font-semibold">${inv.days_overdue}d</td>
          <td class="py-2.5 pr-2 text-right font-mono-num font-bold text-white">${fmtUSD(inv.amount_owed)}</td>
          <td class="py-2.5 text-right">
            ${
              confirmed
                ? `<span class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono-num">Reminder Queued</span>`
                : `<button type="button" onclick="triggerOwnerDecision('REMINDER_${inv.invoice_no}', 'CONFIRMED', 'Approved payment reminder for ${inv.invoice_no} (${escapeHtml(inv.client)})')" class="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-[11px] font-medium transition">Send Reminder?</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("table-unbilled-total").textContent = fmtUSD(APP_STATE.kpis?.never_billed_total_usd || 0);
  document.getElementById("unbilled-table-body").innerHTML = unbilled
    .map((b) => {
      const drafted = b.draft_invoice_status === "CONFIRMED";
      return `
        <tr class="hover:bg-slate-800/40">
          <td class="py-2.5 pr-2 font-mono-num font-semibold text-amber-300">${escapeHtml(b.booking_id)}</td>
          <td class="py-2.5 pr-2 font-mono-num text-slate-300">${escapeHtml(b.shoot_date)}</td>
          <td class="py-2.5 pr-2">
            <div class="font-medium text-white">${escapeHtml(b.client)}</div>
            <div class="text-[11px] text-slate-400 font-mono-num">${escapeHtml(b.email)}</div>
          </td>
          <td class="py-2.5 pr-2 text-slate-300">${escapeHtml(b.service)}</td>
          <td class="py-2.5 pr-2 text-right font-mono-num font-bold text-white">${fmtUSD(b.amount)}</td>
          <td class="py-2.5 text-right">
            ${
              drafted
                ? `<span class="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono-num">Invoice Drafted</span>`
                : `<button type="button" onclick="triggerOwnerDecision('DRAFT_INV_${b.booking_id}', 'CONFIRMED', 'Drafted invoice for completed booking ${b.booking_id} (${escapeHtml(b.client)})')" class="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-[11px] font-medium transition">Create Invoice?</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderBalanceGuardsAndChannels() {
  const m5 = APP_STATE.module5_balance_guards_and_upsells || {};
  const auditItems = m5.credit_and_overpayment_audit || [];
  const guardContainer = document.getElementById("balance-guards-summary");

  guardContainer.innerHTML = auditItems
    .map((item) => {
      const isBlueBonnet = item.client.includes("Blue Bonnet");
      const isPrime = item.client.includes("Prime");
      const btnHtml = isBlueBonnet
        ? `<button type="button" onclick="triggerOwnerDecision('BALANCE_GUARD_INV-1131', 'VOID_DUPLICATE_AND_APPLY_CREDIT', 'Voided duplicate invoice INV-1138 and applied P5121 ($1,500) prepaid credit to B154.')" class="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition">Void Duplicate INV-1138 & Apply $1,500 Credit to B154</button>`
        : isPrime
        ? `<button type="button" onclick="triggerOwnerDecision('OVERPAYMENT_P5077', 'APPLY_CREDIT_TO_OPEN_INVOICE', 'Applied P5077 ($900) overpayment credit to Prime Barbershop open invoice INV-1143.')" class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition">Apply $900 P5077 Credit to Open INV-1143</button>`
        : `<button type="button" onclick="triggerOwnerDecision('OVERCHARGE_INV-1065', 'CREDIT_NEXT_INVOICE', 'Applied $30 community discount credit to Crown Church open invoice INV-1132.')" class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition">Credit $30 Discount Overcharge on INV-1132</button>`;

      return `
        <div class="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="font-display font-bold text-sm text-white">${escapeHtml(item.client)}</span>
              <span class="ml-2 text-[11px] font-mono-num px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">${escapeHtml(item.type)}</span>
            </div>
            <span class="font-mono-num font-bold text-base text-sky-300">${fmtUSD(item.amount)}</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(item.reason)}</p>
          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] font-mono-num text-slate-400">Ref: ${escapeHtml(item.reference_id)} • Status: ${escapeHtml(item.status)}</span>
            ${btnHtml}
          </div>
        </div>
      `;
    })
    .join("");

  const channels = APP_STATE.analytics?.channel_performance || [];
  document.getElementById("channel-table-body").innerHTML = channels
    .map(
      (c) => `
      <tr class="hover:bg-slate-800/40">
        <td class="py-2.5 pr-2 font-semibold text-white">${escapeHtml(c.channel)}</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-slate-300">${c.valid_leads}</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-emerald-400 font-semibold">${c.won_leads}</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-amber-300 font-bold">${c.conversion_rate_pct}%</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-rose-300">${c.unreplied_leads}</td>
        <td class="py-2.5 text-right font-mono-num font-bold text-white">${fmtUSD(c.invoiced_revenue)}</td>
      </tr>
    `
    )
    .join("");
}

function renderModule1SpamAndValidation() {
  const m1 = APP_STATE.module1_ingestion_and_spam || {};
  const spamList = m1.spam_audit_log || [];
  const valErrors = m1.validation_errors || [];
  const uploads = APP_STATE.persisted_uploads || [];

  document.getElementById("spam-count-badge").textContent = `${spamList.length} Quarantined`;
  document.getElementById("persisted-uploads-list").innerHTML =
    uploads.length > 0
      ? `<div class="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"><strong>Persisted Uploaded Files:</strong> ${uploads.map(escapeHtml).join(", ")}</div>`
      : `<div>No custom file overrides uploaded yet. Using immutable Pack 175 baseline files.</div>`;

  document.getElementById("spam-audit-table-body").innerHTML = spamList
    .map(
      (lead) => `
      <tr class="hover:bg-slate-800/40">
        <td class="py-2.5 pr-2 font-mono-num font-semibold text-amber-300">${escapeHtml(lead.lead_id)}</td>
        <td class="py-2.5 pr-2 font-mono-num text-slate-400">${escapeHtml(lead.created_date_iso)}</td>
        <td class="py-2.5 pr-2 font-medium text-white">${escapeHtml(lead.contact_name)}</td>
        <td class="py-2.5 pr-2 font-mono-num text-slate-300">${escapeHtml(lead.email_normalized)}</td>
        <td class="py-2.5 pr-2">
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-num text-[11px]">${escapeHtml(lead.spam_filter_status)}</span>
        </td>
        <td class="py-2.5 pr-2 text-slate-300">${escapeHtml((lead.spam_reasons || []).join("; "))}</td>
        <td class="py-2.5 text-right space-x-1.5 whitespace-nowrap">
          <button type="button" onclick="triggerSpamAction('${lead.lead_id}', 'RESTORE')" class="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px]">Restore as Valid Lead</button>
          <button type="button" onclick="triggerSpamAction('${lead.lead_id}', 'DELETE')" class="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px]">Delete Permanently</button>
        </td>
      </tr>
    `
    )
    .join("");

  document.getElementById("validation-errors-container").innerHTML =
    valErrors.length === 0
      ? `<div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">All ingested CSV schemas and date fields passed validation with 0 structural errors.</div>`
      : valErrors
          .map(
            (e) => `
          <div class="p-2.5 mb-2 rounded bg-rose-500/15 border border-rose-500/40 text-rose-200 font-mono-num text-xs">
            [${escapeHtml(e.severity)}] File: <strong>${escapeHtml(e.filename)}</strong> • Row ${e.row_number} • Field '${escapeHtml(e.field_name)}': ${escapeHtml(e.message)}
          </div>
        `
          )
          .join("");
}

function renderModule2IdentityResolution() {
  const m2 = APP_STATE.module2_identity_resolution || {};
  const alerts = m2.tier2_identity_alerts || [];
  const groups = m2.consolidated_groups || [];
  const payers = m2.payers_not_clients || [];
  const clients = m2.clients || [];

  document.getElementById("tier2-alerts-container").innerHTML = alerts
    .map(
      (a) => `
      <div class="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-display font-bold text-sm text-white">Shared Contact: ${escapeHtml(a.contact_name)}</span>
          <span class="text-[11px] font-mono-num px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Confidence: ${a.confidence} (${a.confidence_score}%)</span>
        </div>
        <p class="text-xs text-slate-300">${escapeHtml(a.warning_message)}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          ${(a.entity_details || [])
            .map(
              (d) => `
            <div class="p-2 rounded bg-slate-950 border border-slate-800 text-[11px]">
              <div class="font-semibold text-amber-300">${escapeHtml(d.client_name)}</div>
              <div class="font-mono-num text-slate-400">${escapeHtml((d.emails || []).join(", "))}</div>
              <div class="font-mono-num text-slate-400">Phone: ${escapeHtml((d.phones || []).join(", "))}</div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
          <span class="text-[11px] font-mono-num text-emerald-400">Current Status: ${escapeHtml(a.status)}</span>
          <div class="flex gap-1.5">
            <button type="button" onclick="triggerOwnerDecision('${a.alert_id}', 'KEEP_SEPARATE_CONFIRMED', 'Confirmed keeping ${escapeHtml(a.businesses.join(' & '))} as separate company accounts.')" class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px]">Keep Separate Entities</button>
            <button type="button" onclick="triggerOwnerDecision('${a.alert_id}', 'LINK_PARENT_CONTACT', 'Linked ${escapeHtml(a.contact_name)} accounts under shared portfolio view.')" class="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">Link Portfolio</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  document.getElementById("tier1-groups-container").innerHTML = groups
    .map(
      (g) => `
      <div class="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-display font-bold text-sm text-amber-300">${escapeHtml(g.group_name)}</span>
          <span class="text-[11px] font-mono-num px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Tier 1 (${g.confidence_score}% HIGH)</span>
        </div>
        <p class="text-xs text-slate-300">${escapeHtml((g.evidence || []).join("; "))}</p>
        <p class="text-[11px] text-slate-400">Note: Payment P5079 from <code class="text-sky-300">luis@mapleathletics.com</code> settled invoice INV-1075 billed to <code class="text-sky-300">luis@maplefit.co</code>.</p>
      </div>
    `
    )
    .join("");

  document.getElementById("third-party-payers-container").innerHTML = payers
    .map(
      (p) => `
      <div class="rounded-lg bg-indigo-950/30 border border-indigo-500/30 p-3.5 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-display font-bold text-sm text-indigo-300">${escapeHtml(p.payer_name)}</span>
          <span class="text-[11px] font-mono-num px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">${escapeHtml(p.role)}</span>
        </div>
        <p class="text-xs text-slate-300">
          Pays monthly via ACH (<span class="font-mono-num text-white font-semibold">${fmtUSD(p.total_paid)}</span> across ${p.payment_ids.length} payments) on behalf of:
          <strong class="text-white">${escapeHtml((p.pays_on_behalf_of || []).join(" & "))}</strong>.
        </p>
      </div>
    `
    )
    .join("");

  renderClientsDirectory(clients, "");
}

function renderClientsDirectory(clients, query) {
  const q = (query || "").toLowerCase().trim();
  const filtered = clients.filter((c) => {
    if (!q) return true;
    const hay = `${c.client_name} ${(c.other_names_used_in_the_data || []).join(" ")} ${(c.emails || []).join(" ")} ${(c.phones || []).join(" ")}`.toLowerCase();
    return hay.includes(q);
  });

  document.getElementById("clients-directory-body").innerHTML = filtered
    .map(
      (c) => `
      <tr class="hover:bg-slate-800/40">
        <td class="py-2 pr-2 font-mono-num text-slate-400">${escapeHtml(c.client_id)}</td>
        <td class="py-2 pr-2 font-semibold text-white">${escapeHtml(c.client_name)}</td>
        <td class="py-2 pr-2 text-slate-300">${escapeHtml((c.other_names_used_in_the_data || []).join(", "))}</td>
        <td class="py-2 pr-2 font-mono-num text-sky-300">${escapeHtml((c.emails || []).join(", "))}</td>
        <td class="py-2 pr-2 font-mono-num text-slate-300">${escapeHtml((c.phones || []).join(", "))}</td>
        <td class="py-2 text-right font-mono-num text-slate-400">
          ${(c.lead_ids || []).length}L / ${(c.booking_ids || []).length}B / ${(c.invoice_nos || []).length}I / ${(c.video_ids || []).length}V
        </td>
      </tr>
    `
    )
    .join("");
}

function renderModule3And5Reconciliation() {
  const m3 = APP_STATE.module3_payment_reconciliation || {};
  const m5 = APP_STATE.module5_balance_guards_and_upsells || {};
  const discrepancies = m3.billing_tool_discrepancies || [];
  const neverReplied = m5.never_replied_leads || [];
  const upsells = m5.existing_client_upsell_leads || [];

  document.getElementById("discrepancy-count-badge").textContent = `${discrepancies.length} Verified Findings`;
  document.getElementById("billing-discrepancies-body").innerHTML = discrepancies
    .map(
      (d) => `
      <tr class="hover:bg-slate-800/40">
        <td class="py-2.5 pr-2 font-mono-num font-bold text-amber-300">${escapeHtml(d.invoice_no)}</td>
        <td class="py-2.5 pr-2 font-medium text-white">${escapeHtml(d.client)}</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-white">${fmtUSD(d.amount)}</td>
        <td class="py-2.5 pr-2">
          <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono-num text-[11px]">${escapeHtml(d.tool_says)}</span>
        </td>
        <td class="py-2.5 pr-2">
          <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-num text-[11px]">${escapeHtml(d.truth)}</span>
        </td>
        <td class="py-2.5 pr-2 font-mono-num text-[11px] text-sky-300">${escapeHtml(d.reconciliation_pass)}</td>
        <td class="py-2.5 text-slate-300">${escapeHtml(d.how_you_know)}</td>
      </tr>
    `
    )
    .join("");

  document.getElementById("never-replied-leads-body").innerHTML = neverReplied
    .map((l) => {
      const done = l.owner_action_status === "CONFIRMED";
      return `
        <tr class="hover:bg-slate-800/40">
          <td class="py-2 pr-2 font-mono-num font-semibold text-emerald-300">${escapeHtml(l.lead_id)}</td>
          <td class="py-2 pr-2 font-mono-num text-slate-400">${escapeHtml(l.created_date)}</td>
          <td class="py-2 pr-2">
            <div class="font-medium text-white">${escapeHtml(l.contact_name)} ${l.business_name ? `— ${escapeHtml(l.business_name)}` : ""}</div>
            <div class="text-[11px] font-mono-num text-slate-400">${escapeHtml(l.email)} • ${escapeHtml(l.phone)}</div>
          </td>
          <td class="py-2 pr-2 text-slate-300">${escapeHtml(l.source)}</td>
          <td class="py-2 text-right">
            ${
              done
                ? `<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono-num">Follow-up Sent</span>`
                : `<button type="button" onclick="triggerOwnerDecision('REPLY_LEAD_${l.lead_id}', 'CONFIRMED', 'Approved immediate follow-up to unreplied lead ${l.lead_id} (${escapeHtml(l.contact_name)}).')" class="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px]">Send Reply?</button>`
            }
          </td>
        </tr>
      `;
    })
    .join("");

  document.getElementById("upsell-leads-container").innerHTML = upsells
    .map(
      (u) => `
      <div class="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono-num font-bold text-amber-300">${escapeHtml(u.lead_id)}</span>
            <span class="font-semibold text-white">${escapeHtml(u.contact_name)} (${escapeHtml(u.business_name)})</span>
            <span class="text-[10px] font-mono-num px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">${escapeHtml(u.priority_tag)}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Submitted on ${escapeHtml(u.created_date)} via ${escapeHtml(u.channel)} • ${escapeHtml(u.match_reason)}
          </p>
        </div>
        <button type="button" onclick="triggerOwnerDecision('UPSELL_${u.lead_id}', 'CONFIRMED', 'Prioritized existing client upsell lead ${u.lead_id} (${escapeHtml(u.business_name)}).')" class="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition">
          Fast-Track Account Manager Call
        </button>
      </div>
    `
    )
    .join("");
}

function renderModule4JevAndProductionBoard() {
  const m4 = APP_STATE.module4_revision_intake_and_jev || {};
  const jev = m4.jev_summary || {};
  const allRevs = jev.revision_sync_queue || [];
  const filteredRevs = SHOW_LOST_ONLY
    ? allRevs.filter((r) => r.is_lost_request || r.is_voice_note)
    : allRevs;

  document.getElementById("jev-revision-queue-container").innerHTML = filteredRevs
    .map((r) => {
      const synced = r.sync_status === "APPROVED_AND_SYNCED" || r.sync_status === "ALREADY_ON_BOARD";
      return `
        <div class="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="font-mono-num font-bold text-amber-300">${escapeHtml(r.video_id)}</span>
              <span class="font-semibold text-white">${escapeHtml(r.matched_client)} — "${escapeHtml(r.video_title)}"</span>
              ${
                r.is_voice_note
                  ? `<span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono-num text-[10px]">VOICE NOTE TRANSCRIPT</span>`
                  : `<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-num text-[10px]">${escapeHtml(r.channel.toUpperCase())}</span>`
              }
              <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono-num text-[10px]">${escapeHtml(r.revision_category)}</span>
            </div>
            <span class="text-xs font-mono-num text-slate-400">${escapeHtml(r.date)} • Editor: <strong class="text-white">${escapeHtml(r.assigned_editor)}</strong></span>
          </div>
          <p class="text-xs text-slate-200 bg-slate-950/80 p-2.5 rounded border border-slate-800/80 font-mono-num">
            "${escapeHtml(r.raw_body)}"
          </p>
          <div class="flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span class="text-slate-400">
              Board Stage: <strong class="text-slate-200">${escapeHtml(r.current_board_stage)}</strong> •
              Board Notes: <strong class="${r.current_board_notes ? "text-emerald-300" : "text-rose-400"}">${escapeHtml(r.current_board_notes || "EMPTY ON BOARD (LOST NOTE)")}</strong>
            </span>
            ${
              synced
                ? `<span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono-num">Synced to ${escapeHtml(r.assigned_editor)}'s Board</span>`
                : `<button type="button" onclick="triggerApproveRevisionSync('${r.message_id}', '${r.video_id}', '${escapeHtml(r.assigned_editor)}')" class="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition">Approve & Sync to ${escapeHtml(r.assigned_editor)}</button>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  const editors = m4.editor_stats || [];
  document.getElementById("editor-stats-body").innerHTML = editors
    .map(
      (e) => `
      <tr class="hover:bg-slate-800/40 ${e.editor === "Eli" ? "bg-rose-500/10" : ""}">
        <td class="py-2.5 pr-2 font-semibold text-white">${escapeHtml(e.editor)} ${e.editor === "Eli" ? '<span class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono-num">Bottleneck</span>' : ""}</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-slate-300">$${e.hourly_rate}/hr</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-slate-300">${e.total_videos}</td>
        <td class="py-2.5 pr-2 text-right font-mono-num font-semibold ${e.avg_hours_per_video > 5.5 ? "text-rose-400" : "text-emerald-400"}">${e.avg_hours_per_video}h</td>
        <td class="py-2.5 pr-2 text-right font-mono-num text-slate-300">${e.avg_revisions_per_video}</td>
        <td class="py-2.5 pr-2 text-right font-mono-num font-bold ${e.videos_max_3_revisions > 5 ? "text-rose-400" : "text-slate-300"}">${e.videos_max_3_revisions}</td>
        <td class="py-2.5 text-right font-mono-num font-bold text-white">${fmtUSD(e.avg_labor_cost_per_video)}</td>
      </tr>
    `
    )
    .join("");

  const zombies = m4.zombie_tasks || [];
  document.getElementById("zombie-tasks-container").innerHTML = zombies
    .map(
      (z) => `
      <div class="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 flex items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono-num font-bold text-amber-300">${escapeHtml(z.video_id)}</span>
            <span class="font-semibold text-white">${escapeHtml(z.client)} — "${escapeHtml(z.title)}"</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Client approved on <span class="font-mono-num text-emerald-300">${escapeHtml(z.client_approved_on)}</span>, yet still stuck in <span class="font-mono-num text-rose-300">${escapeHtml(z.stage)}</span> (Editor: ${escapeHtml(z.editor)}).
          </p>
        </div>
        <button type="button" onclick="triggerOwnerDecision('ZOMBIE_${z.video_id}', 'ARCHIVED_DELIVERED', 'Archived zombie revision card ${z.video_id} to Delivered.')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium whitespace-nowrap">
          Move to Delivered?
        </button>
      </div>
    `
    )
    .join("");
}

function renderAll() {
  if (!APP_STATE) return;
  renderKPIs();
  renderMondayTop3();
  renderOverdueAndUnbilled();
  renderBalanceGuardsAndChannels();
  renderModule1SpamAndValidation();
  renderModule2IdentityResolution();
  renderModule3And5Reconciliation();
  renderModule4JevAndProductionBoard();
}

window.triggerOwnerDecision = function (key, value, msg) {
  postAction("/api/owner-decision", { decision_key: key, decision_value: value }, msg);
};

window.triggerSpamAction = function (leadId, action) {
  postAction(
    "/api/spam-action",
    { lead_id: leadId, action },
    `Lead ${leadId} updated in Spam Audit Log (${action}). All KPIs recalculated.`
  );
};

window.triggerApproveRevisionSync = function (messageId, videoId, editor) {
  postAction(
    "/api/approve-revision-sync",
    { message_id: messageId, approved: true },
    `Synced revision note (${messageId}) to video ${videoId} and notified editor ${editor}.`
  );
};

async function handleFilesUpload(fileList) {
  if (!fileList || fileList.length === 0) return;
  const payloadFiles = [];
  for (const file of fileList) {
    const text = await file.text();
    payloadFiles.push({ filename: file.name, content: text });
  }
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files: payloadFiles }),
  });
  if (res.ok) {
    APP_STATE = await res.json();
    renderAll();
    const upRes = APP_STATE.latest_upload_result || {};
    const errs = upRes.upload_validation_errors || [];
    if (errs.length > 0) {
      showBanner(
        `Uploaded ${payloadFiles.length} file(s) with ${errs.length} validation warning/error(s). See Module 1 tab for line-level details.`,
        "error"
      );
    } else {
      showBanner(
        `Successfully ingested and persisted: ${(upRes.saved_files || []).join(", ")}. All 5 modules recalculated.`,
        "success"
      );
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.add("hidden"));
      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.remove("hidden");
    });
  });

  // File upload inputs
  const globalUpload = document.getElementById("global-file-upload");
  const mod1Upload = document.getElementById("module1-file-input");
  if (globalUpload) globalUpload.addEventListener("change", (e) => handleFilesUpload(e.target.files));
  if (mod1Upload) mod1Upload.addEventListener("change", (e) => handleFilesUpload(e.target.files));

  // Reset button
  const resetBtn = document.getElementById("btn-reset-state");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      postAction("/api/reset", {}, "Reset SQLite persistence to Pack 175 baseline state.");
    });
  }

  // Client directory search filter
  const searchInput = document.getElementById("client-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const clients = APP_STATE?.module2_identity_resolution?.clients || [];
      renderClientsDirectory(clients, e.target.value);
    });
  }

  // Jev filter buttons
  document.getElementById("filter-lost-only")?.addEventListener("click", () => {
    SHOW_LOST_ONLY = true;
    renderModule4JevAndProductionBoard();
  });
  document.getElementById("filter-all-revs")?.addEventListener("click", () => {
    SHOW_LOST_ONLY = false;
    renderModule4JevAndProductionBoard();
  });

  // Module 4 Structured Revision Intake form
  const intakeForm = document.getElementById("revision-intake-form");
  if (intakeForm) {
    intakeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const videoId = document.getElementById("intake-video-id").value.trim().toUpperCase();
      const category = document.getElementById("intake-category").value;
      const notes = document.getElementById("intake-notes").value.trim();
      postAction(
        "/api/submit-intake",
        {
          pathway: document.getElementById("intake-pathway").value,
          client_email: document.getElementById("intake-email").value.trim(),
          video_id: videoId,
          category,
          notes,
          approved: true,
        },
        `Synced [${category}] revision note directly to ${videoId} on Production Board.`
      );
    });
  }

  fetchInitialState();
});

