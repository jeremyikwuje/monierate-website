<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { friendlyDate, formatNumber } from '$lib/functions';
	import AdBanner from '$lib/components/AdBanner.svelte';
	import ExchangeFilter from '$lib/components/ExchangeFilter.svelte';
	import Table from '$lib/components/Table.svelte';
	import { slide } from 'svelte/transition';
	import Notice from '$lib/components/Notice.svelte';

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
							'#': count += 1,
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

	let readMoreRateDetails: boolean = false;

	const handleFilterByCurrency = async (currency_: string) => {
		currency = currency_;
	};
</script>

<svelte:head>
	<title
		>Send {currencies[currency] || currency} to Nigeria – Fast Money Transfers | Monierate</title
	>

	<meta
		name="description"
		content="Send {currencies[currency] ||
			currency} to Naira securely and instantly. Compare real-time transfer rates, track conversions, and get the best payout with Monierate's money transfer tools."
	/>

	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="Send {currencies[currency] || currency} to Naira – Money Transfer Rates | Monierate"
	/>
	<meta
		property="og:description"
		content="Transfer {currencies[currency] ||
			currency} to Naira with transparent, real-time rates. Compare providers, monitor fees, and get alerts to maximize value on every transfer."
	/>
	<meta property="og:url" content="https://monierate.com" />
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

	<h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100">
		Today's {currencies[currency] || currency} to Naira Transfer Exchange Rates
	</h1>
	<div class="text-gray-600 font-normal dark:text-gray-300 space-y-2">
			<p>
			The average rate for {getCurrencySymbol}1 is ₦{formatNumber(pair.price.current)}, compared
			to ₦{formatNumber(pair.price_30d)} a month ago.
			{#if !readMoreRateDetails}
				<button
					class="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-2 cursor-pointer"
					on:click={() => (readMoreRateDetails = true)}>Read More</button
				>
			{/if}
		</p>
		{#if readMoreRateDetails}
			<p in:slide={{ duration: 250 }} out:slide={{ duration: 250 }}>
				Rates provided are for indicative and guidance purposes only. You need at least ₦{formatNumber(
					(pair.price.current || 0) * 100
				)} to get {getCurrencySymbol}100 now, and if you have $100 you can get ₦{formatNumber(pair.price.current * 100)} or less.
			</p>
			<p>
				<strong>Buy rate:</strong> Used for changing {currencies['NGN'] ||
					'NGN'} to {currencies[currency] || currency}.
			</p>
			<p>
				<strong>Sell rate:</strong> Used for changing {currencies[
					currency
				] || currency} to {currencies['NGN'] || 'NGN'}. Tap on any provider for more details.
			</p>
							<button
					class="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-2 cursor-pointer"
					on:click={() => (readMoreRateDetails = false)}>Read Less</button
				>
		{/if}
	</div>
</div>

<div class="container px-0 mb-4">
	<ExchangeFilter
		onSearch={handleSearch}
		selectedCurrency={currency}
		onChangeCurrency={handleFilterByCurrency}
		selectedCategory="/money-transfer-rate"
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

	<div class="container dark:text-gray-300 mt-16">
		<span class="block mb-4">
			<h2>What is a Provider?</h2>
			<p>
				A provider is an entity that helps facilitate the exchange of currencies. If you have 100
				USDT and want to exchange it for naira, you will need an exchange provider to convert your
				USDT to naira. A provider can be an individual or entity. On Monierate, we only list trusted
				entities for you to choose from, not individual traders.
			</p>
		</span>
		<span class="block mb-4">
			<h3>What is Buy Price?</h3>
			<p>
				The buy price is the rate at which you pay to convert naira to dollars. It represents how
				much naira you're paying for every dollar obtained. For instance, if you have naira but need
				USDT to pay a bill, you exchange your naira for USDT, and the provider credits USDT to you
				at the buy price.
			</p>
		</span>
		<span class="block mb-4">
			<h3>What is Sell Price?</h3>
			<p>
				The sell price is the rate at which you pay to convert dollars to naira. It represents how
				much naira you're getting for every dollar exchanged. For instance, if you have USDT but
				need naira to pay a bill, you exchange your USDT for naira, and the provider credits naira
				to you at the sell price.
			</p>
		</span>
		<span class="block mb-4">
			<h3>Why is the buy price usually higher than the sell price?</h3>
			<p>
				Exchange providers make money from the difference between the buying and selling prices of
				the dollar. This is commonly known as arbitrage or trading profit—buying low and selling
				high. If you have USDT but need naira, they buy the USDT from you at a lower naira price and
				sell it at a higher naira price to someone else who needs USDT.
			</p>
		</span>
		<span class="block">
			<h3>How Monierate works</h3>
			<p class="mb-2">
				Monierate operates as a platform for comparing dollar prices across various providers in
				Nigeria.
			</p>
			<p class="mb-2">Here&#39;s how it works:</p>
			<ul class="list-inside ml-2">
				<li class="mb-2">
					<p>
						<strong>Comparison Functionality:</strong>
						Monierate gathers and displays the prices of the dollar from multiple providers in Nigeria.
						You can compare these prices to find the best rates available in the market.
					</p>
				</li>
				<li class="mb-2">
					<p>
						<strong>Exchange Rate Information:</strong>
						You can use Monierate to obtain daily information on the exchange rate of the dollar to naira.
					</p>
				</li>
				<li class="mb-2">
					<p>
						<strong>Order Arrangement:</strong>
						Prices are presented by default from the lowest to the highest, allowing You to easily identify
						the most cost-effective rates.
					</p>
				</li>
				<li class="mb-2">
					<p>
						<strong>Buy and Sell Options:</strong>
						Monierate facilitates You in acquiring more dollars for naira or vice versa by presenting
						both buy and sell options.
					</p>
				</li>
				<li class="mb-2">
					<p>
						<strong>Customizable Sorting:</strong>
						You have the flexibility to customize the order of the displayed rates, choosing between
						low to high or sorting by buy or sell prices.
					</p>
				</li>
				<li class="mb-2">
					<p>
						<strong>Provider Tracking:</strong>
						Monierate actively tracks the 24-hour prices of the dollar across a diverse range of providers,
						including platforms such as Binance, Luno, Remitano, Yellow Card, Quidax, and Payday.
					</p>
				</li>
			</ul>
			<p>
				In essence, we simplifies the process of finding the most favorable dollar exchange rates in
				Nigeria by providing a user-friendly platform for comparison and real-time rate tracking.
			</p>
		</span>
	</div>
</main>
