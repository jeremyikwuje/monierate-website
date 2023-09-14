<script>
    import {toggleButtonLoad, toggleMessage} from '$lib/functions'

    let email = ""

	const subscribe = async () => {
        if (email.length == 0) {
            toggleMessage("Input your email, please.")
            return
        }

        toggleButtonLoad("#btn-subscribe")

        const response = await fetch('/subscribe', {
            method: 'PUT',
            body: JSON.stringify({ email })
        })
        const json = await response.json();
        console.log(json);

        toggleButtonLoad("#btn-subscribe")

        if (json.status == "error") {
            toggleMessage(json.message)
            return
        }

        email = ""
        toggleMessage(json.message, "success")
    }
</script>

<svelte:head>
	<title>Naira Rate Alerts | Monierate</title>
	<meta name="description" content="Get naira exchange rates straight to your email inbox every day or week.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Naira Rate Alerts | Monierate" />
	<meta property="og:description" content="Get naira exchange rates straight to your email inbox every day or week." />
	<meta property="og:url" content="monierate.com/alerts" />
    <meta property="og:image" content="https://monierate.com/monierate-og-image.png">
</svelte:head>

<main class="container md:w-[768px] md:mx-auto">
    <section class="w-full mx-auto pb-16 text-center">
        <h1 class="text-2xl md:text-5xl mb-2 dark:text-gray-100">
            Naira Rate Alerts
        </h1>
        <span class="text-lg">
            The NGN market is disorganized and complex. Stay ahead every morning.
        </span>
    </section>

    <section class="w-[95%] md:w-[80%] mx-auto">
        <div class="border border-gray-300 rounded dark:border-gray-800 px-6 py-8">
            <h2 class="text-xl md:text-2xl mb-6">
                Get rate alerts straight to your email inbox
            </h2>

            <div class="flex items-center pl-4 border border-gray-400 rounded dark:border-gray-700 mb-8">
                <input id="checkbox-black-market" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="checkbox-black-market" class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Daily email about the USD → NGN black market rate
                </label>
            </div>
    
            <div>
                <label for="field-email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email address</label>
                <input type="email" class="input w-full rounded-lg" id="field-email" placeholder="Email address" bind:value={email}>
            </div>
            
            <span id="alert" class="block hidden py-4"></span>
    
            <div class="text-center mb-8">
                <button class="button py-4 bg-black mt-4" id="btn-subscribe" on:click={subscribe}>
                    Get rate alerts
                </button>
            </div>

            <div class="text-center">
                <a href="/account/alerts" class="font-semibold text-gray-600 dark:text-gray-300">Manage my alerts</a>
            </div>
        </div>

        <div class="mt-12">
            <span class="block text-sm text-gray-600 dark:text-gray-600">
                Monierate Naira Rate Alerts always shows the most reliable naira exchange rate in the market. We sourced and aggregate exchange rate data from multiple providers in Nigeria. Exchange rates move frequently and the current rate might not be available for long. Getting this rate doesn't gaurantee the rate may the same when you try to exchange using your favorite wallet, banks, or money agent. By creating a rate alert, you accept the Monierate terms.
            </span>
        </div>
    </section>
</main>