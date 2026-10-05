// Service worker: keeps the whole site in a cache so the game works offline once installed.
//
// Cache-first from a versioned cache. The deploy workflow replaces __VERSION__ with the commit,
// so every release installs a fresh, complete copy; the old one is dropped when no page uses it
// any more (no skipWaiting: a running game never mixes files from two versions).
// tests/sw.test.mjs checks that PRECACHE lists every file of the site.

const CACHE = 'rithmo-__VERSION__';

const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/main.css',
  'fonts/eb-garamond-latin.woff2',
  'fonts/eb-garamond-italic-latin.woff2',
  'fonts/unifraktur-maguntia.woff2',
  'img/favicon.svg',
  'img/apple-touch-icon.png',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/icon-maskable-512.png',
  'js/app.js',
  'js/ai.js',
  'js/ai-worker.js',
  'js/board.js',
  'js/diagrams.js',
  'js/engine.js',
  'js/game.js',
  'js/i18n.js',
  'js/store.js',
  'js/content/codex.en.js',
  'js/content/codex.es.js',
  'js/content/platforms.js',
  'js/content/shared.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k.startsWith('rithmo-') && k !== CACHE).map((k) => caches.delete(k)))));
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // ignoreSearch: "index.html?lang=es" is the same page.
      const hit = await cache.match(request, { ignoreSearch: true });
      if (hit) return hit;
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') cache.put(request, response.clone());
      return response;
    }),
  );
});
