// Offline cache: the whole app is stored on the device after the first visit.
// Bump VERSION whenever the app files change so devices fetch the new copy.
const VERSION = 'chemlab-v3';
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "js/anim-bonding.js",
  "js/anim-matter.js",
  "js/anim-other.js",
  "js/anim-reactions.js",
  "js/app.js",
  "js/bondlab.js",
  "js/content.js",
  "js/elements.js",
  "js/examples.js",
  "js/papers.js",
  "js/tools.js",
  "js/ui.js",
  "build/icon.png",
  "build/icon-180.png",
  "build/icon-192.png",
  "build/icon-512.png",
  "build/icon-maskable.png"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first (so updates arrive), falling back to the cached copy when offline.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    // no-cache: always ask the server whether the file changed (avoids a 10-minute stale copy)
    fetch(e.request.url, { cache: 'no-cache' }).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
