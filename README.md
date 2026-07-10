# MEC CA Study Buddy — v3.0 Claymorphism Premium

> 24×7 AI Education Agent for Indian Intermediate 1st-year **MEC** students preparing for **CA**.
> Mobile-first PWA with **Claymorphism UI** and **premium dark/light theme**.

## 🎨 What's New in v3.0 — Claymorphism Redesign

### Premium Theme System
- **3-way theme toggle**: Auto (system) → Light → Dark — top header button
- **No-flash theme init** — theme applied BEFORE first paint via inline script
- **Premium palettes**:
  - **Light**: soft lavender cream `#e8ebf5` background, pure white cards, purple/pink gradients
  - **Dark**: deep navy `#13152a` background, indigo cards, vibrant accent colors
- Smooth 0.22s transitions on all themed elements
- Mobile status bar `theme-color` meta updates with theme

### Claymorphism Design
- **Soft puffy clay cards** with dual shadows (light top, dark bottom) — true 3D raised effect
- **Rounded corners**: 12–32px throughout
- **Pressed button states** — tactile feedback via inset shadows
- **Inset surfaces** for nested content (file upload area, code blocks)
- **Gradient brand buttons** (purple → pink) with inner highlight
- **Premium typography**: Plus Jakarta Sans (rounded sans-serif) + JetBrains Mono for code
- **Gradient text** for headings and key numbers

### Responsive (Mobile + Desktop)
- **Mobile-first** layout with `max-w-3xl` content container
- **Desktop** (≥768px): wider content (56rem), larger cards (1.5rem padding), larger nav icons
- **Small mobile** (≤380px): tighter spacing, smaller buttons
- Bottom nav auto-centers on desktop with rounded top corners
- Header buttons collapse to icon-only on small screens (text hidden)

### Clay Utility Classes (30+)
- `clay-card`, `clay-card-soft`, `clay-card-flat`, `clay-card-gradient`, `clay-card-accent`
- `clay-btn`, `clay-btn-primary`, `clay-btn-accent`, `clay-btn-success`, `clay-btn-danger`, `clay-btn-ghost`, `clay-btn-icon`
- `clay-input`, `clay-select`, `clay-textarea` (with focus glow)
- `clay-pill`, `clay-pill-brand`, `clay-pill-accent`, `clay-pill-success`
- `clay-inset` (pressed surface), `clay-toggle` (header buttons)
- `clay-header`, `clay-nav` (frosted glass backdrop blur)
- `clay-progress-track`, `clay-progress-fill` (premium progress bars)
- `clay-sheet`, `clay-sheet-overlay` (More menu bottom sheet)
- `stat-card`, `action-tile`, `subject-card`, `bubble-user`, `bubble-ai`, `quiz-option`, `bar-fill`, `nav-btn`

## 🚀 Features

### Core (from v1/v2)
- 🤖 24×7 AI Professor (Groq primary, Gemini fallback) — Hinglish support
- 📝 Class Diary with multi-file upload to Google Drive
- 🎯 Exam Prep — day-wise study plan + model question paper generator
- 🧠 Maths/Commerce/Accounts Tricks vault
- 🔒 PIN-protected, multi-device, offline-first PWA

### Study Tools (from v2.1)
- 🍅 Pomodoro Focus Timer with daily/total stats
- 🃏 Flashcards with AI auto-generate + spaced repetition principles
- ❓ MCQ Mock Test (AI-generated, self-scored, history)
- ⭐ Doubt Bookmarks — save any AI reply for exam-eve revision
- 📊 Performance Analytics — quiz trends, subject-wise accuracy
- 📚 Syllabus Progress Tracker — per-chapter status (Not Started → Mastered)

## 📦 File Structure
```
yeshuai/
├── frontend/
│   ├── index.html         (v3.0 — premium fonts + no-flash theme init)
│   ├── app.js             (v3.0 — Claymorphism classes + theme toggle, 2142 lines)
│   ├── styles.css         (v3.0 — 672 lines, 30+ clay utility classes)
│   ├── sw.js              (v2 — network-first for HTML/JS/CSS)
│   ├── manifest.json
│   └── assets/logo.jpeg
└── appsscript_backend/
    ├── Code.gs            (unchanged — backend works as-is)
    └── appsscript.json
```

## 🛠 Deployment

### Frontend (PWA)
1. Upload `frontend/` folder to any static host (Netlify / GitHub Pages / Cloudflare Pages)
2. Open URL on phone → "Add to Home Screen" → installs as PWA
3. Theme defaults to system preference; tap **🌙/☀️/🖥️** in header to cycle

### Backend (one-time)
1. Open your Google Sheet → Extensions → Apps Script
2. Replace `Code.gs` with `appsscript_backend/Code.gs`
3. Project Settings → "Show appsscript.json" → paste `appsscript_backend/appsscript.json`
4. Deploy → New deployment → Web app → Execute as: Me · Access: Anyone
5. Copy Web App URL → paste in app's setup wizard
6. Run `authorizeNow()` in editor once to grant permissions

See `CHANGELOG.md` for full version history.

## ✅ Verification
- `node --check app.js` ✓
- `node --check sw.js` ✓
- All 6 frontend assets serve HTTP 200
- 30+ clay utility classes used
- 11 CSS variables (theme-aware) used
- Backticks balanced, braces balanced, brackets balanced
- 0 leftover Tailwind dark: classes
- No-flash theme initialization
- Mobile + desktop responsive (3 breakpoints)

## Tech Stack
- **Frontend**: Vanilla JS SPA, Tailwind CSS (browser CDN, layout only), Mermaid.js for diagrams, PWA service worker
- **Design**: Claymorphism + CSS variables for theming, Plus Jakarta Sans font
- **Backend**: Google Apps Script (Web App), Google Sheets DB, Google Drive for file storage
- **AI**: Groq (LLaMA-3.3-70B) primary, Google Gemini 1.5 Flash fallback

Built with ❤️ for future CAs.
