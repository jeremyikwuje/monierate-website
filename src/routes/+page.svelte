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

<header>
    <div id="brand" class="nav-brand flex justify-center items-center mb-8 py-8">
        <img src="/monierate.png" class="h-[32px]" alt="WalletRate Logo">
    </div>
</header>

<main class="w-[95%] md:w-[768px] mx-auto mb-12">
    <div class="mb-8">
        <h1 class="text-3xl md:text-5xl text-center mb-4">Compare dollar card rates</h1>
        <div class="text-center mb-4 px-8">
            <p>We provide dollar rates accross 10 reputable virtual card apps in Nigeria. Get them straight to your inbox every morning.</p>
        </div>
        <div class="flex items-center justify-center">
            <div class="w-[400px] flex items-center justify-center">
                <input placeholder="Email address" type="email" class="bg-transparent border border-gray-200 py-4 px-2 border-r-0 rounded-l-lg w-[70%]" bind:value={email}>
                <button on:click={join} id="btn-join" class="border border-primary py-4 px-4 border-l-0 rounded-r-lg bg-primary font-semibold uppercase">Get Rate</button>
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
        <h2 class="font-semibold text-2xl mb-4">About Monierate.com</h2>
        <div class="mb-8">
            <p>Founded in 2023, Monierate.com is designed to transform the way consumers discover the best deals when exchanging dollars accross Africa.</p>
            <p>We believe exchanging currencies should be a painless experience for everyone involved. We help our users navigate their way across the sea of currency exchange providers by offering detailed insight and guidance on all things currency exchange.</p>
            <p>There are so many different companies to consider, each with their own unique exchange rates. Our aim is to remove the difficulty in finding and using suitable currency exchange providers by guiding you through every single step to ensure you make the best decision for your specific needs.</p>
        </div>
        <div class="">
            &copy; Monierate - { year } <a href="https://twitter.com/jeremyikwuje" class="text-black">@jeremyikwuje</a>
        </div>
    </div>
</footer>

<style>
    .changer {
        @apply flex justify-between items-center py-2 border-b border-gray-200;
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