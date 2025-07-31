import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get_changers } from '$lib/server/changer.service';
import currencySymbols from '$data/currency-symbols.json';
const getHighlights = async (fetch: typeof globalThis.fetch, pair: string): Promise<any> => {
	try {
		const res = await fetch('/api/highlights?max=5&pair=' + pair);
		if (!res.ok) throw new Error(`Failed to fetch highlights: ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error('getHighlights error:', err);
		return [];
	}
};

export const load: PageServerLoad = async ({ fetch, url }) => {
	try {
		const page = Number(url.searchParams.get('page') || '1');
		const currency = url.searchParams.get('currency') || 'USD';
		const pair = `${currency}NGN`.toLowerCase();

		// Fetch changers and rate data in parallel
		const [rawProviders, highlights] = await Promise.all([
			get_changers(),
			getHighlights(fetch, pair)
		]);

		if (!rawProviders || rawProviders.length === 0) {
			throw error(500, {
				message: 'Unable to fetch platforms data, try again in a few minutes.'
			});
		}

		// Transform providers into key-value pair for easy lookup
		const providers: Record<string, (typeof rawProviders)[0]> = {};
		for (const provider of rawProviders) {
			providers[provider.code] = provider;
		}

		// Return everything to page
		return {
			providers,
			page,
			currency,
			currencySymbols,
			highlights
		};
	} catch (err: any) {
		console.error('Page load error:', err);
		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};
