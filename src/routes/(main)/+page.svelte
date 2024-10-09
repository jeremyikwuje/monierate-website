<script>
	import A from "$lib/blog/components/a.svelte";
	import ChangerRates from "$lib/components/ChangerRates.svelte";
    /** @type {import('./$types').PageData} */
    import { friendlyDate } from "$lib/functions";

    export let data;
    const pairs = data.pairs || {};
    const pair = pairs.find((pair) => pair.code === 'usdngn');
    
    let rates = pair.changers;
    // sort rates in decending order by price_buy;
    rates.sort((a, b) => a.price_buy - b.price_buy);
    // filter out rate with price_buy as 0
    const filtered_non_zero_rates = rates.filter((rate) => rate.price_buy > 0);
    const filtered_zero_rates = rates.filter((rate) => rate.price_buy <= 0);
    // soirt rates in descending order by price_buy
    filtered_zero_rates.sort((a, b) => b.price_sell - a.price_sell);
    // merge both rates
    rates = filtered_non_zero_rates.concat(filtered_zero_rates);

    const providers = data.providers || {};
    const total = Object.entries(rates).length;
    
    let searchTerm = '';
    $: filteredRates = rates.filter(rate => {
        const providerName = providers[rate.changer_code]?.name || ''; 
        return providerName.toLowerCase().includes(searchTerm.toLowerCase());
    });
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

<div class="bg-white dark:bg-gray-800"> 
    <div class="container">
        <!-- Landscape Top/Bottom -->
        <div class="cedar-money">
            <a href="https://bit.ly/3MDsvBi" target="_blank">
                <img 
                    src="https://monierate.com/cedar-homepage-1.gif"
                    alt="Cedar Money"
                    class="mx-auto max-w-full md:w-[800px] md:h-[114px]">
            </a>
        </div>
    </div>
</div>

<div class="pt-4 mb-4">
    <div class="container">
        <h1 class="text-2xl md:text-4xl mb-2 dark:text-gray-100 md:text-center">Today's dollar to naira rates on exchanges</h1>
        <div class="mb-12 text-gray-600 font-normal dark:text-gray-300 md:text-center">
            <p>
                Compare the prices of dollar to naira from {total} exchange providers.
            </p>
        </div>
        <div class="flex justify-between items-center dark:text-gray-300 mb-4">
            <span>
            </span>
            <span class="text-right">
                <span class="text-semibold">Sort by:</span>
                <span class="font-semibold">Low to high</span>
            </span>
        </div>    
        <div class="md:flex justify-between items-center dark:text-gray-300">
            <span>
            </span>
            <span class="text-right">
                <label class="relative block">
                    <span class="sr-only">Search</span>
                    <input 
                        bind:value={searchTerm} 
                        class="placeholder:italic placeholder:text-slate-400 block bg-white dark:bg-gray-900 w-full border border-gray-200 dark:border-gray-500 rounded-lg py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" 
                        placeholder="Search providers..." 
                        type="text" 
                        name="search"/>
                </label>
            </span>
        </div>               
    </div>
</div>

<!--<div class="bg-white dark:bg-gray-800">
    <div class="container">
        <div class="pst-net">
            <a href="https://tinyurl.com/mpz2jv3t" target="_blank">
                <img 
                    src="https://ik.imagekit.io/monierate/partners/pst.gif"
                    alt="PST NET Virtual Cards"
                    class="mx-auto max-w-full md:w-[800px] md:h-[114px]">
            </a>
        </div>
    </div>
</div>-->

<main>
    <div class="w-full">
        <div class="container border border-none bg-white py-[10px] mb-16 dark:bg-gray-900 dark:text-light dark:border-none w-full overflow-x-scroll md:overflow-x-hidden overflow-y-scroll md:overflow-y-hidden">
            <ChangerRates rates={rates} changers={providers} />
        </div>

        <div class="container dark:text-gray-300"> 
            <span class="block mb-4">
                <h3>What is a Provider?</h3>
                <p>    
                    A provider is an entity that helps facilitate the exchange of currencies. 
                    If you have 100 USDT and want to exchange it for naira, you will need an exchange provider to convert your USDT to naira. 
                    A provider can be an individual or entity. On Monierate, we only list trusted entities for you to choose from, not individual traders.
                </p>
            </span>
            <span class="block mb-4">
                <h3>What is Buy Price?</h3>
                <p>
                    The buy price is the rate at which you pay to convert naira to dollars. 
                    It represents how much naira you're paying for every dollar obtained. 
                    For instance, if you have naira but need USDT to pay a bill, you exchange your naira for USDT, and the provider credits USDT to you at the buy price.
                </p>
            </span>
            <span class="block mb-4">
                <h3>What is Sell Price?</h3>
                <p>     
                    The sell price is the rate at which you pay to convert dollars to naira. 
                    It represents how much naira you're getting for every dollar exchanged. 
                    For instance, if you have USDT but need naira to pay a bill, you exchange your USDT for naira, and the provider credits naira to you at the sell price.
                </p>
            </span>
            <span class="block mb-4">
                <h3>Why is the buy price usually higher than the sell price?</h3>
                <p>
                    Exchange providers make money from the difference between the buying and selling prices of the dollar. 
                    This is commonly known as arbitrage or trading profit—buying low and selling high. 
                    If you have USDT but need naira, they buy the USDT from you at a lower naira price and sell it at a higher naira price to someone else who needs USDT.</p>
            </span>
            <span class="block">
                <h3>How Monierate works</h3>
                <p class="mb-2">
                    Monierate operates as a platform for comparing dollar prices across various providers in Nigeria.
                </p>
                <p class="mb-2">Here&#39;s how it works:</p>
                <ul class="list-inside ml-2">
                    <li class="mb-2">
                        <p>
                            <strong>Comparison Functionality:</strong>
                            Monierate gathers and displays the prices of the dollar from multiple providers in Nigeria. 
                            You can compare these prices to find the best rates available in the market.
                        </p>
                    </li>
                    <li class="mb-2">
                        <p>
                            <strong>Exchange Rate Information:</strong>
                            You can use Monierate to obtain daily information on the exchange rate of the dollar to naira.
                        </p>
                    </li>
                    <li class="mb-2">
                        <p>
                            <strong>Order Arrangement:</strong>
                            Prices are presented by default from the lowest to the highest, allowing You to easily identify the most cost-effective rates.
                        </p>
                    </li>
                    <li class="mb-2">
                        <p>
                            <strong>Buy and Sell Options:</strong>
                            Monierate facilitates You in acquiring more dollars for naira or vice versa by presenting both buy and sell options.
                        </p>
                    </li>
                    <li class="mb-2">
                        <p>
                            <strong>Customizable Sorting:</strong>
                            You have the flexibility to customize the order of the displayed rates, choosing between low to high or sorting by buy or sell prices.
                        </p>
                    </li>
                    <li class="mb-2">
                        <p>
                            <strong>Provider Tracking:</strong>
                            Monierate actively tracks the 24-hour prices of the dollar across a diverse range of providers, including platforms such as Binance, Luno, Remitano, Yellow Card, Quidax, and Payday.
                        </p>
                    </li>
                </ul>
                <p>In essence, we simplifies the process of finding the most favorable dollar exchange rates in Nigeria by providing a user-friendly platform for comparison and real-time rate tracking.</p>
            </span>
        </div>
    </div>
</main>

<style>
    table thead th {
        @apply dark:text-gray-300 text-black whitespace-nowrap
    }
    table tbody tr td {
        @apply py-2.5 whitespace-nowrap
    }
    table tr td:first-child, table thead th:first-child {
        @apply pl-0
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
        @apply font-semibold text-sm md:text-lg whitespace-nowrap text-gray-800 dark:text-gray-300;
    }
    .changer-rate-base {
        @apply text-gray-500 dark:text-gray-400;
    }
    .changer-rate {
        @apply block font-semibold text-sm md:text-lg whitespace-nowrap text-gray-800 dark:text-light;
    }
</style>