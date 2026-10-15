// api-pricing is priced in USD for every visitor.
// The pricing API returns `price_usd` and `prices_by_cycle.*.usd`.

export type PricingCurrency = {
	code: 'usd';
	symbol: string;
	perRequest: number;
};

export const USD: PricingCurrency = { code: 'usd', symbol: '$', perRequest: 0.01 };

export function formatMoney(n: number, currency: PricingCurrency): string {
	const digits = n < 100 ? 2 : 0;
	return `${currency.symbol}${n.toLocaleString('en-US', { maximumFractionDigits: digits })}`;
}

export function perRequestLabel(currency: PricingCurrency): string {
	return formatMoney(currency.perRequest, currency);
}
