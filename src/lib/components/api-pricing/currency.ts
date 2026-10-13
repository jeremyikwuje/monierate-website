// api-pricing shows Naira to visitors in Nigeria and USD to everyone else.
// The pricing API returns both (`price_ngn` / `price_usd`, `prices_by_cycle.*.ngn` / `.usd`).

export type PricingCurrency = {
	code: 'ngn' | 'usd';
	symbol: string;
	perRequest: number;
};

const CURRENCIES: Record<PricingCurrency['code'], PricingCurrency> = {
	ngn: { code: 'ngn', symbol: '₦', perRequest: 10 },
	usd: { code: 'usd', symbol: '$', perRequest: 0.01 }
};

export function pricingCurrency(country: string | null | undefined): PricingCurrency {
	return (country ?? '').toUpperCase() === 'NG' ? CURRENCIES.ngn : CURRENCIES.usd;
}

export function formatMoney(n: number, currency: PricingCurrency): string {
	const digits = currency.code === 'usd' && n < 100 ? 2 : 0;
	return `${currency.symbol}${n.toLocaleString('en-US', { maximumFractionDigits: digits })}`;
}

export function perRequestLabel(currency: PricingCurrency): string {
	return formatMoney(currency.perRequest, currency);
}
