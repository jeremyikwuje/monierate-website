<script>
import "../app.css";
import { page } from "$app/stores";
import { onMount } from "svelte";

$: paths = $page.url.pathname.split('/')
$: paths.shift()
$: path = paths[0] ?? 'home'
$: currentPath = paths[paths.length - 1]
$: paths.pop()

let year = (new Date()).getFullYear()

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

</script>

<svelte:head>
    
</svelte:head>

<header class="mb-16">
    <nav class="fixed bg-white w-full z-20 top-0 left-0 border-b border-gray-200 dark:bg-gray-900 dark:border-none">
        <div class="w-[95%] md:max-w-[1200px] flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" class="flex items-center">
                <img src="/monierate.png" width="142px" height="24px" class="block dark:hidden h-[24px] w-[142px] md:h-[24px] h-8 mr-3" alt="Monierate Logo" loading="lazy">
                <img alt="Monierate Logo" width="142px" height="24px" class="hidden dark:block h-[24px] w-[142px] md:h-[24px]" src="/monierate-logo-white.png" loading="lazy">
            </a>
            <div class="flex md:order-2">
                <a href="/alerts" type="button" class="font-bold text-white bg-black hover:text-slate-200 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-primary dark:hover:bg-white dark:focus:ring-blue-800">
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

{#if path != ''}
<div class="bg-white dark:bg-gray-800 dark:border-gray-600 shadow-b-md mb-16">
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

<footer class="pt-16 pb-8 mt-8 text-gray-500 dark:text-gray-300">
    <div class="container mx-auto block md:flex justify-between item-center">
        <div class="w-full md:w-[30%]">
            <h3 class="font-bold">Currency converter</h3>
            <ul class="py-4 converter-list">
                <li><a data-sveltekit-reload href="/converter/binance?Amount=1&From=USDT&To=NGN">Convert USDT on Binance</a></li>
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
                <li><a data-sveltekit-reload href="/converter/payday?Amount=1&From=USD&To=NGN">Convert USD on Payday</a></li>
                <li><a data-sveltekit-reload href="/converter/wirepay?Amount=1&From=USD&To=NGN">Convert USD on Wirepay</a></li>
            </ul>
        </div>
        <div class="w-full md:w-[30%]">
            <h3 class="font-bold">Tools</h3>
            <ul class="py-4 converter-list">
                <li><a href="/alerts">Price Alerts</a></li>
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
            <p class="text-sm">
                Built and maintained by <a href="https://twitter.com/jeremyikwuje" class="text-gray-800 dark:text-gray-300">@jeremyikwuje ⚡</a> and <a href="https://twitter.com/onionsman" class="text-gray-800 dark:text-gray-300">@onionsman</a>
            </p>
            </div>
        </div>
    </div>
</footer>

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