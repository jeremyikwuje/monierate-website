<script lang="ts">
	import type { BankData } from './types';

	type PageData = {
		countryName: string;
		countryCode: string;
		banksData: Record<string, BankData>;
	};

	export let data: PageData;

	let { countryName, countryCode, banksData } = data;

	function handleImageError(event: Event) {
		const img = event.currentTarget as HTMLImageElement;
		if (img.src !== '/icons/default.png') {
			img.src = '/icons/default.png'; // Apply fallback only if it's not already set
		}
	}
</script>

<svelte:head>
	<title>USSD Codes in {countryName}: Find Your Bank's Transfer Code</title>
	<meta
		name="description"
		content="Learn about USSD/Transfer codes in {countryName}. Quickly find your bank's code for international money transfers."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="USSD Codes in {countryName}: Find Your Bank's Transfer Code" />
	<meta
		property="og:description"
		content="Learn about USSD/Transfer codes in {countryName}. Quickly find your bank's code for mobile banking."
	/>
	<meta property="og:url" content="https://monierate.com/{countryCode}/ussd-codes/banks" />
</svelte:head>

<div class="mb-4">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
		<h1 class="text-2xl md:text-4xl mb-8">
			USSD Codes for banks in {countryName}
		</h1>
		<span class="text-sm md:text-base text-gray-500 dark:text-gray-400">
			Below are the USSD codes for banks in {countryName}. These USSD codes are used for
			telephone/mobile banking.
		</span>
	</div>

	<!-- Posts -->
	<div class="container w-full">
		<div
			class="bg-white py-[10px] shadow-t-md dark:bg-gray-900 dark:text-light dark:border-none w-full overflow-x-auto"
		>
			<div class="overflow-x-auto w-full">
				<table class="table-auto w-full text-sm text-left whitespace-nowrap">
					<thead>
						<tr>
							<th scope="col" class="py-3 md:pl-4 font-bitter hidden md:inline-block"> # </th>
							<th scope="col" class="py-3 pl-2 md:pl-6 md:pl-0 font-bold font-bitter"> Bank </th>
							<th scope="col" class="py-3 font-bold font-bitter text-right pr-2 md:pr-4">
								USSD Code
							</th>
							<th
								scope="col"
								class="py-3 pr-8 w-[10%] text-right md:w-[25%] md:pl-4 font-bold font-bitter"
							>
								Transfer
							</th>
						</tr>
					</thead>
					<tbody class="banks">
						{#each Object.values(banksData) as data, i}
							<tr class="border-t border-gray-150 dark:border-gray-700">
								<td class="text-gray-500 py-6 pl-4 hidden md:inline-block">
									{i + 1}
								</td>
								<td>
									<a
										href="/{countryCode}/ussd-codes/banks/{data.id}"
										class="flex items-center"
										title=""
									>
										<span class="bank-icon">
											<img
												width="22px"
												height="22px"
												src="/icons/{data.icon}"
												class="rounded-full"
												alt="{data.name} icon"
												on:error={handleImageError}
											/>
										</span>
										<span class="bank-title ml-2">{data.name}</span>
									</a>
								</td>
								<td class="text-right pr-4 md:pr-6 w-[20%] break-words py-3">
									<a
										href="/{countryCode}/ussd-codes/banks/{data.id}"
										class="text-decoration underline bank-code"
										title=""
									>
										{data.ussd.start ? data.ussd.start : ''}
									</a>
								</td>
								<td class="text-right w-[20%] break-words py-3 pr-8">
									{#if data.ussd.transfer}
										{data.ussd.transfer}
									{:else if data.ussd.transfer_to_same_bank}
										{data.ussd.transfer_to_same_bank}
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<style>
	table thead th {
		@apply dark:text-gray-300 text-black;
	}

	.bank-icon {
		@apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
	}
	.bank-title {
		@apply font-semibold md:text-lg capitalize text-gray-800 dark:text-gray-300 whitespace-nowrap;
	}
	.bank-code {
		@apply font-normal text-gray-800 dark:text-gray-300 whitespace-nowrap;
	}
</style>
