<script lang="ts">
	/** @type {import('./$types').PageData} */
	import { friendlyDate } from '$lib/functions';
	import { onMount } from 'svelte';

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

	export let data;
	const pairs = data.pairs || {};
	const pair = pairs.find((pair: any) => pair.code === 'usdngn');

	let rates = pair.changers;
	const providers: Record<string, Changer> = data.providers || {};
	const total = Object.entries(rates).length;
	let newestProviders = ['ridima', 'koyn', 'cleva', 'coinex', 'vertofx'];
	let getNewestProviders: any = {};
	newestProviders.map((code: string) => {
		getNewestProviders[code] = providers[code];
	});
	let groupRates: Record<string, PairChanger[]> = {
		remittance: data.remittance,
		ramp: data.ramp,
		card: data.card,
		allRates: data.allPairs
	};

	// sort rates in decending order by price_buy;
	rates.sort((a: any, b: any) => a.price_buy - b.price_buy);
	// filter out rate with price_buy as 0
	const filtered_non_zero_rates = rates.filter((rate: any) => rate.price_buy > 0);
	const filtered_zero_rates = rates.filter((rate: any) => rate.price_buy <= 0);
	// soirt rates in descending order by price_buy
	filtered_zero_rates.sort((a: any, b: any) => b.price_sell - a.price_sell);
	// merge both rates
	rates = filtered_non_zero_rates.concat(filtered_zero_rates);

	let searchTerm = '';
	$: filteredRates = rates.filter((rate: any) => {
		const providerName = providers[rate.changer_code]?.name || '';
		return providerName.toLowerCase().includes(searchTerm.toLowerCase());
	});

	let newResult: ChangerRate[] = [];
	let sendingResult: ChangerRate[] = [];
	let buyingResult: ChangerRate[] = [];
	let sellingResult: ChangerRate[] = [];
	let fundingResult: ChangerRate[] = [];
	let isMobile: boolean = false;
	$: showHighlights = isMobile ? false : true;

	if (typeof window !== 'undefined') {
		const updateMobileStatus = () => {
			isMobile = window.matchMedia('(max-width: 768px)').matches;
		};

		updateMobileStatus();
		window.addEventListener('resize', updateMobileStatus);
	}

	function findSupportedPlatforms(
		changers: Record<string, Changer>,
		rates: PairChanger[],
		sortDesc: boolean | null,
		useBuying = false
	): ChangerRate[] {
		let platformRates: ChangerRate[] = Object.entries(changers)
			.map(([changer_code, changer]) => {
				const rate = rates.find((rate) => rate.changer_code === changer_code);
				const excludedPlatforms = ['market', 'binance', 'paypal'];

				if (
					rate &&
					!excludedPlatforms.includes(rate.changer_code) &&
					(rate.price_buy > 0 || rate.price_sell > 0)
				) {
					return { rate, changer };
				}
				return null;
			})
			.filter((item): item is { rate: PairChanger; changer: Changer } => item !== null)
			.filter((item) => (useBuying ? item.rate.price_buy > 0 : item.rate.price_sell > 0));

		if (sortDesc === null) {
			return platformRates;
		}

		const priceCompare = (a: ChangerRate, b: ChangerRate) => {
			const price1 = useBuying ? a.rate.price_buy : a.rate.price_sell;
			const price2 = useBuying ? b.rate.price_buy : b.rate.price_sell;
			return sortDesc ? price2 - price1 : price1 - price2;
		};

		return platformRates.sort(priceCompare);
	}

	if (total > 0) {
		try {
			if (groupRates.allRates && groupRates.allRates.length > 0) {
				newResult = findSupportedPlatforms(
					getNewestProviders,
					groupRates.allRates,
					null,
					false
				).slice(0, 5);
			}

			if (groupRates.remittance && groupRates.remittance.length > 0) {
				sendingResult = findSupportedPlatforms(providers, groupRates.remittance, true, false).slice(
					0,
					5
				);
			}
			if (groupRates.ramp && groupRates.ramp.length > 0) {
				buyingResult = findSupportedPlatforms(providers, groupRates.ramp, false, true).slice(0, 5);
				sellingResult = findSupportedPlatforms(providers, groupRates.ramp, true, false).slice(0, 5);
			}
			if (groupRates.card && groupRates.card.length > 0) {
				fundingResult = findSupportedPlatforms(providers, groupRates.card, false, true).slice(0, 5);
			}
		} catch (error) {
			console.error('Results processing error:', error);
		}
	}

	function toggleHighlights(event: Event) {
		let toggle = event.target as HTMLInputElement;
		if (toggle.checked) {
			showHighlights = true;
			if (!isMobile && localStorage) {
				localStorage.setItem('showHighlights', 'true');
			}
		} else {
			showHighlights = false;
			if (!isMobile && localStorage) {
				localStorage.setItem('showHighlights', 'false');
			}
		}
	}

	onMount(() => {
		if (!isMobile && localStorage) {
			if (localStorage.getItem('showHighlights') === 'true') {
				showHighlights = true;
			} else if (localStorage.getItem('showHighlights') === 'false') {
				showHighlights = false;
			}
		}
	});
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

<div class="bg-white dark:bg-gray-800">
	<div class="container">
		<!-- Landscape Top/Bottom -->
		<div class="cedar-money">
			<a href="https://bit.ly/3MDsvBi" target="_blank">
				<picture>
					<source srcset="/media/banners/cedar-homepage-2.avif?v=1" type="image/avif" />
					<source srcset="/media/banners/cedar-homepage-2.gif?v=1" type="image/gif" />

					<img
						src="/media/banners/cedar-homepage-2.avif?v=1"
						alt="Cedar Money"
						width="800px"
						height="114px"
						class="mx-auto max-w-full md:w-[800px] md:h-[114px]"
					/>
				</picture>
			</a>
		</div>
	</div>
</div>

<div class="container px-0">
	<h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100">
		Today's dollar to naira rates on exchanges
	</h1>
	<div class="text-gray-600 font-normal dark:text-gray-300">
		<p>
			Compare the prices of dollar to naira from {total} exchange providers.
		</p>
	</div>

	<!-- Highlight Toggle -->
	<div class="flex justify-end items-center mb-6">
		<label class="inline-flex items-center cursor-pointer">
			<span class="mr-2 text-sm text-gray-600 dark:text-gray-400">Highlight</span>
			<input
				type="checkbox"
				value=""
				class="sr-only peer"
				on:change={toggleHighlights}
				bind:checked={showHighlights}
			/>
			<div
				class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			/>
		</label>
	</div>

	{#if showHighlights}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<!--New-->
			{#if newResult.length > 0}
				<div
					class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
				>
					<div class="flex justify-between items-center mb-4">
						<span
							class="block text-[0.8em] md:text-[1em] font-semibold text-gray-800 dark:text-white"
						>
							🔥 New Listing
						</span>
					</div>
					{#each newResult as { rate, changer }}
						<ul>
							<li class="flex justify-between text-sm text-gray-800 dark:text-gray-200 mb-2">
								<a
									href="/converter/{rate.changer_code}?Amount=1&From=usd&To=ngn"
									class="flex items-center"
									title="{changer.name} dollar to naira rate."
								>
									<span class="changer-icon-sm">
										<picture>
											<source srcset="/icons/svg/{rate.changer_code}.svg" type="image/svg+xml" />
											<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
											<img
												width="16px"
												height="16px"
												src="/icons/svg/{rate.changer_code}.svg"
												class="rounded-full"
												alt="{changer.name} icon"
											/>
										</picture>
									</span>
									<span class="text-gray-500 dark:text-gray-300 text-sm">{changer.name}</span>
								</a>
								<div>
									<span class="text-sm">
										{#if Math.round(rate.price_buy) !== 0}
											₦ {Math.round(rate.price_buy)}
										{:else if Math.round(rate.price_sell) !== 0}
											₦ {Math.round(rate.price_sell)}
										{:else}
											-
										{/if}
									</span>
									<small class="changer-rate-base">per $1</small>
								</div>
							</li>
						</ul>
					{/each}
				</div>
			{/if}

			<!--BUYING-->
			{#if buyingResult.length > 0}
				<div
					class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
				>
					<div class="flex justify-between items-center mb-4">
						<span
							class="block text-[0.8em] md:text-[1em] font-semibold text-gray-800 dark:text-white"
						>
							🔥 Best Buying Rate
						</span>
						<a href="/buy/usd-with-ngn-best-buying-rate" class="text-sm">See more</a>
					</div>
					{#each buyingResult as { rate, changer }}
						<ul>
							<li class="flex justify-between text-sm text-gray-800 dark:text-gray-200 mb-2">
								<a
									href="/converter/{rate.changer_code}?Amount=1&From=usd&To=ngn"
									class="flex items-center"
									title="{changer.name} dollar to naira rate."
								>
									<span class="changer-icon-sm">
										<picture>
											<source srcset="/icons/svg/{rate.changer_code}.svg" type="image/svg+xml" />
											<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
											<img
												width="16px"
												height="16px"
												src="/icons/svg/{rate.changer_code}.svg"
												class="rounded-full"
												alt="{changer.name} icon"
											/>
										</picture>
									</span>
									<span class="text-gray-500 dark:text-gray-300 text-sm">{changer.name}</span>
								</a>
								<div>
									<span class="text-sm">
										{#if Math.round(rate.price_buy) === 0}
											-
										{:else}
											₦ {Math.round(rate.price_buy)}
										{/if}
									</span>
									<small class="changer-rate-base">per $1</small>
								</div>
							</li>
						</ul>
					{/each}
				</div>
			{/if}

			<!--SELLING-->
			{#if sellingResult.length > 0}
				<div
					class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
				>
					<div class="flex justify-between items-center mb-4">
						<span
							class="block text-[0.8em] md:text-[1em] font-semibold text-gray-800 dark:text-white"
						>
							🔥 Best Selling Rate
						</span>
						<a href="/sell/usd-get-ngn-best-selling-rate" class="text-sm">See more</a>
					</div>
					{#each sellingResult as { rate, changer }}
						<ul>
							<li class="flex justify-between text-sm text-gray-800 dark:text-gray-200 mb-2">
								<a
									href="/converter/{rate.changer_code}?Amount=1&From=usd&To=ngn"
									class="flex items-center"
									title="{changer.name} dollar to naira rate."
								>
									<span class="changer-icon-sm">
										<picture>
											<source srcset="/icons/svg/{rate.changer_code}.svg" type="image/svg+xml" />
											<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
											<img
												width="16px"
												height="16px"
												src="/icons/svg/{rate.changer_code}.svg"
												class="rounded-full"
												alt="{changer.name} icon"
											/>
										</picture>
									</span>
									<span class="text-gray-500 dark:text-gray-300 text-sm">{changer.name}</span>
								</a>
								<div>
									<span class="text-sm">
										{#if Math.round(rate.price_sell) === 0}
											-
										{:else}
											₦ {Math.round(rate.price_sell)}
										{/if}
									</span>
									<small class="changer-rate-base">per $1</small>
								</div>
							</li>
						</ul>
					{/each}
				</div>
			{/if}

			<!--SENDING-->
			{#if sendingResult.length > 0}
				<div
					class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
				>
					<div class="flex justify-between items-center mb-4">
						<span
							class="block text-[0.8em] md:text-[1em] font-semibold text-gray-800 dark:text-white"
						>
							🔥 Best Sending Rate
						</span>
						<a href="/send/usd-to-ng-best-rate" class="text-sm">See more</a>
					</div>

					{#each sendingResult as { rate, changer }}
						<ul>
							<li class="flex justify-between text-sm text-gray-800 dark:text-gray-200 mb-2">
								<a
									href="/converter/{rate.changer_code}?Amount=1&From=usd&To=ngn"
									class="flex items-center"
									title="{changer.name} dollar to naira rate."
								>
									<span class="changer-icon-sm">
										<picture>
											<source srcset="/icons/svg/{rate.changer_code}.svg" type="image/svg+xml" />
											<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
											<img
												width="16px"
												height="16px"
												src="/icons/svg/{rate.changer_code}.svg"
												class="rounded-full"
												alt="{changer.name} icon"
											/>
										</picture>
									</span>
									<span class="text-gray-500 dark:text-gray-300 text-sm">{changer.name}</span>
								</a>
								<div>
									<span class="text-sm">
										{#if Math.round(rate.price_sell) === 0}
											-
										{:else}
											₦ {Math.round(rate.price_sell)}
										{/if}
									</span>
									<small class="changer-rate-base">per $1</small>
								</div>
							</li>
						</ul>
					{/each}
				</div>
			{/if}

			<!--FUNDING-->
			{#if fundingResult.length > 0}
				<div
					class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:hidden"
				>
					<div class="flex justify-between items-center mb-4">
						<span
							class="block text-[0.8em] md:text-[1em] font-semibold text-gray-800 dark:text-white"
						>
							🔥 Best Card Rate
						</span>
						<a href="/card/usd-ngn-best-funding-rate" class="text-sm">See more</a>
					</div>
					{#each fundingResult as { rate, changer }}
						<ul>
							<li class="flex justify-between text-sm text-gray-800 dark:text-gray-200 mb-2">
								<a
									href="/converter/{rate.changer_code}?Amount=1&From=usd&To=ngn"
									class="flex items-center"
									title="{changer.name} dollar to naira rate."
								>
									<span class="changer-icon-sm">
										<picture>
											<source srcset="/icons/svg/{rate.changer_code}.svg" type="image/svg+xml" />
											<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
											<img
												width="16px"
												height="16px"
												src="/icons/svg/{rate.changer_code}.svg"
												class="rounded-full"
												alt="{changer.name} icon"
											/>
										</picture>
									</span>
									<span class="text-gray-500 dark:text-gray-300 text-sm">{changer.name}</span>
								</a>
								<div>
									<span class="text-sm">
										{#if Math.round(rate.price_buy) === 0}
											-
										{:else}
											₦ {Math.round(rate.price_buy)}
										{/if}
									</span>
									<small class="changer-rate-base">per $1</small>
								</div>
							</li>
						</ul>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<div class="pt-4 mb-4">
	<div class="container">
		<div class="flex justify-between items-center dark:text-gray-300 mb-4">
			<span />
			<span class="text-right">
				<span class="text-semibold">Sort by:</span>
				<span class="font-semibold">Low to high</span>
			</span>
		</div>
		<div class="md:flex justify-between items-center dark:text-gray-300">
			<span />
			<span class="text-right">
				<label class="relative block">
					<span class="sr-only">Search</span>
					<input
						bind:value={searchTerm}
						class="placeholder:italic placeholder:text-slate-400 block bg-white dark:bg-gray-900 w-full border border-gray-200 dark:border-gray-500 rounded-lg py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
						placeholder="Search providers..."
						type="text"
						name="search"
					/>
				</label>
			</span>
		</div>
	</div>
</div>

<!--<div class="bg-white dark:bg-gray-800">
    <div class="container">
        <div class="pst-net">
            <a href="https://tinyurl.com/mpz2jv3t" target="_blank">
                <img 
                    src="https://ik.imagekit.io/monierate/partners/pst.gif"
                    alt="PST NET Virtual Cards"
                    class="mx-auto max-w-full md:w-[800px] md:h-[114px]">
            </a>
        </div>
    </div>
</div>-->

<main>
	<div class="w-full">
		<div
			class="container border border-none bg-white py-[10px] mb-16 dark:bg-gray-900 dark:text-light dark:border-none w-full overflow-x-scroll md:overflow-x-hidden overflow-y-scroll md:overflow-y-hidden"
		>
			<table class="table-auto overflow-x-scroll overflow-y-scroll w-full text-sm text-left">
				<thead>
					<tr>
						<th scope="col" class="pr-4 py-3 md:pl-4 font-bitter hidden md:inline-block"> # </th>
						<th scope="col" class="py-3 pl-2 md:pl-6 md:pl-0 font-bold font-bitter"> Provider </th>
						<th scope="col" class="pl-16 md:pl-6 pr-6 py-3 font-bold font-bitter text-right">
							Buy <span class="hidden md:inline">Price</span>
						</th>
						<th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-right">
							Sell <span class="hidden md:inline">Price</span>
						</th>
						<th
							scope="col"
							class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 whitespace-nowrap"
						>
							Last updated
						</th>
					</tr>
				</thead>
				<tbody class="changers">
					{#each filteredRates as rate, i}
						{#if rate.changer_code !== 'market' && rate.changer_code !== 'binance'}
							<tr class="py-32 mb-4 border-t border-gray-150 dark:border-gray-800">
								<th scope="row" class="text-gray-500 py-6 pl-4 hidden md:inline-block">
									{i + 1}
								</th>
								<td>
									<a
										href="/converter/{rate.changer_code}?Amount=1&From=USD&To=NGN"
										class="flex items-center"
										title="{providers[rate.changer_code].name} dollar to naira rate."
									>
										<span class="changer-icon">
											<picture>
												<source srcset="/icons/svg/{rate.changer_code}.svg" type="image/svg+xml" />
												<source srcset="/icons/png/{rate.changer_code}.png" type="image/png" />
												<img
													width="22px"
													height="22px"
													src="/icons/svg/{rate.changer_code}.svg"
													class=""
													alt="{providers[rate.changer_code].name} icon"
												/>
											</picture>
										</span>
										<span class="changer-title">{providers[rate.changer_code].name}</span>
									</a>
								</td>
								<td class="text-right pl-6 pr-6">
									<span class="changer-rate">
										{#if Math.round(rate.price_buy) === 0}
											-
										{:else}
											₦{Math.round(rate.price_buy)}
										{/if}
									</span>
									<small class="changer-rate-base">per $1</small>
								</td>
								<td class="text-right pl-6 pr-6">
									<span class="changer-rate">
										{#if Math.round(rate.price_sell) === 0}
											-
										{:else}
											₦{Math.round(rate.price_sell)}
										{/if}
									</span>
									<small class="changer-rate-base">per $1</small>
								</td>
								<td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap">
									{friendlyDate(new Date(rate.updated_at))}
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>

		<div class="container dark:text-gray-300">
			<span class="block mb-4">
				<h2>What is a Provider?</h2>
				<p>
					A provider is an entity that helps facilitate the exchange of currencies. If you have 100
					USDT and want to exchange it for naira, you will need an exchange provider to convert your
					USDT to naira. A provider can be an individual or entity. On Monierate, we only list
					trusted entities for you to choose from, not individual traders.
				</p>
			</span>
			<span class="block mb-4">
				<h3>What is Buy Price?</h3>
				<p>
					The buy price is the rate at which you pay to convert naira to dollars. It represents how
					much naira you're paying for every dollar obtained. For instance, if you have naira but
					need USDT to pay a bill, you exchange your naira for USDT, and the provider credits USDT
					to you at the buy price.
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
					high. If you have USDT but need naira, they buy the USDT from you at a lower naira price
					and sell it at a higher naira price to someone else who needs USDT.
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
							You can use Monierate to obtain daily information on the exchange rate of the dollar to
							naira.
						</p>
					</li>
					<li class="mb-2">
						<p>
							<strong>Order Arrangement:</strong>
							Prices are presented by default from the lowest to the highest, allowing You to easily
							identify the most cost-effective rates.
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
					In essence, we simplifies the process of finding the most favorable dollar exchange rates
					in Nigeria by providing a user-friendly platform for comparison and real-time rate
					tracking.
				</p>
			</span>
		</div>
	</div>
</main>

<style>
	table thead th {
		@apply dark:text-gray-300 text-black whitespace-nowrap;
	}
	table tbody tr td {
		@apply py-2.5 whitespace-nowrap;
	}
	table tr td:first-child,
	table thead th:first-child {
		@apply pl-0;
	}

	.changer {
		@apply flex justify-between items-center py-2 border-b border-gray-200;
	}
	.changer:last-child {
		@apply border-b-0;
	}
	.changer-icon {
		@apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
	}
	.changer-icon-sm {
		@apply bg-transparent border border-black rounded-full w-[16px] h-[16px] mr-2;
	}
	.changer-title {
		@apply font-semibold text-sm md:text-lg whitespace-nowrap text-gray-800 dark:text-gray-300;
	}
	.changer-rate-base {
		@apply text-gray-500 dark:text-gray-400;
	}
	.changer-rate {
		@apply block font-semibold text-sm md:text-lg whitespace-nowrap text-gray-800 dark:text-light;
	}
</style>
