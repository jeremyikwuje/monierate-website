<script lang="ts">
	import { capitalizeFirstLetter, friendlyDate, getNextTriggerTime } from '$lib/functions';
	import { notify } from '$lib/notification';
	import {
		get_all_alerts,
		delete_alert,
		update_alert,
		delete_all_alert,
		delete_all_disabled_alert,
		delete_all_enabled_alert
	} from '$lib/price_alert/alert.service.js';
	import { onMount } from 'svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { goto } from '$app/navigation';
	import CustomSelectBox from '$lib/components/CustomSelectBox.svelte';
	import TipView from '$lib/components/TipView.svelte';
	import { browser } from '$app/environment';

	type Alert = {
		_id: string;
		quote: string;
		base: string;
		type: string;
		price: number;
		direction: string;
		frequency: {
			type: string;
			value: number;
			time?: number;
		};
		exchange: string[];
		cooldown: number;
		channel: string[];
		note?: string;
		disable_after_trigger: boolean;
		status: string;
		created_at: any;
		last_triggered: any;
	};

	type Alerts = Alert[];

	export let data;
	const user: any = data.user;
	const providers = data.providers;
	const pair_list = data.pair_list;
	$: alerts = data.alerts?.sort(
		(a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	) as Alerts;

	$: {
		if (
			(browser && !user?.isLogin) ||
			(browser && user?.isLogin && data.alerts && !(data.alerts.length > 0))
		) {
			goto('/alert/price-alert/periodic', { replaceState: true });
		}
	}

	let showSearch: boolean = false;
	let showConfirmAlertDeletion = {} as { [key: string]: boolean };
	let showConfirmAllAlertDeletion: boolean = false;
	let showConfirmDisabledAlertDeletion: boolean = false;
	let showConfirmEnabledAlertDeletion: boolean = false;

	$: {
		alerts = alerts?.map((a) => ({
			...a,
			exchange: a.exchange.map((e) => providers[e]?.name ?? e)
		}));
	}
	let isRecent = true;
	function toggleSort() {
		let isSortedByRecent = alerts.every(
			(alert, index, array) =>
				index === 0 || new Date(array[index - 1].created_at) >= new Date(alert.created_at)
		);

		alerts = alerts.sort((a, b) => {
			if (isSortedByRecent) {
				isRecent = false;
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			} else {
				isRecent = true;
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
			}
		});
	}

	let isToggling = false;
	async function toggleAlertStatus(id: string) {
		if (isToggling) return;
		isToggling = true;
		const getStatus = 'active' === alerts.find((a) => a._id === id)?.status ? 'disabled' : 'active';
		const res = await update_alert({ id, status: getStatus });
		if (res.status === 'success') {
			alerts = alerts.map((n: any) => (n._id === id ? { ...n, status: getStatus } : n));
		} else {
			notify(`There was an error ${getStatus === 'active' ? 'enabling' : 'disabling'} alert`);
		}
		isToggling = false;
	}

	let searchText: string = '';
	function filterAlerts() {
		if (searchText === '') {
			alerts = data.alerts;
		} else {
			alerts = data.alerts.filter(
				(a: any) =>
					a.base.toLowerCase().includes(searchText.toLowerCase()) ||
					a.quote.toLowerCase().includes(searchText.toLowerCase()) ||
					a.exchange.some((e: any) => e.toLowerCase().includes(searchText.toLowerCase())) ||
					Object.entries(a.channel).some((c: any) =>
						c.toString().toLowerCase().includes(searchText.toLowerCase())
					) ||
					(a.note && a.note.toLowerCase().includes(searchText.toLowerCase())) ||
					friendlyDate(a.created_at).toLowerCase().includes(searchText.toLowerCase())
			);
		}
	}

	let selectedPairForFilter: string = '';
	function filterAlertsByPair() {
		if (selectedPairForFilter === '') {
			alerts = data.alerts;
		} else {
			alerts = data.alerts.filter(
				(a: any) => `${a.base}${a.quote}`.toLowerCase() === selectedPairForFilter.toLowerCase()
			);
		}
	}

	async function deleteAlert(id: string) {
		const res = await delete_alert(id);
		if (res.status === 'success') {
			data.alerts = data.alerts.filter((a: any) => a._id !== id);
		} else {
			notify('There was an error deleting the alert');
		}
		showConfirmAlertDeletion[id] = false;
	}

	async function deleteAllAlert() {
		const res = await delete_all_alert();
		if (res.status === 'success') {
			let getAlerts = await get_all_alerts();
			data.alerts = getAlerts.data;
			notify('All alerts deleted successfully');
		} else {
			notify('There was an error deleting all alerts');
		}
		showConfirmAllAlertDeletion = false;
	}

	async function deleteAllDisabledAlert() {
		const res = await delete_all_disabled_alert();
		if (res.status === 'success') {
			let getAlerts = await get_all_alerts();
			data.alerts = getAlerts.data;
			notify('All disabled alerts deleted successfully');
		} else {
			notify('There was an error deleting disabled alerts');
		}
		showConfirmDisabledAlertDeletion = false;
	}

	async function deleteAllEnabledAlert() {
		const res = await delete_all_enabled_alert();
		if (res.status === 'success') {
			let getAlerts = await get_all_alerts();
			data.alerts = getAlerts.data;
			notify('All enabled alerts deleted successfully');
		} else {
			notify('There was an error deleting enabled alerts');
		}
		showConfirmEnabledAlertDeletion = false;
	}

	let showAllAlertOptions: boolean = false;
	let showAlertOptionsEvent: any;
	function showAlertOptions(alert_id: string) {
		try {
			window.removeEventListener('click', showAlertOptionsEvent);
			let alert = document.getElementById('alert-option-' + alert_id);
			alert?.classList.toggle('hidden');
			showAlertOptionsEvent = window.addEventListener('click', (e) => {
				if (e.target instanceof HTMLElement && !e.target.closest('.alert-options')) {
					alert?.classList.add('hidden');
				}
			});
		} catch (e) {
			console.error(e);
		}
	}

	function editAlert(alert_id: string, alert_type: string) {
		goto(`/alert/price-alert/${alert_type}?edit_alert=${alert_id}`);
	}

	function getProvider(code: string) {
		return providers.find((p: any) => p.code === code);
	}

	onMount(() => {
		window.addEventListener('click', (e) => {
			if (e.target instanceof HTMLElement && !e.target.closest('.all-alert-options')) {
				showAllAlertOptions = false;
			}
		});
	});
</script>

<svelte:head>
	<title>Price Alerts</title>
</svelte:head>

<div class="container">
	{#if user.isLogin}
		<h2 class="text-3xl mb-4">My alerts</h2>
		<div class="mb-6">View and manage all your price alerts in one place.</div>

		{#if data.alerts && data.alerts.length > 0}
			<div class="flex gap-2 items-center justify-end mb-4 md:hidden">
				<a href="/alert/price-alert/" class="button">Create alert</a>
			</div>
			<div
				class="bg-gray-50 dark:bg-gray-900/10 p-2 md:p-6 rounded-lg w-full text-gray-600 dark:text-gray-300"
			>
				<div class="flex items-center justify-between mb-4 relative">
					<div class="flex gap-2 items-center">
						<span class="text-gray-800 dark:text-gray-400">Sort:</span>
						<button
							class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded"
							on:click={toggleSort}
						>
							<i class="fa fa-{isRecent ? 'sort-amount-down' : 'sort-amount-up'}" />
							{isRecent ? 'Most Recent' : 'Oldest'}
						</button>
						<span class="hidden md:inline">
							<CustomSelectBox
								options={pair_list}
								className="!py-1"
								on:select={filterAlertsByPair}
								bind:selected={selectedPairForFilter}
								placeholder="Filter by Pairs"
							/>
							<button
								class="text-blue-500 mx-2 {selectedPairForFilter === '' ? 'hidden' : ''}"
								on:click={() => {
									selectedPairForFilter = '';
									filterAlertsByPair();
								}}>Clear filter</button
							>
						</span>
						<span class="flex md:inline items-center justify-center md:justify-start">
							<button
								class="bg-transpareent p-2 md:hidden"
								on:click={() => (showSearch = !showSearch)}
								aria-label="Search"
							>
								<i class="fa fa-search cursor-pointer" />
							</button>
							<span
								class="flex items-center gap-2 md:flex-none w-full md:w-auto bg-gray-50 dark:bg-gray-800 p-2 md:p-0 absolute md:static -top-1 left-0 transition-opacity duration-300 md:inline z-50"
								class:hidden={!showSearch}
							>
								<input
									type="search"
									class="input border-none w-10 m-0 w-auto bg-gray-200 dark:bg-gray-700 text-gray-500 px-3 py-1 rounded"
									placeholder="Search..."
									bind:value={searchText}
									on:input={filterAlerts}
								/>
								<button
									on:click={() => (showSearch = false)}
									class="button md:hidden"
									aria-label="Close">Cancel</button
								>
							</span>
						</span>
					</div>
					<div class="flex items-center gap-5">
						<span class="relative all-alert-options pr-5 md:pr-0">
							<button on:click={() => (showAllAlertOptions = !showAllAlertOptions)}>
								<i class="fa fa-gear" />
							</button>
							<span
								class="{showAllAlertOptions
									? 'flex'
									: 'hidden'} flex-col gap-4 w-64 z-[70] absolute top-5 right-0 md:left-1/2 md:transform md:-translate-x-1/2 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg"
							>
								<button
									class="hover:bg-gray-200 dark:hover:bg-gray-800"
									on:click={() => (showConfirmAllAlertDeletion = true)}>Delete all alerts</button
								>
								<button
									class="hover:bg-gray-200 dark:hover:bg-gray-800"
									on:click={() => (showConfirmEnabledAlertDeletion = true)}
									>Delete all enabled alerts</button
								>
								<button
									class="hover:bg-gray-200 dark:hover:bg-gray-800"
									on:click={() => (showConfirmDisabledAlertDeletion = true)}
									>Delete all disabled alerts</button
								>
							</span>
						</span>
						<a href="/alert/price-alert/" class="button hidden md:inline-block">Create alert</a>
					</div>
				</div>

				<div class="md:hidden mb-8">
					<span class="text-gray-800 dark:text-gray-400">Filter:</span>
					<CustomSelectBox
						options={pair_list}
						className="!py-1"
						on:select={filterAlertsByPair}
						bind:selected={selectedPairForFilter}
						placeholder="Filter by Pairs"
					/>
					<button
						class="text-blue-500 mx-2 {selectedPairForFilter === '' ? 'hidden' : ''}"
						on:click={() => {
							selectedPairForFilter = '';
							filterAlertsByPair();
						}}>Clear filter</button
					>
				</div>

				{#if searchText !== '' || (selectedPairForFilter !== '' && alerts.length === 0)}
					<p class="text-center text-gray-400 my-16">No results found.</p>
				{:else}
					<div class="mb-10 overflow-x-auto md:overflow-visible">
						<div class="min-w-[800px] md:min-w-auto">
							<table class="table-auto w-full border-separate border-spacing-y-4">
								<thead>
									<tr>
										<th class="p-4 text-left">Pairs, Providers</th>
										<th class="p-4 text-left">Channels</th>
										<th class="p-4 text-left">Interval</th>
										<th class="p-4 text-left">Last Trigger</th>
										<th class="p-4 text-left">Next Trigger</th>
										<th class="p-4 text-left" />
									</tr>
								</thead>
								<tbody>
									{#each alerts as alert}
										<tr
											class="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
										>
											<td class="px-4 py-2 text-left">
												<span class="block mb-2">
													{alert.base.toUpperCase()} in {alert.quote.toUpperCase()}
												</span>
												<span class="flex flex-wrap gap-2 items-center">
													{#each alert.exchange as exchange, index}
														{#if index <= 2}
															<span
																class="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-full inline-flex items-center mb-2 border border-gray-300 dark:border-gray-700"
															>
																<img
																	src="/icons/{getProvider(exchange).icon}"
																	alt="icon"
																	class="w-4 h-4 mr-2"
																/>
																{getProvider(exchange).name}
															</span>
														{/if}
														{#if alert.exchange.length - 1 === index}
															{#if index > 2 && alert.exchange.length - 3 > 0}
																<span
																	class="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded-full inline-flex items-center mb-2 border border-gray-300 dark:border-gray-700"
																>
																	+{alert.exchange.length -
																		3 +
																		(index > 2 && alert.exchange.length - 3 > 1
																			? ' others'
																			: ' other')}
																</span>
															{/if}
														{/if}
													{/each}
												</span>
											</td>
											<td class="px-4 py-2 text-left">
												<span class="flex flex-wrap gap-2 items-center">
													{#each Object.entries(alert.channel) as [key, value]}
														<span
															class="border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-sm"
														>
															<TipView
																tip={{
																	label: capitalizeFirstLetter(key),
																	value: value
																}}
																trigger="click"
															/>
														</span>
													{/each}
												</span>
											</td>
											<td class="px-4 py-2 text-left">
												{alert.frequency.type}
											</td>
											<td class="px-4 py-2 text-left">
												{alert.last_triggered === alert.created_at
													? '-'
													: friendlyDate(alert.last_triggered)}
											</td>
											<td class="px-4 py-2 text-left">
												{getNextTriggerTime(alert.frequency, alert.last_triggered)}
											</td>
											<td class="px-4 py-2 text-left">
												<div>
													<div class="md:hidden ml-1 alert-options">
														<button
															class="text-gray-400 hover:text-red-500"
															aria-label="Options"
															on:click={() => showAlertOptions(alert._id)}
														>
															<i class="fa fa-gear text-lg" />
														</button>
													</div>
													<div
														class="hidden md:flex items-center gap-4 fixed md:static left-0 bottom-0 z-[60] bg-gray-100 dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent p-5 md:p-0 w-full md:w-auto alert-options"
														id="alert-option-{alert._id}"
													>
														<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
															<button
																class="w-12 h-6 rounded-full relative focus:outline-none"
																style="background-color: {alert.status === 'active'
																	? '#4CAF50'
																	: '#c0c0c0'};"
																on:click={() => toggleAlertStatus(alert._id)}
															>
																<span
																	class="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform"
																	style="transform: translateX({alert.status === 'active'
																		? '24px'
																		: '0px'});"
																/>
															</button>
															<button
																class="md:hidden"
																on:click={() => toggleAlertStatus(alert._id)}
																>Enable/Disable this alert</button
															>
														</span>
														<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
															<button
																class="text-gray-400 hover:text-gray-500"
																aria-label="Edit"
																on:click={() => editAlert(alert._id, alert.type)}
															>
																<i class="fa fa-edit text-lg" />
															</button>
															<button
																class="md:hidden"
																on:click={() => editAlert(alert._id, alert.type)}
																>Edit this alert</button
															>
														</span>
														<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
															<button
																class="text-gray-400 hover:text-red-500"
																aria-label="Delete"
																on:click={() => (showConfirmAlertDeletion[alert._id] = true)}
															>
																<i class="fa fa-trash text-lg" />
															</button>
															<button
																class="md:hidden"
																on:click={() => (showConfirmAlertDeletion[alert._id] = true)}
																>Delete this alert</button
															>
														</span>
													</div>
													<Dialog
														bind:isOpen={showConfirmAlertDeletion[alert._id]}
														title="Are you sure you want to delete this alert?"
														actions={[
															{
																label: 'Confirm',
																callback: () => {
																	deleteAlert(alert._id);
																}
															}
														]}
													>
														<p class="mb-4">Please confirm alert deletion.</p>
													</Dialog>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center">
				<p class="text-2xl mb-10">You currently do not have any price alert.</p>
				<a href="/alert/price-alert/" class="button">Create alert</a>
			</div>
		{/if}
	{/if}
</div>

<Dialog
	bind:isOpen={showConfirmAllAlertDeletion}
	title="Are you sure you want to delete all your alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>

<Dialog
	bind:isOpen={showConfirmDisabledAlertDeletion}
	title="Are you sure you want to delete all your disabled alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllDisabledAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>

<Dialog
	bind:isOpen={showConfirmEnabledAlertDeletion}
	title="Are you sure you want to delete all your enabled alerts?"
	actions={[
		{
			label: 'Confirm',
			callback: () => {
				deleteAllEnabledAlert();
			}
		}
	]}
>
	<p class="mb-4">Please confirm alert deletion.</p>
</Dialog>
