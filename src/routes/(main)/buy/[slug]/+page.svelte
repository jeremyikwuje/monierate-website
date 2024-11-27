<script lang="ts">
	import type { PageData } from './$types';
	import { round, chain } from 'mathjs';
	import { changePath, scrollToSection } from '$lib/functions';
	import Money from '$lib/money';
	import { onMount } from 'svelte';

	export let data: PageData;

	interface Changer {
		code: string;
		name: string;
		link: string;
	}

	interface PairChanger {
		changer_code: string;
		price_buy: number;
		price_sell: number;
		updated_at: string;
	}

	interface Currency {
		code: string;
		name: string;
		symbol?: string;
	}

	interface ConversionResult {
		rate: number;
		rate_inverse: number;
		conversion: number;
		platform_rates: PlatformRate[];
	}

	interface PlatformRate {
		platform: Changer;
		rate: number;
		will_receive: number;
		fees: number;
		net_amount: number;
	}

	let isLoading = true;
	let hasResults = false;
	let convertFromInput = 'USD';
	let convertToInput = 'NG';
	let changers: Record<string, Changer> = data.changers || {};
	let pairChangers: PairChanger[] = data.pair_changers || {};
	let pairs = data.pairs || [];
	let currencies: Currency[] = data.currencies || [];
	let convertAmount = 1;
	$: convert = data.convert || { From: 'USD', To: 'NGN', Amount: 1 };
	$: countryToName = data.countryToName || 'Nigeria';
	$: countries = data.countries;
	$: convertFrom = convert.From?.toUpperCase().trim();
	$: convertTo = convert.To?.toUpperCase().trim();

	$: currencyFrom = currencies.find((c) => c.code.toUpperCase() === convertFrom) || {
		code: convertFrom,
		name: convertFrom,
		symbol: convertFrom
	};
	$: currencyTo = currencies.find((c) => c.code.toUpperCase() === convertTo) || {
		code: convertTo,
		name: convertTo,
		symbol: convertTo
	};

	// Conversion result with default values
	let convertResult: ConversionResult = {
		rate: 1,
		rate_inverse: 1,
		conversion: convertAmount,
		platform_rates: []
	};

	async function getPairChangers(
			pair_code: string,
			changer_service: string
	) {
		const response = await fetch(
				`/api/pairs/changers?pair_code=${pair_code}&changer_service=${changer_service}`
		);
		const changers = await response.json();

		pairChangers = changers;

		return changers;
	}

	function findSupportedPlatforms(): PlatformRate[] {
		const from = convertFrom.toLowerCase();
		const to = convertTo.toLowerCase();
		let platform_rates: PlatformRate[] = [];

		try {
			Object.values(pairChangers).forEach((changer_rate) => {

				if (changer_rate.price_sell > 0) {
					const rate = changer_rate.price_sell;
					const conversion = round(chain(rate).multiply(convertAmount).done(), 2);

					const fee_percentage = 0.02; // 2% fee
					const fees = round(conversion * fee_percentage, 2);
					const net_amount = round(conversion - fees, 2);

					platform_rates.push({
						platform: changers[changer_rate.changer_code],
						rate: rate,
						will_receive: conversion,
						fees: fees,
						net_amount: net_amount
					});
				}
			});
		} catch (error) {
			console.error('Error finding platforms:', error);
		}

		return platform_rates.sort((a, b) => b.net_amount - a.net_amount);
	}

	$: {
		isLoading = true;
		hasResults = false;

		try {
			if (convertFrom && convertTo) {
				let rate = 1;
				let rate_inverse = 1;

				if (convertFrom !== convertTo) {
					const pair_code = `${convertFrom.toLowerCase()}${convertTo.toLowerCase()}`;
					const inversePair_code = `${convertTo.toLowerCase()}${convertFrom.toLowerCase()}`;

					let pair = pairs.find((p: any) => p?.code === pair_code);

					if (pair) {
						rate = pair.price?.current || 1;
						rate_inverse = 1 / rate;
					} else {
						pair = pairs.find((p: any) => p?.code === inversePair_code);
						if (pair) {
							rate_inverse = pair.price?.current || 1;
							rate = 1 / rate_inverse;
						}
					}
				}

				convertResult.rate = rate;
				convertResult.rate_inverse = rate_inverse;
				convertResult.conversion = round(chain(rate).multiply(convertAmount).done(), 8);

				// Update platform rates
				convertResult.platform_rates = findSupportedPlatforms();
				hasResults = convertResult.platform_rates && convertResult.platform_rates.length > 0;
			}
		} catch (error) {
			console.error('Conversion calculation error:', error);
		}
		finally {
			// Only hide loading after we've determined if we have results
			setTimeout(() => {
				isLoading = false;
			}, 300);
		}
	}

	// URL pathname update function
	async function updateUrlPath() {
		try {
			isLoading = true;
			changePath(
				`/buy/${convertFromInput.toLowerCase()}-from-${convertToInput.toLowerCase()}-best-rate`
			);
		} catch (error) {
			console.error('URL update error:', error);
		}
	}

	let getInputValue = convertAmount;
	async function handleAmountChange(event: Event) {
		try {
			const target = event.target as HTMLInputElement;
			const inputValue = target.value.trim();

			if (inputValue !== '') {
				const newAmount = parseFloat(inputValue);
				convertAmount = isNaN(newAmount) || newAmount <= 0 ? 1 : newAmount;
				getInputValue = newAmount;
			} else {
				getInputValue = 0;
			}

			await updateUrlPath();
		} catch (error) {
			console.error('Amount change error:', error);
		}
	}

	async function handleCurrencyChange(type: any) {
		scrollToSection('convert-section');
		await updateUrlPath();
	}

	onMount(async () => {
		try {
			if (window) {
				const [currencyFromCode, _, countryToCode] = window.location.pathname
					.replace('/buy/', '')
					.split('-');
				convertFromInput = currencyFromCode.toUpperCase();
				convertToInput = countryToCode.toUpperCase();
			}
		} catch (error) {
			console.log('There was an error set initial input values:', error);
		}

		// referesh the pair changers rate every 10 minutes
		setInterval(() => {
			getPairChangers(`${convertFrom}${convertTo}`, 'ramp');
		}, 60000 * 10);
	});
</script>

<svelte:head>
	<title>
		{convertFrom} in {convertTo}
		- Compare & Buy {currencyFrom?.name}
	</title>
	<meta
		name="description"
		content="Convert {currencyFrom.name} in {currencyTo.name} on Monierate. This is the average exchange rate price of {currencyFrom.name} to {currencyTo.name} in the market right now. It is for information purposes only."
	/>
	<meta
		name="keywords"
		content="{currencyFrom.name} in {currencyTo.name}, {currencyFrom.name} to {currencyTo.name} exchange rate, {currencyFrom.name} to {currencyTo.name} black market, {currencyFrom.name} to {currencyTo.name} rate, {currencyFrom.name} to {currencyTo.name} converter."
	/>

	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content="{convertFrom} in {convertTo} - Compare & Send {currencyFrom?.name} to {currencyTo?.name}"
	/>
	<meta
		property="og:description"
		content="Convert {currencyFrom.name} in {currencyTo.name} on Monierate. Enter any amount in {convertFrom} to see the conversion in {convertTo}."
	/>
</svelte:head>

<div class="bg-white dark:bg-gray-800">
	<div class="container">
		<!-- Landscape Top/Bottom -->
		<div class="cedar-money">
			<a href="https://bit.ly/3zfhZgz" target="_blank">
				<picture>
					<source srcset="/media/banners/cedar-converter.avif" type="image/avif" />
					<source srcset="/media/banners/cedar-converter.gif" type="image/gif" />

					<img
						src="/media/banners/cedar-converter.avif"
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

<div class="mb-24">
	<div class="container mb-4 text-center">
		<h1 class="text-2xl md:text-4xl">
			Buy {convertFrom} | Compare the best rate to buy {currencyFrom?.name} in {countryToName}
		</h1>
	</div>

	<div id="changer-rate-wrapper" class="section">
		<div class="flex justify-center item-center">
			<div class="w-full">
				<div class="block md:flex md:justify-between md:items-center">
					<span class="block md:w-[30%]">
						<label class="label" for="field-convert-from">You Buy</label>
						<select
							id="field-convert-from"
							class="select"
							bind:value={convertFromInput}
							on:change={handleCurrencyChange}
						>
							{#each currencies as currency}
								<option value={currency.code.toUpperCase()}>
									{currency.code.toUpperCase()} - {currency.name}
								</option>
							{/each}
						</select>
					</span>
					<span class="block md:w-[30%]">
						<label class="label" for="field-convert-to">You Pay</label>
						<select
							id="field-convert-to"
							class="select"
							bind:value={convertToInput}
							on:change={handleCurrencyChange}
						>
							{#each Object.entries(countries) as [countryCode, country]}
								<option value={countryCode.toUpperCase()}>
									{country}
								</option>
							{/each}
						</select>
					</span>
					<span class="block md:w-[30%]">
						<label class="label" for="field-convert-amount">Amount</label>
						<span class="input">
							<input
								type="number"
								id="field-convert-amount"
								class="bg-transparent border-none focus:border-none focus:outline-none focus:ring-0"
								value={convertAmount}
								on:input={handleAmountChange}
								step="0.01"
								min="0.01"
							/>
							{convertFrom}
						</span>
					</span>
				</div>
			</div>
		</div>
	</div>

	<!--FOR ACCURATE SCROLL PURPOSE-->
	<span id="convert-section" />
	<!------------------------------->
</div>

{#if getInputValue > 0 && convertFrom !== convertTo}
	<!-- Platforms Table -->
	<div class="container p-0">
		{#if isLoading}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<div class="flex flex-col items-center justify-center p-8">
					<div class="loader" />
					<p class="text-gray-600 dark:text-gray-400 mt-4">Loading exchange rates...</p>
				</div>
			</div>
		{:else if !hasResults}
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			>
				<div class="text-center p-8">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
						No Data Available
					</h3>
					<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
						No platform rates available for converting {convertFrom} to {convertTo}.
					</p>
				</div>
			</div>
		{:else}
			{#each convertResult.platform_rates as platformRate}
				<div class="container mx-auto p-4">
					<div
						class="flex flex-wrap gap-4 px-8 py-4 w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg"
					>
						<div class="flex-1 min-w-full md:min-w-[30%] md:flex md:items-center md:justify-start">
							<div class="flex justify-start items-center">
								<a href={platformRate.platform.link}>
									<img
										src="/icons/svg/{platformRate.platform.code}.svg"
										alt="{platformRate.platform.name} icon"
										class="h-12 mr-2 rounded-full"
									/>
								</a>
								<a
									href={platformRate.platform.link}
									class="text-gray-600 dark:text-gray-300 hover:underline text-lg"
								>
									{platformRate.platform.name}
								</a>
							</div>
						</div>
						<div class="flex-1 min-w-full md:min-w-[30%]">
							<div class="text-left">
								<span class="block text-sm">{convertAmount} {convertFromInput.toUpperCase()} =</span
								>
								<span class="block text-4xl text-gray-800 dark:text-gray-200 py-3">
									{Money.formatMoney(platformRate.will_receive)}
									{currencyTo?.symbol || convertTo}
								</span>
								<span class="block text-sm">
									<span class="pr-3">
										Indicative Rate 
									</span>
									1 {convertFromInput.toUpperCase()} =
									{Money.formatMoney(platformRate.rate, 2)}
									{currencyTo?.symbol || convertTo}
								</span>
							</div>
						</div>
						<div
							class="flex-1 min-w-full md:min-w-[30%] md:text-right md:flex md:items-center md:justify-end"
						>
							<div>
								<a
									href={platformRate.platform.link}
									class="block button w-full md:inline-block md:w-auto mr-4 mb-4 text-center"
								>
									Buy {convertFrom} now
								</a>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
{/if}

<style>
	.loader {
		width: 48px;
		height: 48px;
		border: 5px solid #f3f3f3;
		border-top: 5px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.section {
		@apply w-[95%] md:w-[70%] bg-white dark:bg-gray-900 shadow-lg rounded-lg px-8 py-6 mx-auto;
	}
</style>
