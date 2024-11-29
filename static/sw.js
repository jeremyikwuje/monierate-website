const CACHE_VERSION = 'v1.03';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const CACHE_DELETION_TIMEOUT = 3000; // 3 seconds timeout for deletion

function isAssetResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    
    return contentType.includes('image/') ||
           contentType.includes('video/') ||
           contentType.includes('audio/') ||
           contentType.includes('text/css') ||
           contentType.includes('font/');
}

async function deleteOldCaches() {
    const cacheNames = await caches.keys();
    
    // Create an array of deletion promises with timeouts
    const deletionPromises = cacheNames
        .filter(cacheName => cacheName.startsWith('static-') && 
                            cacheName !== STATIC_CACHE_NAME)
        .map(async cacheName => {
            try {
                // Create a timeout promise
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error(`Cache deletion timeout for ${cacheName}`));
                    }, CACHE_DELETION_TIMEOUT);
                });

                // Race between deletion and timeout
                await Promise.race([
                    caches.delete(cacheName),
                    timeoutPromise
                ]);
                
                console.log(`Successfully deleted cache: ${cacheName}`);
            } catch (error) {
                console.warn(`Failed to delete cache ${cacheName}:`, error);
                // Continue with activation even if deletion fails
            }
        });

    // Execute deletions in parallel with a limit
    const BATCH_SIZE = 3; // Process 3 deletions at a time
    for (let i = 0; i < deletionPromises.length; i += BATCH_SIZE) {
        const batch = deletionPromises.slice(i, i + BATCH_SIZE);
        await Promise.all(batch);
    }
}

async function serveCachedOrNetwork(request) {
    if (request.method !== 'GET') {
        return fetch(request);
    }

    try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }

        const response = await fetch(request);
        
        if (!response) {
            throw new Error('Network response was not valid');
        }

        if (response.ok && isAssetResponse(response)) {
            const clonedResponse = response.clone();
            // Don't await cache put - let it happen in background
            cache.put(request, clonedResponse).catch(error => {
                console.error('Cache put error:', error);
            });
        }
        
        return response;
    } catch (error) {
        console.error('Cache/fetch error:', error);
        return Promise.reject(error);
    }
}

self.addEventListener('install', (event) => {
    console.log('Service Worker installing');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating');
    
    event.waitUntil(
        Promise.all([
            deleteOldCaches(),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(serveCachedOrNetwork(event.request));
});