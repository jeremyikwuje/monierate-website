<script lang="ts">
	import ApiPricingHero from '$lib/components/api-pricing/ApiPricingHero.svelte';
	import ApiPricingLogos from '$lib/components/api-pricing/ApiPricingLogos.svelte';
	import ApiPricingFeatureGrid from '$lib/components/api-pricing/ApiPricingFeatureGrid.svelte';
	import ApiPricingShowcase from '$lib/components/api-pricing/ApiPricingShowcase.svelte';
	import ApiPricingPlans from '$lib/components/api-pricing/ApiPricingPlans.svelte';
	import ApiFaq from '$lib/components/api/ApiFaq.svelte';
	import ApiCta from '$lib/components/api/ApiCta.svelte';
	import { pricingCurrency, perRequestLabel } from '$lib/components/api-pricing/currency';

	let { data } = $props();

	const plans = $derived((data.subscriptionPlans as any[]) || []);

	// Naira for visitors in Nigeria, USD for everyone else
	const currency = $derived(pricingCurrency(data.ucountry));
	const perRequest = $derived(perRequestLabel(currency));

	const faqAnswers = $derived({
		'What currencies and markets are supported?':
			'170+ currencies from 100+ providers, including Binance P2P, Bybit, Luno, Quidax, Chipper Cash and more. Official, mid-market and black market NGN rates, stablecoins (USDT, USDC) and fiat (USD, EUR, GBP and many others) are all included.',
		'What are the rate limits?': `Free (PAYG): unlimited requests billed at ${perRequest} each. Pro: 10,000 req/month, 10 req/min, included in the flat fee. Max: 100,000 req/month, 50 req/min.`,
		'Is there a free tier?': `Yes. Every new account gets 100 free API requests, once, on signup. No card needed. After those 100, each request costs ${perRequest}, or you can move to a flat monthly plan. The dashboard is free forever.`
	});
</script>

<svelte:head>
	<title>Exchange Rate API Pricing | Live Rates from 100+ Providers | Monierate</title>
	<meta
		name="description"
		content="Fast, reliable exchange rate API for Naira. Live stablecoin, official and parallel market rates from 100+ providers across 170+ currencies. Your first 100 requests are free, then $0.01 per request, or pick a flat monthly plan."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Exchange Rate API Pricing | Monierate" />
	<meta
		property="og:description"
		content="Live exchange rates for 170+ currencies from 100+ providers in one JSON API. First 100 requests free, then $0.01 per request, or choose a flat plan."
	/>
	<meta property="og:url" content="https://monierate.com/api-pricing" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
	<link rel="canonical" href="https://monierate.com/api-pricing" />
</svelte:head>

<ApiPricingHero {currency} />
<ApiPricingLogos />
<ApiPricingFeatureGrid />
<ApiPricingShowcase />
<ApiPricingPlans {plans} {currency} />
<div id="faq" class="scroll-mt-6">
	<ApiFaq fullWidth answers={faqAnswers} />
</div>
<ApiCta subtitle="Create a free account and get your API key in minutes. Your first 100 requests are free, no card required." />
