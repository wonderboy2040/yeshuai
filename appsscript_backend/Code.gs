/*****************************************************************
 * MEC CA Study Buddy  —  Google Apps Script backend
 * -------------------------------------------------------------
 * 24x7 AI Education Agent for MEC CA students
 * AI chat (Groq / Gemini), class diary + chat backup to THIS Sheet,
 * photo/notes backup to Google Drive, PIN security.
 *
 * SETUP (one time):
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Replace the default code with this file.
 *   3. Paste appsscript.json (Project Settings → Show appsscript.json).
 *   4. Deploy → New deployment → Web app →
 *        Execute as: Me   |   Who has access: Anyone
 *      Copy the Web App URL — paste in the app's wizard.
 *   5. Run authorizeNow() once to grant Drive + external permissions.
 *****************************************************************/

var PROPS = PropertiesService.getScriptProperties();
var CACHE = CacheService.getScriptCache();

// ── Rate limiting ──────────────────────────────────────────────
var RATE_LIMIT_WINDOW_MS = 60000;
var RATE_LIMIT_MAX       = 30;

function rateLimit(ip) {
  if (!ip) ip = 'unknown';
  var key = 'rl_' + ip;
  var data = CACHE.get(key);
  var now  = Date.now();
  var win  = [];
  if (data) {
    try { win = JSON.parse(data); } catch (e) {}
    win = win.filter(function (t) { return now - t < RATE_LIMIT_WINDOW_MS; });
  }
  if (win.length >= RATE_LIMIT_MAX) {
    console.warn('Rate limit hit for IP: ' + ip);
    throw 'rate_limit_exceeded';
  }
  win.push(now);
  CACHE.put(key, JSON.stringify(win), 60);
}

/* ---------- entry points ---------- */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'status';
  if (action === 'status') return json(statusInfo());
  return json({ ok: false, error: 'use POST' });
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) {
    return json({ ok: false, error: 'invalid_json' });
  }
  var action = body.action || '';
  try { rateLimit(body.pinHash || 'anon'); } catch (rlErr) {
    return json({ ok: false, error: 'Too many requests. Please wait a moment.', retryAfter: 60 });
  }
  try {
    switch (action) {
      case 'status': return json(statusInfo());
      case 'setup':  return json(doSetup(body));
      case 'verify': return json({ ok: checkPin(body.pinHash) });
      case 'chat':   requirePin(body); return json({ reply: doChat(body) });
      case 'log':    requirePin(body); return json(doLog(body.entry || {}));
      case 'logs':   requirePin(body); return json({ logs: readLogs() });
      case 'upload': requirePin(body); return json(doUpload(body));
      default:       return json({ ok: false, error: 'unknown action' });
    }
  } catch (err) {
    console.error('doPost error: ' + err + ' | action: ' + action);
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- status / setup / pin ---------- */
function statusInfo() {
  return {
    ok: true,
    pinSet:   !!PROPS.getProperty('PIN_HASH'),
    hasDrive: !!PROPS.getProperty('DRIVE_FOLDER_ID'),
    hasPhotos:!!PROPS.getProperty('PHOTOS_ALBUM_ID'),
    hasAI:    !!(PROPS.getProperty('GROQ_API_KEY') || PROPS.getProperty('GEMINI_API_KEY')),
    lang:     PROPS.getProperty('LANG') || 'hi'
  };
}

function doSetup(body) {
  if (PROPS.getProperty('PIN_HASH')) return { ok: false, error: 'already_setup' };
  if (!body.pinHash) return { ok: false, error: 'pin_required' };
  PROPS.setProperty('PIN_HASH', body.pinHash);
  if (body.driveId)   PROPS.setProperty('DRIVE_FOLDER_ID', sanitize(body.driveId));
  if (body.photosId)  PROPS.setProperty('PHOTOS_ALBUM_ID', sanitize(body.photosId));
  if (body.groqKey)   PROPS.setProperty('GROQ_API_KEY', body.groqKey);
  if (body.geminiKey) PROPS.setProperty('GEMINI_API_KEY', body.geminiKey);
  if (body.studentName) PROPS.setProperty('STUDENT_NAME', sanitize(body.studentName));
  PROPS.setProperty('LANG', body.lang || 'hi');
  ensureTabs();
  return { ok: true };
}

function checkPin(pinHash) {
  var stored = PROPS.getProperty('PIN_HASH');
  return !!(stored && pinHash && stored === pinHash);
}
function requirePin(body) {
  if (!checkPin(body.pinHash)) throw 'invalid_pin';
}

// ── Input sanitization ─────────────────────────────────────────
function sanitize(str) {
  return String(str || '').replace(/[=@+]|[\u0000-\u001f]/g, '').trim();
}

/* ---------- Google Sheet (memory) ---------- */
function ss() { return SpreadsheetApp.getActiveSpreadsheet(); }

function ensureTabs() {
  var s = ss();
  if (!s.getSheetByName('Diary')) s.insertSheet('Diary').appendRow(['date', 'subject', 'topic', 'note', 'files']);
  if (!s.getSheetByName('Chat'))  s.insertSheet('Chat').appendRow(['time', 'question', 'answer']);
}

function doLog(entry) {
  ensureTabs();
  ss().getSheetByName('Diary').appendRow([
    entry.date || new Date().toISOString(),
    sanitize(entry.subject || ''),
    sanitize(entry.topic || ''),
    sanitize(entry.note || ''),
    (entry.files && entry.files.length) ? entry.files.join(',') : ''
  ]);
  return { ok: true };
}

function readLogs() {
  ensureTabs();
  var sheet = ss().getSheetByName('Diary');
  var vals = sheet.getDataRange().getValues();
  vals.shift();
  var out = vals.map(function (r) {
    return {
      date: r[0], subject: r[1], topic: r[2], note: r[3],
      files: r[4] ? r[4].split(',').filter(function(f) { return f.trim(); }) : []
    };
  });
  out.reverse();
  return out.slice(0, 50);
}

function logChat(q, a) {
  ensureTabs();
  ss().getSheetByName('Chat').appendRow([new Date().toISOString(),
    sanitize(q || '').substring(0, 50000),
    sanitize(a || '').substring(0, 50000)]);
}

/* ---------- 24x7 AI Education Agent (Groq primary, Gemini fallback) ---------- */
function doChat(body) {
  if (!body.message || body.message.length > 10000) throw 'message_invalid';
  var lang = body.lang || 'hi';
  var messages = [{ role: 'system', content: buildSystemPrompt(lang, body.memory || []) }];
  (body.history || []).slice(-10).forEach(function (h) {
    messages.push({ role: h.role === 'assistant' ? 'assistant' : 'user',
                    content: String(h.content || '').slice(0, 2000) });
  });
  var hist = body.history || [];
  if (!hist.length || hist[hist.length - 1].content !== body.message)
    messages.push({ role: 'user', content: body.message });

  var groq = PROPS.getProperty('GROQ_API_KEY');
  var gem  = PROPS.getProperty('GEMINI_API_KEY');
  var reply;
  try {
    if (groq) reply = callGroq(groq, messages);
    else if (gem) reply = callGemini(gem, messages);
    else reply = (lang === 'hi'
      ? '(AI key set nahi hai) Setup me Groq key daalo.'
      : '(No AI key set) Add a Groq key in setup.');
  } catch (err) {
    console.error('Primary AI failed: ' + err);
    if (gem) {
      try {
        reply = callGemini(gem, messages);
        console.info('Gemini fallback succeeded after Groq failure');
      } catch (e2) {
        console.error('Gemini fallback also failed: ' + e2);
        reply = (lang === 'hi'
          ? '⚠️ AI service temporarily unavailable. Please try again.'
          : '⚠️ AI service temporarily unavailable. Please try again.');
      }
    } else {
      reply = (lang === 'hi'
        ? '⚠️ AI service error: ' + String(err).substring(0, 200)
        : '⚠️ AI service error: ' + String(err).substring(0, 200));
    }
  }
  try { logChat(body.message, reply); } catch (e) {
    console.error('Chat logging failed: ' + e);
  }
  return reply;
}

function buildSystemPrompt(lang, memory) {
  var studentName = PROPS.getProperty('STUDENT_NAME') || 'Student';
  var en =
    "You are a warm, caring, and highly experienced 24x7 SENIOR PROFESSOR & EDUCATION AGENT " +
    "for an Indian Intermediate First-Year MEC student (" + studentName + ") on the Telangana " +
    "Telugu Akademi syllabus (Maths Paper-IA, Maths Paper-IB, Economics, Commerce, Accountancy). " +
    "The student is also preparing to become a CA (Chartered Accountant).\n\n" +
    "YOUR TEACHING STYLE:\n" +
    "1. SIMPLE FIRST — Explain concepts in the simplest way possible, like you're talking to a friend.\n" +
    "2. EXAMPLE NEXT — Always give a clear, real-life example the student can relate to.\n" +
    "3. EXAM TIP — End with an exam-specific tip (what to remember, common mistakes, how marks are given).\n" +
    "4. BE ENCOURAGING — The student is working hard. Appreciate effort, motivate, never discourage.\n" +
    "5. BE ACCURATE — Never invent formulas or facts. If unsure, say so.\n" +
    "6. USE HINGLISH (when asked) — Mix of Hindi and English for better understanding.\n\n" +
    "DIAGRAMS: When the student asks for a diagram, flowchart, concept map, or mind map, " +
    "output a valid Mermaid diagram inside a ```mermaid fenced code block (use 'graph TD' " +
    "or 'mindmap' syntax, keep node labels short, avoid special characters), followed by " +
    "a one-line explanation in simple words.\n\n" +
    "PROACTIVE TEACHING: If the student mentions a topic, also suggest what to study next " +
    "and how it connects to what they already know. Be like a personal tutor who knows " +
    "their progress.";
  var hi =
    "Aap ek warm, caring aur bahut experienced 24x7 SENIOR PROFESSOR & EDUCATION AGENT ho " +
    "ek Indian Intermediate First-Year MEC student (" + studentName + " — Maths Paper-IA, " +
    "Maths Paper-IB, Economics, Commerce, Accountancy — Telangana Telugu Akademi syllabus) ke liye, " +
    "jo CA (Chartered Accountant) banne ki taiyari kar raha hai.\n\n" +
    "AAPKA PADHANE KA TAREEKA:\n" +
    "1. PEHLE SIMPLE — Concept ko sabse simple tarike me samjhao, jaise dost se baat kar rahe ho.\n" +
    "2. PHIR EXAMPLE — Ek real-life example do jo student relate kar sake.\n" +
    "3. EXAM TIP — Akhir me exam-specific tip do (kya yaad rakhna hai, common mistakes, marks kaise milte hain).\n" +
    "4. MOTIVATE KARO — Student mehnat kar raha hai. Effort appreciate karo, encourage karo, kabhi discourage mat karo.\n" +
    "5. SAHI PADHAO — Kabhi galat formula ya fact mat banao. Agar sure nahi ho to bolo.\n" +
    "6. HINGLISH ME JAWAB DO — Hindi aur English mix karke, samajhne me aasan ho.\n\n" +
    "DIAGRAM: Agar student diagram, flowchart, concept map ya mind map maange, to ek valid " +
    "Mermaid diagram ```mermaid fenced code block ke andar do ('graph TD' ya 'mindmap' syntax, " +
    "node labels chhote rakho, special characters avoid karo), uske baad ek line simple " +
    "explanation do.\n\n" +
    "PROACTIVE TEACHING: Agar student koi topic mention kare, to ye bhi batado ki aage kya " +
    "padhna chahiye aur ye topic se kya connection hai. Personal tutor ki tarah ho jo " +
    "student ki progress jaanta ho.";
  var base = (lang === 'hi') ? hi : en;
  if (memory && memory.length) {
    var lines = memory.slice(0, 20).map(function (m) {
      return '- ' + String(m.date || '').slice(0, 10) + ' | ' + (m.subject || '') +
             ' | ' + (m.topic || '') + ' | ' + (m.note || '');
    }).join('\n');
    base += "\n\nSTUDENT'S RECENT CLASS DIARY (use this to give personalised guidance — " +
            "connect today's doubt to what they studied):\n" + lines;
  }
  return base;
}

function callGroq(key, messages) {
  var payload = JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: messages,
                                 temperature: 0.6, max_tokens: 1024 });
  var res = UrlFetchApp.fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + key },
    payload: payload,
    muteHttpExceptions: true,
    timeout: 30000
  });
  var data = JSON.parse(res.getContentText());
  if (data.error) throw (data.error.message || JSON.stringify(data.error));
  if (!data.choices || !data.choices[0] || !data.choices[0].message)
    throw 'empty_groq_response';
  return data.choices[0].message.content.trim();
}

function callGemini(key, messages) {
  var sys = messages.filter(function (m) { return m.role === 'system'; })
                    .map(function (m) { return m.content; }).join('\n');
  var convo = messages.filter(function (m) { return m.role !== 'system'; })
                      .map(function (m) { return (m.role === 'assistant' ? 'ASSISTANT' : 'USER') + ': ' + m.content; }).join('\n');
  var prompt = sys + '\n\n' + convo + '\nASSISTANT:';
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key;
  var res = UrlFetchApp.fetch(url, {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true,
    timeout: 30000
  });
  var data = JSON.parse(res.getContentText());
  if (data.error) throw data.error.message;
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content)
    throw 'empty_gemini_response';
  return data.candidates[0].content.parts[0].text.trim();
}

/* ---------- photo/notes upload (Google Drive) ---------- */
var MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function extractDriveId(s) {
  s = (s || '').trim();
  var m = s.match(/[-\w]{25,}/);
  return m ? m[0] : '';
}

function doUpload(body) {
  var folderId = extractDriveId(PROPS.getProperty('DRIVE_FOLDER_ID'));
  if (!folderId) return { ok: false, error: 'Drive Folder ID not set in Setup.' };
  var b64 = (body.data || '');
  if (b64.indexOf(',') >= 0) b64 = b64.split(',')[1];
  var rawLen = Math.ceil(b64.length * 0.75);
  if (rawLen > MAX_UPLOAD_BYTES) return { ok: false, error: 'File too large (max 5 MB)' };
  var decoded;
  try { decoded = Utilities.base64Decode(b64); } catch (e) {
    return { ok: false, error: 'Invalid file data' };
  }
  var blob = Utilities.newBlob(decoded, body.mime || 'image/jpeg',
    body.filename || ('note_' + new Date().getTime() + '.jpg'));
  var folder;
  try {
    folder = DriveApp.getFolderById(folderId);
  } catch (e) {
    return { ok: false, error: 'Cannot open Drive folder. Check Folder ID or re-authorize (run authorizeNow in editor). [' + e + ']' };
  }
  var file = folder.createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  return { ok: true, link: file.getUrl() };
}

/* Run ONCE in the editor to grant Drive + Sheets + external permissions */
function authorizeNow() {
  ensureTabs();
  DriveApp.getRootFolder().getName();
  UrlFetchApp.fetch('https://api.groq.com', { muteHttpExceptions: true });
  console.log('authorizeNow completed — all permissions granted');
  return 'authorized';
}

/* Test Drive folder access in the editor */
function testDrive() {
  var id = extractDriveId(PROPS.getProperty('DRIVE_FOLDER_ID'));
  if (!id) { console.warn('DRIVE_FOLDER_ID is empty. Set it in Setup wizard.'); return; }
  console.log('Folder ID: ' + id);
  var f = DriveApp.getFolderById(id);
  console.log('Drive OK. Folder: ' + f.getName());
}