<script lang="ts">
import type { PageServerData } from "./$types"
import Money from "$lib/money";
import { round, chain } from "mathjs"

export let data: PageServerData;
let changer = data.changer
let market = data.market
let convert = data.convert
const currencies = data.currencies

let rates = JSON.parse(market.rates)
let convertFrom = convert.From.toUpperCase()
let convertTo = convert.To.toUpperCase()
let convertAmount = parseFloat(`${convert.Amount}`)

let convertResult = {
    rate: 0,
    rateInverse: 0,
    conversion: 0,
}

// initialize market currencies
var marketCurrencies: [] = []
var currencyFrom: any = {}
var currencyTo: any = {}
var moreConversions: any = {
    from: [],
    to: []
}

function convertNow() {
    let from = convertFrom.toLowerCase()
    let to = convertTo.toLowerCase()

    console.log(from + to)

    let rate = 1  // 1:1
    let rateInverse = 1
    
    if (from != to) {
        
        if (!rates.hasOwnProperty(from)) {
            convertResult.rate = 0
            convertResult.rateInverse = 0
            convertResult.conversion = 0

            return
        }

        let pair = JSON.parse(rates[from])
        if (!pair.hasOwnProperty(to)) {
            convertResult.rate = 0
            convertResult.rateInverse = 0
            convertResult.conversion = 0
            
            return
        }

        let pairInverse = JSON.parse(rates[to])
        if (!pairInverse.hasOwnProperty(from)) {
            convertResult.rate = 0
            convertResult.rateInverse = 0
            convertResult.conversion = 0
            
            return
        }

        rate = pair[to]
        rateInverse = pairInverse[from]
    }

    /** Calcuate the conversion*/
    convertResult.rate = rate
    convertResult.rateInverse = rateInverse
    convertResult.conversion = round(chain(rate).multiply(convertAmount).done(), 8)

    currencyFrom = marketCurrencies.find( c => c.code === from)
    currencyTo = marketCurrencies.find( c => c.code === to)
    reloadMoreConversions()
}

function updateCurrencies() {
    let from = convertFrom.toLowerCase()
    let to = convertTo.toLowerCase()
    
    currencies.forEach( (currency: any) => {
        let code = currency.code

        if (rates.hasOwnProperty(code)) {
            marketCurrencies.push(currency)
        }
    })
}

async function getMoreConversions() {
    let series = [ 1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000 ]
    let conversions: any = {
        from: [],
        to: []
    }

    series.forEach( serie => {

        let rate = convertResult.rate
        conversions.from.push({
            amount: serie,
            conversion: round(chain(rate).multiply(serie).done(), 8)
        })

        let rateInverse = convertResult.rateInverse
        conversions.to.push({
            amount: serie,
            conversion: round(chain(rateInverse).multiply(serie).done(), 8)
        })
    })

    return conversions
}

function reloadMoreConversions() {
    moreConversions = getMoreConversions()
}

// run the conversions

updateCurrencies()
convertNow()

</script>

<svelte:head>
	<title>
        {Money.format(convertAmount)} {convertFrom} to {convertTo} on {changer.name} - Convert {currencyFrom.name} to {currencyTo.name} on {changer.name}
    </title>
    <meta name="description" content="Convert {currencyFrom.name} to {currencyTo.name} on {changer.name}. {changer.name} {currencyFrom.name} rate. {changer.name} {currencyFrom.name} rate. {changer.name} {currencyTo.name} rate. {changer.name} converter">
    <meta name="keywords" content="{changer.name} {currencyFrom.name} rate, {changer.name} {currencyTo.name} rate, {changer.name} converter">
</svelte:head>

<div class="bg-gray-50 mt-8 mb-8">
    <div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 text-center">
        <h1 class="text-2xl md:text-3xl">
            {Money.format(convertAmount)} {convertFrom} to {convertTo} on {changer.name} - Convert {currencyFrom.name} to {currencyTo.name} on {changer.name}
        </h1>
        <span class="inline-block bg-transparent border border-black rounded-full w-[32px] h-[32px] mt-4">
            <img src="/icons/{changer.icon}" class="rounded-full" alt="{changer.icon}">
        </span>
    </div>
    
    <div id="changer-rate-wrapper" class="w-[95%] md:w-[70%] bg-white shadow-lg rounded-lg px-8 py-4 mx-auto">
        <div class="flex justify-center item-center">
            <div class="w-full">
                <div class="block md:flex md:justify-between md:items-center">
                    <span class="block md:w-[30%]">
                        <label class="label" for="field-convert-amount">Amount</label>
                        <input type="number" id="field-convert-amount" class="input" bind:value={convertAmount} on:input={() => convertNow()}>
                    </span>
                    <span class="block md:w-[30%]">
                        <label class="label" for="field-convert-from">From</label>
                        <select id="field-convert-from" class="select" bind:value={convertFrom} on:change={convertNow}>
                            {#each Object.entries(marketCurrencies) as [index, currency]}
                                <option value="{currency.code.toUpperCase()}">{currency.code.toUpperCase()} - {currency.name}</option>
                            {/each}
                        </select>
                    </span>
                    <span class="block md:w-[30%]">
                        <label class="label" for="field-convert-to">To</label>
                        <select id="field-convert-to" class="select" bind:value={convertTo} on:change={convertNow}>
                            {#each Object.entries(marketCurrencies) as [index, currency]}
                                <option value="{currency.code.toUpperCase()}">{currency.code.toUpperCase()} - {currency.name}</option>
                            {/each}
                        </select>
                    </span>
                </div>
                <div id="convert-result" class="mt-8 mb-8">
                    <span class="block font-semibold text-lg text-gray-600 mb-2">
                        {Money.format(convertAmount)} {currencyFrom.name} =
                    </span>
                    <span class="block font-bold text-3xl mb-2 text-dark">
                        {Money.format(convertResult.conversion)} {currencyTo.name}
                    </span>
                    <span class="block text-gray-500">
                        1 {convertFrom} = {Money.format(convertResult.rate)} {convertTo}
                    </span>
                    <span class="block text-gray-500">
                        1 {convertTo} = {Money.format(convertResult.rateInverse)} {convertFrom}
                    </span>
                </div>
                <div class="block md:flex md:justify-between md:items-center">
                    <span class="flex justify-between items-center bg-accent-100 md:w-[40%] border rounded-lg p-4 mb-8 md:mb-0">
                        <span class="inline-block mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>                          
                        </span>
                        <span class="text-gray-600 text-sm">
                            We use the rate from {changer.name} for this conversion. This is for informational purposes only.
                        </span>
                    </span>
                    <span class="block text-sm md:w-[50%] p-4">
                        {currencyFrom.name} to {currencyTo.name} conversion on {changer.name} — Last updated {new Date(market.updatedAt)}
                    </span>
                </div>
                
                <span class="block mt-12">
                    <a href="{changer.link}" class="btn btn-primary btn-sm">
                        Open {changer.name}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>                          
                    </a>
                 </span>
            </div>
        </div>
    </div>

    <div class="block w-[95%] mx-auto md:w-[70%] md:flex md:justify-between md:items-center mt-8">
        <div class="bg-white shadow-lg rounded-lg md:w-[40%] mb-4">
            <span class="bg-green-100 block py-4 px-8">
                <h3 class="text-center text-lg">
                    Convert {currencyFrom.name} to {currencyTo.name} on {changer.name}
                </h3>
            </span>
            <div class="pb-4">
                {#await moreConversions}
                    <span class="block text-center py-8 px-4">Loading...</span>
                {:then data}
                <table class="w-full text-center px-8">
                    <thead class="bg-green-100">
                        <tr>
                            <th class="py-4">{convertFrom}</th>
                            <th class="py-4">{convertTo}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each Object.entries(data.from) as [index, convert]}
                        <tr>
                            <td class="py-2.5">
                                <a data-sveltekit-reload href="/converter/{changer.code}?Amount={convert.amount}&From={convertFrom}&To={convertTo}">
                                    {Money.format(convert.amount)} {convertFrom}
                                </a>
                            </td>
                            <td class="py-2.5">
                                {Money.format(convert.conversion)} {convertTo}
                            </td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
                {/await}
            </div>
        </div>
        <div class="bg-white shadow-lg rounded-lg md:w-[40%] mb-4">
            <span class="bg-green-100 block py-4 px-8">
                <h3 class="text-center text-lg">Convert {currencyTo.name} to {currencyFrom.name} on {changer.name}</h3>
            </span>
            <div class="pb-4">
                {#await moreConversions}
                    <span class="block text-center py-8 px-4">Loading...</span>
                {:then data}
                    <table class="w-full text-center px-8">
                        <thead class="bg-green-100">
                            <tr>
                                <th class="py-4">{convertTo}</th>
                                <th class="py-4">{convertFrom}</th>
                            </tr>
                        </thead>
                        <tbody>
                                {#each Object.entries(data.to) as [index, convert]}
                                <tr>
                                    <td class="py-2.5">
                                        <a data-sveltekit-reload href="/converter/{changer.code}?Amount={convert.amount}&From={convertTo}&To={convertFrom}">
                                            {Money.format(convert.amount)} {convertTo}
                                        </a>
                                    </td>
                                    <td class="py-2.5">
                                        {Money.format(convert.conversion)} {convertFrom}
                                    </td>
                                </tr>
                                {/each}
                        </tbody>
                    </table>
                {/await}
            </div>
        </div>
    </div>
</div>


<style>
   label {
    @apply font-bold;
   }
</style>