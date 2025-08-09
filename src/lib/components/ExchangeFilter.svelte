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

	let container: HTMLDivElement;
	let showLeft: boolean = false;
	let showRight: boolean = false;

	function checkScroll() {
		if (!container) return;

		const tolerance = 1; // buffer for rounding errors
		showLeft = container.scrollLeft > tolerance;
		showRight = container.scrollLeft + container.clientWidth < container.scrollWidth - tolerance;
	}

	function scrollLeftBy(amount = 150) {
		container.scrollBy({ left: -amount, behavior: 'smooth' });
	}

	function scrollRightBy(amount = 150) {
		container.scrollBy({ left: amount, behavior: 'smooth' });
	}

	onMount(() => {
		checkScroll();
		container.addEventListener('scroll', checkScroll);
		window.addEventListener('resize', checkScroll);

		return () => {
			container.removeEventListener('scroll', checkScroll);
			window.removeEventListener('resize', checkScroll);
		};
	});
</script>

<!-- Top Section: Currency Tabs + Search on desktop -->
<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
	<!-- Currency Tabs (scrollable) -->
	<div class="relative">
		{#if showLeft}
			<span
				class="absolute -left-1 top-1/2 -translate-y-1/2 h-full pl-2 pr-4 bg-gradient-to-r from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
			>
				<button
					class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
					on:click={() => scrollLeftBy()}
				>
					<i class="fa-solid fa-chevron-left text-gray-700 dark:text-gray-200" />
				</button>
			</span>
		{/if}

		<div bind:this={container} class="overflow-x-auto no-scrollbar scroll-smooth">
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

		{#if showRight}
			<span
				class="absolute -right-1 top-1/2 -translate-y-1/2 h-full pl-4 pr-2 bg-gradient-to-l from-white to-white/10 dark:from-gray-800 dark:to-gray-800/10 z-2"
			>
				<button
					class="relative -top-1 w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full bg-white/80 dark:bg-gray-800/80"
					on:click={() => scrollRightBy()}
				>
					<i class="fa-solid fa-chevron-right text-gray-700 dark:text-gray-200" />
				</button>
			</span>
		{/if}
	</div>

	{#if !disableSearch}
		<!-- Search (desktop only) -->
		<div
			class="hidden md:flex relative items-center rounded-md shadow-sm bg-white dark:bg-gray-900 border dark:border-gray-700 px-3 py-2 w-full md:w-72"
		>
			<i class="fa-solid fa-search mr-2 text-gray-400" />
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
<div class="overflow-x-auto no-scrollbar mt-4 border-b border-gray-200 dark:border-gray-700 pb-2">
	<div class="flex flex-nowrap gap-4 min-w-max px-1">
		<a
			href="/{parseCurrencyInUrl}"
			class={`category-link ${selectedCategory === '/' ? 'active' : 'normal'}`}
			on:click={handleClick}
		>
			<i class="fa-solid fa-grip" />
			All
		</a>

		<a
			href="/highlights{parseCurrencyInUrl}"
			class={`category-link ${selectedCategory === '/highlights' ? 'active' : 'normal'}`}
			on:click={handleClick}
		>
			<i class="fa-solid fa-star" />
			Highlights
		</a>

		<a
			href="/bank-rates{parseCurrencyInUrl}"
			class={`category-link ${selectedCategory === '/bank-rates' ? 'active' : 'normal'}`}
			on:click={handleClick}
		>
			<i class="fa-solid fa-landmark" />
			Banks
		</a>

		<a
			href="/money-transfer-rate{parseCurrencyInUrl}"
			class={`category-link ${selectedCategory === '/money-transfer-rate' ? 'active' : 'normal'}`}
			on:click={handleClick}
		>
			<i class="fa-solid fa-dollar-sign" />
			Money Transfer
		</a>

		<!-- <a
			href="/crypto"
			class={`category-link ${selectedCategory === '/crypto' ? 'active' : 'normal'}`}
			on:click={handleClick}
		>
			<i class="fa-brands fa-bitcoin" />
			Crypto
		</a> -->
	</div>
</div>

{#if !disableSearch}
	<!-- Search (mobile only) -->
	<div class="md:hidden mt-4">
		<div
			class="relative flex items-center rounded-md shadow-sm bg-white dark:bg-gray-900 border dark:border-gray-700 px-3 py-2 w-full"
		>
			<i class="fa-solid fa-search mr-2 text-gray-400" />
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
