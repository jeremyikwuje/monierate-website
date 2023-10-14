<script lang="ts">
import type { PageData } from "./$types"
import Money from "$lib/money";
import { round, chain } from "mathjs"
import { changeParam } from "$lib/functions"

export let data: PageData;
let changers = data.changers
let rates_avg = data.market_avg
let pairs = data.pairs
let convert = data.convert
let currencies = data.currencies

let convertFrom = convert.From.toUpperCase()
let convertTo = convert.To.toUpperCase()
let convertAmount = parseFloat(`${convert.Amount}`)

let convertResult = {
    rate: 0,
    rateInverse: 0,
    conversion: 0,
}

// initialize supported currencies
var supported_pairs = ['usdngn', 'btcngn', 'usdtngn', 'usdcngn']

var currencyFrom: any = {}
var currencyTo: any = {}
var updatedAt = ''

function convertNow() {
    let from = convertFrom.toLowerCase()
    let to = convertTo.toLowerCase()

    console.log(from + to)

    let rates: any = rates_avg
    let average = 0
    let rate = 1  // 1:1
    let rateInverse = 1

    if (from != to) {
        /** Get the rate */
        let pair = `${from}${to}`
        if (rates.hasOwnProperty(pair)) {
            updatedAt = rates[pair].updatedAt // get last update time
            rate = rates[pair].parallel
            rateInverse = 1 / rate
        }
        else {
            pair = `${to}${from}`
            if (rates.hasOwnProperty(pair)) {
                updatedAt = rates[pair].updatedAt // get last update time
                rateInverse = rates[pair].parallel
                rate = 1 / rateInverse
            } else {
                rate = 0
                rateInverse = 0
            }
        }
    }

    /** Calcuate the conversion*/
    convertResult.rate = rate
    convertResult.rateInverse = rateInverse
    convertResult.conversion = round(chain(rate).multiply(convertAmount).done(), 8)

    currencyFrom = currencies.find( c => c.code === from)
    currencyTo = currencies.find( c => c.code === to)

    console.log(currencyFrom)
}

/** Get the rates object and return the average rate */
function calculateRate(rates: any) {
    // do not include the following rates
    const exclude = ['market', 'cbn', 'official']
    
    let n: number = 0
    let sum: number = 0
    for (let rate in rates) {
        if (exclude.includes(rate)) {
            continue
        }

        sum += parseFloat(`${rates[rate].buy}`)
        n += 1
    }

    const average = sum / n

    return round(average, 4)
}

convertNow()
</script>

<svelte:head>
	<title>
        {Money.format(convertAmount)} {convertFrom} to {convertTo} - Convert {currencyFrom.name} to {currencyTo.name} 
    </title>
    <meta name="description" content="Convert {currencyFrom.name} to {currencyTo.name}. This is the average exchange rate price of {currencyFrom.name} to {currencyTo.name} in the market right now. It is for information purposes only.">
    <meta name="keywords" content="{currencyFrom.name} to {currencyTo.name}, {currencyFrom.name} to {currencyTo.name} exchange rate, {currencyFrom.name} to {currencyTo.name} black market, {currencyFrom.name} to {currencyTo.name} rate, {currencyFrom.name} to {currencyTo.name} converter.">

    <meta property="og:type" content="website" />
	<meta property="og:title" content="{Money.format(convertAmount)} {convertFrom} to {convertTo} - Convert {currencyFrom.name} to {currencyTo.name}" />
	<meta property="og:description" content="Convert {currencyFrom.name} to {currencyTo.name}. Enter any amount in {convertFrom} to see the conversion in {convertTo}." />
</svelte:head>

<div class="mb-24">
    <div class="w-[100%] md:w-[100%] px-8 pb-4 mx-auto mb-4 text-center">
        <h1 class="text-2xl md:text-4xl">
            {Money.format(convertAmount)} {convertFrom} to {convertTo} - Convert {currencyFrom.name} to {currencyTo.name} 
        </h1>
    </div>

    <div id="changer-rate-wrapper" class="w-[95%] md:w-[70%] bg-white dark:bg-gray-900 shadow-lg rounded-lg px-8 py-4 mx-auto">
        <div class="flex justify-center item-center">
            <div class="w-full">
                <div class="block md:flex md:justify-between md:items-center">
                    <span class="block md:w-[30%]">
                        <label class="label" for="field-convert-amount">Amount</label>
                        <input type="number" id="field-convert-amount" class="input" bind:value={convertAmount} on:input={() => convertNow()} on:input={() => changeParam('Amount', convertAmount)}>
                    </span>
                    <span class="block md:w-[30%]">
                        <label class="label" for="field-convert-from">From</label>
                        <select id="field-convert-from" class="select" bind:value={convertFrom} on:change={convertNow} on:change={() => changeParam('From', convertFrom)}>
                            {#each Object.entries(currencies) as [index, currency]}
                                <option value="{currency.code.toUpperCase()}">{currency.code.toUpperCase()} - {currency.name}</option>
                            {/each}
                        </select>
                    </span>
                    <span class="block md:w-[30%]">
                        <label class="label" for="field-convert-to">To</label>
                        <select id="field-convert-to" class="select" bind:value={convertTo} on:change={convertNow} on:change={() => changeParam('To', convertTo)}>
                            {#each Object.entries(currencies) as [index, currency]}
                                <option value="{currency.code.toUpperCase()}">{currency.code.toUpperCase()} - {currency.name}</option>
                            {/each}
                        </select>
                    </span>
                </div>
                <div id="convert-result" class="mt-8 mb-8">
                    <span class="block font-semibold text-lg text-gray-600 dark:text-gray-300 mb-2">
                        {Money.format(convertAmount)} {currencyFrom.name} =
                    </span>
                    <span class="block font-bold text-3xl mb-2 dark:text-gray-200">
                        {Money.format(convertResult.conversion)} {currencyTo.name}
                    </span>
                    <span class="block text-gray-500 dark:text-gray-400">
                        1 {convertFrom} = {Money.format(convertResult.rate)} {convertTo}
                    </span>
                    <span class="block text-gray-500 dark:text-gray-400">
                        1 {convertTo} = {Money.format(convertResult.rateInverse)} {convertFrom}
                    </span>
                </div>
                <div class="block md:flex md:justify-between md:items-center">
                    <span class="flex justify-between items-center bg-accent-100 md:w-[40%] border dark:border-gray-700 rounded-lg p-4 mb-8 md:mb-0">
                        <span class="inline-block mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>                          
                        </span>
                        <span class="text-gray-600 dark:text-gray-300 text-sm">
                            We aggregate and weigh exchange rates from popular exchanges for this conversion. This is for informational purposes only.
                        </span>
                    </span>
                    <span class="block text-sm md:w-[50%] p-4">
                        {currencyFrom.name} to {currencyTo.name} conversion — Last updated {new Date(updatedAt)}
                    </span>
                </div>
                
                <span class="block mt-12 mb-4">
                    <a href="/alerts" class="button">
                        Get alert
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-4 h-4 ml-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>                          
                    </a>
                </span>
            </div>
        </div>
    </div>
</div>

<style>

</style>