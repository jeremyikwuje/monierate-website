<script>
    /** @type {import('./$types').PageData} */
	import Money from "$lib/money"
    import { format } from "$lib/functions";

    export let data;
    let rates = data.rates || {}
    let providers = data.providers || {}

    let count = 1
    let total = Object.entries(providers).length

    const increment = () => count++;
</script>

<svelte:head>
	<title>Dollar to naira today black market | Monierate</title>
	<meta name="description" content="Compare the naira exchange rates from over 16 exchanges in Nigeria. Track naira rates today. Convert dollar to naira using CBN and black market rate. Get price alert from your favourite crypto exchange such as Binance, Bybit, Quidax, etc.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Naira exchange rates & converter | Monierate" />
	<meta property="og:description" content="Compare the naira exchange rates from over 16 exchanges in Nigeria. Track naira rates today. Convert dollar to naira using CBN and black market rate. Get price alert from your favourite crypto exchange such as Binance, Bybit, Quidax, etc." />
	<meta property="og:url" content="monierate.com" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<div class="pt-4 pb-4">
    <div class="container">
        <h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100 md:text-center">Today's dollar to naira rates on exchanges</h1>
        <div class="mb-12 text-gray-600 font-normal dark:text-gray-300 md:text-center">
            <p>
                Compare the prices of dollar to naira from {total} exchange providers.
            </p>
        </div>
        <div class="flex justify-between items-center dark:text-gray-300">
            <span></span>
            <span>
                <span class="text-semibold">Sort by:</span>
                <span class="font-semibold">Low to high</span>
            </span>
        </div>
    </div>
</div>

<div class="bg-white dark:bg-gray-800">
    <div class="container">
        <!-- Landscape Top/Bottom -->
        <div class="cedar-money">
            <a href="https://bit.ly/monierate-cedar" target="_blank">
                <img src="/cedar-1.gif" alt="Cedar Money" class="mx-auto max-w-full">
            </a>
        </div>
    </div>
</div>

<main>
    <div class="container">
        <div class="border border-gray-100 bg-white py-[10px] shadow-md mb-16 dark:bg-gray-900 dark:text-light dark:border-none min-h-[100vh] w-full overflow-x-scroll md:overflow-x-hidden overflow-y-scroll md:overflow-y-hidden">
            <table class="table-auto overflow-x-scroll overflow-y-scroll w-full text-sm text-left">
                <thead>
                    <tr>
                        <th scope="col" class="pr-4 py-3 md:pl-4 font-bitter hidden md:inline-block">
                            #
                        </th>
                        <th scope="col" class="py-3 pl-2 md:pl-6 md:pl-0 font-bold font-bitter">
                            Provider
                        </th>
                        <th scope="col" class="pl-6 pr-6 py-3 w-[40%] font-bold font-bitter text-right">
                            Buy Price
                        </th>
                        <th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-right">
                            Sell Price
                        </th>
                        <th scope="col" class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 whitespace-nowrap">
                            Last updated
                        </th>
                    </tr>
                </thead>
                <tbody class="changers">
                    {#each Object.entries(rates) as [changer, rate], i}
                    <tr class="mb-4 border-t border-gray-200 dark:border-gray-700">
                        <th scope="row" class="text-gray-500 py-6 pl-4 hidden md:inline-block">
                            { i + 1 }
                        </th>
                        <td>
                            <a href="/converter/{changer}?Amount=1&From=USD&To=NGN" class="flex items-center" title="{providers[changer].name} dollar to naira rate.">
                                <span class="changer-icon">
                                    <img width="22px" height="22px" src="/icons/{providers[changer].icon}" class="rounded-full" alt="{providers[changer].name} icon">
                                </span>
                                <span class="changer-title">{providers[changer].name}</span>
                            </a>
                        </td>
                        <td class="text-right pl-6 pr-6">
                            <span class="changer-rate">₦{Math.round(rate.buy)}</span>
                            <small class="changer-rate-base">per $1</small>
                        </td>
                        <td class="text-right pl-6 pr-6">
                            <span class="changer-rate">₦{Math.round(rate.sell)}</span>
                            <small class="changer-rate-base">per $1</small>
                        </td>
                        <td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap">
                            {format(new Date(rate.updatedAt))}
                        </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="dark:text-gray-300"> 
            <span class="block mb-4">
                <h3>What is a Provider?</h3>
                <p>A provider is an entity that help you facilitate the exchange of currencies. If you have 100 USDT, and you want to exchange it for naira. You will need an exchange provider to convert your USDT to naira. A provider can be an individual or entity. On Monierate, we only list trusted entities for you to choose from not individual traders.</p>
            </span>
            <span class="block mb-4">
                <h3>What is Buy Price?</h3>
                <p>Buy price is the rate at which you will pay to convert <strong>naira to dollar</strong>. It is how much naira you are paying for every dollar you get. An example is, you have naira, but you need USDT to pay for a bill, you will need to exchange your naira for USDT. The provider will credit USDT to you at a Buy Price.</p>
            </span>
            <span class="block mb-4">
                <h3>What is Sell Price?</h3>
                <p>Sell price is the rate at which you will pay to convert <strong>dollar to naira</strong>. It is how much naira you are getting for every dollar you exchange. An example is, you have USDT, but you need naira to pay a bill, you will need to exchange your USDT for naira. The provider will credit naira to you at a Sell Price.</p>
            </span>
            <span class="block mb-4">
                <h3>Why is Buy Price always higher than Sell Price?</h3>
                <p>Exchange Providers makes money from the difference between the exchange price of dollar. This is popularly known as arbitrage or trading profit, buy low and sell high. If you have USDT but need naira, they buy the USDT from you at a lower naira price and sell at a higher naira price to someone else who need USDT.</p>
            </span>
            <span class="block">
                <h3>How Monierate works</h3>
                <p class="mb-2">Monierate is a website for you to compare the prices of dollar accross multiple providers in Nigeria. You can use Monierate to know the exchange rate of dollar to naira, get more dollars for naira and vice versa. By default, prices are arranged from lowest to highest. The cheapest rate is rank first and the most expensive rate is ranked last. In the future, you can change the order of the selection between *low to high* or by *Buy* or *Sell* price..</p>
                <p>Monierate currently tracks the 24-hour price of dollar accross 10+ providers including Binance, Luno, Remitano, Yellow Card, Quidax, and Payday.</p>
            </span>
        </div>
    </div>
</main>

<style>
    table thead th {
        @apply dark:text-gray-300 text-black
    }

    .changer {
        @apply flex justify-between items-center py-2 border-b border-gray-200;
    }
    .changer:last-child {
        @apply border-b-0
    }
    .changer-icon {
        @apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
    }
    .changer-title {
        @apply font-semibold text-lg text-gray-800 dark:text-gray-300;
    }
    .changer-rate-base {
        @apply text-gray-500 dark:text-gray-400;
    }
    .changer-rate {
        @apply block font-semibold text-lg text-gray-800 dark:text-light;
    }
</style>