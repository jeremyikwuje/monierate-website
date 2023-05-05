<script>
    /** @type {import('./$types').PageData} */
    import { toggleButtonLoad, toggleMessage } from "$lib/helper.svelte";
	import Money from "$lib/money";

    export let data;
    let rates = data.rates || {}

    console.log(rates)

    let email = "";
    let year = (new Date()).getFullYear()

    async function join() {
        const btn = "#btn-join";
        toggleButtonLoad(btn);

        const payload = {
            email: email
        };

        if (payload.email.trim() == "") {
            toggleMessage("Provide your email address")
            toggleButtonLoad(btn);

            return;
        }

        const res = await fetch("https://account-api.forward.africa/v1/waitlist", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" 
            },
            body: JSON.stringify(payload)
        });

        let json = await res.json();
        console.log(json);

        toggleButtonLoad(btn);

        if (json.status == "success") {
            toggleMessage("Success! You have been added to the rate list.", "success");
            return;
        }
        else if (json.status == "error")
        {
            toggleMessage(json.message);
            return;
        }
        else {
            toggleMessage("Server not responding, please check back later.")
        }
    }
</script>

<header class="w-[95%] md:w-[1121px] mx-auto mb-12">
    <div id="brand" class="nav-brand flex justify-between items-center mb-8 py-4">
        <img src="/monierate.png" class="h-[32px]" alt="WalletRate Logo">
        <a href="https://monierate.substack.com" class="border border-primary py-2 px-4 rounded-lg bg-primary font-semibold uppercase text-black">Subscribe</a>
    </div>
</header>

<main class="w-[95%] md:w-[768px] mx-auto mb-12">
    <div class="mb-8">
        <h1 class="text-3xl md:text-5xl text-center mb-4">Compare dollar rates</h1>
        <div class="text-center mb-4 px-8">
            <p>We provide dollar rates accross reputable providers in Nigeria. Get more dollar for naira by visiting Monierate.com.</p>
        </div>
        <div class="flex items-center justify-center">
            <div class="w-[400px] flex items-center justify-center">
                <!-- <input placeholder="Email address" type="email" class="bg-transparent border border-gray-200 py-4 px-2 border-r-0 rounded-l-lg w-[70%]" bind:value={email}> -->
                
            </div>
        </div>
        <span class="block text-center pt-4 hidden" id="alert"></span>
    </div>
    <div class="changers-box bg-white px-[15px] py-[10px] rounded-lg shadow-t-md">
        <ul class="changers block p-0" id="changers">
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
        </ul>
    </div>
</main>

<footer>
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
                Built and maintained by <a href="https://twitter.com/jeremyikwuje" class="text-black">@jeremyikwuje ⚡</a>
            </p>
        </div>
    </div>
</footer>

<style>
    .changer {
        @apply flex justify-between items-center py-2 border-b border-gray-200;
    }
    .changer:last-child {
        @apply border-b-0
    }
    .changer-icon {
        @apply bg-transparent border border-gray-50 rounded-full w-[32px] h-[32px] mr-2;
    }
    .changer-title {
        @apply font-semibold text-xl capitalize;
    }
    .changer-rate-base {
        @apply text-gray-500;
    }
    .changer-rate {
        @apply block font-semibold text-xl;
    }

    footer p {
        @apply mb-4;
    }
</style>