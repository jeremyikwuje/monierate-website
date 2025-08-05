<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { friendlyDate, formatNumber, setCookie } from '$lib/functions';
	import AdBanner from '$lib/components/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import Table from '$lib/components/Table.svelte';
	import HighlightCard from '$lib/components/HighlightCard.svelte';
	import { slide } from 'svelte/transition';
	import Notice from '$lib/components/Notice.svelte';
	import ExchangeRateText from '$lib/components/ExchangeRateText.svelte';
	import MainFaq from '$lib/components/MainFAQ.svelte';

	interface Changer {
		code: string;
		name: string;
		link: string;
		pairs: Record<string, unknown>;
	}

	export let data;
	const currencySymbols = data.currencySymbols as any;
	const currencies = data.mergedCurrencies as any;
	const pairs = data.pairs || {};
	let page = data.page;
	$: currency = data.currency;
	$: getCurrencySymbol = currencySymbols[currency] || currency;

	// Reactive pair based on currency
	$: pair = pairs.find((pair: any) => pair.code === `${currency.toLowerCase()}ngn`);

	// Reactive rates from selected pair
	$: rates = pair?.changers || [];

	// Reactive provider lookup
	const providers: Record<string, Changer> = data.providers || {};
	let total = 0;
	$: if (rates) {
		total = Object.entries(rates).length;
	}

	// Sort and filter rates reactively
	$: sortedFilteredRates = (() => {
		if (!rates) return [];

		// Separate non-zero and zero `price_buy` rates
		const nonZeroRates = rates.filter((rate: any) => rate.price_buy > 0);
		const zeroRates = rates.filter((rate: any) => rate.price_buy <= 0);

		// Sort non-zero in ascending price_buy
		nonZeroRates.sort((a: any, b: any) => a.price_buy - b.price_buy);

		// Sort zero rates in descending price_sell
		zeroRates.sort((a: any, b: any) => b.price_sell - a.price_sell);

		// Combine both lists
		return nonZeroRates.concat(zeroRates);
	})();

	// Search filtering
	let searchTerm = '';
	$: filteredRates = sortedFilteredRates.filter((rate: any) => {
		const providerName = providers[rate.changer_code]?.name || '';
		return providerName.toLowerCase().includes(searchTerm.toLowerCase());
	});

	const highlights = data.highlights;
	let newResult = highlights.newResult;
	let buyingResult = highlights.buyingResult;
	let sellingResult = highlights.sellingResult;
	let sendingResult = highlights.sendingResult;
	let fundingResult = highlights.fundingResult;

	// Highlighting
	let showHighlights = data.isMobile ? false : data.showHighlights;

	function toggleHighlights(event: Event) {
		let toggle = event.target as HTMLInputElement;
		if (toggle.checked) {
			showHighlights = true;
			if (!data.isMobile) {
				setCookie("showHighlights", "true", 30);
			}
		} else {
			showHighlights = false;
			if (!data.isMobile) {
				setCookie("showHighlights", "false", 30);
			}
		}
	}

	let tableData: any = null;
	let excludedPlatforms = ['market', 'binance'];
	$: {
		let count: number = 0;
		if (filteredRates) {
			let getFilteredRates = filteredRates
				.filter((item: any) => !excludedPlatforms.includes(item.changer_code))
				.map((rate: any, index: number) => {
					if (providers[rate.changer_code]) {
						return {
							'#': (count += 1),
							Provider: {
								label: providers[rate.changer_code].name,
								icon: [
									`/icons/svg/${rate.changer_code}.svg`,
									`/icons/svg/${rate.changer_code}.png`
								],
								link: `/converter/${rate.changer_code}?Amount=1&From=usd&To=ngn`
							},
							Buy: {
								label:
									rate.price_buy > 0
										? `₦${formatNumber(rate.price_buy, 'en-US', { maximumFractionDigits: 0 })} ${
												rate.price_change_percent_24hr !== 0 ? rate.price_change_percent_24hr : ''
										  }`
										: '-',
								sub: `per ${currencySymbols[currency] || currency + ' '}1`
							},
							Sell: {
								label:
									rate.price_sell > 0
										? `₦${formatNumber(rate.price_sell, 'en-US', { maximumFractionDigits: 0 })} ${
												rate.price_change_percent_24hr !== 0 ? rate.price_change_percent_24hr : ''
										  }`
										: '-',
								sub: `per ${currencySymbols[currency] || currency + ' '}1`
							},
							'Last updated': friendlyDate(rate.updated_at)
						};
					}
				})
				.filter(
					(item: any) => item !== undefined && !excludedPlatforms.includes(item.changer_code)
				);

			tableData = {
				head: ['#', 'Provider', 'Buy', 'Sell', 'Last updated'],
				body: getFilteredRates
			};
		}
	}

	let originalFilteredRates: any[] | null = null;

	const handleSearch = (e: Event) => {
		const searchTerm = (e.target as HTMLInputElement).value.toLowerCase().trim();

		// Backup the original list once
		if (!originalFilteredRates) {
			originalFilteredRates = [...filteredRates];
		}

		// If empty, restore full list
		if (!searchTerm) {
			filteredRates = originalFilteredRates;
			return;
		}

		// Filter using provider name
		const filtered = originalFilteredRates.filter((item: any) => {
			const provider = providers[item.changer_code];
			return provider && provider.name && provider.name.toLowerCase().includes(searchTerm);
		});

		filteredRates = filtered;
	};

	let highlightsLoading: boolean = false;
	const getHighlights = async (pair: string): Promise<any> => {
		try {
			highlightsLoading = true;
			const res = await fetch('/api/highlights?max=5&pair=' + pair);
			if (!res.ok) throw new Error(`Failed to fetch highlights: ${res.status}`);
			return await res.json();
		} catch (err) {
			console.error('getHighlights error:', err);
			return [];
		} finally {
			highlightsLoading = false;
		}
	};

	const handleFilterByCurrency = async (currency_: string) => {
		currency = currency_;
		let highlights = await getHighlights(`${currency.toLowerCase()}ngn`);
		newResult = highlights.newResult;
		buyingResult = highlights.buyingResult;
		sellingResult = highlights.sellingResult;
		sendingResult = highlights.sendingResult;
		fundingResult = highlights.fundingResult;
	};
</script>

<svelte:head>
	<title>Dollar to naira today black market | Monierate</title>
	<meta
		name="description"
		content="Monierate offers reliable naira exchange rates from 40+ exchanges. Track rates, convert dollars, and get crypto price alerts from Binance, Bybit, etc."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Naira exchange rates & converter | Monierate" />
	<meta
		property="og:description"
		content="Compare the naira exchange rates from over 16 exchanges in Nigeria. Track naira rates today. Convert dollar to naira using CBN and black market rate. Get price alert from your favourite crypto exchange such as Binance, Bybit, Quidax, etc."
	/>
	<meta property="og:url" content="monierate.com" />
	<meta property="og:image" content="https://monierate.com/monierate-og-image.png" />
</svelte:head>

<!-- partner -->
<div class="bg-white dark:bg-gray-800">
	<AdBanner name="home" bannerIndexes={data.bannerIndexes} />
</div>

<div class="container px-0">
	{#if !data.isValidCurrency}
		<Notice
			>Looks like the currency you entered isn't valid. Don't worry — we've reset it to {currency.toUpperCase()}.</Notice
		>
	{/if}

	<ExchangeRateText
		title={`Today ${currencies[currency] || currency} to Naira rates on exchanges`}
		data={{
			currencies: currencies,
			currency: { name: currency, symbol: getCurrencySymbol },
			rate: { now: pair.price.current, last: pair.price_30d }
		}}
	/>

	<!-- Highlight Toggle -->
	<div class="flex justify-end items-center mb-6">
		{#if highlightsLoading}
			<span class="mr-2 -mb-1">
				<span
					class="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"
				/>
			</span>
		{/if}
		<label class="inline-flex items-center cursor-pointer">
			<span class="mr-2 text-sm text-gray-600 dark:text-gray-400">Highlight</span>
			<input
				type="checkbox"
				value=""
				class="sr-only peer"
				on:change={toggleHighlights}
				bind:checked={showHighlights}
				id="highlight-toggle"
			/>
			<div
				class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			/>
		</label>
	</div>

	{#if showHighlights}
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
			in:slide={{ duration: 250 }}
			out:slide={{ duration: 250 }}
		>
			<!--New-->
			{#if newResult}
				<HighlightCard
					highlightData={newResult}
					highlightType="auto"
					title="🔥 New Listing"
					currency={getCurrencySymbol}
				/>
			{/if}

			<!--BUYING-->
			{#if buyingResult}
				<HighlightCard
					highlightData={buyingResult}
					highlightType="buy"
					title="🔥 Best Buy Rate"
					link="/buy/usd-with-ngn-best-buying-rate"
					currency={getCurrencySymbol}
				/>
			{/if}

			<!--SELLING-->
			{#if sellingResult}
				<HighlightCard
					highlightData={sellingResult}
					highlightType="sell"
					title="🔥 Best Sell Rate"
					link="/sell/usd-get-ngn-best-selling-rate"
					currency={getCurrencySymbol}
				/>
			{/if}

			<!--SENDING-->
			{#if sendingResult}
				<HighlightCard
					highlightData={sendingResult}
					highlightType="sell"
					title="🔥 Best Sending Rate"
					link="/send/usd-to-ng-best-rate"
					currency={getCurrencySymbol}
				/>
			{/if}

			<!--FUNDING-->
			{#if fundingResult}
				<HighlightCard
					highlightData={fundingResult}
					highlightType="buy"
					title="🔥 Best Card Rate"
					link="/card/usd-ngn-best-funding-rate"
					mobileOnly={true}
					currency={getCurrencySymbol}
				/>
			{/if}
		</div>
	{/if}
</div>

<div class="container px-0 mb-4">
	<ExchangeFilter
		onSearch={handleSearch}
		selectedCurrency={currency}
		onChangeCurrency={handleFilterByCurrency}
		filteredCurrencies={data.AVAILABLE_CURRENCIES}
	/>
</div>

<main>
	{#if tableData && tableData.body && tableData.body.length > 0}
		<Table
			{tableData}
			shrinkFirstColumn={true}
			sortBy={['Provider', 'Buy', 'Sell']}
			pagination={true}
			bind:currentPage={page}
		/>
	{:else}
		<div class="container text-center text-gray-600 dark:text-gray-300">
			<p>No exchange providers found</p>
		</div>
	{/if}

    <MainFaq />
</main>
