const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';
const PRECACHE_URLS = [
  '/',
  'index.html',
  'offline.html',
  'css/style.css',
  'css/performance-optimized.css',
  'css/design-system/base.css',
  'css/design-system/utilities.css',
  'css/design-system/tokens.css',
  'css/design-system/components/buttons.css',
  'css/design-system/components/cards.css',
  'css/design-system/components/forms.css',
  'css/design-system/components/modal.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE).then(cache => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  const current = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !current.includes(k)).map(k => caches.delete(k)))
    )
  );
});

function cacheFirst(req, cacheName) {
  return caches.open(cacheName).then(c =>
    c.match(req).then(r => r || fetch(req).then(res => {
      if (res.status === 200) c.put(req, res.clone());
      return res;
    }))
  );
}

function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then(c =>
    c.match(req).then(r => {
      const fetchP = fetch(req).then(res => {
        if (res.status === 200) c.put(req, res.clone());
        return res;
      }).catch(() => r);
      return r || fetchP;
    })
  );
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.destination === 'script' && (url.pathname.startsWith('/assets/js/') || url.pathname.startsWith('/js/'))) {
    event.respondWith(cacheFirst(request, RUNTIME));
    return;
  }
  if (request.destination === 'style' && url.pathname.startsWith('/css/design-system/')) {
    event.respondWith(cacheFirst(request, PRECACHE));
    return;
  }
  if (url.pathname.startsWith('/assets/fonts/') || url.pathname.startsWith('/assets/images/')) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME));
    return;
  }
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request).catch(() => caches.match('offline.html'))
    );
  }
});
