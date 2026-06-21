/*****************************************************************
 * MEC CA Study Buddy  —  Google Apps Script backend
 * -------------------------------------------------------------
 * One script does EVERYTHING (no Google Cloud, no Render backend):
 *   - AI chat (Groq / Gemini) via UrlFetchApp
 *   - Class diary + chat backup to THIS Google Sheet
 *   - Photo/notes backup to a Google Drive folder
 *   - PIN security (shared across all your devices)
 *
 * SETUP (one time):
 *   1. Open your Google Sheet → Extensions → Apps Script.
 *   2. Delete the default code, paste THIS file (Code.gs).
 *   3. Paste appsscript.json into the manifest (Project Settings →
 *      "Show appsscript.json" → replace it).
 *   4. Deploy → New deployment → type "Web app" →
 *        Execute as: Me     |     Who has access: Anyone
 *      Copy the Web App URL — that's what you paste in the app's wizard.
 *   5. First time you run it, Google asks for permissions → Allow.
 *
 * The app sends a hashed PIN with every request — only requests with
 * the correct PIN are accepted.
 *****************************************************************/

var PROPS = PropertiesService.getScriptProperties();

/* ---------- entry points ---------- */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'status';
  if (action === 'status') return json(statusInfo());
  return json({ ok: false, error: 'use POST' });
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) {}
  var action = body.action || '';
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
  // Only the FIRST device can run setup. Other devices just enter the PIN.
  if (PROPS.getProperty('PIN_HASH')) return { ok: false, error: 'already_setup' };
  if (!body.pinHash) return { ok: false, error: 'pin_required' };
  PROPS.setProperty('PIN_HASH', body.pinHash);
  if (body.driveId)   PROPS.setProperty('DRIVE_FOLDER_ID', body.driveId);
  if (body.photosId)  PROPS.setProperty('PHOTOS_ALBUM_ID', body.photosId);
  if (body.groqKey)   PROPS.setProperty('GROQ_API_KEY', body.groqKey);
  if (body.geminiKey) PROPS.setProperty('GEMINI_API_KEY', body.geminiKey);
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

/* ---------- Google Sheet (memory) ---------- */
function ss() { return SpreadsheetApp.getActiveSpreadsheet(); }

function ensureTabs() {
  var s = ss();
  if (!s.getSheetByName('Diary')) s.insertSheet('Diary').appendRow(['date', 'subject', 'topic', 'note']);
  if (!s.getSheetByName('Chat'))  s.insertSheet('Chat').appendRow(['time', 'question', 'answer']);
}

function doLog(entry) {
  ensureTabs();
  ss().getSheetByName('Diary').appendRow([
    entry.date || new Date().toISOString(),
    entry.subject || '', entry.topic || '', entry.note || ''
  ]);
  return { ok: true };
}

function readLogs() {
  ensureTabs();
  var vals = ss().getSheetByName('Diary').getDataRange().getValues();
  vals.shift(); // remove header
  var out = vals.map(function (r) {
    return { date: r[0], subject: r[1], topic: r[2], note: r[3] };
  });
  out.reverse();
  return out.slice(0, 50);
}

function logChat(q, a) {
  ensureTabs();
  ss().getSheetByName('Chat').appendRow([new Date().toISOString(), q, a]);
}

/* ---------- AI chat (Groq primary, Gemini fallback) ---------- */
function doChat(body) {
  var lang = body.lang || 'hi';
  var messages = [{ role: 'system', content: buildSystemPrompt(lang, body.memory || []) }];
  (body.history || []).slice(-10).forEach(function (h) {
    messages.push({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content || '' });
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
    if (gem) { try { reply = callGemini(gem, messages); } catch (e2) { reply = 'AI error: ' + e2; } }
    else reply = 'AI error: ' + err;
  }
  try { logChat(body.message, reply); } catch (e) {}
  return reply;
}

function buildSystemPrompt(lang, memory) {
  var en = "You are a warm, highly experienced SENIOR PROFESSOR for an Indian " +
    "Intermediate First-Year MEC student (Maths, Economics, Commerce) on the Telangana " +
    "Telugu Akademi syllabus, who is also preparing to become a CA. Teach like a caring " +
    "best friend + expert mentor. For every answer: 1) Simple concept, 2) A clear example, " +
    "3) An exam/test tip; describe diagrams in words/steps when useful. Be accurate; never " +
    "invent formulas. Stay encouraging.";
  var hi = "Aap ek warm, bahut experienced SENIOR PROFESSOR ho ek Indian Intermediate " +
    "First-Year MEC student (Maths, Economics, Commerce — Telangana Telugu Akademi syllabus) " +
    "ke liye, jo CA banne ki taiyari bhi kar raha hai. Ek caring best friend + expert mentor " +
    "ki tarah padhao. Har jawab me: 1) Simple concept, 2) Ek clear example, 3) Exam/test tip; " +
    "zaroorat ho to diagram ko words/steps me samjhao. Hamesha sahi padhao; galat formula mat " +
    "banao. Motivating raho. Jawab HINGLISH (Roman Hindi + English) me do.";
  var base = (lang === 'hi') ? hi : en;
  if (memory && memory.length) {
    var lines = memory.slice(0, 20).map(function (m) {
      return '- ' + String(m.date || '').slice(0, 10) + ' | ' + (m.subject || '') +
             ' | ' + (m.topic || '') + ' | ' + (m.note || '');
    }).join('\n');
    base += "\n\nSTUDENT'S RECENT CLASS DIARY (use it to give personalised, continuous " +
            "guidance — connect today's doubt to what they studied):\n" + lines;
  }
  return base;
}

function callGroq(key, messages) {
  var res = UrlFetchApp.fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + key },
    payload: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: messages,
                              temperature: 0.6, max_tokens: 1024 }),
    muteHttpExceptions: true
  });
  var data = JSON.parse(res.getContentText());
  if (data.error) throw (data.error.message || JSON.stringify(data.error));
  return data.choices[0].message.content.trim();
}

function callGemini(key, messages) {
  var sys = messages.filter(function (m) { return m.role === 'system'; })
                    .map(function (m) { return m.content; }).join('\n');
  var convo = messages.filter(function (m) { return m.role !== 'system'; })
                      .map(function (m) { return m.role.toUpperCase() + ': ' + m.content; }).join('\n');
  var prompt = sys + '\n\n' + convo + '\nASSISTANT:';
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key;
  var res = UrlFetchApp.fetch(url, {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    muteHttpExceptions: true
  });
  var data = JSON.parse(res.getContentText());
  if (data.error) throw data.error.message;
  return data.candidates[0].content.parts[0].text.trim();
}

/* ---------- photo/notes upload (Drive primary, Photos best-effort) ---------- */
function doUpload(body) {
  var folderId = PROPS.getProperty('DRIVE_FOLDER_ID');
  if (!folderId) return { ok: false, error: 'no_drive_folder' };
  var b64 = (body.data || '');
  if (b64.indexOf(',') >= 0) b64 = b64.split(',')[1];
  var blob = Utilities.newBlob(Utilities.base64Decode(b64),
                               body.mime || 'image/jpeg',
                               body.filename || ('note_' + Date.now() + '.jpg'));
  var file = DriveApp.getFolderById(folderId).createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  var link = file.getUrl();

  // Optional: also try Google Photos (only works for an album the app created)
  var albumId = PROPS.getProperty('PHOTOS_ALBUM_ID');
  if (albumId) { try { addToPhotos(blob, albumId); } catch (e) {} }
  return { ok: true, link: link };
}

function addToPhotos(blob, albumId) {
  var token = ScriptApp.getOAuthToken();
  var up = UrlFetchApp.fetch('https://photoslibrary.googleapis.com/v1/uploads', {
    method: 'post', contentType: 'application/octet-stream',
    headers: { Authorization: 'Bearer ' + token,
               'X-Goog-Upload-Protocol': 'raw',
               'X-Goog-Upload-File-Name': blob.getName() },
    payload: blob.getBytes(), muteHttpExceptions: true
  });
  var uploadToken = up.getContentText();
  UrlFetchApp.fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate', {
    method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ albumId: albumId,
      newMediaItems: [{ simpleMediaItem: { uploadToken: uploadToken } }] }),
    muteHttpExceptions: true
  });
}
