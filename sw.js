// Tabooni Pro service worker — غيّر رقم النسخة مع كل تحديث للموقع
const CACHE = 'tabooni-v1.26';
const CORE = ['./', 'index.html', 'config.js', 'data.js', 'manifest.webmanifest', 'assets/logo.png', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // الصفحة نفسها: الشبكة أولًا (حتى يظهر كل تحديث فورًا)، والكاش عند انقطاع الإنترنت
  if (req.mode === 'navigate') {
    // الصفحة الرئيسية بس بتنحفظ للاستعمال بدون إنترنت؛ admin.html وغيرها دايمًا من الشبكة
    const isHome = url.origin === location.origin && (url.pathname === '/' || url.pathname.endsWith('/index.html'));
    e.respondWith(fetch(req).then(r => { if (isHome && r.ok) { const c2 = r.clone(); caches.open(CACHE).then(c => c.put('index.html', c2)); } return r; })
      .catch(() => isHome ? caches.match('index.html') : Response.error()));
    return;
  }
  if (url.pathname.endsWith('/admin.html') || url.pathname.endsWith('/inline-edit.js') || url.pathname.endsWith('/config.js')) return; // دايمًا أحدث نسخة
  // ملفات الموقع والخطوط والصور: من الكاش ثم تحديث بالخلفية
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || url.hostname === 'cdn.shopify.com') {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) caches.open(CACHE).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
