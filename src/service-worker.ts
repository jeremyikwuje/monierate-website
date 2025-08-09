/// <reference types="@sveltejs/kit" />
/// <reference lib="WebWorker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

// Cache config
const CACHE = `cache-${version}`;
const NETWORK_TIMEOUT = 10000;
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

self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			for (const path of ASSETS) {
				const url = new URL(path, self.location.origin).toString();
				try {
					const res = await fetch(url);
					if (res.ok) {
						await cache.put(url, res);
					} else {
						console.warn(`SW: Skipped caching ${url} (${res.status})`);
					}
				} catch (err) {
					console.warn(`SW: Failed to cache ${url}`, err);
				}
			}
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

// Fetch — assets: cache-first; API/other: network-first with offline fallback
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

			// Network-first for other requests (e.g., API)
			try {
				const res = await timeoutFetch(event.request);
				if (res.ok) cache.put(event.request, res.clone());
				return res;
			} catch {
				// Fallback to cached if offline
				const cached = await cache.match(event.request);
				if (cached) return cached;
				return new Response('Offline', { status: 503 });
			}
		})()
	);
});
