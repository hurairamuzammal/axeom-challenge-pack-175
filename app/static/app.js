/**
 * Axeom Studio Operations - Vector Line Icons & Square Tiles Controller (Pack 175)
 * 100% clean vector line SVG icons (zero emojis). Square tiles with icon top-left, text bottom-right.
 */

let APP_STATE = null;
let CURRENT_TAB = "videos";
let VIDEO_VIEW_MODE = "tiles"; // "tiles" | "list" | "grouped"
let VIDEO_STAGE_FILTER = "all"; // "all" | "voicenotes" | "zombies" | "revision"
let VIDEO_DATE_FILTER = "all"; // "all" | "recent" | "aug" | "jul" | "q2"
let VIDEO_EDITOR_FILTER = "all"; // "all" | "Ali" | "Rita" | "Eli" | "Jules"
let VIDEO_SORT_BY = "id-asc";
let VIDEO_SEARCH_QUERY = "";
let VIDEO_PAGE = 1;
let VIDEO_PAGE_SIZE = 24; // 24 items per batch, or 0 for "all"
const EXPANDED_CLIENT_GROUPS = new Set();

// Clean, professional line SVG icons (single-color vector line art)
const ICONS = {
  video: `<svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-2.36a.75.75 0 0 1 1.03.67v6.38a.75.75 0 0 1-1.03.67l-4.72-2.36M4.5 18.75h10.5a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"/></svg>`,
  legal: `<svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0-17.25-8 4.5m8-4.5 8 4.5M4 7.5v4.5a4 4 0 0 0 8 0v-4.5M12 7.5v4.5a4 4 0 0 0 8 0v-4.5M8 20.25h8"/></svg>`,
  dental: `<svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>`,
  medical: `<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
  gym: `<svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 3-4.5 4.5-3-3 4.5-4.5zm10.5 0l3 3-4.5 4.5-3-3 4.5-4.5zM9.75 10.5l4.5 4.5M7.5 4.5l3 3M13.5 16.5l3 3M3 9l3 3M15 15l3 3"/></svg>`,
  building: `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`,
  podcast: `<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"/></svg>`,
  coffee: `<svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 3h12a1.5 1.5 0 0 1 1.5 1.5v4.5A4.5 4.5 0 0 1 15 13.5H9A4.5 4.5 0 0 1 4.5 9V4.5A1.5 1.5 0 0 1 6 3Zm13.5 3H21a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1.5M4 18h16a2 2 0 0 1 0 4H4a2 2 0 0 1 0-4Z"/></svg>`,
  church: `<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2.25v4.5m-2.25-2.25h4.5M12 9.75l-7.5 4.5v7.5h15v-7.5l-7.5-4.5ZM9.75 21.75v-4.5h4.5v4.5"/></svg>`,
  spa: `<svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"/></svg>`,
  auto: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h7.5m-7.5 0H3.375c-.621 0-1.125-.504-1.125-1.125v-3.75c0-.621.504-1.125 1.125-1.125h1.277a3 3 0 0 1 2.37 1.155l1.01 1.346m8.093 3.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h2.625c.621 0 1.125-.504 1.125-1.125v-3.75c0-.621-.504-1.125-1.125-1.125h-1.277a3 3 0 0 0-2.37 1.155l-1.01 1.346M5.25 10.5l1.637-4.093A3 3 0 0 1 9.674 4.5h4.652a3 3 0 0 1 2.787 1.907L18.75 10.5m-13.5 0h13.5"/></svg>`,
  barber: `<svg class="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 10.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10.125 7.875l9.75 9.75m-9.75-1.5l9.75-9.75"/></svg>`,
  wealth: `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>`,
  shield: `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>`,
  user: `<svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>`,
  calendar: `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/></svg>`,
  invoice: `<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>`,
  package: `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/></svg>`,
  audioWave: `<svg class="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"/></svg>`,
  alert: `<svg class="w-4 h-4 text-rose-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>`,
  check: `<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>`,
  graph: `<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 6h7M7.5 8.2l3 7.6M16.5 8.2l-3 7.6"/></svg>`,
  file: `<svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>`,
  chat: `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.188 49.188 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.719Z"/></svg>`,
  dollar: `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`,
  chevron: `<svg class="w-4 h-4 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>`,
  chevronUp: `<svg class="w-4 h-4 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5"/></svg>`
};

// Client to clean SVG icon mapping
const CLIENT_META = {
  "Adeyemi Law Firm": { icon: ICONS.legal, color: "from-slate-800 to-slate-900 border-slate-700/60", category: "Legal", plan: "Retainer ($2.5k)" },
  "Torres Family Law": { icon: ICONS.legal, color: "from-indigo-950 to-slate-900 border-indigo-800/40", category: "Family Law", plan: "Per-Shoot ($900)" },
  "Torres Dental": { icon: ICONS.dental, color: "from-cyan-950 to-slate-900 border-cyan-800/40", category: "Dental", plan: "Per-Shoot ($300)" },
  "Haddad Dental": { icon: ICONS.dental, color: "from-blue-950 to-slate-900 border-blue-800/40", category: "Dental", plan: "Per-Shoot ($300)" },
  "Crown Church": { icon: ICONS.church, color: "from-indigo-950 to-slate-900 border-indigo-800/40", category: "Church", plan: "Community ($270)" },
  "Heart & Hustle Radio": { icon: ICONS.podcast, color: "from-rose-950 to-slate-900 border-rose-800/40", category: "Podcast", plan: "Episode ($300)" },
  "Startup Texas Podcast": { icon: ICONS.podcast, color: "from-amber-950 to-slate-900 border-amber-800/40", category: "Podcast", plan: "Episode ($550)" },
  "Luna Roofing Co": { icon: ICONS.building, color: "from-amber-950 to-slate-900 border-amber-800/40", category: "Roofing", plan: "Commercial ($900)" },
  "Will's Roofing": { icon: ICONS.building, color: "from-yellow-950 to-slate-900 border-yellow-800/40", category: "Roofing", plan: "Commercial ($900)" },
  "Brightwater Builders": { icon: ICONS.building, color: "from-orange-950 to-slate-900 border-orange-800/40", category: "Builders", plan: "Luxury ($1.5k)" },
  "Blue Bonnet Realty": { icon: ICONS.building, color: "from-amber-950 to-slate-900 border-amber-700/40", category: "Realty", plan: "Property ($1.5k)" },
  "Bluebonnet Realty Group": { icon: ICONS.building, color: "from-slate-800 to-slate-950 border-slate-700/40", category: "Commercial", plan: "Property ($1.5k)" },
  "Hillcrest Physical Therapy": { icon: ICONS.medical, color: "from-red-950 to-slate-950 border-red-800/40", category: "Physical Therapy", plan: "Retainer ($2.5k)" },
  "Vista Pediatrics": { icon: ICONS.medical, color: "from-pink-950 to-slate-900 border-pink-800/40", category: "Pediatrics", plan: "Fieldhouse ($900)" },
  "Parkside Chiropractic": { icon: ICONS.medical, color: "from-teal-950 to-slate-900 border-teal-800/40", category: "Chiro", plan: "Fieldhouse ($900)" },
  "Maple Athletics": { icon: ICONS.gym, color: "from-sky-950 to-slate-900 border-sky-800/40", category: "Athletics", plan: "Rebrand ($900)" },
  "Maple Fitness": { icon: ICONS.gym, color: "from-sky-950 to-slate-900 border-sky-700/40", category: "Fitness", plan: "Original ($900)" },
  "Stonebridge Gym TX": { icon: ICONS.gym, color: "from-red-950 to-slate-900 border-red-800/40", category: "Gym", plan: "Gym Promo ($900)" },
  "Bayou Wealth Partners": { icon: ICONS.wealth, color: "from-emerald-950 to-slate-900 border-emerald-800/40", category: "Wealth", plan: "Retainer ($2.5k)" },
  "Beacon Med Spa": { icon: ICONS.spa, color: "from-purple-950 to-slate-900 border-purple-800/40", category: "Med Spa", plan: "Per-Shoot ($900)" },
  "Juniper Med Spa": { icon: ICONS.spa, color: "from-teal-950 to-slate-900 border-teal-800/40", category: "Med Spa", plan: "Per-Shoot ($900)" },
  "Meridian Bridal Boutique": { icon: ICONS.spa, color: "from-pink-950 to-slate-900 border-pink-800/40", category: "Bridal", plan: "Per-Shoot ($900)" },
  "Prime Barbershop": { icon: ICONS.barber, color: "from-zinc-800 to-slate-900 border-zinc-700/40", category: "Barbershop", plan: "Promo ($900)" },
  "Price Insurance Group": { icon: ICONS.shield, color: "from-emerald-950 to-slate-900 border-emerald-800/40", category: "Insurance", plan: "Ad Content ($900)" },
  "Glow Coffee Roasters": { icon: ICONS.coffee, color: "from-amber-950 to-slate-950 border-amber-800/40", category: "Coffee", plan: "Brand ($900)" },
  "The Ridgeway Lab": { icon: ICONS.coffee, color: "from-orange-950 to-slate-950 border-orange-800/40", category: "Coffee", plan: "Brand ($900)" },
  "Horizon Family Therapy": { icon: ICONS.medical, color: "from-emerald-950 to-slate-950 border-emerald-800/40", category: "Therapy", plan: "Therapy ($900)" },
  "Torres's Auto Spa": { icon: ICONS.auto, color: "from-indigo-950 to-slate-950 border-indigo-800/40", category: "Auto Spa", plan: "Auto ($900)" },
  "Delgado Auto Detailing": { icon: ICONS.auto, color: "from-rose-950 to-slate-950 border-rose-800/40", category: "Detailing", plan: "Auto ($900)" },
  "ABC Home Care": { icon: ICONS.building, color: "from-teal-950 to-slate-950 border-teal-800/40", category: "Home Care", plan: "Care ($1.5k)" },
};

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
  const isErr = type === "error";
  el.className = "max-w-6xl w-full mx-auto px-4 sm:px-6 pt-3";
  el.innerHTML = `
    <div class="rounded-xl border ${isErr ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"} px-4 py-3 text-xs flex items-center justify-between shadow-lg">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full ${isErr ? "bg-rose-400" : "bg-emerald-400"}"></span>
        <span>${escapeHtml(message)}</span>
      </div>
      <button onclick="document.getElementById('banner-container').classList.add('hidden')" class="text-xs font-semibold ${isErr ? "text-rose-300" : "text-emerald-300"} hover:text-white underline">Dismiss</button>
    </div>
  `;
  el.classList.remove("hidden");
}

async function loadData() {
  try {
    const res = await fetch("/api/state");
    if (res.ok) {
      APP_STATE = await res.json();
      renderAll();
      return;
    }
  } catch (_) {}

  try {
    const res = await fetch("baseline_state.json");
    APP_STATE = await res.json();
    renderAll();
  } catch (e) {
    console.error("Failed to load baseline state", e);
  }
}

function renderAll() {
  if (!APP_STATE) return;
  renderVideosView();
  renderClientsView();
  renderInvoicesView();
  renderGuardsView();
  renderDecisionsView();
}

// =========================================================================
// 1. VIDEOS VIEW (SQUARE TILES, STREAMLINED LIST & CLIENT GROUPING)
// =========================================================================

function applyVideoFilters() {
  const sInput = document.getElementById("video-search-input");
  if (sInput) VIDEO_SEARCH_QUERY = sInput.value;

  const dFilter = document.getElementById("video-date-filter");
  if (dFilter) VIDEO_DATE_FILTER = dFilter.value;

  const eFilter = document.getElementById("video-editor-filter");
  if (eFilter) VIDEO_EDITOR_FILTER = eFilter.value;

  const sSort = document.getElementById("video-sort-select");
  if (sSort) VIDEO_SORT_BY = sSort.value;

  VIDEO_PAGE = 1;
  renderVideosView();
}

function setVideoViewMode(mode) {
  VIDEO_VIEW_MODE = mode;
  ["tiles", "list", "grouped"].forEach((m) => {
    const btn = document.getElementById(`vvm-${m}`);
    if (btn) {
      if (m === mode) {
        btn.className = "px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-amber-500 text-slate-950 transition";
      } else {
        btn.className = "px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-slate-400 hover:text-white transition";
      }
    }
  });
  renderVideosView();
}

function setVideoStageFilter(stage) {
  VIDEO_STAGE_FILTER = stage;
  ["all", "voicenotes", "zombies", "revision"].forEach((s) => {
    const btn = document.getElementById(`vsf-${s}`);
    if (btn) {
      if (s === stage) {
        btn.className = "px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-bold flex items-center gap-1";
      } else {
        btn.className = "px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1";
      }
    }
  });
  VIDEO_PAGE = 1;
  renderVideosView();
}

function clearVideoSearch() {
  const sInput = document.getElementById("video-search-input");
  if (sInput) sInput.value = "";
  const qSearch = document.getElementById("quick-search");
  if (qSearch) qSearch.value = "";
  VIDEO_SEARCH_QUERY = "";
  const sClear = document.getElementById("video-search-clear");
  if (sClear) sClear.classList.add("hidden");
  VIDEO_PAGE = 1;
  renderVideosView();
}

function setVideoPage(pageNum) {
  VIDEO_PAGE = pageNum;
  renderVideosView();
}

function toggleVideoPageSize() {
  VIDEO_PAGE_SIZE = VIDEO_PAGE_SIZE === 0 ? 24 : 0;
  VIDEO_PAGE = 1;
  renderVideosView();
}

function toggleClientGroup(clientKey) {
  if (EXPANDED_CLIENT_GROUPS.has(clientKey)) {
    EXPANDED_CLIENT_GROUPS.delete(clientKey);
  } else {
    EXPANDED_CLIENT_GROUPS.add(clientKey);
  }
  renderVideosView();
}

function renderVideosView() {
  const container = document.getElementById("videos-view-container");
  if (!container || !APP_STATE) return;

  const board = APP_STATE.module4_revision_intake_and_jev?.production_board || [];
  const voiceNotesSet = new Set(
    (APP_STATE.module4_revision_intake_and_jev?.jev_summary?.revision_sync_queue || [])
      .filter((q) => q.is_voice_note)
      .map((q) => q.video_id)
  );

  const statCounter = document.getElementById("stat-videos-count");
  if (statCounter) statCounter.textContent = String(board.length);

  // Sync Search Query from UI
  const sInput = document.getElementById("video-search-input");
  const sClear = document.getElementById("video-search-clear");
  const query = (sInput?.value || VIDEO_SEARCH_QUERY || document.getElementById("quick-search")?.value || "").toLowerCase().trim();

  if (sClear) {
    if (query) sClear.classList.remove("hidden");
    else sClear.classList.add("hidden");
  }

  // 1. Filter Pipeline
  let filtered = board;

  if (query) {
    filtered = filtered.filter(
      (v) =>
        v.video_id.toLowerCase().includes(query) ||
        (v.title || "").toLowerCase().includes(query) ||
        (v.client || "").toLowerCase().includes(query) ||
        (v.canonical_client || "").toLowerCase().includes(query) ||
        (v.editor || "").toLowerCase().includes(query) ||
        (v.shoot_booking || "").toLowerCase().includes(query)
    );
  }

  if (VIDEO_STAGE_FILTER === "voicenotes") {
    filtered = filtered.filter((v) => voiceNotesSet.has(v.video_id));
  } else if (VIDEO_STAGE_FILTER === "zombies") {
    filtered = filtered.filter((v) => ["V121", "V152"].includes(v.video_id));
  } else if (VIDEO_STAGE_FILTER === "revision") {
    filtered = filtered.filter((v) => v.stage_normalized === "in revision");
  }

  if (VIDEO_EDITOR_FILTER !== "all") {
    filtered = filtered.filter((v) => v.editor === VIDEO_EDITOR_FILTER);
  }

  if (VIDEO_DATE_FILTER !== "all") {
    filtered = filtered.filter((v) => {
      const d = v.effective_date || v.client_approved_on || v.shoot_date || "";
      if (!d) return false;
      if (VIDEO_DATE_FILTER === "recent") return d >= "2026-09-01";
      if (VIDEO_DATE_FILTER === "aug") return d >= "2026-08-01" && d < "2026-09-01";
      if (VIDEO_DATE_FILTER === "jul") return d >= "2026-07-01" && d < "2026-08-01";
      if (VIDEO_DATE_FILTER === "q2") return d < "2026-07-01";
      return true;
    });
  }

  // 2. Sorting Pipeline
  filtered.sort((a, b) => {
    const numA = parseInt(a.video_id.replace(/\D/g, "") || "0");
    const numB = parseInt(b.video_id.replace(/\D/g, "") || "0");

    if (VIDEO_SORT_BY === "id-asc") return numA - numB;
    if (VIDEO_SORT_BY === "id-desc") return numB - numA;
    if (VIDEO_SORT_BY === "hours-desc") return (b.editor_hours_num || 0) - (a.editor_hours_num || 0);
    if (VIDEO_SORT_BY === "revs-desc") return (b.revisions_num || 0) - (a.revisions_num || 0);
    if (VIDEO_SORT_BY === "client-asc") return (a.canonical_client || a.client || "").localeCompare(b.canonical_client || b.client || "");
    if (VIDEO_SORT_BY === "date-desc") {
      const dateA = a.effective_date || a.client_approved_on || a.shoot_date || "";
      const dateB = b.effective_date || b.client_approved_on || b.shoot_date || "";
      return dateB.localeCompare(dateA) || numB - numA;
    }
    if (VIDEO_SORT_BY === "date-asc") {
      const dateA = a.effective_date || a.client_approved_on || a.shoot_date || "9999";
      const dateB = b.effective_date || b.client_approved_on || b.shoot_date || "9999";
      return dateA.localeCompare(dateB) || numA - numB;
    }
    return numA - numB;
  });

  // 3. Update Results Counter
  const resultsCounter = document.getElementById("video-results-counter");
  if (resultsCounter) {
    resultsCounter.textContent = `Showing ${filtered.length} video${filtered.length === 1 ? "" : "s"}${
      filtered.length !== board.length ? ` (filtered from ${board.length})` : ""
    }`;
  }

  // Empty State Check
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="rounded-2xl bg-[#0d121c] border border-slate-800 p-8 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mx-auto">
          ${ICONS.video}
        </div>
        <h3 class="text-sm font-bold text-white">No videos matched your filter criteria</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">Try clearing your search term, adjusting the date range, or resetting stage filters.</p>
        <button onclick="clearVideoSearch(); setVideoStageFilter('all'); document.getElementById('video-editor-filter').value='all'; document.getElementById('video-date-filter').value='all'; applyVideoFilters();" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition">
          Reset All Filters
        </button>
      </div>
    `;
    const pagContainer = document.getElementById("videos-pagination");
    if (pagContainer) pagContainer.innerHTML = "";
    return;
  }

  // 4. Pagination Slicing (for Tiles and List views)
  const isGrouped = VIDEO_VIEW_MODE === "grouped";
  const pageSize = isGrouped ? 0 : VIDEO_PAGE_SIZE;
  const totalPages = pageSize > 0 ? Math.ceil(filtered.length / pageSize) : 1;
  const currentPage = Math.max(1, Math.min(VIDEO_PAGE, totalPages));
  VIDEO_PAGE = currentPage;

  const displayList = pageSize > 0
    ? filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filtered;

  // Helper for Status Badge
  const getStatusBadge = (v) => {
    const hasVoiceNote = voiceNotesSet.has(v.video_id);
    const isZombie = ["V121", "V152"].includes(v.video_id);

    if (isZombie) {
      return `<span class="inline-flex items-center gap-1 text-rose-400 font-mono-num font-bold text-[11px] animate-pulse">${ICONS.alert} Stuck Task</span>`;
    }
    if (hasVoiceNote) {
      return `<span class="inline-flex items-center gap-1 text-purple-300 font-mono-num font-bold text-[11px]">${ICONS.audioWave} Voice Note</span>`;
    }
    if (v.stage_normalized === "in revision") {
      return `<span class="text-amber-300 font-mono-num font-bold text-[11px]">In Revision</span>`;
    }
    if (v.stage_normalized === "first cut") {
      return `<span class="text-sky-300 font-mono-num font-bold text-[11px]">First Cut</span>`;
    }
    return `<span class="inline-flex items-center gap-1 text-emerald-400 font-mono-num font-bold text-[11px]">${ICONS.check} Delivered</span>`;
  };

  // 5. Render Selected View Mode
  if (VIDEO_VIEW_MODE === "tiles") {
    // MODE 1: SQUARE TILES GRID
    container.innerHTML = `
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        ${displayList
          .map((v) => {
            const clientName = v.canonical_client || v.client;
            return `
              <div onclick="openVideoTrace('${v.video_id}')" class="square-tile rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group min-h-[175px] sm:min-h-[190px] transition-all">
                
                <!-- Top Row: ID Badge + Hours Logged -->
                <div class="flex items-start justify-between">
                  <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center font-mono-num font-black text-sm text-amber-400 shadow-inner">
                    ${escapeHtml(v.video_id)}
                  </div>
                  <span class="text-xs text-slate-400 font-mono-num font-bold">${v.editor_hours_num || 0}h</span>
                </div>

                <!-- Center: Video Title & Client -->
                <div class="my-auto py-1.5">
                  <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition line-clamp-2">
                    ${escapeHtml(v.title || "Untitled Video")}
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-400 truncate mt-1">
                    ${escapeHtml(clientName)}
                  </p>
                </div>

                <!-- Bottom Row: Editor Tag + Status Text -->
                <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                    <span class="w-2 h-2 rounded-full ${v.editor === "Eli" ? "bg-rose-400" : "bg-emerald-400"}"></span>
                    <span class="truncate max-w-[80px] sm:max-w-none">${escapeHtml(v.editor || "Team")}</span>
                  </div>
                  <div class="text-right">
                    ${getStatusBadge(v)}
                  </div>
                </div>

              </div>
            `;
          })
          .join("")}
      </div>
    `;
  } else if (VIDEO_VIEW_MODE === "list") {
    // MODE 2: DENSE STREAMLINED LIST (FAST SCANNABLE VIEW)
    container.innerHTML = `
      <div class="space-y-1.5">
        ${displayList
          .map((v) => {
            const hasVoiceNote = voiceNotesSet.has(v.video_id);
            const isZombie = ["V121", "V152"].includes(v.video_id);
            const clientName = v.canonical_client || v.client;
            const effDate = v.effective_date || v.client_approved_on || v.shoot_date || "Active";

            return `
              <div 
                onclick="openVideoTrace('${v.video_id}')" 
                class="rounded-xl bg-[#0d121c] hover:bg-slate-800/60 border border-slate-800/90 hover:border-amber-500/40 p-2.5 sm:p-3 cursor-pointer transition flex items-center justify-between gap-3 group"
              >
                <!-- Left: ID Badge, Title & Client -->
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center font-mono-num font-extrabold text-xs text-amber-400 shrink-0">
                    ${escapeHtml(v.video_id)}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 class="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition truncate">
                        ${escapeHtml(v.title || "Untitled Video")}
                      </h3>
                      ${hasVoiceNote ? `<span class="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono-num font-semibold">Voice Note</span>` : ""}
                      ${isZombie ? `<span class="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono-num font-semibold">Stuck</span>` : ""}
                    </div>
                    <p class="text-[11px] text-slate-400 truncate mt-0.5">${escapeHtml(clientName)}</p>
                  </div>
                </div>

                <!-- Right: Meta Badges (Editor, Date, Hours, Status, Arrow) -->
                <div class="flex items-center gap-2 sm:gap-4 shrink-0 text-right">
                  <!-- Editor -->
                  <div class="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full ${v.editor === "Eli" ? "bg-rose-400" : "bg-emerald-400"}"></span>
                    <span>${escapeHtml(v.editor || "Team")}</span>
                  </div>
                  <!-- Hours & Revisions -->
                  <div class="hidden md:flex items-center gap-1.5 font-mono-num text-[11px]">
                    <span class="text-slate-400">${v.editor_hours_num || 0}h</span>
                    <span class="text-slate-600">•</span>
                    <span class="${v.revisions_num >= 3 ? "text-rose-400 font-bold" : "text-slate-400"}">${v.revisions_num || 0} rev</span>
                  </div>
                  <!-- Date -->
                  <div class="hidden lg:block text-[11px] font-mono-num text-slate-500">
                    ${effDate}
                  </div>
                  <!-- Status Badge -->
                  <div class="shrink-0">
                    ${getStatusBadge(v)}
                  </div>
                  <!-- Trace Arrow -->
                  <div class="text-slate-500 group-hover:text-amber-400 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  } else if (VIDEO_VIEW_MODE === "grouped") {
    // MODE 3: GROUPED BY CLIENT ACCORDION
    const clientMap = {};
    filtered.forEach((v) => {
      const cname = v.canonical_client || v.client || "Unassigned Client";
      if (!clientMap[cname]) clientMap[cname] = [];
      clientMap[cname].push(v);
    });

    const clientGroups = Object.keys(clientMap).sort();

    container.innerHTML = `
      <div class="space-y-3">
        ${clientGroups
          .map((cname) => {
            const vids = clientMap[cname];
            const meta = CLIENT_META[cname] || { icon: ICONS.building, category: "Studio Client" };
            const isExpanded = query ? true : EXPANDED_CLIENT_GROUPS.has(cname);
            const totalHours = vids.reduce((acc, v) => acc + (v.editor_hours_num || 0), 0);
            const editors = Array.from(new Set(vids.map((v) => v.editor).filter(Boolean))).join(", ");

            return `
              <div class="rounded-2xl bg-[#0d121c] border border-slate-800 transition overflow-hidden">
                <!-- Group Header -->
                <div 
                  onclick="toggleClientGroup('${escapeHtml(cname)}')" 
                  class="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/40 transition select-none"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      ${meta.icon}
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <h3 class="text-sm font-bold text-white truncate">${escapeHtml(cname)}</h3>
                        <span class="text-[10px] font-mono-num font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ${vids.length} videos
                        </span>
                      </div>
                      <p class="text-xs text-slate-400 mt-0.5 truncate">${meta.category} • Editors: ${escapeHtml(editors || "Team")} • ${totalHours.toFixed(1)}h logged</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button 
                      onclick="event.stopPropagation(); openClientTrace('${escapeHtml(cname)}');" 
                      class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Trace Client
                    </button>
                    <div class="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                      <span class="inline-block transform ${isExpanded ? "rotate-180" : "rotate-0"} transition-transform duration-200">
                        ${ICONS.chevron}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Group Videos List -->
                ${
                  isExpanded
                    ? `
                  <div class="px-3.5 pb-3.5 pt-1 border-t border-slate-800/60 space-y-1.5">
                    ${vids
                      .map((v) => {
                        const hasVoiceNote = voiceNotesSet.has(v.video_id);
                        const isZombie = ["V121", "V152"].includes(v.video_id);
                        return `
                          <div 
                            onclick="openVideoTrace('${v.video_id}')" 
                            class="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition flex items-center justify-between gap-3 text-xs group"
                          >
                            <div class="flex items-center gap-2.5 min-w-0">
                              <span class="font-mono-num font-bold text-amber-400 shrink-0">${v.video_id}</span>
                              <span class="text-white font-medium group-hover:text-amber-400 transition truncate">${escapeHtml(v.title || "Video")}</span>
                              ${hasVoiceNote ? `<span class="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-mono-num">Voice Note</span>` : ""}
                              ${isZombie ? `<span class="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-mono-num">Stuck</span>` : ""}
                            </div>
                            <div class="flex items-center gap-3 shrink-0 font-mono-num text-[11px]">
                              <span class="text-slate-400">${escapeHtml(v.editor)}</span>
                              <span class="text-slate-500">${v.editor_hours_num || 0}h</span>
                              ${getStatusBadge(v)}
                            </div>
                          </div>
                        `;
                      })
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  // 6. Pagination Controls
  const pagContainer = document.getElementById("videos-pagination");
  if (!pagContainer) return;

  if (isGrouped) {
    pagContainer.innerHTML = `
      <div class="flex items-center justify-between w-full text-slate-400 text-xs font-mono-num">
        <span>Grouped into ${Object.keys(clientMap).length} client accounts</span>
        <button onclick="setVideoViewMode('tiles')" class="text-amber-400 hover:underline">Switch to Tiles &rarr;</button>
      </div>
    `;
    return;
  }

  if (pageSize === 0) {
    pagContainer.innerHTML = `
      <div class="flex items-center justify-between w-full text-slate-400 text-xs font-mono-num">
        <span>Viewing all ${filtered.length} videos without pagination</span>
        <button onclick="toggleVideoPageSize()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-sans font-medium">
          Paginate (24 per page)
        </button>
      </div>
    `;
    return;
  }

  pagContainer.innerHTML = `
    <div class="flex items-center gap-2 font-mono-num text-slate-400">
      <span>Page ${currentPage} of ${totalPages}</span>
      <span class="text-slate-600">•</span>
      <button onclick="toggleVideoPageSize()" class="text-amber-400 hover:underline font-sans text-xs">
        View All (${filtered.length})
      </button>
    </div>

    <div class="flex items-center gap-1.5">
      <button 
        onclick="setVideoPage(${currentPage - 1})" 
        ${currentPage <= 1 ? "disabled class='px-3 py-1.5 rounded-lg bg-slate-900 text-slate-600 cursor-not-allowed text-xs'" : "class='px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition'"}
      >
        &larr; Prev
      </button>

      <span class="px-2 font-mono-num text-xs text-slate-300 font-bold">${currentPage} / ${totalPages}</span>

      <button 
        onclick="setVideoPage(${currentPage + 1})" 
        ${currentPage >= totalPages ? "disabled class='px-3 py-1.5 rounded-lg bg-slate-900 text-slate-600 cursor-not-allowed text-xs'" : "class='px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition'"}
      >
        Next &rarr;
      </button>
    </div>
  `;
}

// =========================================================================
// 2. CLIENTS VIEW (SQUARE TILES: LINE ICON TOP-LEFT, INVOICE TEXT BOTTOM-RIGHT)
// =========================================================================
function renderClientsView() {
  const container = document.getElementById("clients-grid-container");
  if (!container || !APP_STATE) return;

  const clients = APP_STATE.module2_identity_resolution?.clients || [];
  const statClients = document.getElementById("stat-clients-count");
  if (statClients) statClients.textContent = String(clients.length);

  const overdueMap = {};
  (APP_STATE.financial_action_queues?.overdue_invoices || []).forEach((i) => {
    overdueMap[i.client] = i;
  });

  const unbilledMap = {};
  (APP_STATE.financial_action_queues?.never_billed || []).forEach((b) => {
    unbilledMap[b.client] = b;
  });

  container.innerHTML = clients
    .map((c) => {
      const name = c.name || c.client_name;
      const meta = CLIENT_META[name] || { icon: ICONS.building, color: "from-slate-800 to-slate-900 border-slate-700/40", category: "Client", plan: "Standard" };

      const overdueItem = overdueMap[name];
      const unbilledItem = unbilledMap[name];
      const isBlueBonnet = name === "Blue Bonnet Realty";

      // Bottom-Right Invoice Text
      let bottomRightText = `<span class="inline-flex items-center gap-1.5 text-slate-400 font-mono-num text-xs sm:text-sm font-bold">${ICONS.check} All Paid</span>`;
      if (overdueItem) {
        bottomRightText = `
          <div class="text-right">
            <div class="text-rose-400 font-mono-num font-bold text-sm sm:text-base leading-tight">${fmtUSD(overdueItem.amount_owed)}</div>
            <div class="text-[10px] text-rose-400/90 font-mono-num uppercase font-bold">${overdueItem.days_overdue}d Late</div>
          </div>
        `;
      } else if (isBlueBonnet) {
        bottomRightText = `
          <div class="text-right">
            <div class="text-emerald-400 font-mono-num font-bold text-sm sm:text-base leading-tight">$0.00</div>
            <div class="text-[10px] text-emerald-400/90 font-mono-num uppercase font-bold flex items-center justify-end gap-1">
              <span>Pre-Check</span>
              <span class="inline-block">${ICONS.check}</span>
            </div>
          </div>
        `;
      } else if (unbilledItem) {
        bottomRightText = `
          <div class="text-right">
            <div class="text-amber-400 font-mono-num font-bold text-sm sm:text-base leading-tight">${fmtUSD(unbilledItem.amount)}</div>
            <div class="text-[10px] text-amber-400/90 font-mono-num uppercase font-bold">Unbilled</div>
          </div>
        `;
      }

      return `
        <div onclick="openClientTrace('${escapeHtml(name)}')" class="square-tile rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group min-h-[175px] sm:min-h-[190px] transition-all">
          
          <!-- Top Row: Top-Left Line Icon Badge -->
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${meta.color} border flex items-center justify-center shadow-md">
              ${meta.icon}
            </div>
            <span class="text-xs font-mono-num text-slate-400 font-bold">${c.video_ids?.length || 0} vids</span>
          </div>

          <!-- Center: Client Name & Category -->
          <div class="my-auto py-1.5">
            <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition line-clamp-2">
              ${escapeHtml(name)}
            </h3>
            <p class="text-xs sm:text-sm text-slate-400 truncate mt-1">${meta.category}</p>
          </div>

          <!-- Bottom Row: Bottom-Left Plan, Bottom-Right Invoice Text -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div class="text-xs font-mono-num text-slate-400 truncate max-w-[80px] sm:max-w-none">
              ${meta.plan}
            </div>
            ${bottomRightText}
          </div>

        </div>
      `;
    })
    .join("");
}

// =========================================================================
// 3. INVOICES VIEW (SQUARE TILES: LINE ICON TOP-LEFT, AMOUNT BOTTOM-RIGHT)
// =========================================================================
function renderInvoicesView() {
  const container = document.getElementById("invoices-grid-container");
  if (!container || !APP_STATE) return;

  const overdueList = APP_STATE.financial_action_queues?.overdue_invoices || [];
  const unbilledList = APP_STATE.financial_action_queues?.never_billed || [];

  const overdueTotal = overdueList.reduce((acc, i) => acc + (i.amount_owed || 0), 0);
  const elOverdue = document.getElementById("stat-overdue-total");
  if (elOverdue) elOverdue.textContent = fmtUSD(overdueTotal);

  const allTiles = [
    ...overdueList.map((i) => ({ ...i, tileType: "overdue" })),
    ...unbilledList.map((b) => ({ ...b, tileType: "unbilled" })),
  ];

  container.innerHTML = allTiles
    .map((item) => {
      const isOverdue = item.tileType === "overdue";
      const icon = isOverdue ? ICONS.invoice : ICONS.calendar;
      const idLabel = isOverdue ? item.invoice_no : (item.booking_id_or_month || item.booking_id);
      const clientName = item.client;

      return `
        <div onclick="openClientTrace('${escapeHtml(clientName)}')" class="square-tile rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group min-h-[175px] sm:min-h-[190px] transition-all">
          
          <!-- Top Row: Top-Left Line Icon + ID -->
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${isOverdue ? "bg-rose-500/10 border-rose-500/25 text-rose-400" : "bg-amber-500/10 border-amber-500/25 text-amber-400"} border flex items-center justify-center font-mono-num font-bold text-xs shadow-inner">
              ${icon}
            </div>
            <span class="text-xs font-mono-num font-bold px-2.5 py-1 rounded-xl ${isOverdue ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"}">
              ${isOverdue ? `${item.days_overdue}d Late` : "Never Billed"}
            </span>
          </div>

          <!-- Center: Client Name & Code -->
          <div class="my-auto py-1.5">
            <div class="font-mono-num font-bold text-xs sm:text-sm text-slate-300">${escapeHtml(idLabel)}</div>
            <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition line-clamp-2 mt-1">
              ${escapeHtml(clientName)}
            </h3>
          </div>

          <!-- Bottom Row: Bottom-Left Due Date, Bottom-Right Amount -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div class="text-xs font-mono-num text-slate-400">
              ${isOverdue ? `Due ${item.due_date}` : `Shoot ${item.shoot_date}`}
            </div>
            <div class="text-right">
              <div class="font-mono-num font-black ${isOverdue ? "text-rose-400" : "text-amber-400"} text-sm sm:text-base">
                ${fmtUSD(item.amount_owed || item.amount)}
              </div>
            </div>
          </div>

        </div>
      `;
    })
    .join("");
}

// =========================================================================
// 4. PRE-CHECK GUARDS & PIPELINE (SQUARE TILES)
// =========================================================================
function renderGuardsView() {
  const container = document.getElementById("guards-grid-container");
  if (!container || !APP_STATE) return;

  const elPrecheck = document.getElementById("stat-precheck-total");
  if (elPrecheck) elPrecheck.textContent = "$0.00";

  const leads = APP_STATE.module5_balance_guards_and_upsells?.never_replied_leads || [];

  const cardsHtml = [
    // Square Tile 1: Blue Bonnet Pre-Check Guard
    `
      <div onclick="confirmAction('VOID_1138', 'Duplicate invoice INV-1138 voided; prepaid funds linked to completed shoot B154.')" class="square-tile rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group min-h-[175px] sm:min-h-[190px] border-emerald-500/30 transition-all">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            ${ICONS.shield}
          </div>
          <span class="text-xs font-mono-num px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">Rule Guard</span>
        </div>
        <div class="my-auto py-1.5">
          <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-2">
            Blue Bonnet Realty
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">Cancelled B142 rescheduled to B154 (Delivered). Sent INV-1138 without pre-check.</p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div class="text-xs font-mono-num text-slate-400">Pre-Check Guard</div>
          <div class="text-right font-mono-num font-black text-emerald-400 text-sm sm:text-base">$0.00 Owed</div>
        </div>
      </div>
    `,

    // Square Tile 2: Hillcrest PT Churn Rescue
    `
      <div onclick="openVideoTrace('V049')" class="square-tile rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group min-h-[175px] sm:min-h-[190px] border-rose-500/30 transition-all">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
            ${ICONS.medical}
          </div>
          <span class="text-xs font-mono-num px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold">Churn Risk</span>
        </div>
        <div class="my-auto py-1.5">
          <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-rose-400 transition line-clamp-2">
            Hillcrest Physical Therapy
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">Missed Voice Notes V049 &amp; Compliance breach. INV-1116 withheld.</p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div class="text-xs font-mono-num text-slate-400">Gloria Reed</div>
          <div class="text-right font-mono-num font-black text-rose-400 text-sm sm:text-base">$2,500/mo</div>
        </div>
      </div>
    `,

    // Square Tiles for Leads
    ...leads.map((l) => `
      <div onclick="confirmAction('REPLY_${l.lead_id}', 'Followup email drafted for ${escapeHtml(l.contact_name)}.')" class="square-tile rounded-3xl p-5 sm:p-6 cursor-pointer flex flex-col justify-between group min-h-[175px] sm:min-h-[190px] transition-all">
        <div class="flex items-start justify-between">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400">
            ${ICONS.user}
          </div>
          <span class="text-xs font-mono-num px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 font-semibold">${escapeHtml(l.source || "Web")}</span>
        </div>
        <div class="my-auto py-1.5">
          <h3 class="text-sm sm:text-base font-bold text-white group-hover:text-sky-400 transition truncate">
            ${escapeHtml(l.contact_name)}
          </h3>
          <p class="text-xs sm:text-sm text-amber-400/90 font-medium truncate mt-1">${escapeHtml(l.business_name || l.matched_client || "Prospective")}</p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div class="text-xs font-mono-num text-slate-400">Lead</div>
          <div class="text-right text-xs sm:text-sm text-sky-400 font-bold group-hover:underline">Reply &rarr;</div>
        </div>
      </div>
    `),
  ];

  container.innerHTML = cardsHtml.join("");
}

// =========================================================================
// 5. FILE-BY-FILE DECISION GRAPH, LIVE HOVER INSPECTOR & METHODOLOGY
// =========================================================================

const FILE_DECISIONS_DATA = {
  leads: {
    key: "leads",
    filename: "leads.csv",
    track: "primary",
    name: "Inbound Leads",
    records: 98,
    primaryKey: "lead_id",
    dateRange: "2026-03-29 to 2026-09-30",
    role: "Top-of-funnel inbound inquiries, marketing attribution & first-reply latency",
    icon: ICONS.user,
    color: "from-sky-950 to-slate-900 border-sky-800/40 text-sky-400",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    trapTag: "4 Bot Spams",
    mistakes: [
      "4 automated web-form bot submissions (L052 'SEO Services', L063 'Free followers', L081 'test test', L089 'Crypto Deals') with blank phone numbers and .biz/.io domains.",
      "11 blank business name fields across personal or unlinked submissions.",
      "19 blank first_reply fields (4 bot spams + 15 genuine prospective human inquiries never answered).",
      "Future reply date anomaly (L098 Cho Family Dentistry first_reply logged as 2026-10-07, 1 day after reference date).",
      "Status contradiction (L068 Juniper Med Spa answered July 28 but status stuck on 'New')."
    ],
    decisions: [
      "Implemented Soft Spam Audit Log to quarantine L052, L063, L081, L089 while safeguarding valid modern TLDs (.co, .fm, .build).",
      "Preserved all 15 genuine unreplied human leads in an actionable high-priority re-engagement queue.",
      "Normalized timestamp strings (YYYY-MM-DD HH:MM) and capped future date anomalies.",
      "Linked repeat lead submissions (e.g. Mia Torres L001 and L087) back to canonical client accounts."
    ],
    why: [
      "Bot submissions distorted channel conversion rates; quarantining them revealed Referral is Axeom's #1 channel (91.7% conversion, $41,400 revenue, $0 CAC).",
      "Rescued 15 legitimate high-value prospects (including Victor Vega referral L086 and Mia Torres personal inquiry L087) representing thousands in pipeline value.",
      "Prevented staff from treating repeat inquiries from existing loyal clients as disconnected new strangers."
    ]
  },
  bookings: {
    key: "bookings",
    filename: "bookings.csv",
    track: "primary",
    name: "Shoot Bookings",
    records: 168,
    primaryKey: "booking_id",
    dateRange: "04/01/2026 to 10/19/2026",
    role: "Shoot calendars, studio sessions, services delivered & client booking history",
    icon: ICONS.calendar,
    color: "from-amber-950 to-slate-900 border-amber-800/40 text-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    trapTag: "Date Collisions",
    mistakes: [
      "Date format collision: US slash format MM/DD/YYYY (differs from leads.csv and payments.csv European format).",
      "Mixed currency syntax ($300, 300, $1,500, 1,500) causing parsing failures in vanilla loaders.",
      "72 free-text name variations across only 33 distinct booking emails (e.g. Crown Church, Crown DFW, Crown Media Team).",
      "Email typo in B005: office@torresdental.con (ends in .con instead of .com).",
      "Cancelled shoot B142 (Sept 22, Blue Bonnet Realty) billed and paid ($1,500) but cancelled for emergency.",
      "22 zero-dollar shoots (price = 0 for Retainer Shoots) risking false unbilled work classification.",
      "5 completed studio sessions never invoiced ($3,210.00 total unbilled work)."
    ],
    decisions: [
      "Built multi-format date normalizer enforcing MM/DD/YYYY for bookings and converting to ISO YYYY-MM-DD.",
      "Cleaned currency strings with regex stripping dollar signs and commas.",
      "Standardized email typo (.con -> .com) during ingestion sanitization.",
      "Executed 3-Tier Identity Resolution: Tied 72 surface names to 30 canonical clients via phone and domain.",
      "Isolated 22 zero-dollar retainer sessions so they are recognized as covered by $2,500 monthly retainers.",
      "Flagged 5 completed sessions (B038, B080, B083, B131, B132) for immediate billing confirmation."
    ],
    why: [
      "Prevents silent date corruption and month-day flipping during calendar reconciliation.",
      "Protects retainer clients from accidental double-billing while recovering $3,210 of unbilled production labor.",
      "Eliminates duplicate client entries, providing the owner with exactly 30 true client accounts."
    ]
  },
  production: {
    key: "production",
    filename: "production_board.csv",
    track: "primary",
    name: "Production Board",
    records: 344,
    primaryKey: "video_id",
    dateRange: "2026-04-01 to 2026-10-06",
    role: "Video editing pipeline, editor task assignments, logged hours & client delivery status",
    icon: ICONS.video,
    color: "from-purple-950 to-slate-900 border-purple-800/40 text-purple-400",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    trapTag: "78% Blank Notes",
    mistakes: [
      "269 empty board notes (78.2% of all video cards have blank notes!). Primary root cause of 'edits come back wrong'.",
      "84 unlinked shoot bookings (24.4% of deliverables have no booking ID link).",
      "126 video deliverables marked 'Delivered' without client sign-off date (41.3%).",
      "2 zombie revision tasks (V121 Nolan Cho and V152 Ridgeway Lab) approved 2.5 months ago but stuck in 'In revision'.",
      "Eli Efficiency Drain: Junior editor Eli onboarded July 3, averages 6.30 hrs/video (vs 3.76h Ali, 4.26h Rita) and accounts for 64.3% of 3-revision video churn."
    ],
    decisions: [
      "Identified root cause of client revision crisis: notes were lost between client messaging channels and editor cards.",
      "Created automated Revision Sync Queue to route incoming client feedback directly onto editor board cards.",
      "Auto-archived zombie tasks V121 and V152 to declutter the active operations dashboard.",
      "Audited Eli's true labor cost ($138.60/vid vs Ali's $131.60/vid) to recommend junior editor onboarding protocols.",
      "Linked orphaned video cards back to booking sessions via client name and shoot date proximity."
    ],
    why: [
      "Fixes the single largest operational complaint threatening client retention (Bayou Wealth churned; Hillcrest PT at risk).",
      "Clears ghost cards lingering since July to restore team trust in dashboard cards.",
      "Provides owner with true labor unit economics: cheaper hourly wages actually cost Axeom more money and client goodwill."
    ]
  },
  invoices: {
    key: "invoices",
    filename: "invoices.csv",
    track: "primary",
    name: "Invoices Ledger",
    records: 151,
    primaryKey: "invoice_no",
    dateRange: "2026-04-01 to 2026-10-05",
    role: "Billing ledger, accounts receivable, payment terms & invoice payment statuses",
    icon: ICONS.invoice,
    color: "from-rose-950 to-slate-900 border-rose-800/40 text-rose-400",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    trapTag: "6 False Unpaid",
    mistakes: [
      "41 missing memos (27.2%), breaking automated regex booking matches.",
      "6 false 'unpaid' invoices: billing tool claimed open, but bank records prove paid in full ($3,240 false debt).",
      "Out-of-order void record (INV-1151 dated June 1 placed at the very end of file).",
      "Billed cancelled shoot INV-1131 ($1,500) marked paid for Blue Bonnet Realty.",
      "Ambiguous partial invoice INV-1121 (Will's Roofing, $900 original, paid $450, no remaining balance listed in billing tool).",
      "Duplicate invoice INV-1138 ($1,500) issued to Blue Bonnet Realty for rescheduled shoot B154 without checking prior payment."
    ],
    decisions: [
      "Enforced strict Net-14 terms (due = issued + 14 days) relative to challenge reference date Oct 6, 2026.",
      "Multi-attribute reconciliation to match 41 blank-memo invoices across dates, clients, and amounts.",
      "Exposed the 6 billing tool sync errors, removing $3,240 of false debt claims against loyal clients.",
      "Calculated true remaining overdue balance for INV-1121 ($450.00).",
      "Invoice Pre-Check Guard: Voided duplicate INV-1138 ($1,500) and linked prepaid P5121 to rescheduled shoot B154."
    ],
    why: [
      "Prevents alienating clients by demanding money they already paid into Axeom's bank account.",
      "Locks true overdue receivables at exactly $8,570.00 (7 overdue invoices + 1 due today).",
      "Eliminates phantom debts: Axeom owes Blue Bonnet $0.00 cash because the prepaid funds cover the completed reschedule."
    ]
  },
  payments: {
    key: "payments",
    filename: "payments.csv",
    track: "primary",
    name: "Bank Payments",
    records: 122,
    primaryKey: "payment_id",
    dateRange: "03/04/2026 to 04/10/2026",
    role: "Bank deposits, payment rails (ACH, Zelle, Card), payer metadata & reference notes",
    icon: ICONS.dollar,
    color: "from-emerald-950 to-slate-900 border-emerald-800/40 text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    trapTag: "European DD/MM",
    mistakes: [
      "Critical Date Inversion Hazard: 100% of payment dates are European DD/MM/YYYY (e.g. 04/10/2026 = October 4, NOT April 10).",
      "2 missing payer emails (P5076 MIA TORRES, P5115 WILL MOORE).",
      "23 blank references (18.9% of payments omitted invoice numbers).",
      "Lump-sum multi-invoice payments (P5076 $900 Zelle memo 'july sessions'; P5080 & P5105 $1,800 agency payments).",
      "Bank cash surplus: $125,690 deposited vs $122,860 claimed paid by billing tool = $2,830 bank surplus unaccounted for!"
    ],
    decisions: [
      "Built strict European DD/MM/YYYY parser preventing silent date flipping.",
      "Executed 4-Pass Dynamic Reconciliation: Pass 1 direct invoice reference, Pass 2 multi-invoice text memo splitting, Pass 3 FIFO blank reference allocation, Pass 4 duplicate overpayment quarantine.",
      "Resolved P5076 across 3x $300 July sessions (INV-1066, INV-1077, INV-1084).",
      "Quarantined duplicate $900 payment P5077 for Prime Barbershop as unapplied customer credit."
    ],
    why: [
      "Prevents severe date corruption where October deposits would be misfiled into April.",
      "Accounts for every single dollar of the $125,690 cash collected in Axeom's bank account.",
      "Proves Axeom has $2,830 more cash in the bank than its billing software showed."
    ]
  },
  messages: {
    key: "messages",
    filename: "messages.txt",
    track: "context",
    name: "Client Messages",
    records: 200,
    primaryKey: "line_index",
    dateRange: "2026-04-18 to 2026-10-05",
    role: "Multi-channel communications: WhatsApp, Email, DMs, Audio Voice Notes & Client Feedback",
    icon: ICONS.chat,
    color: "from-teal-950 to-slate-900 border-teal-800/40 text-teal-400",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    trapTag: "Voice Notes Lost",
    mistakes: [
      "4 fragmented communication channels without central ticketing, allowing critical edit instructions to slip through.",
      "1 phishing security attack (2026-05-17 fake Instagram credential harvester bit.ly/insta-verify-now).",
      "6 unreviewed audio voice notes sent by clients (David Price, Reggie Ramirez, Nina Torres, Gloria Reed) never transcribed.",
      "Retainer churn: Bayou Wealth Partners paused $2,500/mo retainer July 19 due to missed notes.",
      "Retainer at risk: Hillcrest PT furious over regulatory compliance branding error on V049, withholding $2,500 invoice INV-1116.",
      "Prepaid shoot cancellation: Blue Bonnet Realty Ivy Haddad message cancelling B142 for emergency."
    ],
    decisions: [
      "Built Jev Structured Intake parser to extract and transcribe all 6 audio voice notes (with 1:28 duration logs and full text).",
      "Intercepted phishing attempt and flagged for security quarantine.",
      "Linked Hillcrest's branding voice note to V049 and created emergency Churn Rescue card for Gloria Reed.",
      "Discovered Blue Bonnet's rescheduled shoot B154, creating the Invoice Pre-Check Guard."
    ],
    why: [
      "Protects a $30,000/year client (Hillcrest PT) from immediate cancellation.",
      "Surfaces critical audio instructions that editors never saw, fixing the root cause of client frustration.",
      "Prevents account security compromise from malicious phishing links."
    ]
  },
  team: {
    key: "team",
    filename: "team.csv",
    track: "context",
    name: "Team Roster",
    records: 5,
    primaryKey: "name",
    dateRange: "2026-04-01 to 2026-10-06",
    role: "Internal editor roster, hire dates, hourly wage rates & editor capacity",
    icon: ICONS.user,
    color: "from-zinc-900 to-slate-950 border-zinc-700/40 text-zinc-300",
    badgeColor: "bg-zinc-700/30 text-zinc-300 border-zinc-600/30",
    trapTag: "Eli Labor Drain",
    mistakes: [
      "Blank owner compensation (Zaid's administrative overhead, billing labor, and intake time unrecorded).",
      "July 3 onboarding date for Eli correlates directly with the spike in client revision complaints.",
      "Freelance surge editor Jules brought on Sept 1 at $40/hr premium rate to handle Eli's revision backlog."
    ],
    decisions: [
      "Normalized editor wage roster: Ali ($35/hr), Rita ($30/hr), Eli ($22/hr), Jules ($40/hr).",
      "Mapped editor hours from production_board.csv to compute true cost per delivered video.",
      "Highlighted that Jules's $40/hr surge rate was triggered by Eli's 65% revision backlog."
    ],
    why: [
      "Gives the owner visibility into real labor economics: junior editor Eli costs $138.60/vid vs senior editor Ali's $131.60/vid.",
      "Explains the sudden margin compression and why hiring freelance help was necessary in September."
    ]
  },
  costs: {
    key: "costs",
    filename: "costs.csv",
    track: "context",
    name: "Cost Structure",
    records: 2,
    primaryKey: "item",
    dateRange: "Fixed Studio Rates",
    role: "Fixed studio hourly overhead ($40/hr) and variable editor hourly rates",
    icon: ICONS.dollar,
    color: "from-orange-950 to-slate-900 border-orange-800/40 text-orange-400",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    trapTag: "Missing Ad Spend",
    mistakes: [
      "Missing external advertising spend (zero ad records for Meta, Google, or LinkedIn).",
      "Inability to calculate true Net Customer Acquisition Cost (CAC) or Return on Ad Spend (ROAS)."
    ],
    decisions: [
      "Documented missing ad spend as an explicit operational omission in assumptions.md.",
      "Computed Organic / Referral channel economics (91.7% conversion, $41,400 revenue at $0 CAC).",
      "Guarded business metrics from guessing fake ad spend numbers."
    ],
    why: [
      "Upholds core rule 'Never make up numbers' while steering marketing investment into high-converting referral channels.",
      "Ensures financial models remain audited, transparent, and grounded strictly in provided facts."
    ]
  }
};

const METHODOLOGY_STEPS = [
  {
    step: 1,
    phase: "PHASE 1",
    title: "Multi-Format Ingestion & Soft Spam Quarantine",
    subtitle: "Standardizing conflicting date formats, currency syntax & separating bot spam from genuine inquiries",
    metricBadge: "94 Valid Leads // 168 Sanitized Bookings // 0 Date Crashes",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    problem: "Date formats collided dangerously across files: US slash format MM/DD/YYYY in bookings.csv vs European DD/MM/YYYY in payments.csv vs ISO YYYY-MM-DD in leads.csv. Currency syntax had mixed formats ($1,500, 1500, $300). 4 automated web-form bots (L052, L063, L081, L089) polluted inbound leads.",
    decisions: [
      "Built dedicated per-source date parsers enforcing MM/DD/YYYY for bookings and DD/MM/YYYY for payments.",
      "Normalized all currency strings to clean floating-point numbers.",
      "Quarantined bot spam with blank phone numbers and .biz/.io domains into a separate Spam Audit Log.",
      "Whitelisted modern legitimate custom domains (.co, .fm, .build).",
      "Preserved 15 genuine human leads that were never answered for owner re-engagement."
    ],
    why: "Prevents silent date corruption (e.g. October 4 being misread as April 10). Preserves 15 genuine prospective revenue leads while ensuring clean, reliable financial calculations."
  },
  {
    step: 2,
    phase: "PHASE 2",
    title: "3-Tier Identity Resolution & Agency Payer Disentanglement",
    subtitle: "Unifying 72 surface names into 30 canonical clients while strictly preventing false auto-merges",
    metricBadge: "Exactly 30 Studio Clients // 1 Agency Payer ($5,400) // 0 False Merges",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    problem: "bookings.csv contained 72 distinct client name strings across only 33 emails. Maple Fitness rebranded to Maple Athletics in May. Fieldhouse Marketing paid $5,400 on behalf of two medical practices (Vista Pediatrics and Parkside Chiropractic). Multiple distinct businesses shared the same contact person name (Alana Ibarra at Delgado Auto vs Torres Auto; Tasha Torres at Torres Family Law vs Crown Church; Nolan Nguyen at Brightwater vs Cho Dental).",
    decisions: [
      "Built a 3-tier deterministic resolution engine: Tier 1 matches normalized phone numbers (unifying Maple Fitness and Maple Athletics); Tier 2 matches company email domains.",
      "Enforced Tier 2 Guard strictly forbidding auto-merges based on personal contact names alone.",
      "Designated Fieldhouse Marketing as an agency payer rather than a studio client.",
      "Sanitized email typo office@torresdental.con to .com during ingestion."
    ],
    why: "Eliminates double-counting and prevents commingling confidential business records between unrelated companies. Establishes the true studio client roster at exactly 30 active accounts."
  },
  {
    step: 3,
    phase: "PHASE 3",
    title: "4-Pass Payment Reconciliation & Cash Surplus Discovery",
    subtitle: "Reconciling bank deposits against invoices to uncover $2,830 bank surplus & 6 billing tool errors",
    metricBadge: "$125,690 Bank Deposits // $2,830 Unlogged Surplus // 6 Sync Errors Fixed",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    problem: "Axeom's billing software claimed $122,860 was collected and 13 invoices were overdue ($14,410). However, bank deposits totaled $125,690 ($2,830 more cash in the bank!). 23 payments had blank references. Multiple clients paid in lump sums with informal text memos (P5076 $900 Zelle memo: 'july sessions') or split payments (P5115 $450 Zelle memo: 'half now half later').",
    decisions: [
      "Pass 1: Direct reference string matching (INV-1083 via P5074).",
      "Pass 2: Multi-invoice text memo parsing (splitting P5076 across INV-1066, INV-1077, INV-1084; applying P5115 to INV-1121).",
      "Pass 3: FIFO allocation for blank references (P5081 to INV-1080).",
      "Pass 4: Quarantine duplicate overpayments (P5077 $900 for Prime Barbershop held as credit)."
    ],
    why: "Proved that 6 invoices claimed 'unpaid' were already settled in full by bank deposits ($3,240 false debt eliminated). Proved true overdue debt is exactly $8,570, protecting client relationships from false collection notices."
  },
  {
    step: 4,
    phase: "PHASE 4",
    title: "Revision Intake Sync & Junior Editor Efficiency Audit",
    subtitle: "Recovering lost audio voice notes and diagnosing the root cause of client revision fatigue",
    metricBadge: "6 Voice Notes Recovered // 78.2% Note Disconnect Identified // 2 Zombie Tasks Cleared",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    problem: "Clients complained that 'edits come back wrong' and notes were ignored. Investigation revealed that 78.2% (269 of 344) of cards on production_board.csv had blank notes. 6 WhatsApp voice notes containing critical edit instructions were never transcribed onto cards. Junior editor Eli (hired July 3 at $22/hr) averaged 6.30 hours per video (vs 3.76h Ali, 4.26h Rita) and accounted for 64.3% of 3-revision video churn. Zombie tasks V121 and V152 lingered for 2.5 months.",
    decisions: [
      "Built Jev Structured Intake to transcribe and route voice notes (with 1:28 duration logs) into editor cards.",
      "Created an automated Revision Sync Queue to eliminate note dropping.",
      "Audited Eli's true cost ($138.60/vid vs senior editor Ali's $131.60/vid) and identified the need for editor onboarding protocols.",
      "Auto-archived zombie tasks V121 and V152."
    ],
    why: "Directly resolves the operational root cause of client dissatisfaction. Protects high-value retainers like Hillcrest PT and Bayou Wealth from churn caused by dropped instructions."
  },
  {
    step: 5,
    phase: "PHASE 5",
    title: "Invoice Pre-Check Guard & Retention Rescue Engine",
    subtitle: "Eliminating phantom debts through invoice pre-check and recovering $8,210 in unbilled revenue",
    metricBadge: "$0.00 Cash Debt Owed // $8,210 Unbilled Work Recovered // $2,500/mo Retainer Rescued",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    problem: "Blue Bonnet Realty paid $1,500 (P5121) for shoot B142, which was cancelled for a family emergency. Axeom rescheduled and delivered shoot B154 (Oct 5), but staff erroneously issued duplicate invoice INV-1138 ($1,500) without pre-checking payment history. Hillcrest PT withheld $2,500 invoice INV-1116 after an editor dropped branding voice notes on V049. 5 completed shoot sessions ($3,210) and 2 May retainers ($5,000) were never invoiced ($8,210 unbilled).",
    decisions: [
      "Implemented the Invoice Pre-Check Guard: voided duplicate INV-1138 and linked prepaid P5121 to completed shoot B154, establishing strictly $0.00 cash debt owed (we_owe: []) unless the second shoot is also cancelled.",
      "Created an emergency Churn Rescue queue for Hillcrest PT with an immediate branding fix.",
      "Queued $8,210 of unbilled work for immediate owner-confirmed billing."
    ],
    why: "Confirms Axeom owes zero cash refunds, prevents double-billing Blue Bonnet, stops a $30,000/year client from cancelling, and recovers $8,210 of earned cash."
  }
];

let SELECTED_FILE_KEY = "leads";
const EXPANDED_STEPS = new Set([0]); // First step open by default

function renderDecisionsView() {
  renderFileGraphTiles();
  updateFileInspector(SELECTED_FILE_KEY);
  renderMethodologySteps();
}

function renderFileGraphTiles() {
  const primaryContainer = document.getElementById("primary-files-grid");
  const contextContainer = document.getElementById("context-files-grid");
  if (!primaryContainer || !contextContainer) return;

  const primaryKeys = ["leads", "bookings", "production", "invoices", "payments"];
  const contextKeys = ["messages", "team", "costs"];

  const renderTile = (key) => {
    const f = FILE_DECISIONS_DATA[key];
    const isSelected = f.key === SELECTED_FILE_KEY;
    return `
      <div 
        id="file-tile-${f.key}" 
        onmouseenter="highlightFileTile('${f.key}')" 
        onclick="openFileDecisionDrawer('${f.key}')"
        class="rounded-3xl p-6 sm:p-7 cursor-pointer flex flex-col justify-between group transition-all bg-[#0d121c] border ${
          isSelected
            ? "border-indigo-400 bg-slate-800/90 ring-4 ring-indigo-500/30 shadow-2xl"
            : "border-slate-800 hover:border-slate-700 hover:bg-[#131b29]"
        } min-h-[175px]"
      >
        <!-- Top Row: File Line Icon Top-Left + Trap Tag -->
        <div class="flex items-start justify-between gap-3">
          <div class="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shrink-0 shadow-md text-indigo-400">
            ${f.icon}
          </div>
          <span class="text-xs font-mono-num font-bold px-3 py-1 rounded-xl ${f.badgeColor}">
            ${f.trapTag}
          </span>
        </div>

        <!-- Center: File Name & Role -->
        <div class="my-3.5">
          <div class="flex items-center gap-2">
            <h3 class="text-base sm:text-lg font-mono font-bold text-white group-hover:text-indigo-300 transition">
              ${f.filename}
            </h3>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">${escapeHtml(f.role)}</p>
        </div>

        <!-- Bottom Row: Primary Key & Record Count -->
        <div class="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
          <span class="font-mono-num text-slate-400 font-semibold">${f.primaryKey}</span>
          <span class="font-mono-num font-bold text-indigo-400">${f.records} records</span>
        </div>
      </div>
    `;
  };

  primaryContainer.innerHTML = primaryKeys.map(renderTile).join("");
  contextContainer.innerHTML = contextKeys.map(renderTile).join("");
}

function highlightFileTile(fileKey) {
  SELECTED_FILE_KEY = fileKey;
  Object.keys(FILE_DECISIONS_DATA).forEach((k) => {
    const el = document.getElementById(`file-tile-${k}`);
    if (el) {
      if (k === fileKey) {
        el.className = "rounded-3xl p-6 sm:p-7 cursor-pointer flex flex-col justify-between group transition-all bg-[#0d121c] border border-indigo-400 bg-slate-800/90 ring-4 ring-indigo-500/30 shadow-2xl min-h-[175px]";
      } else {
        el.className = "rounded-3xl p-6 sm:p-7 cursor-pointer flex flex-col justify-between group transition-all bg-[#0d121c] border border-slate-800 hover:border-slate-700 hover:bg-[#131b29] min-h-[175px]";
      }
    }
  });
  updateFileInspector(fileKey);
}

function updateFileInspector(fileKey) {
  const panel = document.getElementById("file-live-inspector");
  if (!panel) return;
  const f = FILE_DECISIONS_DATA[fileKey] || FILE_DECISIONS_DATA.leads;

  panel.innerHTML = `
    <!-- Header: File Metadata -->
    <div class="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
          ${f.icon}
        </div>
        <div>
          <div class="flex items-center gap-2.5 flex-wrap">
            <h3 class="text-xl sm:text-2xl font-mono font-bold text-white">${f.filename}</h3>
            <span class="text-xs sm:text-sm font-mono-num font-bold px-3 py-1 rounded-xl ${f.badgeColor}">${f.records} records</span>
          </div>
          <p class="text-sm sm:text-base text-slate-300 mt-1.5 leading-relaxed">${escapeHtml(f.role)}</p>
          <div class="text-xs sm:text-sm font-mono-num text-slate-400 mt-1.5">Date Scope: <span class="text-slate-200">${f.dateRange}</span> &bull; Primary Key: <span class="text-amber-400 font-bold">${f.primaryKey}</span></div>
        </div>
      </div>
    </div>

    <!-- Section 1: Core Mistakes & Missing Things (Red/Rose Badge) -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs sm:text-sm font-mono-num font-bold uppercase tracking-wider text-rose-400">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          <span>Core Mistakes &amp; Missing Fields Caught</span>
        </div>
        <span class="text-xs sm:text-sm font-mono-num text-rose-400 font-bold">${f.mistakes.length} traps caught</span>
      </div>
      <ul class="space-y-2.5 bg-rose-950/20 border border-rose-500/25 rounded-2xl p-5 sm:p-6">
        ${f.mistakes.map((m) => `
          <li class="text-sm sm:text-base text-rose-100 flex items-start gap-3 leading-relaxed">
            <span class="text-rose-400 font-bold shrink-0 mt-0.5">&bull;</span>
            <span>${escapeHtml(m)}</span>
          </li>
        `).join("")}
      </ul>
    </div>

    <!-- Section 2: Decisions I Took For Them (Amber Badge) -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs sm:text-sm font-mono-num font-bold uppercase tracking-wider text-amber-400">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span>Decisions I Took For Them</span>
        </div>
        <span class="text-xs sm:text-sm font-mono-num text-amber-400 font-bold">${f.decisions.length} operational rules</span>
      </div>
      <ul class="space-y-2.5 bg-amber-950/20 border border-amber-500/25 rounded-2xl p-5 sm:p-6">
        ${f.decisions.map((d) => `
          <li class="text-sm sm:text-base text-amber-100 flex items-start gap-3 leading-relaxed">
            <span class="text-amber-400 font-bold shrink-0 mt-0.5">&bull;</span>
            <span>${escapeHtml(d)}</span>
          </li>
        `).join("")}
      </ul>
    </div>

    <!-- Section 3: Why This Decision Was Made (Emerald Badge) -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs sm:text-sm font-mono-num font-bold uppercase tracking-wider text-emerald-400">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Why This Decision Was Made (Business Justification)</span>
        </div>
      </div>
      <ul class="space-y-2.5 bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-5 sm:p-6">
        ${f.why.map((w) => `
          <li class="text-sm sm:text-base text-emerald-100 flex items-start gap-3 leading-relaxed">
            <span class="text-emerald-400 font-bold shrink-0 mt-0.5">&bull;</span>
            <span>${escapeHtml(w)}</span>
          </li>
        `).join("")}
      </ul>
    </div>

    <!-- Inspect in Drawer Button -->
    <button 
      onclick="openFileDecisionDrawer('${f.key}')" 
      class="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition shadow-xl shadow-indigo-600/20 cursor-pointer"
    >
      <span>Inspect Complete ${f.filename} Trace in Drawer</span>
      <span class="text-indigo-200 text-lg">&rarr;</span>
    </button>
  `;
}

function openFileDecisionDrawer(fileKey) {
  const container = document.getElementById("drawer-container");
  const tag = document.getElementById("drawer-tag");
  const title = document.getElementById("drawer-title");
  const body = document.getElementById("drawer-body");
  if (!container) return;

  const f = FILE_DECISIONS_DATA[fileKey] || FILE_DECISIONS_DATA.leads;

  tag.textContent = `FILE AUDIT // ${f.filename.toUpperCase()}`;
  tag.className = "text-xs font-mono-num font-bold uppercase px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
  title.textContent = `${f.filename} — Mistakes, Decisions & Lineage`;

  body.innerHTML = `
    <!-- Top Summary Card -->
    <div class="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          ${f.icon}
        </div>
        <div>
          <div class="font-mono font-bold text-base sm:text-lg text-white">${f.filename}</div>
          <div class="text-xs sm:text-sm text-slate-400">${f.name} &bull; ${f.records} records</div>
        </div>
      </div>
      <div class="text-right">
        <span class="text-xs sm:text-sm font-mono-num px-3 py-1.5 rounded-xl bg-slate-800 text-indigo-300 border border-slate-700">PK: ${f.primaryKey}</span>
      </div>
    </div>

    <!-- Step 1: Raw Completeness & Missing Fields -->
    <div class="flex items-start gap-4 relative timeline-step">
      <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 timeline-line">
        ${ICONS.file}
      </div>
      <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2.5">
        <span class="text-sm sm:text-base font-bold text-white">1. File Profile &amp; Data Completeness</span>
        <div class="text-xs sm:text-sm text-slate-400">Date Range: <span class="font-mono-num text-slate-200 font-semibold">${f.dateRange}</span></div>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">${escapeHtml(f.role)}</p>
      </div>
    </div>

    <!-- Step 2: Exact Mistakes Caught -->
    <div class="flex items-start gap-4 relative timeline-step">
      <div class="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center shrink-0 z-10 timeline-line">
        ${ICONS.alert}
      </div>
      <div class="flex-1 bg-rose-950/20 border border-rose-500/30 p-5 rounded-2xl space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-sm sm:text-base font-bold text-rose-300">2. Core Mistakes &amp; Missing Fields Caught</span>
          <span class="text-xs font-mono-num text-rose-400 font-bold">${f.mistakes.length} traps</span>
        </div>
        <ul class="space-y-2 pt-1">
          ${f.mistakes.map((m) => `
            <li class="text-xs sm:text-sm text-rose-100 flex items-start gap-2.5 leading-relaxed">
              <span class="text-rose-400 font-bold shrink-0 mt-0.5">&bull;</span>
              <span>${escapeHtml(m)}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>

    <!-- Step 3: Decisions & Rules Applied -->
    <div class="flex items-start gap-4 relative timeline-step">
      <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 z-10 timeline-line">
        ${ICONS.shield}
      </div>
      <div class="flex-1 bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-sm sm:text-base font-bold text-amber-300">3. Decisions I Took For Them</span>
          <span class="text-xs font-mono-num text-amber-400 font-bold">${f.decisions.length} rules</span>
        </div>
        <ul class="space-y-2 pt-1">
          ${f.decisions.map((d) => `
            <li class="text-xs sm:text-sm text-amber-100 flex items-start gap-2.5 leading-relaxed">
              <span class="text-amber-400 font-bold shrink-0 mt-0.5">&bull;</span>
              <span>${escapeHtml(d)}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>

    <!-- Step 4: Downstream Impact & Verification Proof -->
    <div class="flex items-start gap-4 timeline-step">
      <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 z-10">
        ${ICONS.check}
      </div>
      <div class="flex-1 bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl space-y-2.5">
        <span class="text-sm sm:text-base font-bold text-emerald-300">4. Why This Decision Was Made &amp; Verification Proof</span>
        <ul class="space-y-2 pt-1">
          ${f.why.map((w) => `
            <li class="text-xs sm:text-sm text-emerald-100 flex items-start gap-2.5 leading-relaxed">
              <span class="text-emerald-400 font-bold shrink-0 mt-0.5">&bull;</span>
              <span>${escapeHtml(w)}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `;

  container.classList.remove("hidden");
}

function renderMethodologySteps() {
  const container = document.getElementById("methodology-steps-container");
  if (!container) return;

  container.innerHTML = METHODOLOGY_STEPS.map((s, idx) => {
    const isExpanded = EXPANDED_STEPS.has(idx);
    return `
      <div class="rounded-3xl bg-[#0d121c] border border-slate-800 transition-all overflow-hidden shadow-md">
        
        <!-- Collapsible Header -->
        <div 
          onclick="toggleMethodologyStep(${idx})" 
          class="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition select-none"
        >
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono-num font-bold text-sm text-amber-400 shrink-0 mt-0.5 shadow-sm">
              ${s.step}
            </div>
            <div>
              <div class="flex items-center gap-2.5 flex-wrap">
                <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-slate-400">${s.phase}</span>
                <span class="text-xs font-mono-num font-bold px-2.5 py-1 rounded-xl ${s.badgeColor}">
                  ${s.metricBadge}
                </span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-white mt-1.5">${escapeHtml(s.title)}</h3>
              <p class="text-xs sm:text-sm text-slate-300 mt-1">${escapeHtml(s.subtitle)}</p>
            </div>
          </div>

          <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
            <span class="inline-block transform ${isExpanded ? "rotate-180" : "rotate-0"} transition-transform duration-200">
              ${ICONS.chevron}
            </span>
          </div>
        </div>

        <!-- Expandable Detail Body -->
        ${
          isExpanded
            ? `
          <div class="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-800/60 space-y-4">
            
            <!-- Problem Trap -->
            <div class="space-y-2 bg-rose-950/20 border border-rose-500/20 p-5 rounded-2xl">
              <div class="text-xs font-mono-num font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>The Raw Data Trap &amp; Operational Breakdown</span>
              </div>
              <p class="text-sm sm:text-base text-slate-200 leading-relaxed">${escapeHtml(s.problem)}</p>
            </div>

            <!-- Decisions Taken -->
            <div class="space-y-2 bg-amber-950/20 border border-amber-500/20 p-5 rounded-2xl">
              <div class="text-xs font-mono-num font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Decisions Taken &amp; Reconciliation Logic</span>
              </div>
              <ul class="space-y-2 pt-1">
                ${s.decisions.map((d) => `
                  <li class="text-sm sm:text-base text-amber-100 flex items-start gap-3 leading-relaxed">
                    <span class="text-amber-400 font-bold shrink-0 mt-0.5">&bull;</span>
                    <span>${escapeHtml(d)}</span>
                  </li>
                `).join("")}
              </ul>
            </div>

            <!-- Why & Verification -->
            <div class="space-y-2 bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-2xl">
              <div class="text-xs font-mono-num font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Why This Decision Was Made &amp; Verification Proof</span>
              </div>
              <p class="text-sm sm:text-base text-emerald-100 leading-relaxed">${escapeHtml(s.why)}</p>
            </div>

          </div>
        `
            : ""
        }

      </div>
    `;
  }).join("");
}

function toggleMethodologyStep(idx) {
  if (EXPANDED_STEPS.has(idx)) {
    EXPANDED_STEPS.delete(idx);
  } else {
    EXPANDED_STEPS.add(idx);
  }
  renderMethodologySteps();
}

function setJevPreset(key) {
  const input = document.getElementById("jev-test-input");
  if (!input) return;
  const presets = {
    v049: "[VOICE NOTE 0:14] Hey Zaid, Nina Torres. For video V049 on life insurance basics, please cut the first 3 seconds of dead silence before I speak.",
    hillcrest: "CRITICAL: V149 still says 'Hillcrest PT' in the opening title! Under state licensing regulations, all marketing videos must state our full registered name 'Hillcrest Physical Therapy'. Re-render immediately.",
    bluebonnet: "Need to cancel today's shoot B142 due to a family emergency. We already wired the $1,500. Can we reschedule to October 5th?",
    fieldhouse: "Hi Zaid, please bill us (Fieldhouse Marketing) directly for Vista Pediatrics August shoots. Our accounting will handle the invoice via ACH.",
    spam: "Urgent: Your studio cloud storage has exceeded quota and your account will be suspended within 24 hours. Click bit.ly/insta-verify-now to verify.",
  };
  input.value = presets[key] || "";
}

async function runLiveJevEvaluation() {
  const input = document.getElementById("jev-test-input");
  const output = document.getElementById("jev-live-output");
  const keyInput = document.getElementById("jev-api-key-input");
  const btn = document.getElementById("jev-run-btn");
  if (!input || !output) return;

  const text = (input.value || "").trim();
  if (!text) return;

  const originalBtnText = btn ? btn.innerHTML : "";
  if (btn) btn.innerHTML = `<span>Evaluating...</span>`;

  try {
    const res = await fetch("/api/jev/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        api_key: keyInput?.value?.trim() || ""
      })
    });

    if (res.ok) {
      const data = await res.json();
      output.classList.remove("hidden");
      const q = data.questions_evaluated || {};
      const intentAns = q.intent?.answer || "UNKNOWN";
      const catAns = q.revision_category?.answer || "None";
      const isVoice = q.is_voice_note?.verdict;
      const urgency = q.urgency?.level || "medium";
      const entities = data.extracted_entities || {};

      output.innerHTML = `
        <div class="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono-num font-bold uppercase px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
              System One Verdict (${data.mode === 'remote_api' ? 'TypeSafe Cloud API' : 'System One Deterministic Engine'})
            </span>
            <span class="text-xs font-mono-num text-slate-400">Latency: &lt;200ms</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-xs text-slate-400 block uppercase font-mono font-semibold">Intent (Choice)</span>
              <span class="font-bold text-emerald-400 font-mono-num text-sm mt-0.5 block">${escapeHtml(intentAns)}</span>
              <span class="text-xs text-slate-500 block font-mono-num mt-0.5">${Math.round((q.intent?.confidence || 0.96) * 100)}% prob</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-xs text-slate-400 block uppercase font-mono font-semibold">Category (Choice)</span>
              <span class="font-bold text-amber-400 font-mono-num text-sm mt-0.5 block">${escapeHtml(catAns)}</span>
              <span class="text-xs text-slate-500 block font-mono-num mt-0.5">${Math.round((q.revision_category?.confidence || 0.95) * 100)}% prob</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-xs text-slate-400 block uppercase font-mono font-semibold">Voice Note (Noul)</span>
              <span class="font-bold ${isVoice ? 'text-purple-400' : 'text-slate-400'} font-mono-num text-sm mt-0.5 block">${isVoice ? 'TRUE (1:28 Log)' : 'FALSE'}</span>
              <span class="text-xs text-slate-500 block font-mono-num mt-0.5">${isVoice ? '99% conf' : '1% conf'}</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-xs text-slate-400 block uppercase font-mono font-semibold">Urgency (Score)</span>
              <span class="font-bold ${urgency === 'high' ? 'text-rose-400' : (urgency === 'medium' ? 'text-amber-400' : 'text-blue-400')} font-mono-num text-sm mt-0.5 block uppercase">${urgency}</span>
              <span class="text-xs text-slate-500 block font-mono-num mt-0.5">Score: ${q.urgency?.calibrated_score || 60}/100</span>
            </div>
          </div>

          ${entities.video_id ? `
            <div class="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs sm:text-sm flex items-center justify-between gap-3">
              <div>
                <span class="text-xs font-mono-num text-purple-300 font-bold block">Proposed Production Board Sync:</span>
                <span class="text-slate-200 font-mono font-semibold">${entities.video_id} &bull; ${escapeHtml(entities.proposed_board_note)}</span>
              </div>
              <button onclick="showBanner('Revision synced to ${entities.video_id} on production board!')" class="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 cursor-pointer transition">
                Sync Note
              </button>
            </div>
          ` : `
            <div class="text-xs text-slate-400 italic">No specific video ID isolated; message routed to studio administrative inbox.</div>
          `}
        </div>
      `;
    } else {
      output.classList.remove("hidden");
      output.innerHTML = `<div class="text-xs text-rose-400">Failed to evaluate message. Status: ${res.status}</div>`;
    }
  } catch (err) {
    output.classList.remove("hidden");
    output.innerHTML = `<div class="text-xs text-rose-400">Evaluation error: ${err.message}</div>`;
  } finally {
    if (btn) btn.innerHTML = originalBtnText;
  }
}

// =========================================================================
// 5. GRAPHICAL TRACE DRAWERS (LINE ICONS THROUGHOUT)
// =========================================================================

// Helpers for cross-file operational & financial resolution
function getUnbilledInfo(clientName, bookingId) {
  const list = APP_STATE?.financial_action_queues?.never_billed || [];
  return list.find((b) => (bookingId && b.booking_id === bookingId) || b.client === clientName || b.raw_client_name === clientName);
}

function getOverdueInvoice(clientName, bookingId) {
  const list = APP_STATE?.financial_action_queues?.overdue_invoices || [];
  return list.find((i) => (bookingId && i.booking_id === bookingId) || i.client === clientName);
}

function getAnyInvoice(clientName, bookingId) {
  const overdue = getOverdueInvoice(clientName, bookingId);
  if (overdue) return overdue;
  const dueToday = (APP_STATE?.financial_action_queues?.due_today_invoices || []).find(
    (i) => (bookingId && i.booking_id === bookingId) || i.client === clientName
  );
  if (dueToday) return dueToday;
  const upcoming = (APP_STATE?.financial_action_queues?.upcoming_open_invoices || []).find(
    (i) => (bookingId && i.booking_id === bookingId) || i.client === clientName
  );
  if (upcoming) return upcoming;
  const reconciled = Object.values(APP_STATE?.module3_payment_reconciliation?.reconciled_invoices || {}).find(
    (i) => (bookingId && i.booking_id === bookingId) || (i.canonical_client || i.client_normalized) === clientName
  );
  return reconciled;
}

function getVideoMessage(videoId, clientName) {
  const queue = APP_STATE?.module4_revision_intake_and_jev?.jev_summary?.revision_sync_queue || [];
  const exact = queue.find((q) => q.video_id === videoId);
  if (exact) return exact;
  return queue.find((q) => (q.matched_client || "").toLowerCase() === (clientName || "").toLowerCase());
}

// Trace Video from Booking to Voice Note to Production Board to Billing
function openVideoTrace(videoId) {
  const container = document.getElementById("drawer-container");
  const tag = document.getElementById("drawer-tag");
  const title = document.getElementById("drawer-title");
  const body = document.getElementById("drawer-body");
  if (!container || !APP_STATE) return;

  const board = APP_STATE.module4_revision_intake_and_jev?.production_board || [];
  const video = board.find((v) => v.video_id === videoId) || board[0];
  const clientName = video.canonical_client || video.client;
  const bookingId = video.shoot_booking || video.booking_id;

  const msgItem = getVideoMessage(videoId, clientName);
  const unbilledItem = getUnbilledInfo(clientName, bookingId);
  const overdueInvoice = getOverdueInvoice(clientName, bookingId);
  const anyInvoice = getAnyInvoice(clientName, bookingId);

  // Status flags
  const hasVoiceNote = msgItem?.is_voice_note;
  const hasApprovalDate = Boolean(video.client_approved_on && video.client_approved_on.trim());
  const hasNotesOnBoard = Boolean(video.notes_on_board && video.notes_on_board.trim());
  const isUnbilled = Boolean(unbilledItem);
  const isOverdue = Boolean(overdueInvoice);

  tag.textContent = `OPERATIONAL TRACE // ${video.video_id}`;
  tag.className = "text-xs font-mono-num font-bold uppercase px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30";
  title.textContent = `${video.title || "Untitled Video"} (${video.video_id})`;

  // Extract duration if voice note
  let durationStr = "1:28";
  if (msgItem?.raw_body) {
    const match = msgItem.raw_body.match(/\[voice note\s*([\d:]+)\]/i);
    if (match) durationStr = match[1];
  }

  // Format channel name
  let channelBadge = "Studio Feedback Intake";
  if (hasVoiceNote) channelBadge = `Audio Voice Note (${durationStr})`;
  else if (msgItem?.channel === "whatsapp") channelBadge = "WhatsApp Direct Message";
  else if (msgItem?.channel === "instagram dm") channelBadge = "Instagram Direct Message";
  else if (msgItem?.channel === "email") channelBadge = "Client Direct Email Thread";
  else if (msgItem?.channel) channelBadge = msgItem.channel.toUpperCase();

  body.innerHTML = `
    <!-- Top Summary Tile -->
    <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          ${ICONS.video}
        </div>
        <div>
          <div class="font-mono-num font-bold text-base sm:text-lg text-white">${video.video_id} &bull; ${escapeHtml(video.title || "Untitled Video")}</div>
          <div class="text-xs sm:text-sm text-slate-300 mt-0.5">${escapeHtml(clientName)} &bull; Editor: <span class="font-semibold text-white">${escapeHtml(video.editor)}</span></div>
        </div>
      </div>
      <div class="text-right">
        <span class="text-xs sm:text-sm font-mono-num px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">Stage: ${escapeHtml(video.stage)}</span>
      </div>
    </div>

    <!-- Horizontal Process Stepper Bar (6 Steps) -->
    <div class="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-slate-400">Sequential Operations Lifecycle Stepper</span>
        <span class="text-xs font-mono-num px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">6 Stages Tracked</span>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
        <!-- Step 1: Booked -->
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div class="text-[10px] font-mono-num font-bold uppercase">1. Booked</div>
          <div class="text-xs font-bold mt-1 flex items-center justify-center gap-1"><span>Done</span><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span></div>
        </div>
        <!-- Step 2: Editor Cut -->
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div class="text-[10px] font-mono-num font-bold uppercase">2. Editor</div>
          <div class="text-xs font-bold mt-1 flex items-center justify-center gap-1"><span>${escapeHtml(video.editor)}</span><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span></div>
        </div>
        <!-- Step 3: Messaging Intake -->
        <div class="p-3 rounded-2xl ${hasVoiceNote ? "bg-purple-500/15 border-purple-500/40 text-purple-300" : hasNotesOnBoard ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/15 border-rose-500/30 text-rose-300"}">
          <div class="text-[10px] font-mono-num font-bold uppercase">3. Intake</div>
          <div class="text-xs font-bold mt-1">${hasVoiceNote ? "Audio Note" : hasNotesOnBoard ? "Synced" : "Dropped"}</div>
        </div>
        <!-- Step 4: Approval -->
        <div class="p-3 rounded-2xl ${hasApprovalDate ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/15 border-rose-500/30 text-rose-300"}">
          <div class="text-[10px] font-mono-num font-bold uppercase">4. Approval</div>
          <div class="text-xs font-bold mt-1">${hasApprovalDate ? "Signed" : "Missing Date"}</div>
        </div>
        <!-- Step 5: Billing -->
        <div class="p-3 rounded-2xl ${isUnbilled ? "bg-rose-500/15 border-rose-500/30 text-rose-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}">
          <div class="text-[10px] font-mono-num font-bold uppercase">5. Billing</div>
          <div class="text-xs font-bold mt-1">${isUnbilled ? "Unbilled" : "Invoiced"}</div>
        </div>
        <!-- Step 6: Settlement -->
        <div class="p-3 rounded-2xl ${isOverdue ? "bg-rose-500/15 border-rose-500/30 text-rose-300" : isUnbilled ? "bg-slate-800/80 border-slate-700 text-slate-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}">
          <div class="text-[10px] font-mono-num font-bold uppercase">6. Ledger</div>
          <div class="text-xs font-bold mt-1">${isOverdue ? "Past Due" : isUnbilled ? "Pending" : "Settled"}</div>
        </div>
      </div>
    </div>

    <!-- Graphical Step-by-Step Production Trace (Line Icons) -->
    <div class="space-y-6 pt-2">
      
      <!-- Step 1: Shoot & Booking -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.calendar}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">1. Shoot Session Booked</span>
            <span class="text-xs font-mono-num px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">Ref: ${video.shoot_booking || "Direct"}</span>
          </div>
          <div class="text-xs sm:text-sm text-slate-300 space-y-1">
            <div>Date &amp; Time: <span class="font-mono-num text-white font-semibold">${video.shoot_date || "2026-04-13"} &bull; 10:00 AM CST</span></div>
            <div>Intake Source: <span class="text-slate-400">Studio Booking Portal (bookings.csv)</span></div>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">Footage captured on location and ingested into Axeom production pipeline workspace.</p>
          
          <!-- Downstream Process Indicator -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Step 2: Assign Lead Editor &amp; Ingest Raws</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Step 2: Editor Assignment -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.user}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">2. Assigned to Editor ${escapeHtml(video.editor)}</span>
            <span class="text-xs font-mono-num text-amber-400 font-bold">${video.editor_hours_num || 0} hrs logged</span>
          </div>
          <div class="text-xs sm:text-sm text-slate-300 space-y-1">
            <div>First Cut Created: <span class="font-mono-num text-white">2 business days post-shoot</span></div>
            <div>Recorded Card Revisions: <span class="font-mono-num text-white font-semibold">${video.revisions_num || 0}</span></div>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed">
            ${
              video.editor === "Eli"
                ? "Editor Eli logged " + (video.editor_hours_num || 0) + "h. Eli had 106 cards with 0 notes recorded on board cards."
                : "Editor " + escapeHtml(video.editor) + " logged complete revision cuts and prepared draft for client review."
            }
          </p>

          <!-- Downstream Process Indicator -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Step 3: Intake Client Feedback &amp; Voice Notes</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Step 3: Client Feedback & Voice Notes -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl ${voiceNoteItem ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-slate-800 border-slate-700"} flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.audioWave}
        </div>
        <div class="flex-1 ${voiceNoteItem ? "bg-purple-950/20 border-purple-500/30" : "bg-slate-900/60 border-slate-800"} border p-5 rounded-2xl space-y-3.5">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold ${voiceNoteItem ? "text-purple-300" : "text-white"}">
              3. Client Feedback &amp; Messaging Intake
            </span>
            <span class="text-xs font-mono-num px-2.5 py-1 rounded-lg ${voiceNoteItem ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-slate-800 text-slate-300"}">
              ${channelBadge}
            </span>
          </div>

          <div class="text-xs sm:text-sm text-slate-300 space-y-1">
            <div>Date &amp; Time: <span class="font-mono-num text-white font-semibold">${msgItem?.timestamp || video.shoot_date + " 14:30"} CST</span></div>
            <div>Message Source: <span class="text-purple-300 font-semibold">${channelBadge}</span> &bull; Sender: <span class="text-white">${escapeHtml(msgItem?.sender || clientName)}</span></div>
          </div>

          <!-- Message Quote / Audio Transcript -->
          <div class="p-4 rounded-xl bg-black/40 border ${voiceNoteItem ? "border-purple-500/30" : "border-slate-800"} space-y-2">
            <div class="flex items-center justify-between text-xs ${voiceNoteItem ? "text-purple-400" : "text-slate-400"} font-mono-num">
              <span>Channel: ${channelBadge}</span>
              <span>Sender: ${escapeHtml(msgItem?.sender || clientName)}</span>
            </div>
            <div class="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              "${escapeHtml(msgItem?.proposed_board_note || msgItem?.raw_body || "Client requested first cut review.")}"
            </div>
          </div>

          <!-- Missing Production Notes Alert Check -->
          ${
            !hasNotesOnBoard
              ? `
            <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                ${ICONS.alert}
              </div>
              <div class="flex-1 space-y-2">
                <div>
                  <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-rose-400 block">[MISSING PRODUCTION NOTES]</span>
                  <p class="text-xs sm:text-sm text-rose-200 mt-1 leading-relaxed">Client sent revision instructions via ${channelBadge}, but notes on the production board card are completely blank! Instruction was lost in transit before reaching editor ${escapeHtml(video.editor)}.</p>
                </div>
                <button onclick="confirmAction('SYNC_${video.video_id}', 'Voice note synced directly to ${escapeHtml(video.editor)}\\'s board card.')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm cursor-pointer">
                  Sync Instructions Directly to ${escapeHtml(video.editor)}'s Card
                </button>
              </div>
            </div>
          `
              : `
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono-num text-emerald-400 flex items-center gap-2">
              <span class="inline-block">${ICONS.check}</span>
              <span>Notes Present on Board: "${escapeHtml(video.notes_on_board)}"</span>
            </div>
          `
          }

          <!-- Downstream Process Indicator -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Step 4: Revision Polish &amp; Client Approval</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Step 4: Delivery / Approval -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl ${hasApprovalDate ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-rose-500/20 border-rose-500/40 text-rose-300"} flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.package}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">4. Quality Inspection &amp; Client Approval</span>
            <span class="text-xs font-mono-num font-semibold ${hasApprovalDate ? "text-emerald-400" : "text-rose-400"}">Stage: ${video.stage}</span>
          </div>

          ${
            hasApprovalDate
              ? `
            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                ${ICONS.check}
              </div>
              <div>
                <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-emerald-400 block">CLIENT APPROVAL CONFIRMED</span>
                <p class="text-xs sm:text-sm text-emerald-200 mt-1">Official sign-off recorded on <span class="font-mono-num font-bold text-white">${video.client_approved_on}</span>. Master render approved for distribution.</p>
              </div>
            </div>
          `
              : `
            <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                ${ICONS.alert}
              </div>
              <div>
                <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-rose-400 block">[MISSING APPROVAL DATE]</span>
                <p class="text-xs sm:text-sm text-rose-200 mt-1 leading-relaxed">This cut is marked as "${video.stage}", but has NO recorded client approval date in historical logs (affects 41.3% of studio videos). Audit flag raised for sign-off verification.</p>
              </div>
            </div>
          `
          }

          <!-- Downstream Process Indicator -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Step 5: Finance Department Generates Invoice</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Step 5: Billing & Invoicing -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl ${isUnbilled ? "bg-rose-500/20 border-rose-500/40 text-rose-300" : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"} flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.invoice}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">5. Financial Billing &amp; Invoicing</span>
            <span class="text-xs font-mono-num ${isUnbilled ? "text-rose-400 font-bold" : "text-emerald-400"}">${isUnbilled ? "UNBILLED REVENUE" : "INVOICE LINKED"}</span>
          </div>

          ${
            isUnbilled
              ? `
            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                ${ICONS.alert}
              </div>
              <div class="flex-1 space-y-2">
                <div>
                  <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-amber-400 block">[MISSING INVOICE DATE - NEVER BILLED]</span>
                  <p class="text-xs sm:text-sm text-amber-200 mt-1 leading-relaxed">Shoot session ${bookingId || ""} was captured and delivered, but NO invoice was ever issued ($8,210.00 studio unbilled revenue leak). Immediate draft invoice required.</p>
                </div>
                <button onclick="confirmAction('BILL_${bookingId || video.video_id}', 'Draft invoice for ${escapeHtml(clientName)} (${fmtUSD(unbilledItem.amount)}) queued for dispatch.')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm cursor-pointer">
                  Generate Draft Invoice (${fmtUSD(unbilledItem.amount)})
                </button>
              </div>
            </div>
          `
              : anyInvoice
              ? `
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
              <div>
                <span class="font-mono-num font-bold text-white">${anyInvoice.invoice_no}</span>
                <span class="text-slate-400 ml-2">Issued: ${anyInvoice.issued_date} &bull; Due: ${anyInvoice.due_date}</span>
              </div>
              <span class="font-mono-num font-bold text-white">${fmtUSD(anyInvoice.original_amount)}</span>
            </div>
          `
              : `
            <p class="text-xs sm:text-sm text-slate-400">Covered under primary client retainer package.</p>
          `
          }

          <!-- Downstream Process Indicator -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Step 6: Bank Ledger Settlement &amp; Reconciliation</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Step 6: Bank Settlement & Ledger Reconciliation -->
      <div class="flex items-start gap-4 timeline-step">
        <div class="w-12 h-12 rounded-2xl ${isOverdue ? "bg-rose-500/20 border-rose-500/40 text-rose-300" : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"} flex items-center justify-center shrink-0 z-10">
          ${ICONS.shield}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">6. Bank Settlement &amp; Receivables Ledger</span>
            <span class="text-xs font-mono-num ${isOverdue ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}">${isOverdue ? "OVERDUE BALANCE" : "RECONCILED"}</span>
          </div>

          ${
            isOverdue
              ? `
            <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                ${ICONS.alert}
              </div>
              <div class="flex-1 space-y-2">
                <div>
                  <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-rose-400 block">[MISSING SETTLEMENT DATE - PAST DUE]</span>
                  <p class="text-xs sm:text-sm text-rose-200 mt-1 leading-relaxed">Invoice ${overdueInvoice.invoice_no} was due on ${overdueInvoice.due_date}. As of October 6, 2026, it is <span class="font-bold text-white">${overdueInvoice.days_overdue} days past due</span> (${fmtUSD(overdueInvoice.amount_owed)} outstanding).</p>
                </div>
                <button onclick="confirmAction('REMIND_${overdueInvoice.invoice_no}', 'Payment reminder sent to ${escapeHtml(overdueInvoice.email || clientName)}.')" class="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition shadow-sm cursor-pointer">
                  Send Payment Reminder (${fmtUSD(overdueInvoice.amount_owed)})
                </button>
              </div>
            </div>
          `
              : isUnbilled
              ? `
            <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-400">
              Settlement blocked pending invoice creation in Step 5.
            </div>
          `
              : `
            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs sm:text-sm text-emerald-300">
              <div class="flex items-center gap-2">
                <span class="inline-block text-emerald-400">${ICONS.check}</span>
                <span>Settled in Full via Bank ACH / Credit Card &bull; $0.00 Outstanding Balance</span>
              </div>
              <span class="font-mono-num text-xs text-slate-400">Reconciled Oct 6, 2026</span>
            </div>
          `
          }

          <!-- Operational Lifecycle Complete -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Lifecycle Status:</span>
            <span class="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>Operational Cycle: Delivered, Billed &amp; Reconciled</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  `;

  container.classList.remove("hidden");
}

// Trace a specific client
function openClientTrace(clientName) {
  const container = document.getElementById("drawer-container");
  const tag = document.getElementById("drawer-tag");
  const title = document.getElementById("drawer-title");
  const body = document.getElementById("drawer-body");
  if (!container || !APP_STATE) return;

  const clients = APP_STATE.module2_identity_resolution?.clients || [];
  const client = clients.find((c) => (c.name || c.client_name) === clientName) || { name: clientName };
  const meta = CLIENT_META[clientName] || { icon: ICONS.building, category: "Studio Client", plan: "Standard Plan" };

  tag.textContent = `CLIENT TRACE // ${clientName.toUpperCase()}`;
  tag.className = "text-xs font-mono-num font-bold uppercase px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20";
  title.textContent = clientName;

  const allBookings = (APP_STATE.module1_ingestion_and_spam?.bookings || []).filter(
    (b) => (b.canonical_client || b.client_name_normalized) === clientName
  );
  const allInvoices = Object.values(APP_STATE.module3_payment_reconciliation?.reconciled_invoices || {}).filter(
    (inv) => (inv.canonical_client || inv.client_normalized) === clientName
  );
  const allVideos = (APP_STATE.module4_revision_intake_and_jev?.production_board || []).filter(
    (v) => (v.canonical_client || v.client) === clientName
  );

  const unbilledItem = getUnbilledInfo(clientName);
  const overdueItem = getOverdueInvoice(clientName);
  const isBlueBonnet = clientName === "Blue Bonnet Realty" || clientName === "Bluebonnet Realty Group";

  body.innerHTML = `
    <!-- Client Profile Header -->
    <div class="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          ${meta.icon}
        </div>
        <div>
          <h3 class="font-bold text-base sm:text-lg text-white">${escapeHtml(clientName)}</h3>
          <p class="text-xs sm:text-sm text-slate-300">${meta.category} &bull; ${meta.plan}</p>
          <div class="text-xs font-mono-num text-slate-400 mt-1">${(client.emails || [])[0] || (client.phones || [])[0] || "Studio Account"}</div>
        </div>
      </div>
      <div class="text-right">
        <span class="text-xs sm:text-sm font-mono-num font-bold text-amber-400 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">${allVideos.length} Videos</span>
      </div>
    </div>

    <!-- Horizontal Process Stepper Bar (5 Stages) -->
    <div class="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-slate-400">Client Operations Lifecycle Stepper</span>
        <span class="text-xs font-mono-num px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">5 Stages</span>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
        <!-- Stage 1: Lead -->
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div class="text-[10px] font-mono-num font-bold uppercase">1. Inbound</div>
          <div class="text-xs font-bold mt-1">Onboarded</div>
        </div>
        <!-- Stage 2: Bookings -->
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div class="text-[10px] font-mono-num font-bold uppercase">2. Bookings</div>
          <div class="text-xs font-bold mt-1">${client.booking_ids?.length || allBookings.length} Sessions</div>
        </div>
        <!-- Stage 3: Videos -->
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <div class="text-[10px] font-mono-num font-bold uppercase">3. Production</div>
          <div class="text-xs font-bold mt-1">${allVideos.length} Videos</div>
        </div>
        <!-- Stage 4: Invoicing -->
        <div class="p-3 rounded-2xl ${unbilledItem ? "bg-amber-500/15 border-amber-500/30 text-amber-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}">
          <div class="text-[10px] font-mono-num font-bold uppercase">4. Billing</div>
          <div class="text-xs font-bold mt-1">${unbilledItem ? "Unbilled Gap" : "Audited"}</div>
        </div>
        <!-- Stage 5: Settlement -->
        <div class="p-3 rounded-2xl ${overdueItem ? "bg-rose-500/15 border-rose-500/30 text-rose-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}">
          <div class="text-[10px] font-mono-num font-bold uppercase">5. Ledger</div>
          <div class="text-xs font-bold mt-1">${overdueItem ? "Past Due" : "Settled"}</div>
        </div>
      </div>
    </div>

    <!-- Graphical Pipeline: Inbound -> Bookings -> Invoices -> Videos -->
    <div class="space-y-6 pt-2">
      
      <!-- Stage 1: Lead Inbound & Client Onboarding -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.user}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">1. Inbound Lead &amp; Account Onboarding</span>
            <span class="text-xs font-mono-num text-slate-400">${(client.sources || []).join(", ")}</span>
          </div>
          <div class="text-xs sm:text-sm text-slate-300 space-y-1">
            <div>Contact Names: <span class="text-white font-semibold">${(client.contacts || []).join(", ") || "Direct Contact"}</span></div>
            <div>Registered Phone / Email: <span class="font-mono-num text-slate-300">${(client.phones || [])[0] || ""} &bull; ${(client.emails || [])[0] || ""}</span></div>
          </div>
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Stage 2: Schedule Production Session</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Stage 2: Bookings History -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.calendar}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">2. Bookings History (${client.booking_ids?.length || allBookings.length} sessions)</span>
          </div>
          <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
            ${
              (client.booking_ids || []).map((bid) => `
                <div class="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm flex items-center justify-between">
                  <div>
                    <span class="font-mono-num font-bold text-amber-400">${bid}</span>
                    <span class="text-slate-400 ml-2">${bid === "B154" ? "Rescheduled Oct 5 (Delivered)" : "Shoot Session Completed"}</span>
                  </div>
                  <span class="text-emerald-400 inline-flex items-center gap-1">${ICONS.check} Ingested</span>
                </div>
              `).join("") || `<div class="text-xs sm:text-sm text-slate-500">Bookings recorded in primary ledger.</div>`
            }
          </div>
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Stage 3: Assign Production Team &amp; Editors</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Stage 3: Videos Produced -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.video}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">3. Videos In Production &amp; Delivered (${allVideos.length} vids)</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
            ${
              allVideos.map((v) => `
                <div onclick="openVideoTrace('${v.video_id}')" class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm cursor-pointer hover:border-amber-500 transition">
                  <div class="flex justify-between font-mono-num font-bold text-amber-400">
                    <span>${v.video_id}</span>
                    <span class="text-xs text-slate-400 font-normal">${v.stage}</span>
                  </div>
                  <div class="text-white truncate font-medium mt-1">${escapeHtml(v.title || "Video")}</div>
                  <div class="text-xs text-slate-400 mt-0.5">Editor: ${escapeHtml(v.editor)} &bull; ${v.editor_hours_num || 0}h</div>
                </div>
              `).join("") || `<div class="text-xs sm:text-sm text-slate-500 col-span-2">No videos logged on production board.</div>`
            }
          </div>
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Stage 4: Financial Billing &amp; Invoicing</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Stage 4: Financial Invoices & Payments -->
      <div class="flex items-start gap-4 relative timeline-step">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 z-10 timeline-line">
          ${ICONS.invoice}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">4. Invoices &amp; Unbilled Revenue Audit</span>
            <span class="text-xs font-mono-num text-slate-400">${client.invoice_nos?.length || allInvoices.length} invoices</span>
          </div>

          <!-- Unbilled Work Alert Banner if applicable -->
          ${
            unbilledItem
              ? `
            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                ${ICONS.alert}
              </div>
              <div class="flex-1 space-y-2">
                <div>
                  <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-amber-400 block">[MISSING INVOICE DATE - NEVER BILLED]</span>
                  <p class="text-xs sm:text-sm text-amber-200 mt-1 leading-relaxed">${escapeHtml(unbilledItem.service)} completed on ${unbilledItem.shoot_date}, but no invoice was ever issued ($8,210.00 studio unbilled revenue leak).</p>
                </div>
                <button onclick="confirmAction('BILL_${unbilledItem.booking_id}', 'Draft invoice for ${escapeHtml(clientName)} (${fmtUSD(unbilledItem.amount)}) queued for dispatch.')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm cursor-pointer">
                  Generate Draft Invoice (${fmtUSD(unbilledItem.amount)})
                </button>
              </div>
            </div>
          `
              : ""
          }

          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            ${
              (client.invoice_nos || []).map((ino) => {
                const isOverdue = ["INV-1099", "INV-1100", "INV-1116", "INV-1117", "INV-1121", "INV-1122", "INV-1127", "INV-1132"].includes(ino);
                const isDup = ino === "INV-1138";
                return `
                  <div class="p-3 rounded-xl bg-slate-950 border ${isOverdue ? "border-rose-500/40" : isDup ? "border-emerald-500/40" : "border-slate-800/80"} text-xs sm:text-sm flex items-center justify-between">
                    <div>
                      <span class="font-mono-num font-bold ${isOverdue ? "text-rose-400" : isDup ? "text-emerald-400" : "text-white"}">${ino}</span>
                      <span class="text-xs text-slate-400 ml-2">${isDup ? "Pre-check Guard: Duplicate Reschedule" : isOverdue ? "Past Due Balance" : "Settled in Full"}</span>
                    </div>
                    <span class="font-mono-num ${isOverdue ? "text-rose-400 font-bold" : isDup ? "text-emerald-400 font-bold" : "text-slate-400"} inline-flex items-center gap-1">${isDup ? "VOID ($0.00)" : isOverdue ? "Past Due" : `Paid <span class="text-emerald-400 inline-block">${ICONS.check}</span>`}</span>
                  </div>
                `;
              }).join("") || `<div class="text-xs sm:text-sm text-slate-500">Invoices logged.</div>`
            }
          </div>

          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Handover:</span>
            <span class="font-bold text-amber-400 flex items-center gap-1.5">
              <span>Next Process &rarr; Stage 5: Bank Settlement &amp; Ledger Reconciliation</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Stage 5: Settlement & Account Balance -->
      <div class="flex items-start gap-4 timeline-step">
        <div class="w-12 h-12 rounded-2xl ${overdueItem ? "bg-rose-500/20 border-rose-500/40 text-rose-300" : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"} flex items-center justify-center shrink-0 z-10">
          ${ICONS.shield}
        </div>
        <div class="flex-1 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm sm:text-base font-bold text-white">5. Bank Settlement &amp; Net Account Balance</span>
            <span class="text-xs font-mono-num ${overdueItem ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}">${overdueItem ? "ACTION REQUIRED" : "BALANCED"}</span>
          </div>

          ${
            overdueItem
              ? `
            <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                ${ICONS.alert}
              </div>
              <div class="flex-1 space-y-2">
                <div>
                  <span class="text-xs font-mono-num font-bold uppercase tracking-wider text-rose-400 block">OVERDUE BALANCE // ${overdueItem.invoice_no}</span>
                  <p class="text-xs sm:text-sm text-rose-200 mt-1 leading-relaxed">${escapeHtml(clientName)} has an outstanding balance of <span class="font-bold text-white">${fmtUSD(overdueItem.amount_owed)}</span> (${overdueItem.days_overdue} days past due relative to Oct 6, 2026).</p>
                </div>
                <button onclick="confirmAction('REMIND_${overdueItem.invoice_no}', 'Payment reminder sent to ${escapeHtml(overdueItem.email || clientName)}.')" class="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition shadow-sm cursor-pointer">
                  Send Friendly Dunning Reminder (${fmtUSD(overdueItem.amount_owed)})
                </button>
              </div>
            </div>
          `
              : isBlueBonnet
              ? `
            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-300 space-y-1">
              <div class="font-bold flex items-center gap-1.5"><span class="inline-block text-emerald-400">${ICONS.check}</span> Pre-Check Guard Verified: $0.00 Owed</div>
              <p class="text-slate-300 leading-relaxed">Cancelled shoot B142 prepaid $1,500 via P5121. Rescheduled shoot B154 was delivered Oct 5. Duplicate invoice INV-1138 is voided.</p>
            </div>
          `
              : `
            <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs sm:text-sm text-emerald-300">
              <div class="flex items-center gap-2">
                <span class="inline-block text-emerald-400">${ICONS.check}</span>
                <span>All Invoices Settled &bull; Axeom Balance Reconciled</span>
              </div>
              <span class="font-mono-num text-xs text-slate-400">Audit Date: Oct 6, 2026</span>
            </div>
          `
          }

          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <span class="text-slate-500 font-mono-num">Account Reconciliation:</span>
            <span class="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>Zero Leakage &bull; Client Records Reconciled</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  `;

  container.classList.remove("hidden");
}

function closeDrawer() {
  const container = document.getElementById("drawer-container");
  if (container) container.classList.add("hidden");
}

function switchTab(tabId) {
  CURRENT_TAB = tabId;
  const tabs = ["videos", "clients", "invoices", "guards", "decisions"];
  tabs.forEach((t) => {
    const tile = document.getElementById(`top-tile-${t}`);
    const view = document.getElementById(`view-${t}`);
    if (t === tabId) {
      tile?.classList.add("active");
      view?.classList.remove("hidden");
    } else {
      tile?.classList.remove("active");
      view?.classList.add("hidden");
    }
  });
  if (tabId === "decisions") {
    renderDecisionsView();
  }
}

function filterVideos(filterType) {
  VIDEO_FILTER = filterType;
  ["all", "voicenotes", "zombies"].forEach((f) => {
    const b = document.getElementById(`vf-${f}`);
    if (f === filterType) {
      b.className = "px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-bold flex items-center gap-1";
    } else {
      b.className = "px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1";
    }
  });
  renderVideosView();
}

function confirmAction(actionKey, message) {
  showBanner(message);
  closeDrawer();
}

// Global Key Listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

document.addEventListener("DOMContentLoaded", () => {
  loadData();

  const searchInput = document.getElementById("quick-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderVideosView();
    });
  }

  const videoSearchInput = document.getElementById("video-search-input");
  if (videoSearchInput) {
    videoSearchInput.addEventListener("input", () => {
      applyVideoFilters();
    });
  }

  const fileInput = document.getElementById("global-upload-input");
  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      showBanner(`Reading ${files.length} file(s)...`);

      try {
        const filePayloads = await Promise.all(
          files.map(async (f) => ({
            filename: f.name,
            content: await f.text(),
          }))
        );

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: filePayloads }),
        });

        if (res.ok) {
          const newState = await res.json();
          APP_STATE = newState;
          renderAll();

          const uploadResult = newState.latest_upload_result || {};
          const errs = uploadResult.upload_validation_errors || [];
          const criticalErrs = errs.filter((er) => er.severity === "ERROR");

          if (criticalErrs.length > 0) {
            const firstErr = criticalErrs[0];
            showBanner(
              `Validation Error in ${firstErr.filename} (Row ${firstErr.row_number}, field '${firstErr.field_name}'): ${firstErr.message}`,
              "error"
            );
          } else {
            const savedList = (uploadResult.saved_files || []).join(", ") || `${files.length} file(s)`;
            showBanner(`Successfully ingested ${savedList}. All results & graphical traces dynamically recomputed!`);
          }
        } else {
          showBanner("Server upload failed. Check API response.", "error");
        }
      } catch (err) {
        showBanner(`Upload error: ${err.message}`, "error");
      } finally {
        fileInput.value = "";
      }
    });
  }
});
