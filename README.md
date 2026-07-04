# MEC CA Study Buddy

> 24×7 AI Education Agent for Indian Intermediate 1st-year **MEC** students preparing for **CA**.
> Mobile-first PWA — works offline, syncs with Google Apps Script, installable on phone.

## Subjects covered
- 📐 Maths Paper-IA (Algebra · Vector Algebra · Trigonometry)
- 📊 Maths Paper-IB (Coordinate Geometry · Calculus)
- 💰 Economics (Micro + Macro)
- 🏦 Commerce (Business Organisation & Finance)
- 🧮 Accountancy (Principles of Accounting · Ledger · Final Accounts)

## Features

### Core (from v1)
- 🤖 24×7 AI Professor (Groq primary, Gemini fallback) — Hinglish support
- 📝 Today's Class Diary — log what you studied, with photo/PDF upload to Google Drive
- 🎯 Exam Prep — day-wise study plan generator, model question paper generator
- 🧠 Tricks & Tips — subject-wise formula vault with examples
- 🔒 PIN-protected, multi-device, fully private
- 📴 Offline-first PWA with service worker

### New in v2.0.0 (this release)
- 🍅 Pomodoro Focus Timer (25/5 work-break cycles)
- 🃏 Flashcards with AI auto-generation + spaced repetition principles
- ❓ MCQ Mock Test (AI-generated, self-scored, progress tracked)
- ⭐ Doubt Bookmarks (save any AI reply for exam-eve revision)
- 📊 Performance Analytics Dashboard (quiz trends, subject-wise accuracy)
- 📚 Syllabus Progress Tracker (per-chapter mastery: Not Started → Mastered)
- ⚡ "More" sheet in header for accessing advanced features

## Quick start

### Frontend (PWA)
1. Upload the `frontend/` folder to any static host (Netlify / GitHub Pages / Cloudflare Pages).
2. Open the URL on phone → "Add to Home Screen".

### Backend (one-time)
1. Open your Google Sheet → Extensions → Apps Script.
2. Replace `Code.gs` with `appsscript_backend/Code.gs`.
3. Show `appsscript.json` in Project Settings → paste `appsscript_backend/appsscript.json`.
4. Deploy → New deployment → Web app → Execute as: Me · Access: Anyone.
5. Copy the Web App URL → paste in the app's setup wizard.
6. Run `authorizeNow()` in the editor once to grant permissions.

See `CHANGELOG.md` for full details of bug fixes and new features in v2.0.0.

## Tech stack
- **Frontend**: Vanilla JS SPA, Tailwind CSS (browser CDN), Mermaid.js for diagrams, PWA service worker
- **Backend**: Google Apps Script (Web App), Google Sheets as DB, Google Drive for file storage
- **AI**: Groq (LLaMA-3.3-70B) primary, Google Gemini 1.5 Flash fallback

## License
Personal study app. Free to use and modify.
