const CACHE_NAME = `israeledwards-cache-v${Date.now()}`; // Dynamic cache version to force updates
const urlsToCache = [
    '/',
    '/index.html',
    '/MainLayout.css',
    '/home.css',
    '/allproducts.css',
    '/app.css',
    '/bootstrap.css',
    '/bootstrap.grid.css',
    '/bootstrap.reboot.css',
    '/bootstrap.utilities.css',
    '/design.css',
    '/solution.css',
    '/serviceworker.js',
    '/images/icon-192.png'
];

// Install event: Cache resources and force new worker activation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(urlsToCache.map((url) =>
                fetch(url).then((response) => {
                    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                    return cache.put(url, response);
                }).catch(error => console.warn(`Skipping ${url}:`, error))
            ));
        }).then(() => self.skipWaiting()) // Immediately take control
    );
});

// Fetch event: ALWAYS fetch the latest version (bypassing cache)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request)) // Network-first strategy
    );
});

// Activate event: Remove old caches & claim clients
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName)) // Delete all old caches
            )
        ).then(() => self.clients.claim()) // Take control of open pages
    );
});