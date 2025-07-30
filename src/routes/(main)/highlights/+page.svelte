<script lang="ts">
	/** @type {import('./$types').PageData} */
	import AdBanner from '$lib/components/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import HighlightCard from '$lib/components/HighlightCard.svelte';

	export let data;
	const currencySymbols = data.currencySymbols as any;
	$: currency = data.currency;
	$: getCurrencySymbol = currencySymbols[currency] || currency;

	$: newResult = data.newResult;
	$: buyingResult = data.buyingResult;
	$: sellingResult = data.sellingResult;
	$: sendingResult = data.sendingResult;
	$: fundingResult = data.fundingResult;
</script>

<svelte:head>
	<title>Highlights | Monierate</title>
	<meta
		name="description"
		content="Explore daily highlights of naira exchange rates from top Nigerian platforms. Track rate trends, view daily summaries, and get updates from Binance, Bybit, Quidax, and more — all in one place on Monierate."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Highlights of Naira Exchange Rates | Monierate" />
	<meta
		property="og:description"
		content="Stay updated with daily highlights of naira exchange rates across Nigeria’s top exchanges. Compare black market and CBN rates, monitor trends, and get alerts from Binance, Bybit, Quidax, and more."
	/>
	<meta property="og:url" content="https://monierate.com/highlights" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<!-- partner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="home" bannerIndexes={data.bannerIndexes} />
</div>

<div class="container px-0">
	<h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100">Rate Highlights</h1>
	<div class="text-gray-600 font-normal dark:text-gray-300">
		<p>
			Explore a quick snapshot of the most competitive naira exchange rates from leading providers.
			These rates are updated regularly to help you make informed conversion decisions across CBN,
			black market, and crypto platforms like Cedar.money, Bybit, and Quidax.
		</p>
	</div>

	<div class="my-10">
		<ExchangeFilter
			bind:selectedCurrency={currency}
			selectedCategory="/highlights"
			disableSearch={true}
		/>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
		<!--New-->
		{#if newResult}
			<HighlightCard
				highlightData={newResult}
				title="🔥 New Listing"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--BUYING-->
		{#if buyingResult}
			<HighlightCard
				highlightData={buyingResult}
				title="🔥 Best Buying Rate"
				link="/buy/usd-with-ngn-best-buying-rate"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--SELLING-->
		{#if sellingResult}
			<HighlightCard
				highlightData={sellingResult}
				title="🔥 Best Selling Rate"
				link="/sell/usd-get-ngn-best-selling-rate"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--SENDING-->
		{#if sendingResult}
			<HighlightCard
				highlightData={sendingResult}
				title="🔥 Best Sending Rate"
				link="/send/usd-to-ng-best-rate"
				currency={getCurrencySymbol}
			/>
		{/if}

		<!--FUNDING-->
		{#if fundingResult}
			<HighlightCard
				highlightData={fundingResult}
				title="🔥 Best Card Rate"
				link="/card/usd-ngn-best-funding-rate"
				currency={getCurrencySymbol}
			/>
		{/if}
	</div>
</div>
