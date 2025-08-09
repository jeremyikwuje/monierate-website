/// <reference types="@sveltejs/kit" />
/// <reference lib="WebWorker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

// Cache config
const CACHE_VERSION = version;
const CACHE = `cache-${CACHE_VERSION}`;
const NETWORK_TIMEOUT = 10000;
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24h
const ASSETS = [...build, ...files];

// Helpers
const timeoutFetch = async (req: Request, ms = NETWORK_TIMEOUT) => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), ms);
	try {
		const res = await fetch(req, { signal: controller.signal });
		clearTimeout(timeout);
		return res;
	} catch (err) {
		clearTimeout(timeout);
		throw err;
	}
};

const isFresh = (cached?: Response) => {
	if (!cached) return false;
	const dateHeader = cached.headers.get('date');
	if (dateHeader) {
		const age = Date.now() - new Date(dateHeader).getTime();
		return age < MAX_CACHE_AGE;
	}
	return false;
};

// Install — pre-cache app shell & static assets
self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			await cache.addAll(ASSETS);
		})()
	);
});

// Activate — clean old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
			self.clients.claim();
		})()
	);
});

// Fetch — assets: cache-first; others: network-first with timeout & offline fallback
self.addEventListener('fetch', (event: FetchEvent) => {
	if (event.request.method !== 'GET') return;

	event.respondWith(
		(async () => {
			const url = new URL(event.request.url);
			const cache = await caches.open(CACHE);

			// Serve build/static assets from cache
			if (ASSETS.includes(url.pathname)) {
				return (await cache.match(url.pathname)) ?? fetch(event.request);
			}

			// Try network first with timeout
			try {
				const res = await timeoutFetch(event.request);
				if (res.ok) cache.put(event.request, res.clone());
				return res;
			} catch {
				// Fallback to fresh cached response
				const cached = await cache.match(event.request);
				if (cached && isFresh(cached)) return cached;

				// Or stale cached if no fresh one
				if (cached) return cached;

				return new Response('Offline', { status: 503 });
			}
		})()
	);
});
