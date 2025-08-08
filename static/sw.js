const CACHE_VERSION = 'v1.08';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const CACHE_DELETION_TIMEOUT = 3000; // 3 seconds timeout for deletion
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const NETWORK_TIMEOUT = 10000; // 10 seconds network request timeout

// Helper to determine if a response is an asset type that should be cached
function isAssetResponse(response) {
    if (!response || !response.headers) return false;
    
    const contentType = response.headers.get('content-type') || '';
    
    return contentType.includes('image/') ||
           contentType.includes('video/') ||
           contentType.includes('audio/') ||
           contentType.includes('text/css') ||
           contentType.includes('font/')
}

// Immediately delete all old caches on version change
async function deleteOldCaches() {
    try {
        const cacheNames = await caches.keys();
        
        // Filter caches to delete
        const cachesToDelete = cacheNames.filter(cacheName => 
            cacheName.startsWith('static-') && cacheName !== STATIC_CACHE_NAME
        );
        
        if (cachesToDelete.length === 0) {
            console.log('No old caches to delete');
            return;
        }
        
        console.log(`Found ${cachesToDelete.length} old caches to delete`);
        
        // Delete caches in batches with timeout protection
        const BATCH_SIZE = 3;
        for (let i = 0; i < cachesToDelete.length; i += BATCH_SIZE) {
            const batch = cachesToDelete.slice(i, i + BATCH_SIZE);
            
            await Promise.all(batch.map(async cacheName => {
                try {
                    // Set up timeout protection
                    const deletionPromise = caches.delete(cacheName);
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => reject(new Error(`Cache deletion timeout: ${cacheName}`)), 
                            CACHE_DELETION_TIMEOUT);
                    });
                    
                    await Promise.race([deletionPromise, timeoutPromise]);
                    console.log(`Successfully deleted cache: ${cacheName}`);
                } catch (error) {
                    console.warn(`Failed to delete cache ${cacheName}:`, error);
                    // Continue with other deletions even if this one failed
                }
            }));
        }
    } catch (error) {
        console.error('Cache deletion error:', error);
        // We don't want this to block activation
    }
}

// Check if cached response needs validation with the server
function shouldValidateWithServer(cachedResponse) {
    // Check if cache version has changed
    if (cachedResponse && !cachedResponse.url.includes(CACHE_VERSION)) {
        return true;
    }
    
    // Don't validate if response is still fresh
    if (cachedResponse && cachedResponse.headers) {
        // Check cache control headers
        const cacheControl = cachedResponse.headers.get('cache-control');
        if (cacheControl) {
            // If max-age directive is present and still valid, don't validate
            const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
            if (maxAgeMatch) {
                const maxAge = parseInt(maxAgeMatch[1], 10) * 1000; // Convert to ms
                const dateHeader = cachedResponse.headers.get('date');
                if (dateHeader) {
                    const responseTime = new Date(dateHeader).getTime();
                    const now = Date.now();
                    if (now - responseTime < maxAge) {
                        return false; // Still fresh according to max-age
                    }
                }
            }
            
            // If no-cache directive is present, always validate
            if (cacheControl.includes('no-cache')) {
                return true;
            }
        }
        
        // Check age of cached response against our default MAX_CACHE_AGE
        const dateHeader = cachedResponse.headers.get('date');
        if (dateHeader) {
            const cachedDate = new Date(dateHeader).getTime();
            const now = Date.now();
            if (now - cachedDate > MAX_CACHE_AGE) {
                return true; // Older than our max age setting
            }
        }
    }
    
    return false;
}

// Create a conditional request based on cached response
function createConditionalRequest(request, cachedResponse) {
    // Clone the original request to modify headers
    const conditionalRequest = new Request(request.url, {
        method: request.method,
        headers: new Headers(request.headers),
        mode: request.mode,
        credentials: request.credentials,
        cache: 'no-cache' // Force validation with server
    });
    
    // Add conditional headers if available in cached response
    if (cachedResponse && cachedResponse.headers) {
        const etag = cachedResponse.headers.get('etag');
        if (etag) {
            conditionalRequest.headers.set('If-None-Match', etag);
        }
        
        const lastModified = cachedResponse.headers.get('last-modified');
        if (lastModified) {
            conditionalRequest.headers.set('If-Modified-Since', lastModified);
        }
    }
    
    return conditionalRequest;
}

// Network request with timeout
async function timeoutFetch(request, timeoutMs = NETWORK_TIMEOUT) {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const response = await fetch(request, { signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Handle fetch with appropriate strategy
async function handleFetch(request) {
    if (request.method !== 'GET') {
        return fetch(request);
    }
    
    const url = new URL(request.url);
    
    // For API requests, use network-first strategy
    if (url.pathname.includes('/api/')) {
        return handleNetworkFirst(request);
    }
    
    // For asset requests, use cache-first with conditional validation
    return handleCacheWithValidation(request);
}

// Network-first strategy with fallback to cache
async function handleNetworkFirst(request) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    
    try {
        // Try network first with timeout
        const networkResponse = await timeoutFetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.ok && isAssetResponse(networkResponse)) {
            cache.put(request, networkResponse.clone()).catch(err => 
                console.warn('Failed to cache API response:', err));
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network request failed, falling back to cache:', error);
        
        // Fallback to cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If nothing in cache either, throw network error
        throw new Error('No network or cached response available');
    }
}

// Cache-first strategy with conditional validation
async function handleCacheWithValidation(request) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    
    // Try to get from cache first
    let cachedResponse = await cache.match(request);
    
    // Check if we need to validate the cached response
    const needsValidation = !cachedResponse || shouldValidateWithServer(cachedResponse);
    
    if (!needsValidation) {
        // Use cached response without validation
        console.log('Using fresh cached response for:', request.url);
        return cachedResponse;
    }
    
    try {
        // Create conditional request if we have a cached response
        const conditionalRequest = cachedResponse ? 
            createConditionalRequest(request, cachedResponse) : 
            request;
        
        // Fetch with conditional request
        const networkResponse = await timeoutFetch(conditionalRequest);
        
        // If server returns 304 Not Modified, use cached response
        if (networkResponse.status === 304 && cachedResponse) {
            console.log('Server confirmed cache is valid for:', request.url);
            return cachedResponse;
        }
        
        // If we got a valid response, cache it
        if (networkResponse && networkResponse.ok && isAssetResponse(networkResponse)) {
            console.log('Updating cache with new response for:', request.url);
            
            const clonedResponse = networkResponse.clone();
            cache.put(request, clonedResponse).catch(error => {
                console.error('Cache put error:', error);
            });
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Network fetch error:', error);
        
        // Return cached response if available
        if (cachedResponse) {
            console.log('Returning cached response after network error for:', request.url);
            return cachedResponse;
        }
        
        // No options left, return an error response
        return new Response('Network error occurred', { 
            status: 503, 
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store'
            })
        });
    }
}

self.addEventListener('install', (event) => {
    console.log(`Service Worker installing (${CACHE_VERSION})`);
    
    // Immediately take control of all clients
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log(`Service Worker activating (${CACHE_VERSION})`);
    
    // Run cleanup and take control immediately
    event.waitUntil(
        Promise.all([
            deleteOldCaches(),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(handleFetch(event.request));
});

// Add a message listener to force cache refresh when needed
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHES') {
        event.waitUntil(deleteOldCaches());
    }
});