<script lang="ts">
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';
	import { formatNumber } from '$lib/functions';

	type Provider = { name: string; code: string; icon: string };
	type DropdownOption = { label: string; value: string; icon: string };
	type Pair = {
		code: string;
		price: { current: number };
	};
	type Currencies = {
		name: string;
		code: string;
	};

	export let data;
	let pairs: any = data.pairs;
	const currencies = data.currencies as Currencies;
	const providers = data.providers;
	const user = data.user;

	let currentView: string = 'details' as 'details' | 'options';
	let historyView: string = 'active-alerts' as 'active-alerts' | 'alert-history';
	let alertType: string = 'Email';
	let currencyType: string = 'USD';
	let priceType: string = 'NGN';
	let provider: string = 'cedarmoney';
	let cooldown: string = '5 minutes';
	let duration: string = '1 hour';

	const currenciesForDropdown = Object.entries(currencies).map(
		([key, value]: [key: any, value: any]) => ({
			label: value.name,
			value: value.code.toUpperCase()
		})
	) as DropdownOption[];

	const providersForDropdown = Object.entries(providers).map(([_, value]) => {
		const provider = value as Provider;
		return {
			label: provider.name,
			value: provider.code,
			icon: '/icons/' + provider.icon
		};
	}) as DropdownOption[];

	function round(value: number, decimals: number): number {
		const factor = Math.pow(10, decimals);
		return Math.round(value * factor) / factor;
	}

	function convertCurrency(from: string, to: string): number | null {
		let amount = 1;

		from = from.toLowerCase();
		to = to.toLowerCase();

		let rate: number = 1;

		if (from !== to) {
			let pair: Pair | undefined = pairs.find((p: Pair) => p.code === `${from}${to}`);
			if (pair && pair.price.current > 0) {
				rate = Number(pair.price.current);
			} else {
				return null;
			}
		}

		const result = amount * rate;
		return round(result, 8);
	}
	$: convertedPrice = convertCurrency(currencyType, priceType);
</script>

<svelte:head>
	<title>Periodic Price Alerts</title>
</svelte:head>

<div
	class="bg-white border border-gray-300 dark:border-none dark:bg-gray-900/50 dark:shadow-[0_4px_6px_rgba(0,0,0,0.1)] rounded-xl p-5 py-10 md:p-16 flex flex-col md:flex-row gap-4"
>
	<div class="w-full md:w-1/2">
		<div class="text-center mb-8">
			<h2 class="text-2xl mb-2"><i class="fa fa-clock pr-4" /> Periodic Price Alerts</h2>
			<p class="text-gray-500">Get notified of the price of an asset at regular intervals.</p>
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
			every
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
					{ label: '1 day', icon: 'fas fa-clock' },
					{ label: '7 days', icon: 'fas fa-clock' }
				]}
				className="inline-block !w-auto !p-1 leading-none"
				bind:selected={duration}
			/>
			with the current price of
			<CustomSelectBox
				options={currenciesForDropdown}
				className="inline-block !w-auto !p-1 leading-none"
				labelValues={true}
				bind:selected={currencyType}
			/>
			in
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
		{#if convertedPrice !== null}
			<div class="mt-8 text-sm text-gray-800 dark:text-gray-400">
				<i class="fa fa-bolt" /> The price of <span class="text-green-500">{currencyType}</span> is
				currently
				<span class="text-green-500">{formatNumber(convertedPrice)} {priceType}</span>.
			</div>
		{/if}
		<div class="text-center pt-16">
			<button class="button">SET ALERT</button>
		</div>
	</div>
	<div class="w-full md:w-1/2 mt-10 md:mt-0">
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
			<div class="mt-4 space-y-8 flex flex-col items-center">

				<div class="flex gap-4 items-center">
					<label for="add-note">Add a note:</label>
					<input
						id="add-note"
						type="text"
						class="bg-gray-50 text-dark dark:bg-gray-800 dark:text-white p-1 px-2 w-[125px] h-7 rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
						placeholder="Optional"
					/>
					<span class="relative group">
						<i class="fa fa-info-circle text-gray-500" />
						<span
							class="hidden group-hover:inline-block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 shadow-md text-sm text-white p-1 rounded-md whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
						>
							This will appear along side the alert to help give you context.
						</span>
					</span>
				</div>

				<div class="flex gap-4 items-center">
					<input
						id="alert-spam"
						type="checkbox"
						style="transform: scale(1.5);"
						placeholder="Optional"
					/>
					<label for="alert-spam">Disable this alert after it triggers onces.</label>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if user.isLogin}
	<div class="w-full md:w-1/2 mx-auto mt-16">
		<div class="flex justify-center items-center gap-16 text-lg mb-10">
			<button
				class={historyView === 'active-alerts' ? 'text-blue-500' : 'hover:text-gray-500'}
				on:click={() => (historyView = 'active-alerts')}>Active alerts</button
			>
			<button
				class={historyView === 'alert-history' ? 'text-blue-500' : 'hover:text-gray-500'}
				on:click={() => (historyView = 'alert-history')}>Alert history</button
			>
		</div>

		{#if historyView === 'active-alerts'}
			<div class="mt-4 space-y-10 md:w-[90%] md:mx-auto">
				<p class="text-center">You have no active periodic alerts.</p>
			</div>
		{/if}
		{#if historyView === 'alert-history'}
			<div class="mt-4 space-y-10 md:w-[90%] md:mx-auto">
				<p class="text-center">You have no periodic alert history.</p>
			</div>
		{/if}
	</div>
{/if}