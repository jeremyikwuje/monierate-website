<script lang="ts">
	export let searchData: any = [];
	export let searchResult: any = [];
	export let onSearch: (result: any) => void = () => {};
	export let selectedCurrency = 'USD';
	export let selectedCategory = '/';

	const original: any = searchData;

	const handleSearch = (e: Event) => {
		const input = (e.target as HTMLInputElement).value.toLowerCase().trim();

		if (!input && original) {
			searchResult = original; // Restore full list if input is cleared
			onSearch(searchResult);
			return;
		}

		if (searchData.body) {
			let filtered = original.body.filter((item: any) => {
				const values = flatten(item);
				return values.some((val) => String(val).toLowerCase().includes(input));
			});
			searchResult = { ...searchData, body: filtered };
			onSearch(searchResult);
			return;
		}
	};

	// Flatten any nested object/array
	function flatten(input: any): any[] {
		if (input == null) return [];

		if (typeof input === 'object') {
			if (Array.isArray(input)) {
				return input.flatMap(flatten);
			}
			return Object.values(input).flatMap(flatten);
		}

		return [input];
	}

	const currencies = ['USD', 'USDT', 'BTC', 'USDC', 'EUR', 'GBP', 'CAD'];
</script>

<!-- Top Section: Currency Tabs + Search on desktop -->
<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
	<!-- Currency Tabs (scrollable) -->
	<div class="overflow-x-auto no-scrollbar">
		<div class="flex flex-nowrap gap-2 bg-gray-100 dark:bg-gray-900 rounded-md p-1 min-w-max">
			{#each currencies as currency}
				<button
					class={`px-3 py-1 rounded text-sm whitespace-nowrap ${
						selectedCurrency === currency
							? 'bg-white dark:bg-gray-700 shadow font-medium'
							: 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
					}`}
					on:click={() => (selectedCurrency = currency)}
				>
					{currency}
				</button>
			{/each}
		</div>
	</div>

	<!-- Search (desktop only) -->
	<div
		class="hidden md:flex relative items-center rounded-md shadow-sm bg-white dark:bg-gray-900 border dark:border-gray-700 px-3 py-2 w-full md:w-72"
	>
		<i class="fa-solid fa-search mr-2 text-gray-400" />
		<input
			type="text"
			class="flex-1 outline-none text-sm text-gray-700 dark:text-gray-200 bg-transparent"
			placeholder="Search providers..."
			on:input={handleSearch}
		/>
	</div>
</div>

<!-- Category Tabs -->
<div class="overflow-x-auto no-scrollbar mt-4 border-b border-gray-200 dark:border-gray-700 pb-2">
	<div class="flex flex-nowrap gap-4 min-w-max px-1">
		<a href="/" class={`category-link ${selectedCategory === '/' ? 'active' : 'normal'}`}>
			<i class="fa-solid fa-grip" />
			All
		</a>

		<a
			href="/highlights"
			class={`category-link ${selectedCategory === '/highlights' ? 'active' : 'normal'}`}
		>
			<i class="fa-solid fa-star" />
			Highlights
		</a>

		<a href="/banks" class={`category-link ${selectedCategory === '/banks' ? 'active' : 'normal'}`}>
			<i class="fa-solid fa-landmark" />
			Banks
		</a>

		<a
			href="/transafer"
			class={`category-link ${selectedCategory === '/transfer' ? 'active' : 'normal'}`}
		>
			<i class="fa-solid fa-dollar-sign" />
			Money Transfer
		</a>

		<a
			href="/crypto"
			class={`category-link ${selectedCategory === '/crypto' ? 'active' : 'normal'}`}
		>
			<i class="fa-brands fa-bitcoin" />
			Crypto
		</a>
	</div>
</div>

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
			on:input={handleSearch}
		/>
	</div>
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		scrollbar-width: none;
	}
	.category-link {
		@apply flex items-center gap-2 px-3 py-1 text-sm rounded whitespace-nowrap;
	}
	.category-link.active {
		@apply bg-blue-50 text-primary font-semibold;
	}
	.category-link.normal {
		@apply text-gray-600 dark:text-gray-300 hover:text-primary;
	}
</style>
