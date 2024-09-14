<script>
    /** @type {import('./$types').PageData} */
    export let data;
    let rates = data.rates || {}
    let providers = data.providers || {}

    let total = Object.entries(providers).length;

    // get the user timezone
    function getUserTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    // ✅ Or get a Date object with the specified Time zone
    function changeTimeZone(date) {
        const timeZone = getUserTimezone();

        if (typeof date === 'string') {
        return new Date(
            new Date(date).toLocaleString('en-US', {
            timeZone,
            }),
        );
        }
    
        return new Date(
        date.toLocaleString('en-US', {
            timeZone,
        }),
        );
    }

    export const format = (dt, d = "datetime") => {

        dt = changeTimeZone(dt)

        if (d == 'date') {
            return date.format(dt, 'ddd, MMM DD YYYY')
        }

        return date.format(dt, 'ddd, MMM DD YYYY h:mm:ss A')
    }

    export function friendlyDate(dt, d = "datetime") {
        const dateString = format(dt, d);
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const isSameDay = date.getDate() === now.getDate() &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();

        if (diffInSeconds < 900) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (isSameDay) {
            //const hours = Math.floor(diffInSeconds / 3600);
            return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    }
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
                    src="https://monierate.com/cedar-homepage.gif"
                    alt="Cedar Money"
                    class="mx-auto max-w-full md:w-[800px] md:h-[114px]">
            </a>
        </div>
    </div>
</div>

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
                            Buy <span class="hidden md:inline">Price</span>
                        </th>
                        <th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-right">
                            Sell <span class="hidden md:inline">Price</span>
                        </th>
                        <th scope="col" class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 whitespace-nowrap">
                            Last updated
                        </th>
                    </tr>
                </thead>
                <tbody class="changers">
                    {#each Object.entries(rates) as [changer, rate], i}
                    {#if changer != 'binance' }
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
                            <span class="changer-rate">
                                {#if Math.round(rate.buy) === 0}
                                    -
                                {:else}
                                    ₦{Math.round(rate.buy)}
                                {/if}
                            </span>
                            <small class="changer-rate-base">per $1</small>
                        </td>
                        <td class="text-right pl-6 pr-6">
                            <span class="changer-rate">
                                {#if Math.round(rate.sell) === 0}
                                    -
                                {:else}
                                    ₦{Math.round(rate.sell)}
                                {/if}
                            </span>
                            <small class="changer-rate-base">per $1</small>
                        </td>
                        <td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap">
                            {friendlyDate(new Date(rate.updatedAt))}
                        </td>
                    </tr>
                    {/if}
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="dark:text-gray-300"> 
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