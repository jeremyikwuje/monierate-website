import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get_changers } from '$lib/server/changer.service';
import currencySymbols from '$data/currency-symbols.json';
import currencies from '$data/currencies.json';

type CurrencyMap = Record<string, string>;

export const load: PageServerLoad = async ({ fetch, url, parent }) => {
	try {
		const { VALID_CURRENCIES } = await parent();
		const page = Number(url.searchParams.get('page') || '1');
		const rawCurrency = (url.searchParams.get('currency') ?? 'USD').toUpperCase();
		const isValidCurrency = (VALID_CURRENCIES as readonly string[]).includes(rawCurrency);
		const currency = isValidCurrency ? (rawCurrency as string) : 'USD';

		// Fetch changers and rate data in parallel
		const [rawProviders] = await Promise.all([
			get_changers(),
		]);

		if (!rawProviders || rawProviders.length === 0) {
			throw error(500, {
				message: 'Unable to fetch platforms data, try again in a few minutes.'
			});
		}

		// Transform providers into key-value pair for easy lookup
		const providers: Record<string, (typeof rawProviders)[0]> = {};
		for (const provider of rawProviders) {
			if(provider.changer_tags && provider.changer_tags.includes("bank")) {
				providers[provider.code] = provider;
			}
		}
		const mergedCurrencies: CurrencyMap = {
			...currencies.coins,
			...currencies.fiat
		};

		// Return everything to page
		return {
			providers,
			page,
			currency,
			currencySymbols,
			isValidCurrency,
			mergedCurrencies,
		};
	} catch (err: any) {
		console.error('Page load error:', err);
		throw error(500, {
			message: 'Unable to display data, try again in a few minutes.'
		});
	}
};
