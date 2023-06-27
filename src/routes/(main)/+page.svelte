<script>
    /** @type {import('./$types').PageData} */
	import Money from "$lib/money";

    export let data;
    let rates = data.rates || {}

    let first = rates[0]
    let last = rates[rates.length - 1]
</script>

<svelte:head>
	<title>Dollar to naira today black market | Monierate</title>
	<meta name="description" content="Track exchange rate. Convert dollar to naira today black market. Get alerted before anyone does.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Exchange rate & Currency converter | Monierate" />
	<meta property="og:description" content="Track exchange rate. Convert US dollar to Nigerian Naira." />
	<meta property="og:url" content="monierate.com" />
</svelte:head>

<div class="pt-12 pb-4">
    <div class="container">
        <h1 class="text-2xl md:text-3xl mb-2">Today's Dollar Prices in Black Market</h1>
        <div class="mb-12 text-gray-600 font-normal">
            {#if first && last}
            <p>
                The price of dollar today is between ₦{Money.toDollar(first.rate_buy)} and ₦{Money.toDollar(last.rate_buy)}. Prices are displayed from lowest to highest.
            </p>
            {/if}
        </div>
        <div class="flex justify-between items-center">
            <span></span>
            <span>
                <span class="text-semibold">Sort by:</span>
                <span class="font-semibold">Low to high</span>
            </span>
        </div>
    </div>
</div>

<main>
    <div class="container">
        <div class="changers-box bg-white py-[10px] shadow-t-md mb-16">
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
                                Buy Price
                            </th>
                            <th scope="col" class="pl-6 py-3 text-black font-bold font-bitter text-right">
                                Sell Price
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
                                <a data-sveltekit-reload href="/converter/{rate.changer.code}?Amount=1&From=USD&To=NGN" class="flex items-center" title="{rate.changer.name} dollar to naira rate.">
                                    <span class="changer-icon">
                                        <img width="22px" height="22px" src="/icons/{rate.changer.icon}" class="rounded-full" alt="{rate.changer.name} icon">
                                    </span>
                                    <span class="changer-title">{rate.changer.name}</span>
                                </a>
                            </td>
                            <td class="text-right">
                                <span class="changer-rate">₦{Money.toDollar(rate.rate_buy)}</span>
                                <small class="changer-rate-base">per $1</small>
                            </td>
                            <td class="text-right">
                                <span class="changer-rate">₦{Money.toDollar(rate.rate_sell)}</span>
                                <small class="changer-rate-base">per $1</small>
                            </td>
                            <td class="text-right py-2 pr-2 md:pr-4">
                                {#each Object.entries(rate.changer.changer_tags) as [index, tag]}
                                <span class="inline-block p-2 border border-gray-300 text-black rounded-lg text-xs mr-2 font-semibold mb-2">
                                    {tag.tag_id}
                                </span>
                                {/each}
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="">
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
                <p>Buy price is the rate at which you will pay to convert <strong>dollar to naira</strong>. It is how much naira you are paying for every dollar you get. An example is, you have USDT, but you need naira to pay a bill, you will need to exchange your USDT for naira. The provider will credit naira to you at a Sell Price.</p>
            </span>
            <span class="block mb-4">
                <h3>Why is Buy Price always higher than Sell Price?</h3>
                <p>Exchange Providers makes money from the difference between the exchange price of dollar. This is popularly known as arbitrage or trading profit, buy low and sell high. If you have USDT but need naira, they buy the USDT from you at a lower naira price and sell at a higher naira price to someone else who need USDT.</p>
            </span>
            <span class="block">
                <h3>How to Monierate works</h3>
                <p class="mb-2">Monierate is a website for you to compare the prices of dollar accross multiple providers in Nigeria. You can use Monierate to know the exchange rate of dollar to naira, get more dollars for naira and vice versa. By default, prices are arranged from lowest to highest. The cheapest rate is rank first and the most expensive rate is ranked last. In the future, you can change the order of the selection between *low to high* or by *Buy* or *Sell* price..</p>
                <p>Monierate currently tracks the 24-hour price of dollar accross 10+ providers including Binance, Luno, Remitano, Yellow Card, Quidax, and Payday.</p>
            </span>
        </div>
    </div>
</main>

<style>
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
        @apply font-semibold text-lg capitalize text-gray-800;
    }
    .changer-rate-base {
        @apply text-gray-500;
    }
    .changer-rate {
        @apply block font-semibold text-lg text-gray-800;
    }
</style>