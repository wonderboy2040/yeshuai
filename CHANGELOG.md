# MEC CA Study Buddy — Changelog

> AI-powered study companion for **Intermediate 1st-year MEC** students preparing for **CA**.
> Mobile-first PWA — installable on phone, works offline, syncs with Google Apps Script backend.

---

## v2.1.0 — Deep Code Review & Cleanup (current)

### 🐛 Bugs Fixed
| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `app.js` | `_quiz.meta` was never cleared after submit — caused stale "subject" in next quiz | Reset `_quiz.meta = null` in `submitQuiz()` |
| 2 | `app.js` | Pomodoro `skipBtn` triggered `tick()` even when paused — could leave timer in weird state | Skip now calls `completeSession()` directly without depending on running state |
| 3 | `app.js` | `fmtTime()` could go negative if `_pomo.remaining` slipped below 0 | Bounds-checked with `Math.max(0, sec | 0)` |
| 4 | `app.js` | Empty AI quiz response (parse fail) still tried to render quiz view → blank screen | Added `if (!_quiz.questions.length) alert(...)` check |
| 5 | `app.js` | `state.pomoStats` could be malformed if localStorage manually edited | Defensive parsing: `if (!Array.isArray(stats.sessions)) stats.sessions = []` |
| 6 | `app.js` | Render errors in any view crashed the whole app (white screen) | Added try/catch error boundary in `render()` — shows error card with "Home" button |
| 7 | `app.js` | Boot network failure on `verify` left user stuck | Falls back to `session.unlocked = true` and renders cached state |
| 8 | `app.js` | File upload processed files sequentially (slow for multi-file) | Now uses `Promise.all()` for parallel uploads |
| 9 | `app.js` | External file links lacked `rel="noopener noreferrer"` (security/tab-disclosure risk) | Added `rel="noopener noreferrer"` to all `target="_blank"` links |
| 10 | `app.js` | `window.open()` for previous-papers search lacked `noopener` | Added `"noopener"` feature flag |
| 11 | `app.js` | Chapter names containing `"` would break the `data-chap` attribute in syllabus tracker | Now properly escaped with `escapeHtml()` |
| 12 | `app.js` | User-provided text in `escapeHtml()` only stripped `<>` — left `&`, `"`, `'` vulnerable | New `escapeHtml()` covers all 5 chars; old `sanitize()` retained for backward-compat |
| 13 | `app.js` | Offline banner had conflicting `dark:bg-amber-950` and `dark:bg-amber-800` classes | Removed the conflicting class |
| 14 | `app.js` | Quiz "Previous" button on Q1 was clickable (just opacity-40) | Added `pointer-events-none` so it can't be clicked on Q1 |
| 15 | `app.js` | `boot()` failed silently when network down — no UI feedback | Falls through to render with cached state instead of blank screen |
| 16 | `sw.js` | Cache-first branch returned `undefined` if both cache AND network failed | Now falls back to `caches.match("./index.html")` (offline shell) |

### 🧹 Cleanup
- **Removed dead i18n keys** `trickM1`–`trickM10` (defined but never referenced — leftover from initial draft)
- **Removed dead LS key** `examGoal` (defined, never used)
- **Removed unused `fromWizard` parameter** from `renderLock()` (was always falsy)
- **Extracted `tr(hi, en)` helper** — replaces 17 verbose `state.lang === "hi" ? "X" : "Y"` ternaries with cleaner code
- **Extracted `dailyIndex(arr)` helper** — replaces 2 copies of the date-based motivation-index calculation
- **Extracted `escapeHtml(str)` helper** — proper HTML-escape for user/AI content (vs the older `sanitize()` which only stripped `<>`)
- **Extracted constants** for magic numbers: `MAX_FILE_BYTES`, `MAX_BOOKMARKS`, `MAX_QUIZ_HISTORY`, `MAX_POMO_SESSIONS`, `POMO_WORK_SEC`, `POMO_BREAK_SEC`
- **Extracted `ingestFiles()` and `readFileAsDataURL()` helpers** from `TodayView()` for clarity
- **Extracted `newWizard()` factory** for the setup wizard state
- **Renamed shadowing variables** like `tr` (trick item) → `trItem` to avoid clash with the new `tr()` helper
- **Grouped related code** with consistent section headers (──── ── style)
- **Reorganized i18n keys** in the same logical order as the views that use them
- **Removed unused `maxPct` variable** in AnalyticsView (was declared but never read)
- **Backticks in comments** were unbalanced (caused odd total) — fixed the mermaid comment
- **Added ARIA labels** to icon-only buttons (mic, diagram, send, FAB, close-sheet)
- **Added `autocomplete="off"`** to PIN inputs to prevent browser auto-fill leaks
- **`Math_TRICKS.forEach`** loop dropped its unused `si` (subject index) parameter
- **All views wrapped in try/catch** in `render()` — single view bug no longer kills the app

### ✅ Verification
- `node --check app.js` ✓
- `node --check sw.js` ✓
- All 6 frontend assets serve HTTP 200 from local server ✓
- 0 syntax errors, 0 duplicate function declarations, 0 undefined i18n refs, 0 unused LS keys
- Backticks balanced (270 = 135 pairs), braces balanced, brackets balanced
- Constants properly used (no magic numbers in view code)

---

## v2.0.0 — Bug Fixes + New Features (previous release)

### 🐛 Critical Bugs Fixed
| # | File | Line | Bug | Fix |
|---|------|------|-----|-----|
| 1 | `frontend/app.js` | 648 | `const mot = MOTIVATIONSotIdx];` (invalid JS — broke whole app) | `const mot = MOTIVATIONS[motIdx];` |
| 2 | `frontend/app.js` | 884 | Same as above in `TricksView()` | Same fix |

These were in the original repo and prevented the SPA from loading at all.

### 🚀 New Features Added
1. 🍅 **Pomodoro Focus Timer** — 25/5 work-break cycles with daily/total stats
2. 🃏 **Flashcards** — create, flip, mark known/unknown; AI auto-generate button
3. ❓ **MCQ Mock Test** — AI generates 5/10/15 questions, self-scored, history saved
4. ⭐ **Doubt Bookmarks** — every AI reply has a "⭐ Save" button for exam-eve revision
5. 📊 **Performance Analytics** — quiz trend chart, subject-wise accuracy bars, syllabus tracker
6. 📚 **Syllabus Progress Tracker** — per-chapter status: Not Started → Studying → Revised → Mastered
7. ⚡ **"More" sheet** in header — keeps bottom nav uncluttered

### 🔧 Other Improvements
- Service Worker upgraded `mec-cache-v1` → `mec-cache-v2`
  - Network-first for HTML/JS/CSS (users always get latest fixes)
  - Cache-first for images/icons
  - Backend/AI calls bypass cache
- Backend (`Code.gs`) unchanged — no redeploy needed
- `README.md` + `CHANGELOG.md` added

---

## v1.0.0 — Original Release

- 24×7 AI Professor chat (Groq primary, Gemini fallback, Hinglish support)
- Class Diary with multi-file upload to Google Drive
- Exam Prep with day-wise plan generator + model question paper generator
- Maths/Commerce/Accounts Tricks vault
- PIN-protected multi-device PWA
- Offline-first service worker
