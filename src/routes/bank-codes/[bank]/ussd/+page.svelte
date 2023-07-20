<script lang="ts">
	export let data

	const code = data.code
	const bank = data.bank
</script>

<svelte:head>
	<title>List of {bank.name} USSD Codes</title>
	<meta name="description" content="List of all {bank.name} USSD Codes codes for your mobile banking.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="List of {bank.name} USSD Codes" />
	<meta property="og:description" content="List of all {bank.name} USSD Codes codes for your mobile banking." />
	<meta property="og:url" content="https://moniecode.com/bank-ussd" />
</svelte:head>

<div class="mt-8 mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-6 text-center">
        <span class="inline-block bg-transparent border border-black rounded-full w-[32px] h-[32px] mb-4">
            <img src="/icons/{bank.icon}" width="40px" height="40px" class="rounded-full" alt="{bank.name} icon">
        </span>
		<h1 class="text-2xl md:text-4xl">
			List of {bank.name} USSD Codes
		</h1>
	</div>
	
	<!-- Posts -->
	<div class="container">
		<div class="banks-box bg-white py-[10px] shadow-t-md mb-16 dark:bg-gray-900 dark:text-light min-h-[100vh] w-full overflow-x-scroll">
			<table class="table-auto overflow-x-scroll w-full text-sm text-left">
				<thead>
					<tr>
						<th scope="col" class="pl-2 md:pl-4 py-3 pl-2 md:pl-4 w-[50%] md:w-[25%] md:pl-4 font-bold font-bitter">
							Options
						</th>
						<th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-left md:text-right">
							USSD
						</th>
					</tr>
				</thead>
				<tbody class="banks">
					<tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">Start</span>
						</td>
						<td class="pl-6 pr-6 text-left md:text-right">
							<span class="bank-code">{code.start}</span>
						</td>
					</tr>
                    <tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">Transfer (to {bank.name})</span>
						</td>
						<td class="pl-6 pr-6 text-left md:text-right">
							<span class="bank-code">{code.transfer[0]}</span>
						</td>
					</tr>
                    <tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">Transfer (Other banks)</span>
						</td>
						<td class="pl-6 pr-6 text-left md:text-right">
							<span class="bank-code">{code.transfer[1]}</span>
						</td>
					</tr>
                    <tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">Airtime (Self)</span>
						</td>
						<td class="pl-6 pr-6 text-left md:text-right">
							<span class="bank-code">{code.airtime[0]}</span>
						</td>
					</tr>
                    <tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">Airtime (Others)</span>
						</td>
						<td class="text-left md:text-right pl-6 pr-6">
							<span class="bank-code">{code.airtime[1]}</span>
						</td>
					</tr>
                    <tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">Check Balance</span>
						</td>
						<td class="text-left md:text-right pl-6 pr-6">
							<span class="bank-code">{code.balance}</span>
						</td>
					</tr>
                    <tr class="mb-4 border-t border-gray-100 dark:border-gray-700">
						<td class="pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">BVN</span>
						</td>
						<td class="text-left md:text-right pl-6 pr-6">
							<span class="bank-code">{code.bvn}</span>
						</td>
					</tr>

                    {#each Object.entries(code.others) as [index, options]}
                    <tr class="mb-4 border-t border-gray-100 dark:border-gray-900">
						<td class="pl-2 md:pl-4 w-[50%] md:w-[25%]">
							<span class="bank-title">{options.text}</span>
						</td>
						<td class="text-left md:text-right pl-6 pr-6">
							<span class="bank-code">{options.code}</span>
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
    table tbody tr td {
        @apply py-4
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
    .bank-code-base {
        @apply text-gray-500 dark:text-gray-400;
    }
    .bank-code {
        @apply block font-semibold text-lg text-gray-800 dark:text-light whitespace-nowrap;
    }
	.bank-codes {
        @apply block font-semibold text-gray-800 dark:text-light whitespace-nowrap;
    }
</style>