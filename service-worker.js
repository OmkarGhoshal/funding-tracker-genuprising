self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('funding-cache').then(cache => {
      return cache.addAll([
        'Gen U.html',
        'Gen U.json',
        'Main.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});