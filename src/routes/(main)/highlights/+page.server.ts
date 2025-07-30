import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get_changers } from '$lib/server/changer.service';
import { get_pairs_changers } from '$lib/server/pair.service';
import currencySymbols from '$data/currency-symbols.json';

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

// Utility function to map supported platforms with their rates
function findSupportedPlatforms(
    changers: Record<string, Changer>,
    rates: PairChanger[],
    sortDesc: boolean | null,
    useBuying = false
): ChangerRate[] {
    const excludedPlatforms = ['market', 'binance', 'paypal'];

    let platformRates: ChangerRate[] = Object.entries(changers)
        .map(([changer_code, changer]) => {
            const rate = rates.find((rate) => rate.changer_code === changer_code);

            if (
                rate &&
                !excludedPlatforms.includes(rate.changer_code) &&
                (rate.price_buy > 0 || rate.price_sell > 0)
            ) {
                return { rate, changer };
            }
            return null;
        })
        .filter((item): item is ChangerRate => item !== null)
        .filter((item) => (useBuying ? item.rate.price_buy > 0 : item.rate.price_sell > 0));

    if (sortDesc === null) return platformRates;

    const priceCompare = (a: ChangerRate, b: ChangerRate) => {
        const priceA = useBuying ? a.rate.price_buy : a.rate.price_sell;
        const priceB = useBuying ? b.rate.price_buy : b.rate.price_sell;
        return sortDesc ? priceB - priceA : priceA - priceB;
    };

    return platformRates.sort(priceCompare);
}

export const load: PageServerLoad = async ({ fetch, url }) => {
    try {
        const currency = url.searchParams.get('currency') || 'USD';
        const pair = `${currency}NGN`.toLowerCase();

        // Fetch changers and rate data in parallel
        const [rawProviders, remittance, ramp, card, allPairs] = await Promise.all([
            get_changers(),
            get_pairs_changers(pair, 'remittance'),
            get_pairs_changers(pair, 'ramp'),
            get_pairs_changers(pair, 'card'),
            get_pairs_changers(pair)
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

        // Process top platform results from different rate groups
        const groupRates = {
            allRates: allPairs,
            remittance,
            ramp,
            card
        };

        let newResult: ChangerRate[] = [];
        let sendingResult: ChangerRate[] = [];
        let buyingResult: ChangerRate[] = [];
        let sellingResult: ChangerRate[] = [];
        let fundingResult: ChangerRate[] = [];

        const totalRates = allPairs?.length ?? 0;

        if (totalRates > 0) {
            try {
                const newestProviders = ['breet', 'busha', 'spenda', 'ridima', 'koyn'];
                const getNewestProviders = Object.fromEntries(
                    newestProviders.map((code) => [code, providers[code]])
                );

                if (groupRates.allRates && groupRates.allRates.length > 0) {
                    newResult = findSupportedPlatforms(
                        getNewestProviders,
                        groupRates.allRates,
                        null,
                        false
                    ).slice(0, 10);
                }

                if (groupRates.remittance && groupRates.remittance.length > 0) {
                    sendingResult = findSupportedPlatforms(
                        providers,
                        groupRates.remittance,
                        true,
                        false
                    ).slice(0, 10);
                }

                if (groupRates.ramp && groupRates.ramp.length > 0) {
                    buyingResult = findSupportedPlatforms(providers, groupRates.ramp, false, true).slice(
                        0,
                        10
                    );
                    sellingResult = findSupportedPlatforms(providers, groupRates.ramp, true, false).slice(
                        0,
                        10
                    );
                }

                if (groupRates.card && groupRates.card.length > 0) {
                    fundingResult = findSupportedPlatforms(providers, groupRates.card, false, true).slice(
                        0,
                        10
                    );
                }
            } catch (processingError) {
                console.error('Results processing error:', processingError);
            }
        }

        // Return everything to page
        return {
            providers,
            remittance,
            ramp,
            card,
            allPairs,
            currency,
            currencySymbols,
            newResult,
            sendingResult,
            buyingResult,
            sellingResult,
            fundingResult
        };
    } catch (err: any) {
        console.error('Page load error:', err);
        throw error(500, {
            message: 'Unable to display data, try again in a few minutes.'
        });
    }
};
