# MEC CA Study Buddy — Changelog

> AI-powered study companion for **Intermediate 1st-year MEC** students preparing for **CA**.
> Mobile-first PWA — installable on phone, works offline, syncs with Google Apps Script backend.

---

## v3.0.0 — Claymorphism Premium UI Redesign (current)

### 🎨 Complete UI/UX Redesign
The entire app has been redesigned with **Claymorphism** design language — soft puffy "clay" elements with dual shadows, rounded corners, and tactile pressed states.

### Premium Dark/Light Theme System
- **3-way theme toggle** in header: Auto (system) → Light → Dark
- **No-flash theme initialization** — theme applied before first paint via inline script in `index.html`
- **Premium color palettes**:
  - Light: soft lavender cream `#e8ebf5` background, pure white cards, purple/pink gradient accents
  - Dark: deep navy `#13152a` background, indigo cards, vibrant accent colors
- Smooth 0.22s theme transitions on all themed elements
- Mobile status bar `theme-color` meta updates dynamically with theme
- Mermaid diagram theme re-initializes when app theme changes

### Claymorphism Design System (30+ utility classes)
- `clay-card` family (5 variants): base, soft, flat, gradient, accent
- `clay-btn` family (7 variants): base, primary, accent, success, danger, ghost, icon
- `clay-input`, `clay-select`, `clay-textarea` with focus glow
- `clay-pill` family (4 variants): base, brand, accent, success
- `clay-inset` — pressed/inset surface for nested content
- `clay-toggle` — header pill buttons
- `clay-header`, `clay-nav` — frosted glass with backdrop-blur
- `clay-progress-track`, `clay-progress-fill` — premium progress bars
- `clay-sheet`, `clay-sheet-overlay` — bottom sheet for "More" menu
- Specialized: `stat-card`, `action-tile`, `subject-card`, `bubble-user`, `bubble-ai`, `quiz-option`, `bar-fill`, `nav-btn`

### Clay Shadow System (CSS variables)
- `--clay-shadow` (large), `--clay-shadow-sm` (small), `--clay-shadow-lg` (extra large)
- `--clay-inset` (pressed/inset effect)
- `--clay-pressed` (button pressed state)
- Different values for light vs dark themes for proper 3D effect

### Responsive Improvements
- Mobile-first layout with `max-w-3xl` (768px) content container
- Desktop (≥768px): wider content (56rem), 1.5rem card padding, larger nav icons
- Small mobile (≤380px): tighter spacing, smaller buttons
- Bottom nav auto-centers on desktop with rounded top corners + side borders
- Header buttons collapse to icon-only on small screens (text hidden via `hidden sm:inline`)

### Premium Typography
- **Plus Jakarta Sans** — rounded, friendly sans-serif (400/500/600/700/800 weights)
- **JetBrains Mono** — for code blocks and Pomodoro timer
- Gradient text effect for headings and key numbers (`.text-gradient`)

### Visual Upgrades Per View
- **Home**: 3-color gradient greeting card (purple → light purple → pink), clay action tiles with colored icon wraps
- **Subjects**: gradient clay header on each subject card, clay pills for chapters
- **Today**: clay inputs with focus glow, clay inset for file upload area, parallel file uploads
- **Exam**: clay checkboxes, clay danger button for plan generation
- **Tricks**: accent gradient motivation card, clay accordion with gradient subject headers
- **Chat**: distinct `bubble-user` (gradient purple) and `bubble-ai` (clay card) styles, clay icon buttons for mic/diagram/send
- **Bottom Nav**: `nav-btn` class with active state color + icon scale + drop-shadow glow
- **More Sheet**: frosted glass overlay, clay sheet with rounded top, clay list items
- **Pomodoro**: gradient timer text, clay button group
- **Flashcards**: clay inset flip card, gradient mastery progress bar
- **Quiz**: `quiz-option` class with selected state (purple border + glow), gradient progress bar
- **Bookmarks**: clay soft cards with gradient delete button, clay pill "Ask more" buttons
- **Analytics**: gradient summary card, clay progress bars with color-coded accuracy (green/amber/red), clay syllabus tracker

### Files Modified
- `frontend/index.html` — premium font preconnect + load, no-flash theme init script, theme-aware mermaid init
- `frontend/styles.css` — **complete rewrite** (59 → 672 lines): clay utility classes, theme variables, responsive breakpoints
- `frontend/app.js` — added theme state + functions, replaced all Tailwind visual classes with clay classes, gradient maps for subject cards
- `frontend/sw.js` — unchanged (v2 network-first strategy)
- `appsscript_backend/Code.gs` — unchanged

### ✅ Verification
- `node --check app.js` ✓ (2142 lines)
- `node --check sw.js` ✓
- All 6 frontend assets serve HTTP 200
- 30+ clay utility classes actively used
- 11 CSS theme variables (light + dark) defined and used
- Backticks balanced (266/133 pairs), braces 663/663, brackets 139/139
- 0 leftover Tailwind `dark:bg-slate-*` / `bg-gradient-to-*` visual classes (only in data keys for gradMap)

---

## v2.1.0 — Deep Code Review & Cleanup

### 16 bugs fixed (render error boundary, _quiz.meta reset, fmtTime bounds-check, parallel file uploads, security rel attributes, etc.)
### Major cleanup: extracted `tr()` helper, `escapeHtml()`, `dailyIndex()`, magic-number constants, dead code removal

---

## v2.0.0 — Bug Fixes + New Features

### Critical bug fixes: `MOTIVATIONSotIdx]` → `MOTIVATIONS[motIdx]` (2 instances, prevented app from loading)
### Added 6 new features: Pomodoro, Flashcards, MCQ Mock Test, Doubt Bookmarks, Performance Analytics, Syllabus Tracker
### Service Worker upgraded to v2 with network-first strategy

---

## v1.0.0 — Original Release

24×7 AI Professor chat, Class Diary, Exam Prep, Maths Tricks, PIN-protected PWA, offline-first service worker
