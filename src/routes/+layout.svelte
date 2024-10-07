<script>
import "../app.css";
import { page, navigating } from "$app/stores";
import { onMount } from "svelte";
import { getCookie, setCookie } from "$lib/functions";
import { browser } from "$app/environment";
import Money from "$lib/money";

export let data;
const selected_partner_top = data.selected_partner_top;
const market_avg_rate = parseFloat(`${data.market_avg_rate}`);

const top_pairs = data.top_pairs;

let year = (new Date()).getFullYear();
let showPromotionBar = (getCookie('promotion_bar') == null ? true : false);

// get the current page path
$: paths = $page.url.pathname.split('/');
$: paths.shift();
$: path = paths[0] ?? 'home';
$: currentPath = paths[paths.length - 1];
$: paths.pop();

// hide promotion bar on alert page
$: showPromotionBar = (path == 'alerts' ? false : true);
// hide sticky navbar menu on page change
$: if ($navigating) {
    if (browser) {
        const targetEl = document.getElementById('navbar-sticky');
        targetEl?.classList.add("hidden");
    }
}

// toggle navbar collapse menu on mobile
onMount(() => {
    const collapse = () => {
        const triggerEl = document.getElementById('nav-collapse-trigger');
        const targetEl = document.getElementById('navbar-sticky');

        triggerEl?.addEventListener('click', () => {
            //if (targetEl?.classList.contains('hidden'))
            targetEl?.classList.toggle("hidden");
        })
    }
    collapse();
})

function breadcrumbs(paths, current) {
    let url = "";
    for (let i = 0; i < paths.length; i++) {
        if (i > current) continue;
        url += `/${paths[i]}`;
    }

    return url;
}

function hidePromotionBar() {
    if (browser) {
        let element = document.querySelector('#promotion-bar');
        element?.classList.add('hidden');
    
        setCookie('promotion_bar', 'hide', 7);
    }
}

</script>

<svelte:head>
</svelte:head>

<!-- <div id="top-banner" tabindex="-1" class="flex md:hidden fixed top-0 mb-8 start-0 z-50 justify-between w-full p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
    <div class="flex items-center mx-auto">
        <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
            <span class="inline-flex p-1 me-3 bg-gray-200 rounded-full dark:bg-gray-600 w-6 h-6 items-center justify-center">
                <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18.435 7.546A2.32 2.32 0 0 1 17.7 5.77a3.354 3.354 0 0 0-3.47-3.47 2.322 2.322 0 0 1-1.776-.736 3.357 3.357 0 0 0-4.907 0 2.281 2.281 0 0 1-1.776.736 3.414 3.414 0 0 0-2.489.981 3.372 3.372 0 0 0-.982 2.49 2.319 2.319 0 0 1-.736 1.775 3.36 3.36 0 0 0 0 4.908A2.317 2.317 0 0 1 2.3 14.23a3.356 3.356 0 0 0 3.47 3.47 2.318 2.318 0 0 1 1.777.737 3.36 3.36 0 0 0 4.907 0 2.36 2.36 0 0 1 1.776-.737 3.356 3.356 0 0 0 3.469-3.47 2.319 2.319 0 0 1 .736-1.775 3.359 3.359 0 0 0 0-4.908ZM8.5 5.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3 9.063a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm2.207-6.856-6 6a1 1 0 0 1-1.414-1.414l6-6a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span class="sr-only">Discount</span>
            </span>
            <span>
                { selected_partner_top.text } 
                <a href="{ selected_partner_top.link }" class="break-word text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline text-wrap">
                    { selected_partner_top.brand }
                    <svg class="inline-block w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </span>
        </p>
    </div>
</div> -->

<!-- <div id="top-banner" tabindex="-1" class="fixed top-0 mb-8 start-0 z-50 flex justify-between w-full p-4"> -->

<div id="top-banner" tabindex="-1" class="flex fixed top-0 mb-8 w-full z-50 gap-x-6 overflow-hidden bg-gray-50 px-6 py-3 sm:px-3.5 sm:before:flex-1">
    <div class="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
      <div class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"></div>
    </div>
    <div class="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">
      <div class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"></div>
    </div>
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span class="text-sm leading-6 text-gray-900">
        <strong class="font-semibold hidden md:inline-block">{ selected_partner_top.brand }</strong>
        <svg viewBox="0 0 2 2" class="mx-2 hidden md:inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>
        { selected_partner_top.text }
    
        <svg viewBox="0 0 2 2" class="mx-2 hidden md:inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>
        <a href="{ selected_partner_top.link }" class="hidden md:inline-block rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">
            {selected_partner_top.cta} <span aria-hidden="true">&rarr;</span>
        </a>
        <a href="{ selected_partner_top.link }" class="inline-block md:hidden break-word text-sm font-semibold text-sm text-gray-900 dark:text-gray-900 hover:underline text-wrap">
            { selected_partner_top.brand } 
            <svg class="inline-block md:hidden w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
        </a>
      </span>
    </div>
    <div class="flex flex-1 justify-end">
    </div>
</div>


<header class="mb-0 mt-16">
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
                <a href="/alerts" type="button" class="button px-3 bg-gray-900 dark:bg-gray-200 font-semibold text-white dark:text-gray-900">
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
        {#each Object.entries(top_pairs) as [code, value], i} 
            <a data-sveltekit-reload href="/converter/?From={value.from}&To={value.to}&Amount=1" class="mr-2 text-gray-900 dark:text-gray-300 mr-6 text-[90%] md:text-lg">
                <span class="font-medium mr-[2px]">{value.name}</span>
                <span class="font-thin mr-[2px]">{Money.format(value.price, 2)}</span>
                <!-- display 24hr price change in green or red -->
                {#if value.price_change_percent_24hr > 0}
                <span class="inline-block text-green-500 font-thin">
                    <svg viewBox="0 0 320 512" width="16" height="16" class="inline-block bg-transparent text-2xl" fill="green" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"/>
                    </svg>
                    {Money.format(value.price_change_percent_24hr, 2)}%
                </span>
                {:else}
                    <span class="inline-block text-red-500 font-thin">
                        <svg viewBox="0 0 320 512" width="16" height="16" class="inline-block bg-transparent text-2xl" fill="red" xmlns="http://www.w3.org/2000/svg">
                            <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"/>
                        </svg>
                        {Money.format(value.price_change_percent_24hr, 2)}%
                    </span>
                {/if}
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
            <a href="https://bit.ly/4gj4L2V" target="_blank">
                <img 
                    src="https://monierate.com/cedar-homepage.gif"
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
                <li><a data-sveltekit-reload href="https://bit.ly/3Xlo8jv" class="font-bold text-indigo-500">Send USD on Cedar</a></li>
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
                <li><a href="https://tinyurl.com/cambridge-currencies-foot-link">Send Money to Europe</a></li>
                <li><a href="https://bit.ly/3Xlo8jv">Pay your Importers</a></li>
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

            <span class="block mb-8">
                <ul class="flex justify-left mt-5 space-x-5">
                    <li>
                        <a href="https://x.com/monierate" class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                            <!-- X -->
                            <span class="[&>svg]:h-5 [&>svg]:w-5">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 512 512">
                                <path
                                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                </svg>
                            </span>
                        </a>
                    </li>

                    <li>
                        <a href="https://www.tiktok.com/@monierate" class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                            <!-- X -->
                            <span class="[&>svg]:h-5 [&>svg]:w-5">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 448 512">
                                    <path
                                    d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                                </svg>                            
                            </span>
                        </a>
                    </li>

                    <li>
                        <a href="https://linkedin.com/company/monierate" class="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                            <!-- Linkedin -->
                            <span class="[&>svg]:h-5 [&>svg]:w-5">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 448 512">
                                <path
                                    d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                                </svg>
                            </span>
                        </a>
                    </li>
                </ul>
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
                        <span class="md:hidden">
                            $1 = ₦{Math.round(market_avg_rate)}
                        </span>
                        <span class="hidden md:inline">
                            $1 = ₦{Math.round(market_avg_rate)} (market avg.)
                        </span>
                    </p>
                </div>
                <div class="w-auto">
                    <a class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
                        href="https://tinyurl.com/cedar-get-alert-link">Send Money
                    </a>
                </div>
                <div class="">
                    <button on:click={hidePromotionBar} type="button" class="-mr-1 flex rounded-md p-2 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-white dark:text-gray-200"><span class="sr-only">Dismiss</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-6 w-6 text-white"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button>
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