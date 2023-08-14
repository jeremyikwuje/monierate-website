<script>
    /** @type {import('./$types').PageServerData} */
    import Money from "$lib/money";
    import { format } from "$lib/functions";

    export let data;

    const provider = data.provider
    const pairs = Object.entries(provider.pairs)
    console.log(pairs)

    function getCurrency(pair) {
        return pair.split('ngn')[0]
    }
</script>

<svelte:head>
	<title>{provider.name} exchange rates in Nigeria | Monierate</title>
	<meta name="description" content="Compare {provider.name} exchange rates in a range of currencies.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{provider.name} exchange rates in Nigeria | Monierate" />
	<meta property="og:description" content="Compare {provider.name} exchange rates in a range of currencies." />
	<meta property="og:url" content="monierate.com/ng/compare/provider" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<div>
    <div class="container md:w-[768px] md:mx-auto">
        <section class="w-full mx-auto pb-16 text-center">
            <span class="inline-block bg-transparent border border-black rounded-full w-[32px] h-[32px] mt-4">
                <img src="/icons/{provider.icon}" width="30px" height="30px" class="rounded-full" alt="{provider.name} icon">
            </span>
            <h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100">
                {provider.name} exchange rates in Nigeria
            </h1>
            <div class="text-lg text-gray-600 font-normal dark:text-gray-300">
                <p>
                    Considering using {provider.name}? Compare {provider.name} exchange rates in Nigeria.
                </p>
            </div>
        </section>

        <section class="bg-white py-[10px] mb-16 border rounded-lg shadow-sm dark:bg-gray-900 dark:text-light min-h-[50vh] w-full md:w-[768px] md:mx-auto overflow-x-scroll md:overflow-x-hidden">
            {#if pairs.length > 1}
                <table class="table-auto overflow-x-scroll w-full text-sm text-left ">
                    <thead>
                        <tr>
                            <th scope="col" class="py-3 md:pl-0 font-bold font-bitter">
                                Currency
                            </th>
                            <th scope="col" class="pl-6 pr-6 py-3 w-[40%] font-bold font-bitter text-right">
                                Buy rate
                            </th>
                            <th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-right">
                                Sell rate
                            </th>
                            <th scope="col" class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 whitespace-nowrap">
                                Last updated
                            </th>
                        </tr>
                    </thead>
                    <tbody class="providers">
                        {#each pairs as [pair, rate]}
                            <tr class="mb-4 border-t border-gray-200 dark:border-gray-700">
                                <td>
                                    <span class="flex items-center">
                                        <span class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4" style="background-image: url('https://raw.githubusercontent.com/monierate/currencies/main/assets/available_icons/{getCurrency(pair)}.png');"></span>
                                        <span class="provider-title">{getCurrency(pair).toUpperCase()}</span>
                                    </span>
                                </td>
                                <td class="text-right pl-6 pr-6">
                                    <span class="provider-rate">₦{Money.format(rate.buy)}</span>
                                    <small class="provider-rate-base">per {pair}</small>
                                </td>
                                <td class="text-right pl-6 pr-6">
                                    <span class="provider-rate">₦{Money.format(rate.sell)}</span>
                                    <small class="provider-rate-base">per {pair}</small>
                                </td>
                                <td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap">
                                    {#if (rate.updatedAt) }
                                        {format(new Date(rate.updatedAt))}
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {:else}
                <div class="text-center py-16">
                    <span class="block pb-6">
                        <svg class="mx-auto" width="85px" height="85px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.0315 6.93751C4.75731 4.72857 6.30192 2.69766 8.54207 2.32168L8.93963 2.25496C10.9651 1.91501 13.0349 1.91501 15.0604 2.25496L15.4579 2.32168C17.6981 2.69766 19.2427 4.72857 18.9685 6.93751L18.9505 7.08273C18.8855 7.6063 18.4315 8 17.8928 8H6.10719C5.56847 8 5.11452 7.6063 5.04953 7.08273L5.0315 6.93751Z" stroke="#888888" stroke-width="1.5"></path> <path d="M9 8L6 22" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> <path d="M15 8L15.75 11.5M18 22L16.5 15" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16.5 17H7.5" stroke="#888888" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                    </span>
                    <span class="text-xl fold-bold block">
                        We should have shown you rates from {provider.name} – we haven’t gotten to them all yet.
                    </span>
                    <p></p>
                </div>
            {/if}
            
        </section>

        <section>
            <h2 class="text-2xl">About {provider.name} in Nigeria</h2>
            <div class="py-6 text-lg">
                <p class="mb-4">{provider.bio}</p>
            </div>
        </section>

        <section>
            <h2 class="text-2xl">How to use {provider.name} in Nigeria</h2>
            <div class="py-6 text-lg">
                <p class="mb-4">
                    To get starting using {provider.name} in Nigeria, follow the steps below.
                </p>
                <ol class="list-decimal ml-12 mb-4">
                    <li>Visit {provider.name} website to get started.</li>
                    <li>Create an account with your personal details.</li>
                    <li>Verify your account as required.</li>
                </ol>
                <p>Once your account is fully setup, you can start using {provider.name} to transact.</p>
            </div>
        </section>
        <section>
            <h2 class="text-2xl">Learn more about {provider.name}</h2>
            <div class="py-6 text-lg">
                Want to learn more about {provider.name}? Click <a href="{provider.link}">here</a> to learn more.
            </div>
        </section>
    </div>
</div>

<style>
table thead th {
    @apply dark:text-gray-300 text-black whitespace-nowrap
}
table tbody tr td {
    @apply py-6 whitespace-nowrap
}
table tr td:first-child, table thead th:first-child {
    @apply pl-4
}

.provider {
    @apply flex justify-between items-center py-2 border-b border-gray-200;
}
.provider:last-child {
    @apply border-b-0
}
.provider-icon {
    @apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
}
.provider-title {
    @apply font-semibold text-lg capitalize text-gray-800 dark:text-gray-300;
}
.provider-rate-base {
    @apply text-gray-500 dark:text-gray-400;
}
.provider-rate {
    @apply block font-semibold text-lg text-gray-800 dark:text-light;
}
</style>