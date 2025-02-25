<script lang="ts">
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';

	type Provider = { name: string; code: string, icon: string };
	type DropdownOption = { label: string; value: string, icon: string };

	export let data;
	const currencies = data.currencies;
	const providers = data.providers;

	let currentView: string = 'details' as 'details' | 'options';
	let alertType: string = 'Email';
	let currencyType: string = 'BTC';
	let rangeType: string = 'above';
	let price: string = '0.00';
	let priceType: string = 'USD';
    let provider: string = 'cedarmoney';
    let cooldown: string = '5 minutes';

	const currenciesForDropdown = Object.entries(currencies).map(([key, value]) => ({
		label: value,
		value: key
	}));

	const providersForDropdown = Object.entries(providers).map(([_, value]) => {
		const provider = value as Provider;
		return {
			label: provider.name,
			value: provider.code,
            icon: "/icons/" + provider.icon
		};
	}) as DropdownOption[];
</script>

<svelte:head>
	<title>Price alert</title>
</svelte:head>

<div
	class="bg-white dark:bg-gray-900/50 shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded-xl p-4 flex flex-col md:flex-row gap-4 p-16"
>
	<div class="w-full md:w-1/2">
		<div class="text-center mb-8">
			<h2 class="text-2xl mb-2"><i class="fa fa-line-chart pr-4" /> Price Alerts</h2>
			<p class="text-gray-500">Get notified when your favorite stocks reach a certain price</p>
		</div>
		<div class="flex flex-wrap gap-y-5 gap-x-2">
			Send me an
			<CustomSelectBox
				options={[
					{ label: 'Email', icon: 'fas fa-envelope' },
					{ label: 'SMS', icon: 'fas fa-sms' },
					{ label: 'Push Notification', icon: 'fas fa-bell' }
				]}
				className="inline-block !w-auto !p-1 leading-none"
				bind:selected={alertType}
			/>
			as soon as
			<CustomSelectBox
				options={currenciesForDropdown}
				className="inline-block !w-auto !p-1 leading-none"
				labelValues={true}
				bind:selected={currencyType}
			/>
			goes
			<CustomSelectBox
				options={[
					{ label: 'above', icon: 'fas fa-arrow-up' },
					{ label: 'bellow', icon: 'fas fa-arrow-down' }
				]}
				className="inline-block !w-auto !p-1 leading-none"
				bind:selected={rangeType}
			/>
			the price of
			<input
				bind:value={price}
				type="text"
				class="bg-gray-800 text-white p-1 px-2 w-[80px] h-7 rounded-md border border-gray-600 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
				placeholder="0.00"
			/>
			<CustomSelectBox
				options={currenciesForDropdown}
				className="inline-block !w-auto !p-1 leading-none"
				labelValues={true}
				bind:selected={priceType}
			/>
			on
			<CustomSelectBox
				options={providersForDropdown}
				className="inline-block !w-auto !p-1 leading-none"
				bind:selected={provider}
			/>
		</div>
        <div class="mt-8 text-sm text-gray-800 dark:text-gray-400">
            <i class="fa fa-bolt" /> The price of <span class="text-green-500">BTC</span> is currently <span class="text-green-500">87,501.38 USD</span>.
        </div>
        <div class="text-center pt-10">
            <button class="button">SET ALERT</button>
        </div>
	</div>
	<div class="w-full md:w-1/2">
		<div class="flex justify-center items-center gap-16 text-lg mb-10">
			<button
				class={currentView === 'details' ? 'text-blue-500' : 'hover:text-gray-500'}
				on:click={() => (currentView = 'details')}>Details</button
			>
			<button
				class={currentView === 'options' ? 'text-blue-500' : 'hover:text-gray-500'}
				on:click={() => (currentView = 'options')}>Options</button
			>
		</div>

		{#if currentView === 'details'}
		<div class="mt-4 space-y-10 md:w-[90%] md:mx-auto">
			<div class="flex gap-4 items-center">
				<i class="fa fa-comments text-4xl" />
				<p>Get regular price updates delivered to your device at any frequency.</p>
			</div>
			<div class="flex gap-2 items-center">
				<p>Convert the price to your local fiat currency, or view the value relative to BTC.</p>
				<i class="fa fa-cny text-4xl" />
			</div>
			<div class="flex gap-4 items-center">
				<i class="fa fa-object-group text-4xl" />
				<p>
					Get price data directly from any of our 47 supported exchanges, including Coinbase and
					Binance. Or use our market average.
				</p>
			</div>
		</div>
        {/if}
		{#if currentView === 'options'}
		<div class="mt-4 space-y-10 flex flex-col items-center">
            <div class="flex gap-4 items-center">
                <span>Cooldown:</span>
                <CustomSelectBox
				options={[
					{ label: '5 minutes', icon: 'fas fa-clock' },
					{ label: '10 minutes', icon: 'fas fa-clock' },
					{ label: '15 minutes', icon: 'fas fa-clock' },
					{ label: '30 minutes', icon: 'fas fa-clock' },
					{ label: '1 hour', icon: 'fas fa-clock' },
					{ label: '2 hour', icon: 'fas fa-clock' },
					{ label: '3 hour', icon: 'fas fa-clock' },
					{ label: '4 hour', icon: 'fas fa-clock' },
					{ label: '6 hour', icon: 'fas fa-clock' },
					{ label: '12 hour', icon: 'fas fa-clock' },
					{ label: '24 hour', icon: 'fas fa-clock' },
					{ label: '7 days', icon: 'fas fa-clock' },
				]}
				className="inline-block !w-auto !p-1 leading-none"
				bind:selected={cooldown}
			/>
            <span>
                <i class="fa fa-info-circle text-gray-500" />
            </span>
            </div>
        </div>
        {/if}

	</div>
</div>
