const CACHE_NAME = 'javelin-checklist-v4';
const FILES_TO_CACHE = [
  '.',
  'index.html',
  'task-editor.html',
  'settings.html',
  'react-app.js',
  'manifest.json',
  'sw.js',
  'tasks.js',
  'https://cdn.jsdelivr.net/npm/lucide@latest/dist/lucide.min.js',

  'https://cdn.jsdelivr.net/npm/tailwindcss@^3/dist/tailwind.min.css',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'

];
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});


