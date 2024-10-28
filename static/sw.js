const staticCacheName = 'static-v1.00';

async function cacheResources(resources) {
    const cache = await caches.open(staticCacheName);
    return cache.addAll(resources);
}

function isAssetRequest(request) {
    const url = new URL(request.url);
    const assetExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.mp4', '.webm', '.css', '.js'];
    const isAssetByExtension = assetExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
    
    const acceptHeader = request.headers.get('Accept') || '';
    const isAssetByHeader = acceptHeader.includes('image/') || 
                           acceptHeader.includes('video/') ||
                           acceptHeader.includes('text/css') ||
                           acceptHeader.includes('javascript');
    
    return isAssetByExtension || isAssetByHeader;
}

async function serveCachedOrNetwork(request) {
    const sameOrigin = new URL(request.url).origin === location.origin;
    const isGetRequest = request.method === 'GET';
    const isAsset = isAssetRequest(request);
    
    if (sameOrigin && isGetRequest) {
        if (isAsset) {
            try {
                const cache = await caches.open(staticCacheName);
                const cachedResponse = await cache.match(request);
                
                if (cachedResponse) {
                    return cachedResponse;
                }
 
                const response = await fetch(request);
                await cache.put(request, response.clone());
                return response;
            } catch (error) {
                console.error('Asset fetch failed:', error);
                return Promise.reject(error);
            }
        } 
        
        if (navigator.onLine) {
            try {
                const response = await fetch(request);
                
                const cache = await caches.open(staticCacheName);
                await cache.put(request, response.clone());
                
                return response;
            } catch (error) {
                console.error('Network fetch failed:', error);
                
                const cache = await caches.open(staticCacheName);
                const cachedResponse = await cache.match(request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return Promise.reject(error);
            }
        }
    }
    
    // When offline or for non-same-origin requests
    const cache = await caches.open(staticCacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // If not in cache, try network as fallback
    try {
        const response = await fetch(request);
        
        // Cache same-origin GET requests
        if (sameOrigin && isGetRequest) {
            await cache.put(request, response.clone());
        }
        
        return response;
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
                        return caches.delete(cacheName);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(serveCachedOrNetwork(event.request));
});