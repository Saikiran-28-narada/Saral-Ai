/* Saral AI Service Worker — offline-first caching for GitHub Pages */
const CACHE = 'saral-ai-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './css/main.css',
  './css/dark-mode.css',
  './css/animations.css',
  './js/app.js',
  './js/camera.js',
  './js/ai-engine.js',
  './js/reels.js',
  './js/quiz.js',
  './js/doubt-buddy.js',
  './js/teach-back.js',
  './js/exam-countdown.js',
  './js/parent-report.js',
  './js/teacher-connect.js',
  './js/offline-mode.js',
  './js/night-mode.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // HTML navigations: prefer the network so GitHub Pages updates appear quickly,
  // then fall back to the cached app when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // Static assets: cache-first for reliable offline use.
  event.respondWith(
    caches.match(request).then(hit => {
      if (hit) return hit;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
