<script lang="ts">
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';

	type Provider = { name: string; code: string; icon: string; pairs: any };
	type DropdownOption = { label: string; value: string; icon: string };

	enum CurrentScreen {
		FIRST_SCREEN = 's1',
		SECOND_SCREEN = 's2'
	}

	enum Channels {
		EMAIL = 'email',
		WEBHOOK = 'webhook'
	}

	$: current_screen = CurrentScreen.FIRST_SCREEN;

	const change_screen = (screen: CurrentScreen) => {
		current_screen = screen;
	};

	export let data;
	const providers: [Provider] = data.providers;
	const pair_list: any = data.pair_list;
	const user: any = data.user;

	let currentView: string = 'details' as 'details' | 'options';
	let historyView: string = 'active-alerts' as 'active-alerts' | 'alert-history';

	let selectedPair: string = 'usdngn';
	let selectedProviders: string[] = [];
	$: selectedChannels = [] as string[];
	let selectedChannelsValues = {} as { email: string; webhook: string };
	let disableAfterTrigger: boolean = false;
	let note: string = '';
	let selectedCooldown: number;
	let selectedRange: string = 'above';
	let selectedAmount: number;

	if (user.isLoggedIn) {
		selectedChannelsValues = { email: user.email, webhook: '' };
	}

	let isSelectedProvidersDropdownOpen: boolean = false;

	const toggle_channel = (channel: Channels) => {
		if (selectedChannels.includes(channel)) {
			selectedChannels = selectedChannels.filter((c) => c !== channel);
		} else {
			selectedChannels = [...selectedChannels, channel];
		}
	};

	let providersForDropdown: DropdownOption[] = [];
	$: {
		providersForDropdown = Object.entries(providers)
			.filter(([_, value]) => {
				try {
					return value.pairs[selectedPair.toLowerCase()] !== undefined;
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
			}) as DropdownOption[];

		selectedProviders = [];
	}
</script>

<svelte:head>
	<title>Periodic Price Alerts</title>
</svelte:head>

<div class="flex flex-col md:flex-row gap-4">
	<div class="w-full md:w-1/2">
		<div class="md:w-3/4 mx-auto px-2 md:px-10 pb-5 flex flex-col gap-5">
			<div class="text-center mb-8">
				<h2 class="text-2xl mb-2"><i class="fa fa-line-chart pr-4" /> Price Alerts</h2>
				<p class="text-gray-500">Get notified when your favorite stocks reach a certain price</p>
			</div>

			{#if current_screen === CurrentScreen.FIRST_SCREEN}
				<div>
					<p class="text-xl mb-4">Select a pair, range, providers and amount to get started.</p>

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

					<div class="mb-5">
						<label for="range" class="label">Select range</label>
						<CustomSelectBox
							options={[
								{ label: 'above', icon: 'fas fa-arrow-up' },
								{ label: 'bellow', icon: 'fas fa-arrow-down' }
							]}
							className="!w-full"
							bind:selected={selectedRange}
							id="range"
							fullbox={true}
							placeholder="Select range"
						/>
					</div>

					<div class="mb-5">
						<label for="amount" class="label">Select amount</label>
						<input
							type="number"
							id="amount"
							class="c-buttom"
							bind:value={selectedAmount}
							placeholder="Enter amount"
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

					<button
						class="button w-full"
						disabled={!selectedPair ||
							selectedProviders.length === 0 ||
							!selectedAmount ||
							selectedAmount <= 0 ||
							!selectedRange}
						on:click={() => change_screen(CurrentScreen.SECOND_SCREEN)}>Continue</button
					>
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

					<button class="button w-full">Set alert</button>
					<button
						class="border border-gray-300 dark:border-gray-600 hover:border-gray-400 w-full mt-4 p-2 rounded-lg text-center text-gray-500 dark:text-gray-400"
						on:click={() => change_screen(CurrentScreen.FIRST_SCREEN)}>Go back</button
					>
				</div>
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
					<label for="cooldown">Cooldown:</label>
					<CustomSelectBox
						id="cooldown"
						options={[
							{ label: '5 minutes', value: 5, icon: 'fas fa-clock' },
							{ label: '10 minutes', value: 10, icon: 'fas fa-clock' },
							{ label: '15 minutes', value: 15, icon: 'fas fa-clock' },
							{ label: '30 minutes', value: 30, icon: 'fas fa-clock' },
							{ label: '1 hour', value: 60, icon: 'fas fa-clock' },
							{ label: '2 hours', value: 120, icon: 'fas fa-clock' },
							{ label: '3 hours', value: 180, icon: 'fas fa-clock' },
							{ label: '4 hours', value: 240, icon: 'fas fa-clock' },
							{ label: '6 hours', value: 360, icon: 'fas fa-clock' },
							{ label: '12 hours', value: 720, icon: 'fas fa-clock' },
							{ label: '24 hours', value: 1440, icon: 'fas fa-clock' },
							{ label: '7 days', value: 10080, icon: 'fas fa-clock' }
						]}
						className="inline-block !w-auto !p-1 leading-none"
						bind:selected={selectedCooldown}
					/>
					<span class="relative group">
						<i class="fa fa-info-circle text-gray-500" />
						<span
							class="hidden group-hover:inline-block absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 shadow-md text-sm text-white p-1 rounded-md whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
						>
							Specify an amount of time that must pass before the alert can be triggered again.
						</span>
					</span>
				</div>

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
		@apply w-full text-left bg-gray-100 dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0;
	}
</style>
