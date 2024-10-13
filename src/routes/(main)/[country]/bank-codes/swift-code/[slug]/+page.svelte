<script lang="ts">
	export let data;

	let bankInfo = data.bankInfo;
	let countryName = data.countryName;
	let countryCode = data.countryCode;
</script>

<svelte:head>
	<title>{bankInfo.name} {countryName} SWIFT Codes</title>
	<meta name="description" content="Get all {bankInfo.name} Bank SWIFT codes." />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{bankInfo.name} SWIFT Codes {countryName}" />
	<meta property="og:description" content="Get all {countryName} Bank SWIFT codes." />
	<meta
		property="og:url"
		content="https://monierate.com/{countryCode}/bank-codes/swift-code/{bankInfo.id}"
	/>
</svelte:head>

<div class="mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
		<h1 class="text-2xl md:text-4xl">
			SWIFT Codes for {bankInfo.name}
			{countryName}
		</h1>
	</div>

	<div class="container">
		<div
			class="border rounded-md bg-white py-4 shadow-md dark:bg-gray-900 dark:text-light dark:border-none"
		>
			<div class="flex items-center p-4">
				<span class="bank-icon mr-4">
					<img
						width="50px"
						height="50px"
						src="/icons/{bankInfo.icon}"
						class="rounded-full"
						alt="{bankInfo.name} icon"
					/>
				</span>
				<div>
					<h2 class="text-lg font-bold font-bitter">{bankInfo.name}</h2>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						SWIFT Code:
						<span class="font-medium"
							>{bankInfo.swift.codes ? bankInfo.swift.codes.join(', ') : 'N/A'}</span
						>
					</p>
				</div>
			</div>
			<div class="p-4 border-t border-gray-200 dark:border-gray-700">
				<div class="flex flex-col md:flex-row md:space-x-8 justify-center items-start">
					<!-- First List (Left) -->
					<div
						class="flex-grow md:basis-1/3 p-6 bg-white border rounded-md shadow-t-md mb-8 md:mb-0 dark:bg-gray-900 dark:text-light dark:border-none"
					>
						<h2 class="text-lg font-semibold mb-4">
							Key information for {bankInfo.name.toUpperCase()}
						</h2>

						<div class="space-y-4">
							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500 whitespace-nowrap">SWIFT CODE</span
									>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400"
										>{bankInfo.swift.codes.join(', ')}</span
									>
								</div>
							</div>

							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500">BANK</span>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400"
										>{bankInfo.name.toUpperCase()}</span
									>
								</div>
							</div>

							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500">ADDRESS</span>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400">
										{bankInfo.address ? bankInfo.address.toUpperCase() : ''}
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Second List (Right, Wider) -->
					<div
						class="flex-grow md:basis-2/3 p-6 bg-white border rounded-md shadow-t-md dark:bg-gray-900 dark:text-light dark:border-none"
					>
						<h2 class="text-lg font-semibold mb-4">
							Detailed information about {bankInfo.name.toUpperCase()}
						</h2>

						<div class="space-y-4">
							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500 whitespace-nowrap">SWIFT CODE</span
									>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400"
										>{bankInfo.swift.codes.join(', ')}</span
									>
								</div>
							</div>

							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500">BANK</span>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400"
										>{bankInfo.name.toUpperCase()}</span
									>
								</div>
							</div>

							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500">ADDRESS</span>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400">
										{bankInfo.address ? bankInfo.address.toUpperCase() : ''}
									</span>
								</div>
							</div>

							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500">CITY</span>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400">
										{bankInfo.city ? bankInfo.city.toUpperCase() : ''}
									</span>
								</div>
							</div>

							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500">BRANCH</span>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400">
										{bankInfo.branch ? bankInfo.branch.toUpperCase() : ''}
									</span>
								</div>
							</div>

							<div class="flex items-center justify-between border border-gray-300 dark:border-gray-800 rounded-lg p-4">
								<div class="flex space-x-4">
									<span class="text-sm font-medium text-gray-500">COUNTRY</span>
									<span class="text-sm font-semibold text-gray-600 dark:text-gray-400">
										{countryName ? countryName.toUpperCase() : ''}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="container">
					<h2 class="text-lg font-bold font-bitter text-center pb-10 pt-5">
						{bankInfo.name.toUpperCase()} SWIFT CODE DETAILS
					</h2>
					<div class="overflow-x-auto">
						<table class="table-auto w-full text-sm md:text-base text-center">
							<thead class="whitespace-nowrap">
								<tr class="text-gray-800 dark:text-gray-300">
									<th scope="col" class="py-2 px-2 font-bold text-base md:text-xl text-center">
										SWIFT
									</th>
									<th scope="col" class="py-2 px-2 font-bold text-base md:text-xl text-center">
										Bank Code
									</th>
									<th scope="col" class="py-2 px-2 font-bold text-base md:text-xl text-center">
										Country Code
									</th>
									<th scope="col" class="py-2 px-2 font-bold text-base md:text-xl text-center">
										Location Code
									</th>
									<th scope="col" class="py-2 px-2 font-bold text-base md:text-xl text-center">
										Branch Code
									</th>
								</tr>
							</thead>
							<tbody class="banks">
								{#each bankInfo.swift.details as code}
									<tr class="border-t border-gray-100 dark:border-gray-700">
										<td
											class="py-2 px-2 text-xs md:text-sm text-center text-gray-800 dark:text-gray-400"
											>{code.codes}</td
										>
										<td class="py-2 px-2 text-xs md:text-sm text-center">{code.details.bank}</td>
										<td class="py-2 px-2 text-xs md:text-sm text-center">{code.details.country}</td>
										<td class="py-2 px-2 text-xs md:text-sm text-center">{code.details.location}</td>
										<td class="py-2 px-2 text-xs md:text-sm text-center"
											>{code.details.branch ? code.details.branch : ''}</td
										>
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
