<script lang="ts">
	/** @type {import('./$types').PageServerData} */
	export let data;

	let banks = data.banks;
	let swiftCodes = data.swiftCodes;
	let countryName = data.countryName;
	let countryCode = data.countryCode;
	let banksData = data.banksData;
</script>

<svelte:head>
	<title>{countryName} Banks SWIFT Codes</title>
	<meta name="description" content="Get all {countryName} Banks SWIFT codes.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{countryName} SWIFT Codes" />
	<meta property="og:description" content="Get all {countryName} Bank SWIFT codes." />
	<meta property="og:url" content="https://monierate.com/{countryCode}/bank-codes/swift-code" />
</svelte:head>

<div class="mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
		<h1 class="text-2xl md:text-4xl">
			SWIFT Codes for banks in {countryName}
		</h1>
	</div>
	
	<!-- Posts -->
	<div class="container">
		<div class="border rounded-md bg-white py-[10px] shadow-t-md mb-16 dark:bg-gray-900 dark:text-light dark:border-none w-full min-h-[100vh] overflow-x-auto">
			<table class="table-auto overflow-x-scroll w-full text-sm text-left">
				<thead>
					<tr>
						<th scope="col" class="pl-2 py-3 w-[50%] md:w-[25%] md:pl-4 font-bold font-bitter">
							Bank
						</th>
						<th scope="col" class="pr-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 hidden md:table-cell">
							SWIFT Code
						</th>
						<th scope="col" class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 md:w-[20%] whitespace-nowrap">
							More
						</th>
					</tr>
				</thead>
				<tbody class="banks">
					{#each Object.entries(banksData) as [bank, data]}
					<tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<a href="/{countryCode}/bank-codes/swift-code/{data.id}" class="flex items-center" title="">
								<span class="bank-icon">
									<img width="22px" height="22px" src="/icons/{data.icon}" class="rounded-full" alt="{data.name} icon">
								</span>
								<span class="bank-title">{data.name}</span>
							</a>
						</td>
						<td class="text-right pl-6 pr-6 hidden md:table-cell bank-codes">
							{data.swift.codes ? data.swift.codes.join(', ') : ''}
						</td>
						<td class="text-right py-2 pr-2 md:pr-4 w-[100px]">
							<a href="/{countryCode}/bank-codes/swift-code/{data.id}" class="inline-block p-2 border border-gray-300 text-black rounded-lg text-xs mr-2 font-semibold mb-2 dark:text-light whitespace-nowrap">more</a>
						</td>
					</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
    table thead th {
        @apply dark:text-gray-300 text-black
    }

    .bank {
        @apply flex justify-between items-center py-2 border-b border-gray-200;
    }
    .bank:last-child {
        @apply border-b-0
    }
    .bank-icon {
        @apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
    }
    .bank-title {
        @apply font-semibold md:text-lg capitalize text-gray-800 dark:text-gray-300 whitespace-nowrap;
    }
	.bank-codes {
        @apply block font-semibold text-gray-800 dark:text-light whitespace-nowrap;
    }
</style>