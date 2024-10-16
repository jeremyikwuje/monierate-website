<script lang="ts">
	import type { BankData } from './types';

	type PageData = {
		countryName: string;
		countryCode: string;
		banksData: Record<string, BankData>;
	};

	export let data: PageData;

	let { countryName, countryCode, banksData } = data;
</script>

<svelte:head>
	<title>{countryName} Banks SWIFT Codes</title>
	<meta name="description" content="Get all {countryName} Banks SWIFT codes." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{countryName} SWIFT Codes" />
	<meta property="og:description" content="Get all {countryName} Bank SWIFT codes." />
	<meta property="og:url" content="https://monierate.com/{countryCode}/swift-codes/providers" />
</svelte:head>

<div class="mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
		<h1 class="text-2xl md:text-4xl mb-8">
			SWIFT Codes for banks in {countryName}
		</h1>
		<span class="text-sm md:text-base text-gray-500 dark:text-gray-400">
			Below are the SWIFT codes for banks in {countryName}. These SWIFT codes are only the active participants who are connected to SWIFT network.
		</span>
	</div>

	<!-- Posts -->
	<div class="container w-full">
		<div
			class="bg-white py-[10px] shadow-t-md mb-16 dark:bg-gray-900 dark:text-light dark:border-none w-full min-h-[100vh] overflow-x-auto"
		>
			<div class="overflow-x-auto w-full">
				<table class="table-auto w-full text-sm text-left whitespace-nowrap">
					<thead>
						<tr>
							<th scope="col" class="py-3 md:pl-4 font-bitter hidden md:inline-block">
								#
							</th>
							<th scope="col" class="py-3 pl-2 md:pl-6 md:pl-0 font-bold font-bitter">
								Bank
							</th>
							<th scope="col" class="py-3 font-bold font-bitter text-right pr-2 md:pr-4">
								SWIFT Code
							</th>
							<th scope="col" class="py-3 pr-8 w-[10%] text-right md:w-[25%] md:pl-4 font-bold font-bitter">
								City
							</th>
							<th scope="col" class="py-3 w-[10%] text-right md:w-[25%] md:pl-4 font-bold font-bitter pr-4">
								Branch
							</th>
						</tr>
					</thead>
					<tbody class="banks ">
						{#each Object.values(banksData) as data, i}
						    <tr class="border-t border-gray-150 dark:border-gray-700">
								<td class="text-gray-500 py-6 pl-4 hidden md:inline-block">
									{i + 1}
								</td>
								<td>
									<a
										href="/{countryCode}/swift-codes/providers/{data.id}"
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
											/>
										</span>
										<span class="bank-title ml-2">{data.name}</span>
									</a>
								</td>
								<td class="text-right pr-4 md:pr-6 w-[20%] break-words py-3">
									<a
										href="/{countryCode}/swift-codes/providers/{data.id}"
										class="text-decoration underline bank-code"
										title=""
									>
										{data.swift.codes ? data.swift.codes.join(', ') : ''}
									</a>
								</td>
								<td class="text-right w-[20%] break-words py-3 pr-8">
								    {data.city ? data.city : ''}
								</td>
								<td class="text-right w-[20%] break-words py-3 pr-4">
								    {data.branch ? data.branch : ''}
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
