<script lang="ts">
	import { onMount } from 'svelte';
	export let data;

	let isMobile = false;
	let bankInfo = data.bankInfo;
	let countryName = data.countryName;
	let countryCode = data.countryCode;

	onMount(() => {
		const updateMedia = () => {
			isMobile = window.innerWidth < 768;
		};

		updateMedia();
		window.addEventListener('resize', updateMedia);

		return () => window.removeEventListener('resize', updateMedia);
	});

	// Type definitions
	interface ImageSources {
		svg: string;
		png: string;
		webp?: string;
	}

	let fallbackStates = new Map<string, boolean>();

	function generateSrcSet(baseUrl: string, sizes: number[]): string {
		return sizes.map((size) => `${baseUrl} ${size}w`).join(', ');
	}

	function handleImageError(event: Event, id: string) {
		const img = event.currentTarget as HTMLImageElement;
		if (!fallbackStates.get(id)) {
			fallbackStates.set(id, true);

			// Clear all srcset attributes from source elements
			const picture = img.closest('picture');
			if (picture) {
				const sources = picture.getElementsByTagName('source');
				Array.from(sources).forEach((source) => {
					source.srcset = '';
					source.removeAttribute('srcset');
				});
			}

			// Clear the img srcset
			img.srcset = '';
			img.removeAttribute('srcset');

			const fallbackSrc = '/icons/default.png';

			// Create a new image to check if fallback exists
			const testImage = new Image();
			testImage.onerror = () => {
				console.error('Fallback image not found:', fallbackSrc);
			};
			testImage.src = fallbackSrc;

			img.src = fallbackSrc;
			// Force a reload of the image
			img.complete && (img.src = img.src);
		}
	}
</script>

<svelte:head>
	<title>{bankInfo.name} {countryName} USSD Codes</title>
	<meta name="description" content="Get all {bankInfo.name} Bank USSD codes." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{bankInfo.name} USSD Codes {countryName}" />
	<meta property="og:description" content="Get all {countryName} Bank USSD codes." />
	<meta property="og:url" content="https://monierate.com/{countryCode}/ussd-code/{bankInfo.id}" />
</svelte:head>

<div class="mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
		<div class="flex flex-col items-center justify-center">
			<span class="bank-icon mr-4">
				<picture>
					{#if !fallbackStates.get(bankInfo.id)}
						<source
							srcset={generateSrcSet(`/icons/svg/${bankInfo.id}.svg`, [400, 800, 1200])}
							type="image/svg+xml"
						/>
						<source
							srcset={generateSrcSet(`/icons/png/${bankInfo.id}.png`, [400, 800, 1200])}
							type="image/png"
						/>
					{/if}
					<img
						width="70px"
						height="70px"
						class="rounded-full"
						alt="{bankInfo.name} icon"
						src={`/icons/svg/${bankInfo.id}.svg`}
						srcset={generateSrcSet(`/icons/svg/${bankInfo.id}.svg`, [400, 800, 1200])}
						on:error={(e) => handleImageError(e, bankInfo.id)}
					/>
				</picture>
			</span>
			<h1 class="text-2xl md:text-4xl py-5">
				{bankInfo.name} USSD Code
			</h1>
			<div>
				<h2 class="text-xl py-5">USSD Code</h2>

				<div>
					<span
						class="inline-flex items-center justify-between space-x-2 border border-gray-200 dark:border-gray-700 px-2 py-2 rounded-md w-full bg-white shadow-md dark:bg-gray-900"
					>
						<input
							type="text"
							placeholder={bankInfo.ussd.start}
							value={bankInfo.ussd.start}
							class="bg-transparent border-none text-gray-800 dark:text-gray-300 focus:outline-none w-full px-5"
						/>
						{#if isMobile}
							<a
								class="bg-transparent text-gray-800 dark:text-gray-300 underline px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-700"
								href="tel:{bankInfo.ussd.start}"
							>
								Dial
							</a>
						{:else}
							<button
								class="bg-transparent text-gray-800 dark:text-gray-300 underline px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-gray-700"
								on:click={() => navigator.clipboard.writeText(bankInfo.ussd.start)}
							>
								Copy
							</button>
						{/if}
					</span>
				</div>
			</div>
			<p class="py-5">
				Dial the code above to access {bankInfo.name} Mobile service
				{bankInfo.name.toLowerCase().includes(countryName.toLowerCase())
					? ''
					: `in ${countryName}`}.
			</p>
		</div>
	</div>

	<div class="container px-0 md:px-4">
		<div class="bg-white py-4 dark:bg-gray-900 dark:text-light dark:border-none overflow-x-auto">
			<div class="p-2 md:p-4">
				<div class="flex flex-col md:flex-row md:space-x-8 justify-center items-start">
					<div
						class="flex-grow md:basis-1/2 md:p-6 bg-white border rounded-md shadow-t-md mb-8 md:mb-0 dark:bg-gray-900 dark:text-light dark:border-none"
					>
						<div class="overflow-x-auto">
							<table class="table-auto table-fixed w-full text-sm md:text-base text-left">
								<thead class="whitespace-nowrap">
									<tr class="text-gray-800 dark:text-gray-300">
										<th
											scope="col"
											class="w-[50%] md:w-auto py-2 px-2 font-bold text-base md:text-xl"
										>
											Bank Code
										</th>
										<th
											scope="col"
											class="py-2 px-2 font-bold text-base md:text-xl text-left md:text-right"
										>
											{bankInfo.ussd.start ? bankInfo.ussd.start : ''}
										</th>
									</tr>
								</thead>
								<tbody class="banks">
									{#if bankInfo.ussd.transfer_to_same_bank}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Transfer to {bankInfo.name}</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.transfer_to_same_bank}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.transfer_other_banks}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Transfer to other Banks</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.transfer_other_banks}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.airtime_self}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Airtime self</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.airtime_self}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.airtime_others}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Airtime others</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.airtime_others}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.balance}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Balance</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.balance}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.bvn}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">BVN</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.bvn}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.update_bvn_details}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Update BVN details</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.update_bvn_details}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.stop_debit_transactions}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Stop debit transactions</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.stop_debit_transactions}</td
											>
										</tr>
									{/if}
									{#if bankInfo.ussd.activate_code}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Activate code</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{bankInfo.ussd.activate_code}</td
											>
										</tr>
									{/if}
									{#if countryName}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<td class="py-3 px-2 text-xs md:text-sm">Country</td>
											<td
												class="py-3 px-2 text-xs md:text-sm text-gray-800 dark:text-gray-400 text-left md:text-right"
												>{countryName}</td
											>
										</tr>
									{/if}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="container">
	<div
		class="border rounded-md bg-white py-4 shadow-md dark:bg-gray-900 dark:text-light dark:border-none"
	>
		<div class="container">
			<div class="overflow-x-auto text-center">
				<table class="table-auto inline w-full text-xs md:text-base text-center">
					<tbody>
						<tr class="text-lg md:text-3xl">
							<td class="py-2 px-2 md:px-10">{bankInfo.ussd.start}</td>
						</tr>
						<tr class="text-gray-800 dark:text-gray-300">
							<td class="p-2 md:p-5"> {bankInfo.name} </td>
						</tr>
					</tbody>
				</table>

				<div class="pt-5">
					<p class="inline-block border border-gray-200 rounded-md dark:border-gray-700 p-5">
						This is the USSD code for {bankInfo.name.toUpperCase()}
						{#if !bankInfo.name.includes(countryName)}
							in {countryName.toUpperCase()}
						{/if}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
