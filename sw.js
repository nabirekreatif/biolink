/* Service Worker Acc Cell WebApp — jaringan dulu (no-cache) untuk berkas aplikasi agar
 * pembaruan & segel lisensi selalu terbaru; cadangan offline dari cache.
 * Data dari Apps Script dan nk-license.js TIDAK di-cache di sini. Naikkan VERSI setiap rilis. */
const VERSI = 'acc-cell-v6';
const SHELL = ['./', 'index.html', 'css/style.css', 'js/core.js', 'js/qr.js', 'js/public.js', 'js/app.js', 'js/demo-data.js',
  'assets/logo.png', 'assets/icon-192.png', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(SHELL).catch(() => { })).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSI).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;           // GAS, gambar Drive, font: biarkan browser
  if (/nk-license\.js$|config\.js$/.test(url.pathname)) return;                  // lisensi & konfigurasi selalu dari jaringan
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(res => {
      if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(VERSI).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
