// Service Worker für Offline-Funktionalität
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('fahrschul-app-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/styles.css',
                '/js/app.js',
                '/js/db.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
}); 