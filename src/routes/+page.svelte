<script>
    /** @type {import('./$types').PageData} */
    import { toggleButtonLoad, toggleMessage } from "$lib/helper.svelte";
	import Money from "$lib/money";
	import { onMount } from "svelte";

    export let data;
    let rates = data.rates || {}

    onMount(async () => {
        
    })

    let first = rates[0]
    let last = rates[rates.length - 1]

    console.log(rates)
    console.log(first)

    let email = "";
    let year = (new Date()).getFullYear()
</script>

<header>
    <div id="brand" class="nav-brand container flex justify-between items-center py-4">
        <img src="/monierate.png" class="h-[24px]" alt="WalletRate Logo">
        <a href="https://monierate.substack.com" class="border border-primary py-2 px-4 rounded-lg bg-primary font-semibold uppercase text-black">Subscribe</a>
    </div>
</header>

<div class="bg-gray-50 pt-12 pb-4">
    <div class="container">
        <h1 class="text-2xl md:text-3xl mb-2">Today's Dollar Prices in Black Market</h1>
        <div class="mb-12 text-gray-600 font-normal">
            {#if first && last}
            <p>
                The price of dollar today is between ₦{Money.toDollar(first.rate_buy)} and ₦{Money.toDollar(last.rate_buy)}. Prices are displayed from lowest to highest.
            </p>
            {/if}
        </div>
        <!-- <div>
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li class="mr-2">
                    <a href="#" class="inline-flex py-2 px-4 text-gray-600 font-semibold group text-blue-600 bg-blue-100 rounded-lg" aria-current="page">
                        Crypto
                    </a>
                </li>
                <li class="mr-2">
                    <a href="#" class="inline-flex py-2 px-4 text-gray-600 font-semibold group">
                        Virtual Card
                    </a>
                </li>
            </ul>
        </div> -->
        <div class="flex justify-between items-center">
            <span></span>
            <span>
                <span class="text-semibold">Sort by:</span>
                <span class="font-semibold">Low to high</span>
            </span>
        </div>
    </div>
</div>

<main class="bg-gray-50">
    <div class="container">
        <div class="changers-box bg-white py-[10px] shadow-t-md">
            <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead>
                        <tr>
                            <th scope="col" class="pr-2 py-3 md:pl-4 font-bitter hidden md:inline-block">
                                #
                            </th>
                            <th scope="col" class="pr-6 py-3 pl-2 md:pl-0 text-black font-bold font-bitter w-[40%]">
                                Provider
                            </th>
                            <th scope="col" class="pl-6 py-3 text-black font-bold font-bitter text-right">
                                Price
                            </th>
                            <th scope="col" class="pl-6 py-3 text-black font-bold font-bitter text-right pr-2 md:pr-4">
                                Services
                            </th>
                        </tr>
                    </thead>
                    <tbody class="changers">
                        {#each Object.entries(rates) as [index, rate]}
                        <tr class="mb-4 border-t border-gray-100">
                            <th scope="row" class="text-gray-500 py-6 pl-4 hidden md:inline-block">
                                {parseInt(index) + 1}
                            </th>
                            <td>
                                <span class="flex items-center">
                                    <span class="changer-icon">
                                        <img src="/icons/{rate.changer.icon}" class="rounded-full" alt="Paga Icon">
                                    </span>
                                    <span class="changer-title">{rate.changer.name}</span>
                                </span>
                            </td>
                            <td class="text-right">
                                <span class="changer-rate">₦{Money.toDollar(rate.rate_buy)}</span>
                                <small class="changer-rate-base">per $1</small>
                            </td>
                            <td class="text-right py-2 pr-2 md:pr-4">
                                {#each Object.entries(rate.changer.changer_tags) as [index, tag]}
                                <span class="inline-block p-2 bg-blue-100 text-blue-800 rounded-lg text-xs mr-2 font-semibold mb-2">
                                    {tag.tag_id}
                                </span>
                                {/each}
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            
            <!-- <ul class="changers block p-0" id="changers">
                {#each Object.entries(rates) as [index, rate]}
                <li id="changer-1" class="changer">
                    <span class="flex items-center">
                        <span class="changer-icon">
                            <img src="/icons/{rate.changer.icon}" class="rounded-full" alt="Paga Icon">
                        </span>
                        <span class="changer-title">{rate.changer.name}</span>
                    </span>
                    <span class="inline-block text-center">
                        <span class="changer-rate">₦{Money.toDollar(rate.rate_buy)}</span>
                        <small class="changer-rate-base">per $1</small>
                    </span>
                </li>
                {/each}
            </ul> -->
        </div>
    </div>
</main>

<footer class="bg-gray-50 pt-8">
    <div class="w-[95%] md:w-[768px] mx-auto mb-12 text-center">
        <h2 class="font-semibold text-2xl mb-4">About Monierate</h2>
        <div class="mb-8">
            <p>With so many dollar app out there, each offering their own unique rates, chances are you are paying more for every dollar you buy.</p>
            <p>But you can save thousands of naira on your next exchange when you compare several dollar rates and pick the cheapest on Monierate.</p>
            <p>Monierate is a website to track and compare dollar exchange rates across multiple providers in Nigeria. It currently track the 24-hour price of dollar accross 10 providers including Chippercash, Paga, Payday, Wirepay, BitNob, and Bitmama.</p>
        </div>
        <div class="">
            &copy; Monierate - { year }
            <p class="mt-4 text-sm">
                Built and maintained by <a href="https://twitter.com/jeremyikwuje" class="text-black">@jeremyikwuje ⚡</a> and <a href="https://twitter.com/onionsman">@onionsman</a>
            </p>
        </div>
    </div>
</footer>

<style>
    .container {
        @apply w-[95%] md:w-[991px] mx-auto;
    }
    .changer {
        @apply flex justify-between items-center py-2 border-b border-gray-200;
    }
    .changer:last-child {
        @apply border-b-0
    }
    .changer-icon {
        @apply bg-transparent border border-gray-50 rounded-full w-[24px] h-[24px] mr-2;
    }
    .changer-title {
        @apply font-semibold text-lg capitalize text-gray-800;
    }
    .changer-rate-base {
        @apply text-gray-500;
    }
    .changer-rate {
        @apply block font-semibold text-lg text-gray-800;
    }

    footer p {
        @apply mb-4;
    }
</style>