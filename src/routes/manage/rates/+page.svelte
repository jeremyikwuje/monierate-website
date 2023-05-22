<script>
    import Rate from './Rate.svelte'

    import {request, toggleButtonLoad, toggleMessage} from '$lib/helper.svelte'
	import { onMount } from 'svelte';
	/** @type {import('./$types').PageData} */
    
    export let data
    const changers = data.changers

    /** update changer values */
    let rate = {
        buy: 0,
        sell: 0
    }

    async function changeRate() {
        let changer = document.querySelector("#field-changer")

        const payload = {
            changer_code: changer.value,
            currency: 'usd',
            rate: rate
        }

        if (payload.changer_code.length == 0) {
            console.log("No changer code")
            toggleMessage("Select a Changer")
            return
        }
        if (payload.rate.buy == 0) {
            console.log("No buy rate")
            toggleMessage("Input a buy rate")
            return
        }
        if (payload.rate.sell == 0) {
            console.log("No sell rate")
            toggleMessage("Input a sell rate")
            return
        }

        toggleButtonLoad("#btn-change")

        const response = await request('post', '/manage/rates', payload)
        if (response.status == "error") {
            toggleMessage(response.message)
            return
        }

        toggleMessage(response.message, "success")
        reloadRates()

        rate.buy = 0
        rate.sell = 0
    }

    async function getRates() {
        const response = await request('get', '/manage/rates', {})
        return response.data
    }

    let rates = getRates()
    function reloadRates() {
        rates = getRates()
    }
</script>

<body class="bg-gray-100">
    <div class="py-4 px-4 mx-auto w-[98%] md:w-[80%]">
        <h1 class="text-2xl mb-4">
            <a href="/manage">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </a>
            Rates
        </h1>

        <div class="flex flex-col justify-between item-center md:flex-row">
            <div class="md:w-[300px] mb-4">
                <div class="bg-white shadow-lg p-4 md:w-[300px] rounded-lg">
                    <h2 class="mb-4 font-bold">Update rate</h2>
                    <div class="" id="rate-update-form">
                        <span class="block mb-4">
                            <label for="">Changer</label>
                            <select id="field-changer" class="select">
                                <option value="">--select changer--</option>
                                {#each Object.entries(changers) as [index, changer]}
                                    <option value="{changer.code}">{changer.name}</option>
                                {/each}
                            </select>
                        </span>
                        <span class="block mb-4">
                            <label for="">Buy rate</label>
                            <input type="tel" class="px-2 py-2 input" id="field-buy" bind:value={rate.buy}>
                        </span>
                        <span class="block mb-4">
                            <label for="">Sell rate</label>
                            <input type="tel" class="px-2 py-2 input" id="field-sell" bind:value={rate.sell}>
                        </span>   
                        <button class="btn btn-primary" on:click={changeRate} id="btn-change">Save</button>
                    </div>
                </div>     
            </div>
            <div class="md:w-[70%]">
                {#await rates}
                    <span>Loading...</span>
                {:then data}
                    <Rate rates={data}/>
                {/await}
            </div>
        </div> 
    </div>

    <div id="alert" class="hidden w-auto md:min-w-[200px] absolute top-10 right-5 bg-white shadow rounded-lg border border-gray-800 p-3 shadow-lg text-dark">
        <div class="flex flex-row">
            <div class="ml-2 mr-6">
                <span class="block text-gray-900" id="alert-message"></span>
            </div>
        </div>
    </div>
</body>

<style>
</style>