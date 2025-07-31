import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import currencySymbols from '$data/currency-symbols.json';

const getHighlights = async (fetch: typeof globalThis.fetch, pair: string): Promise<any> => {
	try {
		const res = await fetch('/api/highlights?max=10&pair=' + pair);
		if (!res.ok) throw new Error(`Failed to fetch highlights: ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error('getHighlights error:', err);
		return [];
	}
};

export const load: PageServerLoad = async ({ fetch, url }) => {
	try {
		const currency = url.searchParams.get('currency') || 'USD';
		const pair = `${currency}NGN`.toLowerCase();

		const highlights = await getHighlights(fetch, pair);

		return {
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
