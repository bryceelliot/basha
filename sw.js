// Basha Donair Service Worker — offline-first for static assets
const CACHE = 'basha-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/menu.html',
  '/css/style.css',
  '/css/custom.css',
  '/js/main.js',
  '/js/cookie-consent.js',
  '/images/basha-logo-fb.jpg',
  '/images/hero.webp',
  '/images/hero.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Network-first for HTML (so users see fresh content)
  if (req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return r;
      }).catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
    );
    return;
  }
  // Cache-first for everything else (CSS/JS/images)
  e.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((r) => {
        const copy = r.clone();
        if (r.ok) caches.open(CACHE).then((c) => c.put(req, copy));
        return r;
      })
    )
  );
});
