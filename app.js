/* ===================================================================
   MEC CA Study Buddy — Frontend SPA (Apps Script edition)
   - First-time SETUP WIZARD (Apps Script URL + Drive/Photos ID + PIN)
   - PIN lock screen, multi-device (data lives in your Google Sheet)
   - Chat / class diary / photo upload all go through your Apps Script
   =================================================================== */

// ---------- i18n ----------
const I18N = {
  en: {
    appName: "MEC Study Buddy", tagline: "Your Senior CA Professor — always with you",
    nav: { home: "Home", subjects: "Subjects", today: "Today", exam: "Exams", chat: "Chat" },
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    welcome: "Ready to study, future CA? 🎓",
    quickAsk: "Ask the Professor", logToday: "Log today's class", myNotes: "My Notes", examPrep: "Exam Prep",
    todayTitle: "Today's Class Diary", todayHint: "Tell me what you studied today — I'll remember and guide you.",
    subject: "Subject", topic: "Topic / Chapter", note: "What did you learn? (notes, doubts)",
    save: "Save", saved: "Saved ✓", recent: "Recent classes", noLogs: "No classes logged yet.",
    subjectsTitle: "Your MEC Subjects", openChat: "Ask about this",
    examTitle: "Exam & Test Preparation", examHint: "Get a study plan, important questions & revision tips.",
    makePlan: "Make my plan", chatTitle: "Senior CA Professor",
    chatPlaceholder: "Type your doubt… (Maths, Eco, Commerce)", clearMem: "Clear chat",
    streak: "Day streak", classesLogged: "Classes logged", topicsCovered: "Topics covered",
    uploadPhoto: "Upload notes / diagram photo", photoSaved: "Photo backed up ✓", uploading: "Uploading…",
    // setup / lock
    setupTitle: "First-time Setup", step: "Step",
    s1Title: "Connect your backend", s1Hint: "Paste the Google Apps Script Web App URL you deployed.",
    urlPh: "https://script.google.com/macros/s/..../exec", testBtn: "Test connection",
    testing: "Testing…", connected: "Connected ✓", connectFail: "Could not connect. Check the URL.",
    s2Title: "Backup locations", s2Hint: "Optional — where your photos & notes get saved.",
    driveIdLabel: "Google Drive Folder ID", photosIdLabel: "Google Photos Album ID (optional)",
    groqLabel: "Groq API key (free AI)", groqHint: "Get it free at console.groq.com",
    langLabel: "Language", s3Title: "Set a PIN", s3Hint: "You'll use this PIN to open the app on any device.",
    createPin: "Create PIN (4–6 digits)", confirmPin: "Confirm PIN", finishBtn: "Finish setup",
    next: "Next", back: "Back", pinMismatch: "PINs don't match", pinLen: "PIN must be 4–6 digits",
    lockTitle: "Enter your PIN", unlock: "Unlock", wrongPin: "Wrong PIN, try again",
    existingFound: "This backend is already set up. Enter your PIN to connect this device.",
    reset: "Reset / use different backend", optional: "optional", saving: "Saving…",
  },
  hi: {
    appName: "MEC Study Buddy", tagline: "Aapke Senior CA Professor — hamesha saath",
    nav: { home: "Home", subjects: "Subjects", today: "Aaj", exam: "Exam", chat: "Chat" },
    greetMorning: "Good morning", greetAfternoon: "Good afternoon", greetEvening: "Good evening",
    welcome: "Padhne ke liye ready ho, future CA? 🎓",
    quickAsk: "Professor se pucho", logToday: "Aaj ki class likho", myNotes: "Mere Notes", examPrep: "Exam Prep",
    todayTitle: "Aaj ki Class Diary", todayHint: "Batao aaj kya padha — main yaad rakhunga aur guide karunga.",
    subject: "Subject", topic: "Topic / Chapter", note: "Kya seekha? (notes, doubts)",
    save: "Save karo", saved: "Save ho gaya ✓", recent: "Recent classes", noLogs: "Abhi koi class log nahi hui.",
    subjectsTitle: "Aapke MEC Subjects", openChat: "Iske baare me pucho",
    examTitle: "Exam & Test ki Taiyari", examHint: "Study plan, important questions aur revision tips lo.",
    makePlan: "Mera plan banao", chatTitle: "Senior CA Professor",
    chatPlaceholder: "Apna doubt likho… (Maths, Eco, Commerce)", clearMem: "Chat clear karo",
    streak: "Din ka streak", classesLogged: "Classes logged", topicsCovered: "Topics cover hue",
    uploadPhoto: "Notes / diagram photo upload karo", photoSaved: "Photo backup ho gaya ✓", uploading: "Upload ho raha…",
    setupTitle: "Pehli baar Setup", step: "Step",
    s1Title: "Apna backend connect karo", s1Hint: "Jo Google Apps Script Web App URL deploy kiya woh paste karo.",
    urlPh: "https://script.google.com/macros/s/..../exec", testBtn: "Connection test karo",
    testing: "Test ho raha…", connected: "Connect ho gaya ✓", connectFail: "Connect nahi hua. URL check karo.",
    s2Title: "Backup jagah", s2Hint: "Optional — photos & notes kahan save honge.",
    driveIdLabel: "Google Drive Folder ID", photosIdLabel: "Google Photos Album ID (optional)",
    groqLabel: "Groq API key (free AI)", groqHint: "console.groq.com se free milti hai",
    langLabel: "Bhasha", s3Title: "PIN set karo", s3Hint: "Is PIN se kisi bhi device pe app khulega.",
    createPin: "PIN banao (4–6 digit)", confirmPin: "PIN confirm karo", finishBtn: "Setup poora karo",
    next: "Aage", back: "Peeche", pinMismatch: "PIN match nahi hua", pinLen: "PIN 4–6 digit ka ho",
    lockTitle: "Apna PIN daalo", unlock: "Unlock", wrongPin: "Galat PIN, dubara try karo",
    existingFound: "Ye backend pehle se setup hai. Is device ko connect karne ke liye PIN daalo.",
    reset: "Reset / dusra backend", optional: "optional", saving: "Save ho raha…",
  }
};

// ---------- SUBJECT DATA (from the student's Telangana MEC books) ----------
const SUBJECTS = [
  { id: "maths1a", name: "Maths Paper-IA", icon: "📐", color: "from-orange-500 to-amber-600",
    tag: "Algebra · Vector Algebra · Trigonometry",
    chapters: ["Functions","Mathematical Induction","Matrices","Addition of Vectors","Product of Vectors",
               "Trigonometric Ratios upto Transformations","Trigonometric Equations","Inverse Trigonometric Functions",
               "Hyperbolic Functions","Properties of Triangles"] },
  { id: "maths1b", name: "Maths Paper-IB", icon: "📊", color: "from-rose-500 to-red-600",
    tag: "Coordinate Geometry · Calculus",
    chapters: ["Locus","Transformation of Axes","The Straight Line","Pair of Straight Lines",
               "Three Dimensional Coordinates","Direction Cosines & Direction Ratios","The Plane",
               "Limits & Continuity","Differentiation","Applications of Derivatives"] },
  { id: "eco", name: "Economics", icon: "💰", color: "from-teal-500 to-emerald-600",
    tag: "Micro & Macro Economics",
    chapters: ["Introduction to Economics","Theories of Consumer Behaviour","Demand Analysis","Production Analysis",
               "Market Analysis","Theories of Distribution","National Income Analysis",
               "Theories of Employment & Public Finance","Money, Banking & Inflation","Basic Statistics for Economics"] },
  { id: "commerce", name: "Commerce", icon: "🏦", color: "from-blue-500 to-indigo-600",
    tag: "Business Organisation & Finance",
    chapters: ["Concept of Business","Business Activities & Functions",
               "Sole Proprietorship, Joint Hindu Family Business & Co-operative Societies","Partnership",
               "Joint Stock Company","Formation of a Company","Commencement of Business","Business Finance",
               "Sources of Business Finance","Micro, Small & Medium Enterprises (MSME)",
               "Multinational Companies (MNCs)","Current Trends in Business (E-business)"] },
];

// ---------- STATE / STORAGE ----------
const LS = { cfg: "mec_cfg", logs: "mec_logs", chat: "mec_chat", streak: "mec_streak", lastDay: "mec_lastday" };
let cfg = JSON.parse(localStorage.getItem(LS.cfg) || "null");   // { url, lang }
let session = { pinHash: sessionStorage.getItem("mec_pin") || null, unlocked: false };
let state = {
  lang: (cfg && cfg.lang) || "hi", view: "home",
  logs: JSON.parse(localStorage.getItem(LS.logs) || "[]"),
  chat: JSON.parse(localStorage.getItem(LS.chat) || "[]"),
};
const t = () => I18N[state.lang];
const saveLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ---------- helpers ----------
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };
async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function greet() { const h = new Date().getHours(); return h < 12 ? t().greetMorning : h < 17 ? t().greetAfternoon : t().greetEvening; }
function mdToHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>").replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>").replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>")
    .replace(/^(.*)$/s, "<p>$1</p>");
}

// ---------- Apps Script API (text/plain avoids CORS preflight) ----------
async function api(action, payload = {}) {
  const body = JSON.stringify(Object.assign({ action, pinHash: session.pinHash }, payload));
  const res = await fetch(cfg.url, {
    method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
    body, redirect: "follow",
  });
  return res.json();
}
async function apiStatus(url) {
  const res = await fetch(url + (url.includes("?") ? "&" : "?") + "action=status");
  return res.json();
}

// ===================================================================
//  BOOT  (decide: setup wizard / pin lock / app)
// ===================================================================
async function boot() {
  if (!cfg || !cfg.url) return renderSetup();
  if (!session.pinHash) return renderLock();
  try {
    const r = await api("verify");
    if (r && r.ok) { session.unlocked = true; await loadServerLogs(); render(); }
    else { sessionStorage.removeItem("mec_pin"); session.pinHash = null; renderLock(t().wrongPin); }
  } catch (e) { render(); } // offline → use local cache
}

async function loadServerLogs() {
  try {
    const r = await api("logs");
    if (r && r.logs) { state.logs = r.logs.filter(x => x.topic || x.subject); saveLS(LS.logs, state.logs); }
  } catch (e) {}
}

// ===================================================================
//  SETUP WIZARD
// ===================================================================
let wiz = { step: 1, url: "", status: null, driveId: "", photosId: "", groqKey: "", lang: "hi", pin: "", pin2: "" };

function shell(inner) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(el(`
    <div class="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <div class="mb-6 text-center">
          <div class="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-teal-500 to-indigo-600 text-3xl text-white shadow-lg">🎓</div>
          <h1 class="mt-3 text-xl font-bold">MEC CA Study Buddy</h1>
        </div>
        <div id="card" class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl"></div>
      </div>
    </div>`));
  document.getElementById("card").appendChild(inner);
}

function field(label, id, ph, type = "text", val = "", hint = "") {
  return `<label class="mb-1 mt-3 block text-xs font-semibold">${label}</label>
    <input id="${id}" type="${type}" value="${val}" placeholder="${ph}"
      class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2.5 outline-none focus:border-teal-500">
    ${hint ? `<p class="mt-1 text-[11px] text-slate-400">${hint}</p>` : ""}`;
}

function renderSetup(msg = "") {
  const T = t();
  if (wiz.step === 1) {
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide text-teal-600">${T.step} 1 / 3</p>
      <h2 class="mt-1 text-lg font-bold">${T.s1Title}</h2>
      <p class="mt-1 text-xs text-slate-500">${T.s1Hint}</p>
      ${field(T.urlPh ? "Apps Script URL" : "URL", "wUrl", T.urlPh, "url", wiz.url)}
      <p id="msg" class="mt-2 text-xs ${msg.includes("✓") ? "text-emerald-600" : "text-rose-500"}">${msg}</p>
      <button id="testBtn" class="mt-3 w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.testBtn}</button>
    </div>`);
    inner.querySelector("#testBtn").onclick = async () => {
      const url = inner.querySelector("#wUrl").value.trim();
      if (!url) return;
      wiz.url = url;
      const btn = inner.querySelector("#testBtn"); btn.textContent = T.testing; btn.disabled = true;
      try {
        const st = await apiStatus(url);
        if (!st || !st.ok) throw new Error("bad");
        wiz.status = st;
        if (st.pinSet) { wiz.step = "existing"; renderSetup(); }   // another device already configured
        else { wiz.step = 2; renderSetup(T.connected); }
      } catch (e) { renderSetup(T.connectFail); }
    };
    return shell(inner);
  }

  if (wiz.step === 2) {  // fresh setup — backup + AI + language
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide text-teal-600">${T.step} 2 / 3</p>
      <h2 class="mt-1 text-lg font-bold">${T.s2Title}</h2>
      <p class="mt-1 text-xs text-slate-500">${T.s2Hint}</p>
      ${field(T.driveIdLabel, "wDrive", "1AbC...", "text", wiz.driveId)}
      ${field(T.photosIdLabel, "wPhotos", T.optional, "text", wiz.photosId)}
      ${field(T.groqLabel, "wGroq", "gsk_...", "text", wiz.groqKey, T.groqHint)}
      <label class="mb-1 mt-3 block text-xs font-semibold">${T.langLabel}</label>
      <select id="wLang" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2.5">
        <option value="hi" ${wiz.lang === "hi" ? "selected" : ""}>🇮🇳 Hinglish</option>
        <option value="en" ${wiz.lang === "en" ? "selected" : ""}>🇬🇧 English</option>
      </select>
      <div class="mt-4 flex gap-2">
        <button id="back" class="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 font-semibold">${T.back}</button>
        <button id="next" class="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.next}</button>
      </div>
    </div>`);
    inner.querySelector("#back").onclick = () => { wiz.step = 1; renderSetup(); };
    inner.querySelector("#next").onclick = () => {
      wiz.driveId = inner.querySelector("#wDrive").value.trim();
      wiz.photosId = inner.querySelector("#wPhotos").value.trim();
      wiz.groqKey = inner.querySelector("#wGroq").value.trim();
      wiz.lang = inner.querySelector("#wLang").value;
      wiz.step = 3; renderSetup();
    };
    return shell(inner);
  }

  if (wiz.step === 3) {  // create PIN
    const inner = el(`<div>
      <p class="text-[11px] font-semibold uppercase tracking-wide text-teal-600">${T.step} 3 / 3</p>
      <h2 class="mt-1 text-lg font-bold">${T.s3Title}</h2>
      <p class="mt-1 text-xs text-slate-500">${T.s3Hint}</p>
      ${field(T.createPin, "wPin", "••••", "password")}
      ${field(T.confirmPin, "wPin2", "••••", "password")}
      <p id="msg" class="mt-2 text-xs text-rose-500">${msg}</p>
      <div class="mt-4 flex gap-2">
        <button id="back" class="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 font-semibold">${T.back}</button>
        <button id="fin" class="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.finishBtn}</button>
      </div>
    </div>`);
    inner.querySelectorAll('input[type=password]').forEach(i => { i.inputMode = "numeric"; });
    inner.querySelector("#back").onclick = () => { wiz.step = 2; renderSetup(); };
    inner.querySelector("#fin").onclick = async () => {
      const p1 = inner.querySelector("#wPin").value.trim(), p2 = inner.querySelector("#wPin2").value.trim();
      if (!/^\d{4,6}$/.test(p1)) return renderSetup3msg(T.pinLen);
      if (p1 !== p2) return renderSetup3msg(T.pinMismatch);
      const btn = inner.querySelector("#fin"); btn.textContent = T.saving; btn.disabled = true;
      const pinHash = await sha256(p1);
      session.pinHash = pinHash;
      cfg = { url: wiz.url, lang: wiz.lang };
      try {
        const r = await fetch(cfg.url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "setup", pinHash, driveId: wiz.driveId, photosId: wiz.photosId,
            groqKey: wiz.groqKey, lang: wiz.lang }) }).then(x => x.json());
        if (!r || !r.ok) throw new Error(r && r.error || "setup failed");
        finishUnlock();
      } catch (e) { renderSetup3msg(String(e.message || e)); btn.disabled = false; btn.textContent = T.finishBtn; }
    };
    return shell(inner);
  }

  if (wiz.step === "existing") {  // backend already set up → just enter PIN
    return renderLock(T.existingFound, true);
  }
}
function renderSetup3msg(m) { const e = document.getElementById("msg"); if (e) e.textContent = m; }

// ===================================================================
//  PIN LOCK
// ===================================================================
function renderLock(msg = "", fromWizard = false) {
  const T = t();
  const inner = el(`<div class="text-center">
    <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl">🔒</div>
    <h2 class="mt-3 text-lg font-bold">${T.lockTitle}</h2>
    <p class="mt-1 text-xs text-slate-500">${msg || ""}</p>
    <input id="pinInp" type="password" inputmode="numeric" maxlength="6" placeholder="••••"
      class="mx-auto mt-4 block w-40 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-teal-500">
    <p id="lmsg" class="mt-2 text-xs text-rose-500"></p>
    <button id="unlock" class="mt-3 w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${T.unlock}</button>
    <button id="reset" class="mt-3 text-[11px] text-slate-400 hover:underline">${T.reset}</button>
  </div>`);
  const tryUnlock = async () => {
    const pin = inner.querySelector("#pinInp").value.trim();
    if (!/^\d{4,6}$/.test(pin)) { inner.querySelector("#lmsg").textContent = T.pinLen; return; }
    const btn = inner.querySelector("#unlock"); btn.disabled = true; btn.textContent = "…";
    const pinHash = await sha256(pin);
    session.pinHash = pinHash;
    if (!cfg) cfg = { url: wiz.url, lang: wiz.lang || "hi" };
    try {
      const r = await api("verify");
      if (r && r.ok) { finishUnlock(); }
      else { session.pinHash = null; inner.querySelector("#lmsg").textContent = T.wrongPin; btn.disabled = false; btn.textContent = T.unlock; }
    } catch (e) { inner.querySelector("#lmsg").textContent = "Network error"; btn.disabled = false; btn.textContent = T.unlock; }
  };
  inner.querySelector("#unlock").onclick = tryUnlock;
  inner.querySelector("#pinInp").addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });
  inner.querySelector("#reset").onclick = () => {
    if (confirm("Reset this device's connection?")) {
      localStorage.removeItem(LS.cfg); sessionStorage.removeItem("mec_pin");
      cfg = null; session = { pinHash: null }; wiz = { step: 1, url: "", lang: "hi" }; renderSetup();
    }
  };
  shell(inner);
  setTimeout(() => inner.querySelector("#pinInp").focus(), 50);
}

async function finishUnlock() {
  sessionStorage.setItem("mec_pin", session.pinHash);
  state.lang = cfg.lang || "hi";
  saveLS(LS.cfg, cfg);
  session.unlocked = true;
  await loadServerLogs();
  render();
}

// ===================================================================
//  MAIN APP RENDER
// ===================================================================
function updateStreak() {
  const today = new Date().toDateString(); const last = localStorage.getItem(LS.lastDay);
  let streak = parseInt(localStorage.getItem(LS.streak) || "0", 10);
  if (last !== today) { const y = new Date(Date.now() - 864e5).toDateString();
    streak = (last === y) ? streak + 1 : 1; localStorage.setItem(LS.streak, streak); localStorage.setItem(LS.lastDay, today); }
  return streak || 1;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(Header());
  const main = el(`<main class="view-enter mx-auto w-full max-w-3xl px-4 pb-28 pt-4"></main>`);
  const views = { home: HomeView, subjects: SubjectsView, today: TodayView, exam: ExamView, chat: ChatView };
  main.appendChild((views[state.view] || HomeView)());
  app.appendChild(main);
  app.appendChild(BottomNav());
  if (state.view === "chat") scrollChat();
}

function Header() {
  const h = el(`
    <header class="safe-top sticky top-0 z-20 border-b border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
      <div class="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
        <div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white text-lg shadow">🎓</div>
        <div class="min-w-0 flex-1"><h1 class="truncate text-base font-bold leading-tight">${t().appName}</h1>
          <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">${t().tagline}</p></div>
        <button id="langBtn" class="shrink-0 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
          ${state.lang === "hi" ? "🇮🇳 Hinglish" : "🇬🇧 English"}</button>
      </div></header>`);
  h.querySelector("#langBtn").onclick = () => {
    state.lang = state.lang === "hi" ? "en" : "hi"; cfg.lang = state.lang; saveLS(LS.cfg, cfg); render();
  };
  return h;
}

function StatCard(label, value, icon) {
  return `<div class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
    <div class="text-2xl">${icon}</div><div class="mt-1 text-xl font-extrabold">${value}</div>
    <div class="text-[11px] text-slate-500 dark:text-slate-400">${label}</div></div>`;
}

function HomeView() {
  const streak = updateStreak();
  const topics = new Set(state.logs.map(l => l.subject + "|" + l.topic)).size;
  const wrap = el(`<div class="space-y-5"></div>`);
  wrap.appendChild(el(`<section class="rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-600 to-indigo-600 p-5 text-white shadow-lg">
      <p class="text-sm opacity-90">${greet()}, Yeshaswini 👋</p>
      <h2 class="mt-1 text-xl font-bold">${t().welcome}</h2>
      <button id="goChat" class="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30">💬 ${t().quickAsk}</button>
    </section>`));
  wrap.appendChild(el(`<div class="grid grid-cols-3 gap-3">
      ${StatCard(t().streak, streak, "🔥")}${StatCard(t().classesLogged, state.logs.length, "📚")}${StatCard(t().topicsCovered, topics, "✅")}</div>`));
  const acts = [
    { v: "today", icon: "📝", label: t().logToday, c: "from-orange-400 to-amber-500" },
    { v: "subjects", icon: "📖", label: t().myNotes, c: "from-teal-400 to-emerald-500" },
    { v: "exam", icon: "🎯", label: t().examPrep, c: "from-rose-400 to-red-500" },
    { v: "chat", icon: "🤖", label: t().nav.chat, c: "from-indigo-400 to-violet-500" }];
  const grid = el(`<div class="grid grid-cols-2 gap-3 sm:grid-cols-4"></div>`);
  acts.forEach(a => { const b = el(`<button class="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition">
        <span class="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${a.c} text-2xl text-white">${a.icon}</span>
        <span class="text-xs font-semibold text-center">${a.label}</span></button>`); b.onclick = () => go(a.v); grid.appendChild(b); });
  wrap.appendChild(grid);
  const recent = el(`<section><h3 class="mb-2 px-1 text-sm font-bold">${t().recent}</h3></section>`);
  recent.appendChild(LogList(state.logs.slice(0, 3))); wrap.appendChild(recent);
  wrap.querySelector("#goChat").onclick = () => go("chat");
  return wrap;
}

function SubjectsView() {
  const wrap = el(`<div class="space-y-4"><h2 class="px-1 text-lg font-bold">${t().subjectsTitle}</h2></div>`);
  const grid = el(`<div class="grid grid-cols-1 gap-3 sm:grid-cols-2"></div>`);
  SUBJECTS.forEach(s => {
    const card = el(`<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div class="flex items-center gap-3 bg-gradient-to-r ${s.color} p-4 text-white"><span class="text-3xl">${s.icon}</span>
          <div><h3 class="font-bold">${s.name}</h3><p class="text-xs opacity-90">${s.tag} · ${s.chapters.length} chapters</p></div></div>
        <div class="p-4"><div class="flex flex-wrap gap-1.5">
            ${s.chapters.slice(0, 6).map(c => `<span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px]">${c}</span>`).join("")}
            <span class="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px]">+${s.chapters.length - 6} more</span></div>
          <button class="askSub mt-3 w-full rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 py-2 text-xs font-semibold text-white">${t().openChat}</button></div></div>`);
    card.querySelector(".askSub").onclick = () => { go("chat"); setTimeout(() => sendMessage(state.lang === "hi"
        ? `${s.name} ka ek important chapter samjhao aur 3 exam questions do.`
        : `Explain an important chapter of ${s.name} and give 3 exam questions.`), 60); };
    grid.appendChild(card);
  });
  wrap.appendChild(grid); return wrap;
}

function TodayView() {
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">${t().todayTitle}</h2>
      <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${t().todayHint}</p></div></div>`);
  const opts = SUBJECTS.map(s => `<option value="${s.name}">${s.icon} ${s.name}</option>`).join("");
  const form = el(`<form id="logForm" class="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div><label class="mb-1 block text-xs font-semibold">${t().subject}</label>
        <select name="subject" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2">${opts}</select></div>
      <div><label class="mb-1 block text-xs font-semibold">${t().topic}</label>
        <input name="topic" required class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2" placeholder="e.g. Demand Analysis"></div>
      <div><label class="mb-1 block text-xs font-semibold">${t().note}</label>
        <textarea name="note" rows="3" class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2"></textarea></div>
      <button class="w-full rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 py-2.5 font-semibold text-white">${t().save}</button>
    </form>`);
  form.onsubmit = async (e) => {
    e.preventDefault(); const fd = new FormData(form);
    const entry = { subject: fd.get("subject"), topic: fd.get("topic"), note: fd.get("note"), date: new Date().toISOString() };
    state.logs.unshift(entry); saveLS(LS.logs, state.logs);
    const btn = form.querySelector("button"); btn.textContent = t().saved; btn.disabled = true;
    try { await api("log", { entry }); } catch (e2) {}
    setTimeout(() => go("today"), 700);
  };
  wrap.appendChild(form);

  // photo upload card
  const up = el(`<div class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-center">
      <p class="text-sm font-semibold">📸 ${t().uploadPhoto}</p>
      <input id="photoInp" type="file" accept="image/*" capture="environment" class="mt-3 block w-full text-xs">
      <p id="upMsg" class="mt-2 text-xs text-emerald-600"></p></div>`);
  up.querySelector("#photoInp").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const msg = up.querySelector("#upMsg"); msg.className = "mt-2 text-xs text-slate-500"; msg.textContent = t().uploading;
    const reader = new FileReader();
    reader.onload = async () => {
      try { const r = await api("upload", { filename: f.name, mime: f.type, data: reader.result });
        if (r && r.ok) { msg.className = "mt-2 text-xs text-emerald-600"; msg.innerHTML = `${t().photoSaved} ${r.link ? `<a class="underline" target="_blank" href="${r.link}">view</a>` : ""}`; }
        else { msg.className = "mt-2 text-xs text-rose-500"; msg.textContent = (r && r.error) || "upload failed"; }
      } catch (er) { msg.className = "mt-2 text-xs text-rose-500"; msg.textContent = "upload error"; }
    };
    reader.readAsDataURL(f);
  };
  wrap.appendChild(up);

  const list = el(`<section><h3 class="mb-2 px-1 text-sm font-bold">${t().recent}</h3></section>`);
  list.appendChild(LogList(state.logs)); wrap.appendChild(list);
  return wrap;
}

function LogList(logs) {
  if (!logs.length) return el(`<p class="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-xs text-slate-500">${t().noLogs}</p>`);
  const box = el(`<div class="space-y-2"></div>`);
  logs.forEach(l => {
    const sub = SUBJECTS.find(s => s.name === l.subject);
    const d = l.date ? new Date(l.date).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";
    box.appendChild(el(`<div class="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <span class="text-xl">${sub ? sub.icon : "📘"}</span>
        <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2">
            <p class="truncate font-semibold">${l.topic || ""}</p><span class="shrink-0 text-[11px] text-slate-400">${d}</span></div>
          <p class="text-[11px] text-slate-500">${l.subject || ""}</p>
          ${l.note ? `<p class="mt-1 text-xs text-slate-600 dark:text-slate-300">${l.note}</p>` : ""}</div></div>`));
  });
  return box;
}

function ExamView() {
  const wrap = el(`<div class="space-y-4"><div><h2 class="px-1 text-lg font-bold">${t().examTitle}</h2>
      <p class="px-1 text-xs text-slate-500 dark:text-slate-400">${t().examHint}</p></div></div>`);
  const opts = SUBJECTS.map(s => `<label class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
      <input type="checkbox" value="${s.name}" class="examSub h-4 w-4 accent-teal-600"><span>${s.icon} ${s.name}</span></label>`).join("");
  const card = el(`<div class="space-y-3"><div class="grid grid-cols-1 gap-2 sm:grid-cols-2">${opts}</div>
      <div class="flex items-center gap-2"><input id="examDays" type="number" min="1" value="7" class="w-20 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-center"><span class="text-xs text-slate-500">days left</span></div>
      <button id="planBtn" class="w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-600 py-2.5 font-semibold text-white">🎯 ${t().makePlan}</button></div>`);
  card.querySelector("#planBtn").onclick = () => {
    const subs = [...card.querySelectorAll(".examSub:checked")].map(c => c.value);
    const days = card.querySelector("#examDays").value || 7;
    const list = subs.length ? subs.join(", ") : "all MEC subjects";
    go("chat"); setTimeout(() => sendMessage(state.lang === "hi"
      ? `Mere exam me ${days} din bache hain. ${list} ke liye day-wise study plan banao with important questions aur revision tips.`
      : `My exam is in ${days} days. Make a day-wise study plan for ${list} with important questions and revision tips.`), 60);
  };
  wrap.appendChild(card); return wrap;
}

// ---------- CHAT ----------
function ChatView() {
  const wrap = el(`<div class="flex h-[calc(100dvh-9.5rem)] flex-col"></div>`);
  const head = el(`<div class="mb-2 flex items-center justify-between px-1"><h2 class="text-lg font-bold">🤖 ${t().chatTitle}</h2>
      <button id="clearMem" class="text-[11px] text-rose-500 hover:underline">${t().clearMem}</button></div>`);
  head.querySelector("#clearMem").onclick = () => { if (confirm("Clear chat?")) { state.chat = []; saveLS(LS.chat, state.chat); render(); } };
  wrap.appendChild(head);
  const scroll = el(`<div id="chatScroll" class="no-sb flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"></div>`);
  if (!state.chat.length) scroll.appendChild(el(`<div class="grid h-full place-items-center text-center text-slate-400">
      <div><div class="text-4xl">🎓</div><p class="mt-2 text-xs">${state.lang === "hi" ? "Apna pehla doubt pucho!" : "Ask your first doubt!"}</p></div></div>`));
  else state.chat.forEach(m => scroll.appendChild(Bubble(m.role, m.content)));
  wrap.appendChild(scroll);
  const bar = el(`<form id="chatForm" class="safe-bottom mt-2 flex items-end gap-2">
      <textarea id="chatInput" rows="1" placeholder="${t().chatPlaceholder}" class="max-h-28 flex-1 resize-none rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5"></textarea>
      <button class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white">➤</button></form>`);
  const inp = bar.querySelector("#chatInput");
  inp.addEventListener("input", () => { inp.style.height = "auto"; inp.style.height = Math.min(inp.scrollHeight, 112) + "px"; });
  inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); bar.requestSubmit(); } });
  bar.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; inp.value = ""; inp.style.height = "auto"; sendMessage(v); };
  wrap.appendChild(bar); return wrap;
}

function Bubble(role, content) {
  const me = role === "user";
  return el(`<div class="flex ${me ? "justify-end" : "justify-start"}"><div class="max-w-[85%] rounded-2xl px-3.5 py-2.5 ${me
      ? "bg-gradient-to-br from-teal-500 to-indigo-600 text-white rounded-br-sm" : "bg-slate-100 dark:bg-slate-800 rounded-bl-sm"}">
      <div class="msg-body text-[13px] leading-relaxed">${me ? content.replace(/</g, "&lt;") : mdToHtml(content)}</div></div></div>`);
}
function scrollChat() { const s = document.getElementById("chatScroll"); if (s) s.scrollTop = s.scrollHeight; }

async function sendMessage(text) {
  if (state.view !== "chat") go("chat");
  state.chat.push({ role: "user", content: text }); saveLS(LS.chat, state.chat);
  const scroll = document.getElementById("chatScroll");
  if (scroll && scroll.querySelector(".place-items-center")) scroll.innerHTML = "";
  scroll && scroll.appendChild(Bubble("user", text));
  const typing = el(`<div class="flex justify-start"><div class="typing rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3"><span></span><span></span><span></span></div></div>`);
  scroll && scroll.appendChild(typing); scrollChat();
  let reply;
  try {
    const r = await api("chat", { lang: state.lang, message: text, history: state.chat.slice(-10), memory: state.logs.slice(0, 20) });
    reply = (r && r.reply) || ("⚠️ " + ((r && r.error) || "no reply"));
  } catch (e) {
    reply = state.lang === "hi" ? "⚠️ Network issue — backend se connect nahi ho paya." : "⚠️ Network issue — couldn't reach the backend.";
  }
  typing.remove();
  state.chat.push({ role: "assistant", content: reply }); saveLS(LS.chat, state.chat);
  scroll && scroll.appendChild(Bubble("assistant", reply)); scrollChat();
}

// ---------- BOTTOM NAV ----------
function BottomNav() {
  const items = [
    { v: "home", icon: "🏠", label: t().nav.home }, { v: "subjects", icon: "📚", label: t().nav.subjects },
    { v: "today", icon: "📝", label: t().nav.today }, { v: "exam", icon: "🎯", label: t().nav.exam },
    { v: "chat", icon: "💬", label: t().nav.chat }];
  const nav = el(`<nav class="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div class="mx-auto flex w-full max-w-3xl items-stretch justify-around px-2 pt-1.5"></div></nav>`);
  const row = nav.firstElementChild;
  items.forEach(it => { const active = state.view === it.v;
    const b = el(`<button class="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 ${active ? "nav-active" : "text-slate-500 dark:text-slate-400"}">
        <span class="text-lg ${active ? "scale-110" : ""} transition">${it.icon}</span><span class="text-[10px] font-semibold">${it.label}</span></button>`);
    b.onclick = () => go(it.v); row.appendChild(b); });
  return nav;
}
function go(v) { state.view = v; render(); window.scrollTo({ top: 0 }); }

// ---------- BOOT ----------
boot();
