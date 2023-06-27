<script>
import "../app.css";
import { page } from "$app/stores";

$: paths = $page.url.pathname.split('/')
$: path = paths[1] ?? 'home'

console.log(path)

let year = (new Date()).getFullYear()
</script>

<header>
    <nav id="brand" class="">
        <div class="container flex flex-col md:flex-row justify-between items-center pt-4 md:py-4">
            <div class="mb-8 md:mb-0">
                <a href="/">
                    <img src="/monierate.png" height="24px" class="h-[28px] md:h-[34px]" alt="Monierate Logo">
                </a>
            </div>
            
            <div class="nav-link flex justify-between items-center">
                <a href="/" class={path == '' ? 'active': ''}>$1 Today</a>
                <!-- <a href="/converter" class="{path == 'converter' ? 'active': ''}">Converter</a> -->
                <a href="/blog" class="{path == 'blog' ? 'active': ''} hidden md:inline-block">Blog</a>
            </div>
        </div>
    </nav>
</header>
    
<slot />
    
<hr class="mt-16">
<footer class="pt-16 pb-8 mt-8 text-gray-500">
    <div class="w-[95%] md:w-[70%] mx-auto block md:flex justify-between item-center">
        <div class="w-full md:w-[30%]">
        <h3 class="font-bold">Currency converter</h3>
        <ul class="py-4 converter-list">
            <li><a data-sveltekit-reload href="/converter/binance?Amount=1&From=USDT&To=NGN">Convert USDT on Binance</a></li>
            <li><a data-sveltekit-reload href="/converter/remitano?Amount=1&From=USDT&To=NGN">Convert USDT on Remitano</a></li>
            <li><a data-sveltekit-reload href="/converter/quidax?Amount=1&From=USDT&To=NGN">Convert USDT on Quidax</a></li>
            <li><a data-sveltekit-reload href="/converter/yellowcard?Amount=1&From=USDT&To=NGN">Convert USDT on Yellow Card</a></li>
            <li><a data-sveltekit-reload href="/converter/luno?Amount=1&From=USDC&To=NGN">Convert USDC on Luno</a></li>
            <li><a data-sveltekit-reload href="/converter/bitmama?Amount=1&From=USDC&To=NGN">Convert USDC on Bitmama</a></li>
            <li><a data-sveltekit-reload href="/converter/payday?Amount=1&From=USD&To=NGN">Convert USD on Payday</a></li>
            <li><a data-sveltekit-reload href="/converter/wirepay?Amount=1&From=USD&To=NGN">Convert USD on Wirepay</a></li>
            <li><a data-sveltekit-reload href="/converter/bitnob?Amount=1&From=USD&To=NGN">Convert USD on Bitnob</a></li>
            <li><a data-sveltekit-reload href="/converter/eversend?Amount=1&From=USD&To=NGN">Convert USD on Eversend</a></li>
            <li><a data-sveltekit-reload href="/converter/klasha?Amount=1&From=USD&To=NGN">Convert USD on Klasha</a></li>
            <li><a data-sveltekit-reload href="/converter/coinprofile?Amount=1&From=USD&To=NGN">Convert USD on Coinprofile</a></li>
        </ul>
        </div>
        <div class="w-full md:w-[50%]">
            <span class="block mb-8">
                <span class="font-bold block mb-2 text-gray-800">Contacts</span>
                <span class="font-bold text-xl block mb-2 text-gray-800">hello@monierate.com</span>
            </span>

            <span class="block text-sm">
            &copy; { year }, Monierate.com. 
            </span>

            <div class="mt-4">
            <p class="text-sm mb-4 text-gray-500">
                We aggregate the exchange rates from multiple market providers. This is for informational purposes only.
            </p>
            <p class="text-sm mb-4 text-gray-500">
                References made to third party names, logos and trademarks on this website are to identify corresponding goods and services that Monierate visitor can themselves exchange currencies. Unless otherwise specified, the trademark holders are not affiliated with Monierate, our products or website, and they do not sponsor or endorse Monierate services. Such references are included strictly as nominative fair use under applicable trademark law and remain fully the property of their respective trademark holders.
            </p>
            <p class="text-sm">
                Built and maintained by <a href="https://twitter.com/jeremyikwuje" class="text-gray-800">@jeremyikwuje ⚡</a> and <a href="https://twitter.com/onionsman" class="text-gray-800">@onionsman</a>
            </p>
            </div>
        </div>
    </div>
</footer>

<div id="alert" class="hidden w-auto md:min-w-[200px] toast toast-end">
    <div class="alert shadow-lg bg-white text-gray-900 border border-gray-700">
    <div>
        <span id="alert-message"></span>
    </div>
    </div>
</div>

<style> 
    .nav-link a {
        @apply block md:inline-block md:w-auto text-gray-800 mr-0 md:mr-6 py-2 px-2 hover:text-black text-center font-bold;
    }
    .nav-link a:first-child {
        @apply mr-4 md:mr-6;
    }
    .nav-link a:last-child {
        @apply mr-0;
    }
    .nav-link a.active {
        @apply text-black border-b-4 border-gray-800;
    }

    footer .converter-list {
        @apply py-4;
    }
    footer .converter-list li {
        @apply mb-4
    }
    footer .converter-list a {
        @apply block text-sm text-gray-500 font-semibold;
    }
</style>