<script lang="ts">
import type { PageData } from "./$types"
import Money from "$lib/money";
import { round, chain } from "mathjs"
import { changeParam, friendlyDate } from "$lib/functions"
	import ChangerRates from "$lib/components/ChangerRates.svelte";

export let data: PageData;
let changers = data.changers;
let pairs = data.pairs;
let pair_rates: any = {};
let convert = data.convert;
let currencies = data.currencies;

let convertFrom = convert.From.toUpperCase();
let convertTo = convert.To.toUpperCase();
let convertAmount = parseFloat(`${convert.Amount}`);
let unit_currency = convertFrom;
let convertResult = {
    rate: 0,
    rate_inverse: 0,
    conversion: 0,
};

var currencyFrom: any = {}
var currencyTo: any = {}
var updated_at = ''

var moreConversions: any = {
    from: [],
    to: []
}

function convertNow() {
    const from = convertFrom.toLowerCase();
    const to = convertTo.toLowerCase();

    let rate = 1;  // 1:1
    let rate_inverse = 1;

    if (from != to) {
        /** Get the rate */
        let pair_code = `${from}${to}`.toLowerCase();
        let pair = pairs.find((p) => p.code === pair_code);
        if (pair) {
            updated_at = pair.updatedAt; // get last update time
            rate = pair.price.current;
            rate_inverse = 1 / rate;
            unit_currency = from.toUpperCase();
            
            // get rates of a pair
            pair_rates = sortRates(pair.changers || {});
        }
        else {
            pair_code = `${from}${to}`.toLowerCase();
            pair = pairs.find((p) => p.code === pair_code);
            if (pair) {
                updated_at = pair.updatedAt; // get last update time
                rate_inverse = pair.price.current;
                rate = 1 / rate_inverse
                unit_currency = to.toUpperCase()

                // get rates of a pair
                pair_rates = sortRates(pair.changers || {});
            } else {
                rate = 0
                rate_inverse = 0
                unit_currency = from.toUpperCase()
            }
        }
    }

    /** Calcuate the conversion*/
    convertResult.rate = rate
    convertResult.rate_inverse = rate_inverse
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

        let rate_inverse = convertResult.rate_inverse
        conversions.to.push({
            amount: serie,
            conversion: round(chain(rate_inverse).multiply(serie).done(), 8)
        })
    })

    moreConversions = conversions
}

function sortRates(rates: any) {
    // sort rates in decending order by price_buy;
    rates.sort((a, b) => a.price_buy - b.price_buy);
    // filter out rate with price_buy as 0
    const filtered_non_zero_rates = rates.filter((rate) => rate.price_buy > 0);
    const filtered_zero_rates = rates.filter((rate) => rate.price_buy <= 0);
    // soirt rates in descending order by price_buy
    filtered_zero_rates.sort((a, b) => b.price_sell - a.price_sell);
    // merge both rates
    rates = filtered_non_zero_rates.concat(filtered_zero_rates);

    return rates;
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

<div class="bg-white dark:bg-gray-800">
    <div class="container">
        <!-- Landscape Top/Bottom -->
        <div class="cedar-money ">
            <a href="https://bit.ly/3zfhZgz" target="_blank">
                <img 
                    src="https://monierate.com/cedar-converter-1.gif"
                    alt="Cedar Money"
                    class="mx-auto max-w-full md:w-[800px] md:h-[114px]">
            </a>
        </div>
    </div>
</div>

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
                        1 {convertTo} = {Money.format(convertResult.rate_inverse)} {convertFrom}
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
                        {currencyFrom.name} to {currencyTo.name} conversion — Last updated {new Date(updated_at)}
                    </span>
                </div>
                
                <span class="block mt-12 mb-4">
                    <a href="https://tinyurl.com/cambridge-currencies-button" class="block button w-full md:inline-block md:w-auto mr-4 mb-4 ">
                        Send money
                        <svg class="inline-block w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>                                                  
                    </a>
                    <a href="https://tinyurl.com/cedar-button-converter-pair" class="block button buy font-bold w-full md:inline-block md:w-auto">
                        Pay your suppliers abroad
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-4 h-4 ml-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg> 
                    </a>
                </span>
            </div>
        </div>
    </div>

    {#if pair_rates.length > 0}
    <div class="container mt-16 border border-none bg-white py-[10px] dark:bg-gray-900 dark:text-light dark:border-none w-full overflow-x-scroll md:overflow-x-hidden overflow-y-scroll md:overflow-y-hidden">
        <h2 class="mb-8 text-center text-2xl">Best {convertFrom} to {convertTo} rates</h2>
        <ChangerRates rates={pair_rates} changers={changers} />
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
                    {currencyFrom.description}
                </span>
            </div>
            <div class="shadow-lg md:w-[45%] p-8 bg-white dark:bg-gray-900">
                <h2 class="text-2xl">{convertTo} - {currencyTo.name}</h2>
                <span class="block mt-6">
                    {currencyTo.description}
                </span>
            </div>
        </div>
    </div>
</div>

<style>
.section {
    @apply w-[95%] md:w-[70%] bg-white dark:bg-gray-900 shadow-lg rounded-lg px-4 py-4 mx-auto;
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
    @apply py-2 whitespace-nowrap
}
table tr td:first-child, table thead th:first-child {
    @apply pl-0
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
    @apply font-semibold text-sm md:text-lg whitespace-nowrap capitalize text-gray-800 dark:text-gray-300;
}
.changer-rate-base {
    @apply text-gray-500 dark:text-gray-400;
}
.changer-rate {
    @apply block font-semibold text-sm md:text-lg whitespace-nowrap text-gray-800 dark:text-light;
}
</style>