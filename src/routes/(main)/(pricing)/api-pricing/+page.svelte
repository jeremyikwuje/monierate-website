<script lang="ts">
	import ApiPricingHero from '$lib/components/api-pricing/ApiPricingHero.svelte';
	import ApiPricingLogos from '$lib/components/api-pricing/ApiPricingLogos.svelte';
	import ApiPricingFeatureGrid from '$lib/components/api-pricing/ApiPricingFeatureGrid.svelte';
	import ApiPricingShowcase from '$lib/components/api-pricing/ApiPricingShowcase.svelte';
	import ApiPricingPlans from '$lib/components/api-pricing/ApiPricingPlans.svelte';
	import ApiFaq from '$lib/components/api/ApiFaq.svelte';
	import ApiCta from '$lib/components/api/ApiCta.svelte';

	let { data } = $props();

	const plans = $derived((data.subscriptionPlans as any[]) || []);
</script>

<svelte:head>
	<title>Exchange Rate API Pricing | Live Naira Rates from 90+ Providers | Monierate</title>
	<meta
		name="description"
		content="Fast, reliable exchange rate API for Naira. Live stablecoin, official and parallel market rates from 90+ providers. Your first 100 requests are free, then $0.01 per request, or pick a flat monthly plan."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Exchange Rate API Pricing | Monierate" />
	<meta
		property="og:description"
		content="Live Naira exchange rates from 90+ providers in one JSON API. First 100 requests free, then $0.01 per request, or choose a flat plan."
	/>
	<meta property="og:url" content="https://monierate.com/api-pricing" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
	<link rel="canonical" href="https://monierate.com/api-pricing" />
</svelte:head>

<ApiPricingHero />
<ApiPricingLogos />
<ApiPricingFeatureGrid />
<ApiPricingShowcase />
<ApiPricingPlans {plans} />
<div id="faq" class="scroll-mt-6">
	<ApiFaq
		fullWidth
		freeTierAnswer="Yes. Every new account gets 100 free API requests, once, on signup. No card needed. After those 100, each request costs $0.01, or you can move to a flat monthly plan. The dashboard is free forever."
	/>
</div>
<ApiCta subtitle="Create a free account and get your API key in minutes. Your first 100 requests are free, no card required." />
