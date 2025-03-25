<script lang="ts">
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';
	import { Timeframe } from './types';
	import { create_alert, update_alert } from '$lib/price_alert/alert.service';
	import { notify } from '$lib/notification';
	import { goto } from '$app/navigation';
	import { login_uri } from '$lib/functions';

	type Provider = { name: string; code: string; icon: string; pairs: any };
	type DropdownOption = { label: string; value: string; icon: string };

	enum CurrentScreen {
		FIRST_SCREEN = 's1',
		SECOND_SCREEN = 's2',
		THIRD_SCREEN = 's3'
	}

	enum Channels {
		EMAIL = 'email',
		WEBHOOK = 'webhook'
	}

	let current_screen = CurrentScreen.FIRST_SCREEN;

	const change_screen = (screen: CurrentScreen) => {
		current_screen = screen;
	};

	export let data;
	const providers: Provider[] = data.providers;
	const pair_list: any = data.pair_list;
	const user: any = data.user;

	let alertEdit: any = false;

	if (data.alert && data.alert._id) {
		alertEdit = data.alert;
	}

	let currentView: string = 'details';
	let isLoading: boolean = false;

	let selectedPair: string = 'usdngn';
	let selectedProviders: string[] = [];
	let selectedChannels: string[] = [];
	let selectedChannelsValues = {} as { email: string; webhook: string };
	let selectedTimeframe = Object.keys(Timeframe)[0] as string;
	let selectedTimeframeInterval = 1;
	let selectedDayTimeValues = 1;
	let disableAfterTrigger: boolean = false;
	let note: string = '';

	$: selected_base = pair_list.find((pair: any) => pair.value === selectedPair)?.base;
	$: selected_quote = pair_list.find((pair: any) => pair.value === selectedPair)?.quote;
	$: getSelectedTimeframe = selectedTimeframe ? Timeframe[selectedTimeframe]?.frequency?.type : '';

	let error: string = '';

	if (user?.isLogin && !alertEdit) {
		selectedChannelsValues.email = user.email;
	}

	let isSelectedProvidersDropdownOpen: boolean = false;

	const toggle_channel = (channel: Channels) => {
		if (selectedChannels.includes(channel)) {
			selectedChannels = selectedChannels.filter((c) => c !== channel);
		} else {
			selectedChannels = [...selectedChannels, channel];
		}
	};

	$: timeframeOptions = Object.entries(Timeframe).map(([key, value]) => ({
		label: key,
		value: key
	})).filter(({ label }) => !(label === 'Hourly' && selectedChannels.includes('email')));

	$: timeframeValues = !selectedTimeframe
		? []
		: Object.entries(Timeframe[selectedTimeframe]?.frequency?.values || {}).map(([key, value]) => ({
				label: key,
				value: value
		  }));

	$: dayTimeValues =
		selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly'
			? Object.entries(Timeframe[selectedTimeframe]?.frequency?.time || {}).map(([key, value]) => ({
					label: key,
					value: value
			  }))
			: [];

	let providersForDropdown: DropdownOption[] = [];

	function updateProvidersForDropdown() {
		providersForDropdown = Object.entries(providers)
			.filter(([_, value]) => {
				try {
					const provider = value as Provider;
					return provider.pairs && provider.pairs[selectedPair.toLowerCase()] !== undefined;
				} catch (e) {
					return false;
				}
			})
			.map(([_, value]) => {
				const provider = value as Provider;
				return {
					label: provider.name,
					value: provider.code,
					icon: '/icons/' + provider.icon
				};
			});
	}

	$: if (selectedPair) {
		updateProvidersForDropdown();
	}

	async function create_alert_handler() {
		if (selectedProviders.length === 0) {
			error = 'Please select at least one provider';
			return;
		}

		if (Object.entries(selectedChannelsValues).length === 0) {
			error = 'Please select at least one notification channel';
			return;
		}

		isLoading = true;
		const alert: any = {
			type: 'periodic',
			quote: selected_quote,
			base: selected_base,
			frequency: {
				type: getSelectedTimeframe,
				value: selectedTimeframeInterval
			},
			exchange: selectedProviders,
			channel: selectedChannelsValues,
			disable_after_trigger: disableAfterTrigger
		};

		if (selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly') {
			alert.frequency.time = selectedDayTimeValues;
		}

		if (note !== '') {
			alert.note = note;
		}

		try {
			const create_alert_response = await create_alert(alert);

			isLoading = false;
			if (create_alert_response.status === 'error') {
				error = create_alert_response.description || create_alert_response.message;
			} else {
				notify(create_alert_response.message);
				goto('/alert');
			}
		} catch (err) {
			isLoading = false;
			error = 'Failed to create alert. Please try again.';
			console.error('Create alert error:', err);
		}
	}

	async function update_alert_handler(alert_id: string) {
		if (selectedProviders.length === 0) {
			error = 'Please select at least one provider';
			return;
		}

		if (Object.entries(selectedChannelsValues).length === 0) {
			error = 'Please select at least one notification channel';
			return;
		}

		isLoading = true;
		const alert: any = {
			id: alert_id,
			type: 'periodic'
		};

		if (selected_quote !== alertEdit.quote) {
			alert.quote = selected_quote;
		}

		if (selected_base !== alertEdit.base) {
			alert.base = selected_base;
		}

		if (
			getSelectedTimeframe !== alertEdit.frequency?.type ||
			selectedTimeframeInterval !== alertEdit.frequency?.value ||
			selectedDayTimeValues !== alertEdit.frequency?.time
		) {
			alert.frequency = {
				type: getSelectedTimeframe,
				value: selectedTimeframeInterval
			};
		}

		if (
			(selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly') &&
			selectedDayTimeValues !== alertEdit.frequency?.time
		) {
			alert.frequency = {
				...(alert.frequency || {}),
				time: selectedDayTimeValues
			};
		}

		if (JSON.stringify(selectedProviders) !== JSON.stringify(alertEdit.exchange)) {
			alert.exchange = selectedProviders;
		}

		const filteredChannels = Object.fromEntries(
			Object.entries(selectedChannelsValues).map(([key, value]) => [
				key,
				value === '' || !selectedChannels.includes(key) ? null : value
			])
		);

		if (JSON.stringify(filteredChannels) !== JSON.stringify(alertEdit.channel)) {
			alert.channel = filteredChannels;
		}

		if (disableAfterTrigger !== alertEdit.disable_after_trigger) {
			alert.disable_after_trigger = disableAfterTrigger;
		}

		if (note !== alertEdit.note && note !== '') {
			alert.note = note;
		}

		try {
			const update_alert_response = await update_alert(alert);

			isLoading = false;
			if (update_alert_response.error) {
				notify(update_alert_response.error);
			} else if (update_alert_response.status === 'error') {
				error = update_alert_response.message;
			} else {
				notify(update_alert_response.message);
				goto('/alert');
			}
		} catch (err) {
			isLoading = false;
			error = 'Failed to update alert. Please try again.';
			console.error('Update alert error:', err);
		}
	}

	function initializeFromExistingAlert() {
		if (!alertEdit) return;

		console.log('Initializing from existing alert');

		if (alertEdit.base && alertEdit.quote) {
			selectedPair = `${alertEdit.base}${alertEdit.quote}`.toLowerCase();

			updateProvidersForDropdown();
		}

		setTimeout(() => {
			if (alertEdit.exchange && Array.isArray(alertEdit.exchange)) {
				selectedProviders = [...alertEdit.exchange];
			}
		}, 100);

		if (alertEdit.channel && Object.entries(alertEdit.channel)) {
			selectedChannels = [...Object.keys(alertEdit.channel)];
			selectedChannelsValues = { ...alertEdit.channel };
		}

		if (alertEdit.frequency) {
			for (const [key, value] of Object.entries(Timeframe as [any, any])) {
				if (value.frequency && value.frequency.type === alertEdit.frequency.type) {
					selectedTimeframe = key;
					break;
				}
			}

			if (alertEdit.frequency.value !== undefined) {
				selectedTimeframeInterval = alertEdit.frequency.value;
			}

			if (alertEdit.frequency.time !== undefined) {
				selectedDayTimeValues = alertEdit.frequency.time;
			}
		}

		if (alertEdit.disable_after_trigger !== undefined) {
			disableAfterTrigger = alertEdit.disable_after_trigger;
		}

		if (alertEdit.note) {
			note = alertEdit.note;
		}
	}

	initializeFromExistingAlert();
</script>

<svelte:head>
	<title>Periodic Price Alerts</title>
</svelte:head>

<div class="flex flex-col md:flex-row gap-4">
	<div class="w-full md:w-1/2">
		<div class="md:w-3/4 mx-auto px-2 md:px-10 pb-5 flex flex-col gap-5">
			<div class="text-center mb-4">
				<h2 class="text-2xl mb-2">
					<i class="fa fa-clock pr-4" />
					{alertEdit ? 'Update' : ''} Periodic Price Alerts
				</h2>
				<p class="text-gray-500">Get notified of the price of an asset at regular intervals.</p>
			</div>

			{#if error !== ''}
				<div
					class="text-sm text-red-900 mb-2 border border-red-300 p-3 rounded-lg bg-red-50 shadow"
				>
					<p>{error}</p>
				</div>
			{/if}

			{#if current_screen === CurrentScreen.FIRST_SCREEN}
				<div>
					{#if alertEdit}
						<p class="text-xl mb-4">
							Please review and apply the necessary updates to refresh this alert.
						</p>
					{:else}
						<p class="text-xl mb-4">Select a pair and providers to get started.</p>
					{/if}

					<div class="mb-5">
						<label for="pair" class="label">Select a pair</label>
						<CustomSelectBox
							options={pair_list}
							className="!w-full"
							bind:selected={selectedPair}
							id="pair"
							fullbox={true}
						/>
					</div>

					<div class="mb-10">
						<label for="providers" class="label">Select providers</label>
						<div
							class="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400"
						>
							{#if !isSelectedProvidersDropdownOpen}
								{#each selectedProviders as provider}
									<span
										class="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-full mr-2 inline-flex items-center mb-2"
									>
										<img
											src="/icons/{Object.entries(providers).find(
												([_, value]) => value.code === provider
											)?.[1]?.icon}"
											alt="icon"
											class="w-4 h-4 mr-2"
										/>

										{Object.entries(providers).find(([_, value]) => value.code === provider)?.[1]
											?.name || provider}

										<i
											class="fa fa-times ml-2 cursor-pointer"
											on:click={() =>
												(selectedProviders = selectedProviders.filter((p) => p !== provider))}
										/>
									</span>
								{/each}
							{/if}

							<CustomSelectBox
								options={providersForDropdown}
								className="!p-1 !px-2 !rounded-full !bg-gray-100 dark:!bg-gray-800 {selectedProviders.length ===
									0 || isSelectedProvidersDropdownOpen
									? 'block !w-full !justify-center !border-none !py-0'
									: '!text-sm'}"
								bind:selected={selectedProviders}
								multiple={true}
								placeholder={selectedProviders.length === 0 || isSelectedProvidersDropdownOpen
									? 'Select providers'
									: 'Add'}
								bind:isDropdownOpen={isSelectedProvidersDropdownOpen}
								fullbox={selectedProviders.length === 0 || isSelectedProvidersDropdownOpen
									? true
									: false}
								id="providers"
							/>
						</div>
					</div>

					{#if !user.isLogin}
						<a
							href={login_uri('/alert')}
							class="block button w-full text-center bg-blue-500 text-white font-semibold hover:bg-blue-600"
							>Login to continue</a
						>
					{:else}
						<button
							class="button w-full"
							disabled={!selectedPair || selectedProviders.length === 0}
							on:click={() => change_screen(CurrentScreen.SECOND_SCREEN)}>Continue</button
						>
					{/if}
				</div>
			{:else if current_screen === CurrentScreen.SECOND_SCREEN}
				<div>
					<p class="text-xl mb-4">Where do you want to receive the alert?</p>

					<div class="mb-10">
						<div class="mb-4">
							<button
								class="c-buttom mb-2 flex flex-row items-center justify-between"
								on:click={() => toggle_channel(Channels.EMAIL)}
							>
								<span>
									<i class="fa fa-envelope mr-2" />
									Email
								</span>
								{#if selectedChannels.includes(Channels.EMAIL)}
									<div
										class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-2"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
								{/if}
							</button>
							{#if selectedChannels.includes(Channels.EMAIL)}
								<label for="email" class="label text-sm">Email address</label>
								<input
									type="email"
									id="email"
									class="input"
									bind:value={selectedChannelsValues.email}
									placeholder="example@example.com"
								/>
							{/if}
						</div>

						<div class="mb-4">
							<button
								class="c-buttom mb-4 flex flex-row items-center justify-between"
								on:click={() => toggle_channel(Channels.WEBHOOK)}
							>
								<span>
									<i class="fa fa-plug mr-2" />
									Web hook
								</span>
								{#if selectedChannels.includes(Channels.WEBHOOK)}
									<div
										class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center ml-2"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="white"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									</div>
								{/if}
							</button>
							{#if selectedChannels.includes(Channels.WEBHOOK)}
								<label for="uri" class="label text-sm">Webhook URI</label>
								<input
									type="text"
									id="uri"
									class="input"
									bind:value={selectedChannelsValues.webhook}
									placeholder="https://example.com/webhook"
								/>
							{/if}
						</div>
					</div>

					<button
						class="button w-full"
						disabled={!(selectedChannelsValues.email || selectedChannelsValues.webhook)}
						on:click={() => change_screen(CurrentScreen.THIRD_SCREEN)}>Continue</button
					>
					<button
						class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
						on:click={() => change_screen(CurrentScreen.FIRST_SCREEN)}>Go back</button
					>
				</div>
			{:else if current_screen === CurrentScreen.THIRD_SCREEN}
				<div>
					<p class="text-xl mb-4">When do you want to be receiving the alert?</p>

					<div class="mb-10">
						<div class="mb-4">
							<label for="time" class="label">Select time</label>
							<CustomSelectBox
								options={timeframeOptions}
								fullbox={true}
								className="!w-full"
								id="time"
								bind:selected={selectedTimeframe}
							/>
						</div>

						{#if selectedTimeframe !== ''}
							<div class="mb-4">
								<label for="timex" class="label">Get it every</label>
								<CustomSelectBox
									options={timeframeValues}
									fullbox={true}
									className="!w-full"
									id="timex"
									bind:selected={selectedTimeframeInterval}
									placeholder="Select interval"
								/>
							</div>
						{/if}

						{#if selectedTimeframe === 'Monthly' || selectedTimeframe === 'Weekly'}
							<div class="mb-4">
								<label for="timexx" class="label">What time of the day</label>
								<CustomSelectBox
									options={dayTimeValues}
									fullbox={true}
									className="!w-full"
									id="timexx"
									bind:selected={selectedDayTimeValues}
									placeholder="Select interval"
								/>
							</div>
						{/if}
					</div>

					{#if alertEdit}
						<button
							class="button w-full"
							on:click={() => update_alert_handler(alertEdit._id)}
							disabled={isLoading ||
								(selectedTimeframe === 'Hourly' && selectedTimeframeInterval === 1)}
							>Update alert</button
						>
					{:else}
						<button
							class="button w-full"
							on:click={create_alert_handler}
							disabled={isLoading ||
								(selectedTimeframe === 'Hourly' && selectedTimeframeInterval === 1)}
							>Set alert</button
						>
					{/if}
					<button
						class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
						on:click={() => change_screen(CurrentScreen.SECOND_SCREEN)}>Go back</button
					>
				</div>
			{/if}
			{#if alertEdit}
				<button
					class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
					on:click={() => goto('/alert', { replaceState: true })}>Cancel changes</button
				>
			{/if}
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
						bind:value={note}
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
						bind:checked={disableAfterTrigger}
					/>
					<label for="alert-spam">Disable this alert after it triggers onces.</label>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.c-buttom {
		@apply w-full text-left bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400;
	}
</style>
