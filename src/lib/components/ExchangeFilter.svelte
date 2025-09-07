<script lang="ts">
	import { setUrlParam } from '$lib/functions';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let search: string = '';
	export let onSearch: (a: any) => void = () => {};
	export let selectedCurrency = 'USD';
	export let onChangeCurrency: (currency: any) => void = () => {};
	export let selectedCategory = '/';
	export let disableSearch: boolean = false;

	let currencies = ['USD', 'USDT', 'BTC', 'EUR', 'GBP', 'CAD', 'USDC'];

	$: parseCurrencyInUrl =
		selectedCurrency && selectedCurrency !== 'USD' ? `?currency=${selectedCurrency}` : '';

	function handleClick(event: MouseEvent) {
		event.preventDefault();

		// Get the link (href) from the clicked anchor
		const target = event.currentTarget as HTMLAnchorElement;
		const href = target.href;

		// Convert full URL to relative path (optional)
		const url = new URL(href);
		const relativePath = url.pathname + url.search;

		goto(relativePath, { noScroll: true, keepFocus: true });
	}

	let currencyTabContainer: HTMLDivElement;
	let showCurrencyTabLeftScrollButton: boolean = false;
	let showCurrencyTabRightScrollButton: boolean = false;

	function checkCurrencyTabScroll() {
		if (!currencyTabContainer) return;

		const tolerance = 1; // buffer for rounding errors
		showCurrencyTabLeftScrollButton = currencyTabContainer.scrollLeft > tolerance;
		showCurrencyTabRightScrollButton =
			currencyTabContainer.scrollLeft + currencyTabContainer.clientWidth <
			currencyTabContainer.scrollWidth - tolerance;
	}

	function currencyTabScrollByLeft(amount = 150) {
		currencyTabContainer.scrollBy({ left: -amount, behavior: 'smooth' });
	}

	function currencyTabScrollByRight(amount = 150) {
		currencyTabContainer.scrollBy({ left: amount, behavior: 'smooth' });
	}

	let categoryTabContainer: HTMLDivElement;
	let showCategoryTabLeftScrollButton: boolean = false;
	let showCategoryTabRightScrollButton: boolean = false;

	function checkCategoryTabScroll() {
		if (!categoryTabContainer) return;

		const tolerance = 1; // buffer for rounding errors
		showCategoryTabLeftScrollButton = categoryTabContainer.scrollLeft > tolerance;
		showCategoryTabRightScrollButton =
			categoryTabContainer.scrollLeft + categoryTabContainer.clientWidth <
			categoryTabContainer.scrollWidth - tolerance;
	}

	function categoryTabScrollByLeft(amount = 150) {
		categoryTabContainer.scrollBy({ left: -amount, behavior: 'smooth' });
	}

	function categoryTabScrollByRight(amount = 150) {
		categoryTabContainer.scrollBy({ left: amount, behavior: 'smooth' });
	}

	onMount(() => {
		try {
			checkCurrencyTabScroll();
			currencyTabContainer.addEventListener('scroll', checkCurrencyTabScroll);
			window.addEventListener('resize', checkCurrencyTabScroll);
		} catch (error) {
			console.error('Error setting up scroll listeners:', error);
		}

		try {
			checkCategoryTabScroll();
			categoryTabContainer.addEventListener('scroll', checkCategoryTabScroll);
			window.addEventListener('resize', checkCategoryTabScroll);
		} catch (error) {
			console.error('Error setting up scroll listeners:', error);
		}

		return () => {
			try {
				currencyTabContainer.removeEventListener('scroll', checkCurrencyTabScroll);
				window.removeEventListener('resize', checkCurrencyTabScroll);
			} catch (error) {
				console.error('Error removing scroll listeners:', error);
			}

			try {
				categoryTabContainer.removeEventListener('scroll', checkCategoryTabScroll);
				window.removeEventListener('resize', checkCategoryTabScroll);
			} catch (error) {
				console.error('Error removing scroll listeners:', error);
			}
		};
	});
</script>

<!-- Top Section: Currency Tabs + Search on desktop -->
<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
	<!-- Currency Tabs (scrollable) -->
	<div class="relative">
		{#if showCurrencyTabLeftScrollButton}
			<span
				class="absolute -left-1 top-1/2 -translate-y-1/2 h-full pl-2 pr-4 bg-gradient-to-r from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
			>
				<button
					class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
					on:click={() => currencyTabScrollByLeft()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 text-gray-700 dark:text-gray-200"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
					</svg>
				</button>
			</span>
		{/if}

		<div bind:this={currencyTabContainer} class="overflow-x-auto no-scrollbar scroll-smooth">
			<div class="flex flex-nowrap gap-2 bg-gray-100 dark:bg-gray-900 rounded-md p-1 min-w-max">
				{#each currencies as currency}
					<button
						class={`px-3 py-1 rounded text-sm whitespace-nowrap ${
							selectedCurrency === currency
								? 'bg-white dark:bg-gray-700 shadow font-medium'
								: 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
						}`}
						on:click={async () => {
							selectedCurrency = currency;
							onChangeCurrency(currency);
							setUrlParam('currency', currency);
						}}
					>
						{currency}
					</button>
				{/each}
			</div>
		</div>

		{#if showCurrencyTabRightScrollButton}
			<span
				class="absolute -right-1 top-1/2 -translate-y-1/2 h-full pl-4 pr-2 bg-gradient-to-l from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
			>
				<button
					class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
					on:click={() => currencyTabScrollByRight()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6 text-gray-700 dark:text-gray-200"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
					</svg>
				</button>
			</span>
		{/if}
	</div>

	{#if !disableSearch}
		<!-- Search (desktop only) -->
		<div
			class="hidden md:flex relative items-center rounded-md shadow-sm bg-white dark:bg-gray-900 border dark:border-gray-700 px-3 py-2 w-full md:w-72"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6 mr-2 text-gray-400"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>

			<input
				type="text"
				class="flex-1 outline-none text-sm text-gray-700 dark:text-gray-200 bg-transparent"
				placeholder="Search providers..."
				on:input={onSearch}
				bind:value={search}
				id="search"
			/>
		</div>
	{/if}
</div>

<!-- Category Tabs -->
<div class="relative">
	{#if showCategoryTabLeftScrollButton}
		<span
			class="absolute -left-1 top-1/2 -translate-y-1/2 h-full pl-2 pr-4 bg-gradient-to-r from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
		>
			<button
				class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
				on:click={() => categoryTabScrollByLeft()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6 text-gray-700 dark:text-gray-200"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>
			</button>
		</span>
	{/if}

	<div
		class="overflow-x-auto no-scrollbar mt-4 border-b border-gray-200 dark:border-gray-700 pb-2"
		bind:this={categoryTabContainer}
	>
		<div class="flex flex-nowrap gap-4 min-w-max px-1">
			<a
				href="/{parseCurrencyInUrl}"
				class={`category-link ${selectedCategory === '/' ? 'active' : 'normal'}`}
				on:click={handleClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
						clip-rule="evenodd"
					/>
				</svg>

				All
			</a>

			<a
				href="/highlights{parseCurrencyInUrl}"
				class={`category-link ${selectedCategory === '/highlights' ? 'active' : 'normal'}`}
				on:click={handleClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						fill-rule="evenodd"
						d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
						clip-rule="evenodd"
					/>
				</svg>

				Highlights
			</a>

			<a
				href="/offramp-rates{parseCurrencyInUrl}"
				class={`category-link ${selectedCategory === '/offramp-rates' ? 'active' : 'normal'}`}
				on:click={handleClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
					/>

					<path stroke-linecap="round" stroke-linejoin="round" d="M12 13v8m0 0l-3-3m3 3l3-3" />
				</svg>

				Offramp
			</a>

			<a
				href="/bank-rates{parseCurrencyInUrl}"
				class={`category-link ${selectedCategory === '/bank-rates' ? 'active' : 'normal'}`}
				on:click={handleClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						d="M14.916 2.404a.75.75 0 0 1-.32 1.011l-.596.31V17a1 1 0 0 1-1 1h-2.26a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5H2V9.957a.75.75 0 0 1-.596-1.372L2 8.275V5.75a.75.75 0 0 1 1.5 0v1.745l10.404-5.41a.75.75 0 0 1 1.012.319ZM15.861 8.57a.75.75 0 0 1 .736-.025l1.999 1.04A.75.75 0 0 1 18 10.957V16.5h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75V9.21a.75.75 0 0 1 .361-.64Z"
					/>
				</svg>

				Banks
			</a>

			<a
				href="/money-transfer-rate{parseCurrencyInUrl}"
				class={`category-link ${selectedCategory === '/money-transfer-rate' ? 'active' : 'normal'}`}
				on:click={handleClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="size-5"
				>
					<path
						d="M10.75 10.818v2.614A3.13 3.13 0 0 0 11.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 0 0-1.138-.432ZM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 0 0-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152Z"
					/>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-6a.75.75 0 0 1 .75.75v.316a3.78 3.78 0 0 1 1.653.713c.426.33.744.74.925 1.2a.75.75 0 0 1-1.395.55 1.35 1.35 0 0 0-.447-.563 2.187 2.187 0 0 0-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 1 1-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 1 1 1.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 0 1-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 0 1 1.653-.713V4.75A.75.75 0 0 1 10 4Z"
						clip-rule="evenodd"
					/>
				</svg>

				Money Transfer
			</a>

			<!-- <a
			href="/crypto"
			class={`category-link ${selectedCategory === '/crypto' ? 'active' : 'normal'}`}
			on:click={handleClick}
		>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
  <path fill-rule="evenodd" d="M9.638 1.093a.75.75 0 0 1 .724 0l2 1.104a.75.75 0 1 1-.724 1.313L10 2.607l-1.638.903a.75.75 0 1 1-.724-1.313l2-1.104ZM5.403 4.287a.75.75 0 0 1-.295 1.019l-.805.444.805.444a.75.75 0 0 1-.724 1.314L3.5 7.02v.73a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .388-.657l1.996-1.1a.75.75 0 0 1 1.019.294Zm9.194 0a.75.75 0 0 1 1.02-.295l1.995 1.101A.75.75 0 0 1 18 5.75v2a.75.75 0 0 1-1.5 0v-.73l-.884.488a.75.75 0 1 1-.724-1.314l.806-.444-.806-.444a.75.75 0 0 1-.295-1.02ZM7.343 8.284a.75.75 0 0 1 1.02-.294L10 8.893l1.638-.903a.75.75 0 1 1 .724 1.313l-1.612.89v1.557a.75.75 0 0 1-1.5 0v-1.557l-1.612-.89a.75.75 0 0 1-.295-1.019ZM2.75 11.5a.75.75 0 0 1 .75.75v1.557l1.608.887a.75.75 0 0 1-.724 1.314l-1.996-1.101A.75.75 0 0 1 2 14.25v-2a.75.75 0 0 1 .75-.75Zm14.5 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-.388.657l-1.996 1.1a.75.75 0 1 1-.724-1.313l1.608-.887V12.25a.75.75 0 0 1 .75-.75Zm-7.25 4a.75.75 0 0 1 .75.75v.73l.888-.49a.75.75 0 0 1 .724 1.313l-2 1.104a.75.75 0 0 1-.724 0l-2-1.104a.75.75 0 1 1 .724-1.313l.888.49v-.73a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
</svg>

			Crypto
		</a> -->
		</div>
	</div>

	{#if showCategoryTabRightScrollButton}
		<span
			class="absolute -right-1 top-1/2 -translate-y-1/2 h-full pl-4 pr-2 bg-gradient-to-l from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
		>
			<button
				class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
				on:click={() => categoryTabScrollByRight()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6 text-gray-700 dark:text-gray-200"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</span>
	{/if}
</div>

{#if !disableSearch}
	<!-- Search (mobile only) -->
	<div class="md:hidden mt-4">
		<div
			class="relative flex items-center rounded-md shadow-sm bg-white dark:bg-gray-900 border dark:border-gray-700 px-3 py-2 w-full"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6 mr-2 text-gray-400"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>

			<input
				type="text"
				class="flex-1 outline-none text-sm dark:text-gray-200 bg-transparent"
				placeholder="Search providers..."
				on:input={onSearch}
				bind:value={search}
				id="search-mobile"
			/>
		</div>
	</div>
{/if}

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		scrollbar-width: none;
	}
	.category-link {
		@apply flex items-center gap-2 px-3 py-1 text-sm rounded whitespace-nowrap font-bold;
	}
	.category-link.active {
		@apply bg-blue-50 text-primary font-semibold;
	}
	.category-link.normal {
		@apply text-gray-500 dark:text-gray-300 hover:text-primary;
	}
</style>
