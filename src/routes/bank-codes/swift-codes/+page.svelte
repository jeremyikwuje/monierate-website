<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;
	let groupedByAlpha = data.countries;

	function scrollToHash(event: MouseEvent) {
		event.preventDefault();

		const target = event.target as HTMLAnchorElement;
		const targetId = target?.getAttribute('href')?.substring(1);

		const targetElement = targetId && document.getElementById(targetId);
		if (targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop - 50,
				behavior: 'smooth'
			});
		}
	}

	let selectedCountry = '';
	let selectedBank = '';
	let selectedCity = '';
	let banks: string[] = [];
	let cities: string[] = [];
	let bankData: Record<string, { name: string; city: string; swift: string }> = {};

    async function loadBanks() {
        if (!selectedCountry) return;

        try {
            const Banks = await import(`../../../data/banks/${selectedCountry.toLowerCase()}-banks.json`);
            bankData = Banks.default || Banks;
            banks = Object.keys(bankData);
            cities = []; 
            selectedBank = '';
            selectedCity = '';
        } catch (error) {
            console.error(`Error loading banks for ${selectedCountry}:`, error);
        }
    }

	function loadCities() {
		if (!selectedBank || !bankData[selectedBank]) {
			console.error('Invalid bank selection or bank data unavailable.');
			return;
		}
		cities = [bankData[selectedBank].city];
		selectedCity = '';
	}

	function findSwiftCode() {
		if (!selectedCountry) {
			alert('Please select a country.');
			return;
		}

		let url = `/${selectedCountry.toLowerCase()}/bank-codes/swift-code`;

		if (selectedBank) {
			url += `/${selectedBank.toLowerCase()}`;
		}

		if (selectedCity) {
			const bank = bankData[selectedBank];
			if (bank && bank.city !== selectedCity) {
				alert('SWIFT Code not found for selected details.');
				return;
			}
		}

		goto(url);
	}
</script>

<svelte:head>
	<title>Select Provider & Swift Code | Monierate</title>
	<meta
		name="description"
		content="Find and select the best provider and get the Swift code for your transactions."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Find Swift Codes for Transactions | Monierate" />
	<meta
		property="og:description"
		content="Select a provider and get the correct Swift code for your financial transactions."
	/>
	<meta property="og:url" content="monierate.com/ng/select/provider/swift-code" />
	<meta property="og:image" content="https://monierate.com/monierate-swift-code-og-image.png" />
</svelte:head>

<div class="container">
	<h1 class="text-2xl md:text-4xl mb-2 text-center">Looking for SWIFT code?</h1>
</div>

<div class="section">
	<div class="flex justify-center items-center">
		<div class="w-full">
			<div class="block md:flex md:justify-between md:items-center">
				<!-- Select Country -->
				<span class="block md:w-[30%]">
					<label class="label" for="field-country">Select Country</label>
					<select
						id="field-country"
						class="select"
						bind:value={selectedCountry}
						on:change={loadBanks}
					>
						<option value="" disabled selected>Select Country</option>
						{#each Object.entries(groupedByAlpha) as [letter, countries]}
							<optgroup label={letter}>
								{#each Object.entries(countries) as [code, name]}
									<option value={code}>{name}</option>
								{/each}
							</optgroup>
						{/each}
					</select>
				</span>

				<!-- Select Bank -->
				<span class="block md:w-[30%]">
					<label class="label" for="field-bank">Select Bank</label>
					<select id="field-bank" class="select" bind:value={selectedBank} on:change={loadCities}>
						<option value="" disabled selected>Select Bank</option>
						{#each banks as bank}
							<option value={bank}>{bankData[bank]?.name}</option>
						{/each}
					</select>
				</span>

				<!-- Select City -->
				<span class="block md:w-[30%]">
					<label class="label" for="field-city">Select City</label>
					<select id="field-city" class="select" bind:value={selectedCity}>
						<option value="" disabled selected>Select City</option>
						{#each cities as city}
							<option value={city}>{city}</option>
						{/each}
					</select>
				</span>
			</div>

			<div class="mt-4">
				<button class="button w-full md:w-[20%]" on:click={findSwiftCode}>Find SWIFT Code</button>
			</div>
		</div>
	</div>
</div>

<main>
	<div class="container">
		<section id="grouped" class="mt-12">
			<h2 class="text-xl md:text-2xl mb-4">Countries</h2>

			<div class="flex justify-center items-center flex-wrap gap-2 mt-8">
				{#each Object.entries(groupedByAlpha) as [letter]}
					<a
						href="#{letter.toUpperCase()}-label"
						class="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-500 hover:text-white"
						on:click={scrollToHash}
					>
						{letter.toUpperCase()}
					</a>
				{/each}
			</div>

			{#each Object.entries(groupedByAlpha) as [letter, countries]}
				<h3 class="text-lg md:text-xl mb-2 py-2" id="{letter.toUpperCase()}-label">{letter}</h3>
				<div class="block md:flex md:items-center md:flex-wrap">
					{#each Object.entries(countries) as [code, name]}
						<a
							href="/{code.toLowerCase()}/bank-codes/swift-code"
							class="inline-block w-[100%] md:w-[22%] shadow-md rounded-lg border border-gray-100 dark:border-gray-700 text-black dark:text-white mr-8 last-child:mr-0 p-4 mb-4"
						>
							<span class="flex items-center">
								<span
									class="inline-block w-[32px] h-[32px] rounded-full bg-no-repeat bg-cover border border-black bg-black-200 mr-4"
									style="background-image: url('https://wise.com/public-resources/assets/flags/rectangle/{code.toLowerCase()}.png');"
								/>
								<span>{name}</span>
							</span>
						</a>
					{/each}
				</div>
			{/each}
		</section>
	</div>
</main>

<style>
	.section {
		@apply w-[95%] md:w-[70%] bg-white dark:bg-gray-900 shadow-lg rounded-lg px-4 py-4 mx-auto;
	}
</style>
