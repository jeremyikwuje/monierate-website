<script>
	import { goto, invalidateAll } from '$app/navigation';
    import {  clearPopup, toggleButtonLoad, toggleMessage, togglePopup } from '$lib/functions'
	import { onMount } from 'svelte';

    export let data

    let auth = data.auth
    let confirm = data.confirm
    
    let authenticated = false

    onMount( ()=> {
        if (confirm != null) {
            togglePopup(confirm)
            goto('/alerts')
        }

        if (auth != null) {
            if (auth.status == "error") {
                togglePopup(auth)
            }
            else {
                authenticated = true
            }
        }
    })

    let email = ""
    let emailManage = ""
    let checked = false

	const subscribe = async () => {
        console.log(checked)

        let emailField = document.querySelector('#field-email')
        let checkedField = document.querySelector('#checked-wraper')

        if (!checked) {
            checkedField?.classList.add("border-red-600")
            toggleMessage("Select a rate")
            return
        }
        
        checkedField?.classList.remove('border-red-600')

        if (email.length == 0) {
            emailField?.classList.add("border-red-600")
            toggleMessage("Input your email, please.")
            return
        }

        emailField?.classList.remove('border-red-600')

        toggleButtonLoad("#btn-subscribe")

        const payload = {
            email,
            interval: 'DAY'
        }
        const response = await fetch('/api/alerting', {
            method: 'PUT',
            body: JSON.stringify(payload)
        })
        const json = await response.json();

        toggleButtonLoad("#btn-subscribe")
        togglePopup(json)

        if (json.status == "error") {
            return
        }

        email = ""
        checked = false
    }

    const deleteAlert = async (id) => {
        console.log(checked)
        
        if (id.length == 0) {
            return
        }

        const payload = {
            id,
        }
        const response = await fetch('/api/alerting', {
            method: 'DELETE',
            body: JSON.stringify(payload)
        })
        const json = await response.json();
        
        togglePopup(json)

        if (json.status == "error") {
            return
        }

        invalidateAll()
    }

    const login = async () => {
        let emailField = document.querySelector('#manage-field-email')

        if (emailManage.length == 0) {
            emailField?.classList.add("border-red-600")
            alert("Input your email, please.")
            return
        }

        emailField?.classList.remove('border-red-600')

        toggleButtonLoad("#btn-login")

        const payload = {
            email: emailManage
        }
        const response = await fetch('/api/alerting', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        const json = await response.json();
        console.log(json);

        toggleButtonLoad("#btn-login")
        togglePopup(json)

        if (json.status == "error") {
            return
        }

        email = ""
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
        <div class="border border-gray-300 rounded dark:border-gray-800 px-6 py-8 mb-8">
            <h2 class="text-xl md:text-2xl mb-6">
                Get rate alerts straight to your email inbox
            </h2>

            <div class="flex items-center pl-4 border border-gray-400 rounded dark:border-gray-700 mb-8" id="checked-wraper">
                <input bind:checked id="field-black-market" type="checkbox" name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="field-black-market" class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
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
        </div>

        {#if authenticated }
            <div class="border border-gray-300 rounded dark:border-gray-800 px-6 py-8 mb-12">
                <h2 class="text-xl md:text-2xl mb-6">
                    My alerts
                </h2>
    
                <table class="table-auto overflow-x-scroll w-full text-sm text-left">
                    <tbody class="changers">
                        {#each Object.entries(data.alerts) as [index, alert]}
                        <tr class="mb-4">
                            <td>{alert.market.toUpperCase()}</td>
                            <td>{alert.interval}</td>
                            <td>{alert.currency}</td>
                            <td>{alert.currency_in}</td>
                            <td>
                                <button class='text-red-600' on:click={ () => deleteAlert(alert.id) }>Delete</button>
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <div class="border border-gray-300 rounded dark:border-gray-800 px-6 py-8 mb-8">
                <h2 class="text-xl md:text-2xl mb-6">
                    Manage alerts
                </h2>
                <span class="block mb-8 text-gray-600">
                    A magic link will be sent to your email to manage existing your alerts.
                </span>
        
                <div>
                    <label for="field-email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email address</label>
                    <input type="email" class="input w-full rounded-lg" id="manage-field-email" placeholder="Email address" bind:value={emailManage}>
                </div>
                
                <span id="alert" class="block hidden py-4"></span>
        
                <div class="text-center mb-8">
                    <button class="button py-4 bg-black mt-4" id="btn-login" on:click={login}>
                        Send magic link
                    </button>
                </div>
            </div>
        {/if}

        <div class="mt-12">
            <span class="block text-sm text-gray-600 dark:text-gray-600">
                Monierate Naira Rate Alerts always shows the most reliable naira exchange rate in the market. We sourced and aggregate exchange rate data from multiple providers in Nigeria. Exchange rates move frequently and the current rate might not be available for long. Getting this rate doesn't gaurantee the rate may the same when you try to exchange using your favorite wallet, banks, or money agent. By creating a rate alert, you accept the Monierate terms.
            </span>
        </div>
    </section>
</main>

<div id="popup" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden w-full overflow-y-hidden h-[calc(100%)] max-h-full hidden bg-gray-50">
    <div class="w-full flex flex-col justify-center h-[100vh]">
        <div class="w-[80%] md:w-[500px] min-h-[240px] mx-auto relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="p-6 text-center">
                <svg class="mx-auto mb-6 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 class="text-lg font-normal text-gray-500 dark:text-gray-400 mb-8" id="popup-message">message here</h3>
                <button on:click={clearPopup} type="button" class="button bg-black">
                    Okay
                </button>
            </div>
        </div>
    </div>
</div>