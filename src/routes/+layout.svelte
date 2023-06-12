<script>
  import "../app.css";

  let year = (new Date()).getFullYear()
</script>

<header>
  <div id="brand" class="nav-brand container flex justify-between items-center py-4">
      <a href="/">
        <img src="/monierate.png" class="h-[24px]" alt="Monierate Logo">
      </a>
      <a href="https://monierate.substack.com" class="border-2 border-black py-2 px-4 rounded-lg bg-primary font-semibold uppercase text-black">Subscribe</a>
  </div>
</header>

<slot />

<footer class="pt-16 pb-8 mt-8 bg-black text-white">
  <div class="w-[95%] md:w-[70%] mx-auto block md:flex justify-between item-center">
      <div class="w-full md:w-[30%]">
        <h3 class="font-bold">Currency converter</h3>
        <ul class="py-4 converter-list">
          <a data-sveltekit-reload href="/converter/binance?Amount=1&From=USDT&To=NGN">Convert USDT on Binance</a>
          <a data-sveltekit-reload href="/converter/remitano?Amount=1&From=USDT&To=NGN">Convert USDT on Remitano</a>
          <a data-sveltekit-reload href="/converter/quidax?Amount=1&From=USDT&To=NGN">Convert USDT on Quidax</a>
          <a data-sveltekit-reload href="/converter/yellowcard?Amount=1&From=USDT&To=NGN">Convert USDT on Yellow Card</a>
          <a data-sveltekit-reload href="/converter/luno?Amount=1&From=USDC&To=NGN">Convert USDC on Luno</a>
          <a data-sveltekit-reload href="/converter/bitmama?Amount=1&From=USDC&To=NGN">Convert USDC on Bitmama</a>
          <a data-sveltekit-reload href="/converter/payday?Amount=1&From=USD&To=NGN">Convert USD on Payday</a>
          <a data-sveltekit-reload href="/converter/wirepay?Amount=1&From=USD&To=NGN">Convert USD on Wirepay</a>
          <a data-sveltekit-reload href="/converter/bitnob?Amount=1&From=USD&To=NGN">Convert USD on Bitnob</a>
          <a data-sveltekit-reload href="/converter/eversend?Amount=1&From=USD&To=NGN">Convert USD on Eversend</a>
          <a data-sveltekit-reload href="/converter/klasha?Amount=1&From=USD&To=NGN">Convert USD on Klasha</a>
          <a data-sveltekit-reload href="/converter/coinprofile?Amount=1&From=USD&To=NGN">Convert USD on Coinprofile</a>
        </ul>
      </div>
      <div class="w-full md:w-[50%]">
          <span class="block mb-8">
              <span class="font-bold block mb-2">Contacts</span>
              <span class="font-bold text-xl block mb-2">hello@monierate.com</span>
          </span>

          <span class="block text-sm">
            &copy; { year }, Monierate.com. 
          </span>

          <div class="mt-4">
            <p class="text-sm mb-4">
              We aggregate the exchange rates from multiple market providers. This is for informational purposes only.
            </p>
            <p class="text-sm mb-4">
              References made to third party names, logos and trademarks on this website are to identify corresponding goods and services that Monierate visitor can themselves exchange currencies. Unless otherwise specified, the trademark holders are not affiliated with Monierate, our products or website, and they do not sponsor or endorse Monierate services. Such references are included strictly as nominative fair use under applicable trademark law and remain fully the property of their respective trademark holders.
            </p>
            <p class="text-sm">
              Built and maintained by <a href="https://twitter.com/jeremyikwuje" class="text-white">@jeremyikwuje ⚡</a> and <a href="https://twitter.com/onionsman" class="text-white">@onionsman</a>
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
  footer .converter-list {
    @apply py-4;
  }
  footer .converter-list a {
    @apply text-white mb-2 block text-sm;
  }
</style>