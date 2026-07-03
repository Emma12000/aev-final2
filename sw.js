const CACHE = 'aev-v1';
const STATIC = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/api.js',
  '/assets/logo-aev.png',
  '/assets/tabler-icons.min.css',
];

// Installation : mise en cache des assets statiques
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC)));
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch : cache-first pour les assets, réseau pour l'API
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Laisser passer les appels API et les ressources externes
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('railway.app') ||
    url.hostname.includes('facebook.net') ||
    url.hostname.includes('google') ||
    url.hostname.includes('officeapps.live.com')
  ) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          if (res.ok && e.request.method === 'GET') {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => {
          // Hors-ligne : renvoyer index.html pour la navigation
          if (e.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
