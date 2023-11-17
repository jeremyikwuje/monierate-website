<script lang="ts">
import type { PageData } from "./$types"
import Money from "$lib/money";
import { round, chain } from "mathjs"
import { changeParam, format } from "$lib/functions"

export let data: PageData;
let changers = data.changers
let rates_avg = data.market_avg
let pairs = data.pairs
let pairRates: any = {}
let convert = data.convert
let currencies = data.currencies

let convertFrom = convert.From.toUpperCase()
let convertTo = convert.To.toUpperCase()
let convertAmount = parseFloat(`${convert.Amount}`)
let unitCurrency = convertFrom
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
        /** Get the rate */
        let pair = `${from}${to}`
        if (rates_avg.hasOwnProperty(pair)) {
            updatedAt = rates_avg[pair].updatedAt // get last update time
            rate = rates_avg[pair].parallel
            rateInverse = 1 / rate
            unitCurrency = from.toUpperCase()
            
            // get rates of a pair
            let pairData = pairs.find( (p: any) => p.pair === pair )
            pairRates = sortRates(pairData.rates || {})

            console.log('yes', pairRates)
        }
        else {
            pair = `${to}${from}`
            if (rates_avg.hasOwnProperty(pair)) {
                updatedAt = rates_avg[pair].updatedAt // get last update time
                rateInverse = rates_avg[pair].parallel
                rate = 1 / rateInverse
                unitCurrency = to.toUpperCase()

                // get rates of a pair
                let pairData = pairs.find( (p: any) => p.pair === pair )
                pairRates = sortRates(pairData.rates || {})
            } else {
                rate = 0
                rateInverse = 0
                unitCurrency = from.toUpperCase()
            }
        }


    }

    /** Calcuate the conversion*/
    convertResult.rate = rate
    convertResult.rateInverse = rateInverse
    convertResult.conversion = round(chain(rate).multiply(convertAmount).done(), 8)

    currencyFrom = currencies.find( c => c.code === from)
    currencyTo = currencies.find( c => c.code === to)

    getMoreConversions()
}

async function getMoreConversions() {
    let series = [ 1, 3, 5, 7, 10, 12, 15, 25, 30, 45, 50, 75, 100, 300, 400, 500, 750, 1000, 3000, 5000, 7500, 10000, 15000, 25000, 50000, 75000, 100000 ]
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

    moreConversions = conversions
}

function sortRates(rates: any) {
    // changer is not specified
    // so get all rates from pair
    let rates_entries = Object.entries(rates)

    /** Seperate the rate with zero buy rate */
    let only_buy_rates: any = []
    let only_sell_rates: any = []
    let key: string
    let value: any
    for ([key, value] of rates_entries) {
        let rate = [key, value]

        if (value.buy == 0) {
            only_sell_rates.push(rate)
        }
        else {
            only_buy_rates.push(rate)
        }
    }

    // sort the rates by ascending order
    const sort_only_buy_rates = only_buy_rates.sort((x: any, y: any) => x[1].buy - y[1].buy)
    // sort the sell rates by decending order
    const sort_only_sell_rates = only_sell_rates.sort(
        (x: any, y: any) => y[1].sell - x[1].sell
    )

    let result: any = sort_only_buy_rates.concat(sort_only_sell_rates)
    return result
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

    <div id="changer-rate-wrapper" class="section">
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
    {#if pairRates.length > 0}
    <div id="more-rates" class="mt-16">
        <h2 class="mb-8 text-center text-2xl">Best {convertFrom} to {convertTo} rates</h2>
        <div class="section overflow-x-scroll md:overflow-x-hidden">
            <table class="table-auto overflow-x-scroll w-full text-sm text-left ">
                <thead>
                    <tr>
                        <th scope="col" class="py-3 md:pl-0 font-bold font-bitter">
                            Provider
                        </th>
                        <th scope="col" class="pl-6 pr-6 py-3 w-[40%] font-bold font-bitter text-right">
                            Buy rate
                        </th>
                        <th scope="col" class="pl-6 pr-6 py-3 font-bold font-bitter text-right">
                            Sell rate
                        </th>
                        <th scope="col" class="pl-6 py-3 font-bold font-bitter text-right pr-2 md:pr-4 whitespace-nowrap">
                            Last updated
                        </th>
                    </tr>
                </thead>
                <tbody class="changers">
                    {#each pairRates as [changer_code, rate]}
                        {#if changer_code != 'market'}
                        <tr class="mb-4 border-t border-gray-200 dark:border-gray-700">
                            <td>
                                <a href="/converter/{changer_code}?Amount=1&From={convertFrom}&To={convertTo}" class="flex items-center">
                                    <span class="changer-icon">
                                        <img width="22px" height="22px" src="/icons/{changers[changer_code].icon}" class="rounded-full" alt="{changers[changer_code].name} icon">
                                    </span>
                                    <span class="changer-title">{changers[changer_code].name}</span>
                                </a>
                            </td>
                            <td class="text-right pl-6 pr-6">
                                <span class="changer-rate">₦{Money.format(rate.buy, 0)}</span>
                                <small class="changer-rate-base">per {unitCurrency}</small>
                            </td>
                            <td class="text-right pl-6 pr-6">
                                <span class="changer-rate">₦{Money.format(rate.sell, 0)}</span>
                                <small class="changer-rate-base">per {unitCurrency}</small>
                            </td>
                            <td class="text-right py-2 pr-2 md:pr-4 whitespace-nowrap">
                                {#if (rate.updatedAt) }
                                    {format(new Date(rate.updatedAt))}
                                {/if}
                            </td>
                        </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
    {/if}

    <div class="more-conversion">
        <div class="entry">
            <span class="header">
                <h2 class="text-center text-lg">
                    Convert {currencyFrom.name} to {currencyTo.name}
                </h2>
            </span>
            <div class="pb-4">
                {#await moreConversions}
                    <span class="block text-center py-8 px-4">Loading...</span>
                {:then conversions}
                <table class="w-full text-center px-8">
                    <thead>
                        <tr>
                            <th class="py-4">{convertFrom}</th>
                            <th class="py-4">{convertTo}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each Object.entries(conversions.from) as [index, convert]}
                        <tr>
                            <td class="py-2.5">
                                <a data-sveltekit-reload href="/converter/?Amount={convert.amount}&From={convertFrom}&To={convertTo}">
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
        <div class="entry">
            <span class="header">
                <h2 class="text-center text-lg">Convert {currencyTo.name} to {currencyFrom.name}</h2>
            </span>
            <div class="pb-4">
                {#await moreConversions}
                    <span class="block text-center py-8 px-4">Loading...</span>
                {:then conversions}
                    <table class="w-full text-center px-8">
                        <thead class="">
                            <tr>
                                <th class="py-4">{convertTo}</th>
                                <th class="py-4">{convertFrom}</th>
                            </tr>
                        </thead>
                        <tbody>
                                {#each Object.entries(conversions.to) as [index, convert]}
                                <tr>
                                    <td class="py-2.5">
                                        <a data-sveltekit-reload href="/converter?Amount={convert.amount}&From={convertTo}&To={convertFrom}">
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

    <div class="w-[95%] mx-auto md:w-[70%] mt-24">
        <h2 class="text-2xl mb-6 text-center">Currency Infomation</h2>
        <div class="block md:flex md:justify-between md:items-center">
            <div class="shadow-lg md:w-[45%] p-8 bg-white dark:bg-gray-900">
                <h2 class="text-2xl">{convertFrom} - {currencyFrom.name}</h2>
                <span class="block mt-6">
                    {currencyFrom.bio}
                </span>
            </div>
            <div class="shadow-lg md:w-[45%] p-8 bg-white dark:bg-gray-900">
                <h2 class="text-2xl">{convertTo} - {currencyTo.name}</h2>
                <span class="block mt-6">
                    {currencyTo.bio}
                </span>
            </div>
        </div>
    </div>
</div>

<style>
.section {
    @apply w-[95%] md:w-[70%] bg-white dark:bg-gray-900 shadow-lg rounded-lg px-8 py-4 mx-auto;
}

.more-conversion {
    @apply w-[95%] mx-auto md:w-[70%] md:flex md:justify-between md:items-center mt-16
}
.more-conversion .entry {
    @apply bg-white dark:bg-gray-900 shadow-lg rounded-lg md:w-[40%] mb-4
}
.more-conversion .entry .header {
    @apply border-b border-gray-200 dark:border-gray-700 block py-4 px-8
}

table thead th {
    @apply dark:text-gray-300 text-black whitespace-nowrap
}
table tbody tr td {
    @apply py-6 whitespace-nowrap
}
table tr td:first-child, table thead th:first-child {
    @apply pl-4
}

.changer {
    @apply flex justify-between items-center py-2 border-b border-gray-200;
}
.changer:last-child {
    @apply border-b-0
}
.changer-icon {
    @apply bg-transparent border border-black rounded-full w-[24px] h-[24px] mr-2;
}
.changer-title {
    @apply font-semibold text-lg capitalize text-gray-800 dark:text-gray-300;
}
.changer-rate-base {
    @apply text-gray-500 dark:text-gray-400;
}
.changer-rate {
    @apply block font-semibold text-lg text-gray-800 dark:text-light;
}
</style>