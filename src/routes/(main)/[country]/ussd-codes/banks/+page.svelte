<script lang="ts">
	import type { BankData } from './types';

	type PageData = {
		countryName: string;
		countryCode: string;
		banksData: Record<string, BankData>;
	};

	export let data: PageData;

	let { countryName, countryCode, banksData } = data;

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

	<div class="container px-0 md:px-4">
		<div class="bg-white py-4 dark:bg-gray-900 dark:text-light dark:border-none overflow-x-auto">
			<div class="p-1 md:p-4">
				<div class="flex flex-col md:flex-row md:space-x-8 justify-center items-start">
					<div
						class="flex-grow md:basis-1/2 md:p-6 bg-white border rounded-md shadow-t-md mb-8 md:mb-0 dark:bg-gray-900 dark:text-light dark:border-none"
					>
						<div class="overflow-x-auto w-full">
							<table class="table-auto w-full table-fixed text-sm md:text-base text-left">
								<thead class="whitespace-nowrap">
									<tr class="text-gray-800 dark:text-gray-300">
										<th scope="col" class="w-[10%] py-3 md:pl-4 font-bitter hidden"> # </th>
										<th
											scope="col"
											class="w-[80%] md:w-auto py-2 px-2 font-bold text-base text-left md:text-xl"
										>
											Bank
										</th>
										<th
											scope="col"
											class="w-[30%] py-2 px-2 font-bold text-base md:text-xl text-left md:text-right"
										>
											USSD Code
										</th>
										<th
											scope="col"
											class="py-2 px-2 pl-10 font-bold text-base md:text-xl text-center md:text-right"
										>
											Transfer
										</th>
									</tr>
								</thead>
								<tbody class="banks">
									{#each Object.values(banksData) as data, i}
										<tr class="border-t border-gray-100 dark:border-gray-800">
											<!-- <td class="text-gray-500 py-6 pl-4 hidden md:inline-block">
												{i + 1}
											</td> -->
											<td class="py-3 px-2 text-xs md:text-sm">
												<a
													href="/{countryCode}/ussd-codes/banks/{data.id}"
													class="flex items-center"
													title=""
												>
													<span class="bank-icon">
														<picture>
															{#if !fallbackStates.get(data.id)}
																<source
																	srcset={generateSrcSet(
																		`/icons/svg/${data.id}.svg`,
																		[400, 800, 1200]
																	)}
																	type="image/svg+xml"
																/>
																<source
																	srcset={generateSrcSet(
																		`/icons/png/${data.id}.png`,
																		[400, 800, 1200]
																	)}
																	type="image/png"
																/>
															{/if}
															<img
																width="800"
																height="114"
																src={`/icons/svg/${data.id}.svg`}
																srcset={generateSrcSet(
																	`/icons/svg/${data.id}.svg`,
																	[400, 800, 1200]
																)}
																sizes="(max-width: 800px) 100vw, 800px"
																class="rounded-full"
																alt="{data.name} icon"
																on:error={(e) => handleImageError(e, data.id)}
															/>
														</picture>
													</span>
													<span class="bank-title ml-2">{data.name}</span>
												</a>
											</td>
											<td class="py-3 px-2 text-xs md:text-sm md:text-right">
												<a
													href="/{countryCode}/ussd-codes/banks/{data.id}"
													class="text-decoration underline bank-code"
													title=""
												>
													{data.ussd.start ? data.ussd.start : ''}
												</a>
											</td>
											<td class="py-3 px-2 pl-10 text-xs md:text-sm md:text-right">
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
		</div>
	</div>
</div>

<style>
	.bank-icon {
		@apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
	}
	.bank-title {
		@apply font-semibold md:text-lg capitalize text-gray-800 dark:text-gray-300;
	}
	.bank-code {
		@apply font-normal text-gray-800 dark:text-gray-300 whitespace-nowrap;
	}
</style>
