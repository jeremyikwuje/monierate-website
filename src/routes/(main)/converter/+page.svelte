<svelte:head>
	<title>Currency Converter</title>
	<meta name="description" content="Save money on exchange rates.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Naira Currency Converter" />
	<meta property="og:description" content="Save money on exchange rates. Convert Nigerian Naira to US Dollar and vice versa." />
	<meta property="og:url" content="monierate.com/converter" />
</svelte:head>

<script>

let convertFrom = 0
let convertTo = 0
let convertAmount = 0


function convertNow() {}
</script>

<div class="bg-gray-50 mt-8 mb-8">
    <div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 text-center">
        <h1 class="text-2xl md:text-4xl">
            Save money on exchange rates
        </h1>
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
                        </select>
                    </span>
                    <span class="block md:w-[30%]">
                        <label class="label" for="field-convert-to">To</label>
                        <select id="field-convert-to" class="select" bind:value={convertTo} on:change={convertNow}>
                            
                        </select>
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>

</style>