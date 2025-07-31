import { json, error } from '@sveltejs/kit';
import { get_changers } from '$lib/server/changer.service';
import { get_pairs_changers } from '$lib/server/pair.service';

interface Changer {
	code: string;
	name: string;
	link: string;
	pairs: Record<string, unknown>;
}

interface PairChanger {
	changer_code: string;
	price_buy: number;
	price_sell: number;
	updated_at: string;
}

interface ChangerRate {
	rate: PairChanger;
	changer: Changer;
}

const EXCLUDED = new Set(['market', 'binance', 'paypal']);
const NEWEST = ['oneremit', 'breet', 'busha', 'spenda', 'ridima'];

const findPlatforms = (
	changers: Record<string, Changer>,
	rates: PairChanger[] = [],
	sortDesc: boolean | null,
	tag: 'buy' | 'sell' | 'new' = 'sell'
): ChangerRate[] =>
	rates
		.filter(({ changer_code, price_buy, price_sell }) => {
			if (changers[changer_code] && !EXCLUDED.has(changer_code)) {
				if (tag === 'new') {
					if (price_buy > 0 || price_sell > 0) {
						return true;
					}
				}
				const price = tag === 'buy' ? price_buy : price_sell;
				return price > 0;
			}
		})
		.map((rate) => ({ rate, changer: changers[rate.changer_code] }))
		.sort((a, b) => {
			if (sortDesc === null) return 0;
			if (tag === 'buy') {
				return sortDesc ? b.rate.price_buy - a.rate.price_buy : a.rate.price_buy - b.rate.price_buy;
			} else if (tag === 'sell') {
				return sortDesc
					? b.rate.price_sell - a.rate.price_sell
					: a.rate.price_sell - b.rate.price_sell;
			} else if (tag === 'new') {
				return NEWEST.indexOf(a.changer.code) - NEWEST.indexOf(b.changer.code);
			} else {
				return 0;
			}
		});

export const GET = async ({ url }) => {
	const pair = url.searchParams.get('pair')?.trim() || null;
	const max = (url.searchParams.get('max')?.trim() || 10) as number;

	if (!pair) {
		throw error(400, 'Invalid pair');
	}

	const [rawChangers, remittance, ramp, card, all] = await Promise.all([
		get_changers(),
		get_pairs_changers(pair, 'remittance'),
		get_pairs_changers(pair, 'ramp'),
		get_pairs_changers(pair, 'card'),
		get_pairs_changers(pair)
	]);

	if (!rawChangers?.length) {
		throw error(500, 'Platform data unavailable. Try again shortly.');
	}

	const changers = Object.fromEntries(rawChangers.map((p: any) => [p.code, p]));
	const newest = Object.fromEntries(NEWEST.filter((c) => changers[c]).map((c) => [c, changers[c]]));

	const safe = (rates?: PairChanger[]) => Array.isArray(rates) && rates.length;

	const res = {
		newResult: safe(all) ? findPlatforms(newest, all, false, 'new').slice(0, max) : [],
		sendingResult: safe(remittance)
			? findPlatforms(changers, remittance, true, 'sell').slice(0, max)
			: [],
		buyingResult: safe(ramp) ? findPlatforms(changers, ramp, false, 'buy').slice(0, max) : [],
		sellingResult: safe(ramp) ? findPlatforms(changers, ramp, true, 'sell').slice(0, max) : [],
		fundingResult: safe(card) ? findPlatforms(changers, card, false, 'buy').slice(0, max) : []
	};

	return json(res);
};
