const staticCacheName = 'static-v1.00'; // Current cache name

// Function to cache resources
async function cacheResources(resources) {
    const cache = await caches.open(staticCacheName);
    return cache.addAll(resources);
}

// Serve cached response or fetch from network
async function serveCachedOrNetwork(request) {
    const cache = await caches.open(staticCacheName);
    const sameOrigin = new URL(request.url).origin === location.origin;

    // Handle HTML requests if online
    if (sameOrigin && request.method === 'GET' && request.headers.get('Accept').includes('text/html')) {
        try {
            const networkResponse = await fetch(request);
            cache.put(request, networkResponse.clone()); // Update cache with fresh response
            return networkResponse;
        } catch (error) {
            const cachedResponse = await cache.match(request);
            return cachedResponse || Promise.reject(error); // Serve from cache if available, otherwise rethrow error
        }
    }

    // Handle other GET requests
    try {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        const networkResponse = await fetch(request);
        if (sameOrigin && request.method === 'GET' && !request.url.includes('/index.js')) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Fetch failed; returning offline fallback:', error);
        return Promise.reject(error); // Optional: add an offline fallback response if needed
    }
}

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        cacheResources([]).then(() => self.skipWaiting()) // Add resources to cache here if needed
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== staticCacheName) {
                        return caches.delete(cacheName); // Delete old cache versions
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(serveCachedOrNetwork(event.request));
});
