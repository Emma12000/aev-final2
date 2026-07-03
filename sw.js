const CACHE = 'aev-v2';
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

// Fetch : stale-while-revalidate pour les assets, réseau pour l'API
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

  // Requêtes non-GET : réseau direct
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE).then((cache) => {
      return cache.match(e.request).then((cached) => {
        // Toujours rafraîchir en arrière-plan
        const networkFetch = fetch(e.request).then((res) => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => null);

        // Servir le cache immédiatement si disponible, sinon attendre le réseau
        if (cached) {
          e.waitUntil(networkFetch);
          return cached;
        }
        return networkFetch.then((res) => {
          if (res) return res;
          // Hors-ligne : renvoyer index.html pour la navigation
          if (e.request.mode === 'navigate') return cache.match('/index.html');
        });
      });
    })
  );
});
