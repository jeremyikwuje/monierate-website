const staticCacheName = 'static-v1';

async function cacheResources(resources) {
    const cache = await caches.open(staticCacheName);
    return cache.addAll(resources);
}

async function serveCachedOrNetwork(request) {
    const cache = await caches.open(staticCacheName);
    const sameOrigin = new URL(request.url).origin === location.origin;
    const acceptHeader = request.headers.get('Accept') || '';
    const isHtmlRequest = acceptHeader.includes('text/html');

    if (isHtmlRequest && navigator.onLine && sameOrigin && request.method === 'GET') {
        try {
            const networkResponse = await fetch(request);
            cache.put(request, networkResponse.clone()); 
            return networkResponse;
        } catch (error) {
            console.error('Network fetch failed; serving from cache:', error);
            return cache.match(request); 
        }
    }

    try {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        const networkResponse = await fetch(request);
        if (sameOrigin && request.method === 'GET') {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Fetch failed:', error);
        return Promise.reject(error); 
    }
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        cacheResources([]).then(() => self.skipWaiting())
    );
});

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

self.addEventListener('fetch', (event) => {
    event.respondWith(serveCachedOrNetwork(event.request));
});
