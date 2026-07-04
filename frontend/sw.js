/* ===================================================================
   MEC CA Study Buddy — Service Worker (v2)
   Strategy:
     • HTML / JS / CSS → network-first (always get latest)
     • Logo / images / manifest → cache-first (rarely change)
     • Google / Groq API calls → bypass cache (always network)
   =================================================================== */

const CACHE = "mec-cache-v2";
const ASSETS = [
  ".",
  "index.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "assets/logo.jpeg"
];

const NETWORK_FIRST = ["/index.html", "/app.js", "/styles.css", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Never cache backend / AI calls
  if (url.hostname.includes("google.com") || url.hostname.includes("groq.com")) {
    return;
  }

  // Only handle GET
  if (e.request.method !== "GET") return;

  // Network-first for HTML / JS / CSS so users get latest fixes
  const isNetworkFirst = NETWORK_FIRST.some((p) => url.pathname.endsWith(p)) || url.pathname === "/" || url.pathname === "";

  if (isNetworkFirst) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(e.request).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for everything else (images, fonts, etc.)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});

// Allow page to trigger immediate SW activation
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
