<script>
import "../app.css";
import { page, navigating } from "$app/stores";
import { onMount } from "svelte";
import { getCookie, setCookie } from "$lib/functions";
import { browser } from "$app/environment";
import Money from "$lib/money";

export let data
let sponsorLink = data.sponsorLink
let parallel_avg = parseFloat(`${data.parallel_avg}`)
let market_avg = data.market_avg
let top_rates = {
    usdngn: {
        parallel: market_avg.usdngn.parallel,
        name: 'USD/NGN',
        from: 'USD',
        to: 'NGN'
    },
    usdtngn: {
        parallel: market_avg.usdtngn.parallel,
        name: 'USDT/NGN',
        from: 'USDT',
        to: 'NGN'
    },
    btcngn: {
        parallel: market_avg.btcngn.parallel,
        name: 'BTC/NGN',
        from: 'BTC',
        to: 'NGN'
    },
    eurngn: {
        parallel: market_avg.eurngn.parallel,
        name: 'EUR/NGN',
        from: 'EUR',
        to: 'NGN'
    }
}

let year = (new Date()).getFullYear()
let showPromotionBar = (getCookie('promotion_bar') == null ? true : false)

// get the current page path
$: paths = $page.url.pathname.split('/')
$: paths.shift()
$: path = paths[0] ?? 'home'
$: currentPath = paths[paths.length - 1]
$: paths.pop()

// hide promotion bar on alert page
$: showPromotionBar = (path == 'alerts' ? false : true)
// hide sticky navbar menu on page change
$: if ($navigating) {
    if (browser) {
        const targetEl = document.getElementById('navbar-sticky')
        targetEl?.classList.add("hidden")
    }
}

// toggle navbar collapse menu on mobile
onMount(() => {
    const collapse = () => {
        const triggerEl = document.getElementById('nav-collapse-trigger')
        const targetEl = document.getElementById('navbar-sticky')

        triggerEl?.addEventListener('click', () => {
            //if (targetEl?.classList.contains('hidden'))
            targetEl?.classList.toggle("hidden")
        })
    }
    collapse()
})

function breadcrumbs(paths, current) {
    let url = ""
    for (let i = 0; i < paths.length; i++) {
        console.log(paths[i], i)
        if (i > current) continue
        url += `/${paths[i]}`
    }

    return url
}

function hidePromotionBar() {
    if (browser) {
        let element = document.querySelector('#promotion-bar')
        element?.classList.add('hidden')
    
        setCookie('promotion_bar', 'hide', 7)
    }
}

</script>

<svelte:head>
    
</svelte:head>

<header class="mb-0">
    <!-- <div class="bg-top-banner w-full py-2 text-center text-white fixed z-20 top-0 left-0">
       Best Dollar App <a href="https://tinyurl.com/beansAppTopBanner" class="underline font-extrabold text-white">Get Now</a>
    </div> -->
    <nav class="bg-white w-full z-20 top-0 left-0 border-b border-gray-200 dark:bg-gray-900 dark:border-none">
        <div class="w-[95%] md:max-w-[1200px] flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" class="flex items-center">
                <img src="/monierate.png" width="142px" height="24px" class="block dark:hidden h-[24px] w-[142px] md:h-[24px] h-8 mr-3" alt="Monierate Logo" loading="lazy">
                <img alt="Monierate Logo" width="142px" height="24px" class="hidden dark:block h-[24px] w-[142px] md:h-[24px]" src="/monierate-logo-white.png" loading="lazy">
            </a>
            <div class="flex md:order-2">
                <a href="/alerts" type="button" class="button bg-primary font-bold">
                    Get alert
                </a>

                <button id="nav-collapse-trigger" data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
            </div>
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                <ul class="nav-link">
                    <li>
                        <a href="/" class="{path == '' ? 'active': ''}" aria-current="page">$1 Today</a>
                    </li>
                    <li>
                        <a href="/converter" class="{path == 'converter' ? 'active': ''}" aria-current="page">Converter</a>
                    </li>
                    <li>
                        <a href="/ng/compare" class="{path == 'ng' ? 'active': ''}">Compare</a>
                    </li>
                    <li>
                        <a href="/alerts" class="{path == 'alerts' ? 'active': ''}">Price Alerts</a>
                    </li>
                    <li>
                        <a data-sveltekit-reload href="/blog" class="{path == 'blog' ? 'active': ''}">Blog</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

<div class="bg-white w-full py-2 whitespace-nowrap overflow-x-auto no-scrollbar dark:bg-gray-800 dark:border-gray-600 border-b border-gray-100">
    <div class="container">
        {#each Object.entries(top_rates) as [pair, rate], i} 
            <a data-sveltekit-reload href="/converter/?From={rate.from}&To={rate.to}&Amount=1" class="mr-2 text-gray-900 dark:text-gray-300 mr-6 text-[90%] md:text-lg">
                <span class="font-medium mr-2">{rate.name}</span>
                <span class="font-thin">{Money.format(rate.parallel, 2)}</span>
            </a>
        {/each}
    </div>
</div>

{#if path != ''}
<div class="bg-white dark:bg-gray-800 dark:border-gray-600 shadow-b-md">
    <div class="container">
        <span class="text-sm">
            <a href="/" class="mr-2 underline">Home</a>
            {#each paths as path, index}
                <span class="inline-block mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-3 h-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>                  
                </span>  
                <a href="{breadcrumbs(paths, index)}" class="mr-2 text-gray-700 dark:text-gray-300">{path}</a>
            {/each}
            <span class="inline-block mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-3 h-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>                  
            </span>  
            <span class="text-gray-700 dark:text-gray-300">{currentPath}</span>
        </span>
    </div>
</div>
{/if}
    
<slot />
    
<div class="w-full h-1 mt-16 dark:border-gray-900"></div>

<div class="bg-white dark:bg-gray-800">
    <div class="container">
        <!-- Landscape Top/Bottom -->
        <div class="cedar-money">
            <a href="https://tinyurl.com/24ujvanp" target="_blank">
                <img 
                    src="https://ik.imagekit.io/monierate/cedar-banner-send-money.gif"
                    alt="Cedar Money"
                    class="mx-auto max-w-full md:w-[800px] md:h-[114px]">
            </a>
        </div>
    </div>
</div>

<footer class="pt-16 pb-8 mt-8 text-gray-500 dark:text-gray-300">
    <div class="container mx-auto block md:flex justify-between item-center">
        <div class="w-full md:w-[30%]">
            <h3 class="font-bold">Currency converter</h3>
            <ul class="py-4 converter-list">
                <li><a data-sveltekit-reload href="/converter/cedarmoney?Amount=1&From=USD&To=NGN" class="font-bold text-purple-500">Send USD on Cedar</a></li>
                <li><a data-sveltekit-reload href="/converter/bybit?Amount=1&From=USDT&To=NGN">Convert USDT on Bybit</a></li>
                <li><a data-sveltekit-reload href="/converter/bitmama?Amount=1&From=USDT&To=NGN">Convert USDT on Bitmama</a></li>
                <li><a data-sveltekit-reload href="/converter/bitnob?Amount=1&From=USDT&To=NGN">Convert USDT on Bitnob</a></li>
                <li><a data-sveltekit-reload href="/converter/chippercash?Amount=1&From=USD&To=NGN">Convert USD on Chipper Cash</a></li>
                <li><a data-sveltekit-reload href="/converter/coinprofile?Amount=1&From=USD&To=NGN">Convert USDT on Coinprofile</a></li>
                <li><a data-sveltekit-reload href="/converter/eversend?Amount=1&From=USD&To=NGN">Convert USD on Eversend</a></li>
                <li><a data-sveltekit-reload href="/converter/klasha?Amount=1&From=USD&To=NGN">Convert USD on Klasha</a></li>
                <li><a data-sveltekit-reload href="/converter/paxful?Amount=1&From=USDT&To=NGN">Convert USDT on Paxful</a></li>
                <li><a data-sveltekit-reload href="/converter/remitano?Amount=1&From=USDT&To=NGN">Convert USDT on Remitano</a></li>
                <li><a data-sveltekit-reload href="/converter/quidax?Amount=1&From=USDT&To=NGN">Convert USDT on Quidax</a></li>
                <li><a data-sveltekit-reload href="/converter/yellowcard?Amount=1&From=USDT&To=NGN">Convert USDT on Yellow Card</a></li>
                <li><a data-sveltekit-reload href="/converter/luno?Amount=1&From=USDC&To=NGN">Convert USDC on Luno</a></li>
                <li><a data-sveltekit-reload href="/converter/payday?Amount=1&From=USD&To=NGN">Convert USD on Changera</a></li>
                <li><a data-sveltekit-reload href="/converter/wirepay?Amount=1&From=USD&To=NGN">Convert USD on Wirepay</a></li>
            </ul>
        </div>
        <div class="w-full md:w-[30%]">
            <h3 class="font-bold">Tools</h3>
            <ul class="py-4 converter-list">
                <li><a href="/alerts">Price Alerts</a></li>
                <li><a href="/converter">Currency Converter</a></li>
                <li><a href="/ng/compare">Compare exchange rates</a></li>
                <li><a href="/bank-codes">Bank Codes</a></li>
            </ul>
        </div>
        <div class="w-full md:w-[40%]">
            <span class="block mb-8">
                <h3 class="font-bold block mb-2 text-gray-800 dark:text-gray-300">Contacts</h3>
                <span class="font-bold text-xl block mb-2 text-gray-800 dark:text-gray-300">hello@monierate.com</span>
            </span>

            <span class="block text-sm">
            &copy; { year }, Monierate.com. 
            </span>

            <div class="mt-4">
            <p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
                We aggregate the exchange rates from multiple market providers. This is for informational purposes only.
            </p>
            <p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
                References made to third party names, logos and trademarks on this website are to identify corresponding goods and services that Monierate visitor can themselves exchange currencies. Unless otherwise specified, the trademark holders are not affiliated with Monierate, our products or website, and they do not sponsor or endorse Monierate services. Such references are included strictly as nominative fair use under applicable trademark law and remain fully the property of their respective trademark holders.
            </p>
            <p class="text-sm mb-4 text-gray-500 dark:text-gray-300">
                If you subscribe for our exchange rate <a href="/alert">alert</a>, you understand and accept the <a href="/policy/data">Monierate data policy</a>.
            </p>
            <p class="text-sm">
                Built and maintained by <a href="https://twitter.com/jeremyikwuje" class="text-gray-800 dark:text-gray-300">@jeremyikwuje ⚡</a> and <a href="https://twitter.com/onionsman" class="text-gray-800 dark:text-gray-300">@onionsman</a>
            </p>
            </div>
        </div>
    </div>
</footer>

{#if showPromotionBar }
<div class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5 z-50" id="promotion-bar">
    <div class="mx-auto w-[95%] md:w-[500px] px-2 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-gray-800 p-2 shadow-lg sm:p-3 dark:bg-gray-100">
            <div class="flex flex-wrap items-center justify-between">
                <div class="flex w-0 flex-1 items-center">
                    <span class="flex rounded-lg bg-gray-900 dark:bg-gray-600 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" class="h-6 w-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                    </span>
                    <p class="ml-3 truncate font-medium text-white dark:text-gray-900">
                        <span class="md:hidden">$1 = ₦{Money.format(parallel_avg)}</span>
                        <span class="hidden md:inline">
                            $1 = ₦{Math.round(parallel_avg)} (Black market avg.)
                        </span>
                    </p>
                </div>
                <div class="w-auto">
                    <a class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
                        href="/alerts">Get alert
                    </a>
                </div>
                <div class="">
                    <button on:click={hidePromotionBar} type="button" class="-mr-1 flex rounded-md p-2 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-white"><span class="sr-only">Dismiss</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6 text-white"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}

<!-- Landscape Top/Bottom -->
<!-- <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-9886145381404391"
     data-ad-slot="3727635247"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script> -->

<style>
    .nav-link {
        @apply flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0;
    }
    .nav-link a {
        @apply font-bold block py-2 pl-3 pr-4 text-gray-500 md:hover:text-primary md:p-0 md:dark:hover:text-primary dark:text-white dark:hover:text-white dark:border-gray-700;
    }
    .nav-link a:first-child {
        @apply mr-4 md:mr-6;
    }
    .nav-link a:last-child {
        @apply mr-0;
    }
    .nav-link a.active {
        @apply text-black md:dark:text-primary;
    }

    footer .converter-list {
        @apply py-4;
    }
    footer .converter-list li {
        @apply mb-4
    }
    footer .converter-list a {
        @apply block text-sm text-gray-500 font-semibold dark:text-gray-300;
    }
</style>