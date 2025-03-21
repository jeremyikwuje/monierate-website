<script lang="ts">
	import {
		login_uri,
		capitalizeFirstLetter,
		getReadableFrequency,
		friendlyDate
	} from '$lib/functions';
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
	};

	type Alerts = Alert[];

	export let data;
	const user: any = data.user;
	const providers = data.providers;
	$: alerts = data.alerts?.sort(
		(a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	) as Alerts;

	let showSearch: boolean = false;
	let showConfirmAlertDeletion: boolean = false;
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
					Object.entries(a.channel).some((c: any) => c.toString().toLowerCase().includes(searchText.toLowerCase())) ||
					(a.note && a.note.toLowerCase().includes(searchText.toLowerCase())) ||
					friendlyDate(a.created_at).toLowerCase().includes(searchText.toLowerCase())
			);
			console.log(alerts)
		}
	}

	async function deleteAlert(id: string) {
		const res = await delete_alert(id);
		if (res.status === 'success') {
			data.alerts = data.alerts.filter((a: any) => a._id !== id);
		} else {
			notify('There was an error deleting the alert');
		}
		showConfirmAlertDeletion = false;
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
	<h2 class="text-3xl mb-4">My alerts</h2>
	<div class="mb-6">View and manage all your price alerts in one place.</div>

	{#if user.isLogin}
		{#if data.alerts && data.alerts.length > 0}
			<div class="flex gap-2 items-center justify-end mb-4 md:hidden">
				<a href="/alert/price-alert/" class="button">Create alert</a>
			</div>
			<div class="bg-gray-50 dark:bg-gray-900/10 p-2 md:p-6 rounded-lg w-full text-gray-600 dark:text-gray-300">
				<div class="flex items-center justify-between mb-4 relative">
					<div class="flex gap-2 items-center">
						<span class="text-gray-800 dark:text-gray-400">Sort:</span>
						<button class="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded" on:click={toggleSort}>
							<i class="fa fa-{isRecent ? 'sort-amount-down' : 'sort-amount-up'}" />
							{isRecent ? 'Most Recent' : 'Oldest'}
						</button>
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

				{#if searchText !== '' && alerts.length === 0}
					<p class="text-center text-gray-400 my-16">No results found.</p>
				{:else}
					{#each alerts as alert}
						<div
							class="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
						>
							<div class="flex flex-col gap-1 text-sm md:text-base">
								<div class="flex items-center gap-2">
									<span class="text-red-500 text-lg">
										<i class="fa fa-bell" />
									</span>
									{#if alert.type === 'periodic'}
										<span class="text-gray-600 dark:text-gray-300">
											Receive price alert via <span class="text-green-400 font-semibold"
												>{Object.keys(alert.channel).map((c) => capitalizeFirstLetter(c)).join(', ')}</span
											>,
											<span class="text-blue-400 font-semibold"
												>{getReadableFrequency(alert.frequency).toLowerCase()}</span
											>
											for
											<span class="text-yellow-400 font-semibold">{alert.base.toUpperCase()}</span>
											in
											<span class="text-yellow-400 font-semibold">{alert.quote.toUpperCase()}</span>
											on
											<span class="text-blue-500 font-semibold">{alert.exchange.join(', ')}</span>.
										</span>
									{:else}
										<p>Threshold alert</p>
									{/if}
								</div>
								<div class="text-sm text-gray-800 dark:text-gray-400 flex flex-col md:flex-row md:items-center gap-2 flex-wrap">
									<span>
										Created: <span class="text-gray-600 dark:text-gray-300">{friendlyDate(alert.created_at)}</span>
									</span>
									{#if alert.note}
									<span class="text-gray-600 dark:text-gray-300 hidden md:inline-block"> | </span>
									<span class="text-gray-500 dark:text-gray-400">Note: {alert.note}</span>
									{/if}
									{#if alert.disable_after_trigger}
									<span class="text-gray-600 dark:text-gray-300 hidden md:inline-block"> | </span>
									<span class="text-gray-500 dark:text-gray-400">Will be disabled after being sent.</span>
									{/if}
								</div>
							</div>
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
										style="background-color: {alert.status === 'active' ? '#4CAF50' : '#F44336'};"
										on:click={() => toggleAlertStatus(alert._id)}
									>
										<span
											class="absolute top-0.5 left-1 w-5 h-5 bg-white rounded-full transition-transform"
											style="transform: translateX({alert.status === 'active' ? '24px' : '0px'});"
										/>
									</button>
									<button class="md:hidden" on:click={() => toggleAlertStatus(alert._id)}
										>Enable/Disable this alert</button
									>
								</span>
								<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
									<button class="text-gray-400 hover:text-gray-500" aria-label="Edit" on:click={() => editAlert(alert._id, alert.type)}>
										<i class="fa fa-edit text-lg" />
									</button>
									<button class="md:hidden" on:click={() => editAlert(alert._id, alert.type)}>Edit this alert</button>
								</span>
								<span class="flex items-center gap-4 w-full md:w-auto p-4 md:p-0">
									<button
										class="text-gray-400 hover:text-red-500"
										aria-label="Delete"
										on:click={() => (showConfirmAlertDeletion = true)}
									>
										<i class="fa fa-trash text-lg" />
									</button>
									<button class="md:hidden" on:click={() => (showConfirmAlertDeletion = true)}
										>Delete this alert</button
									>
								</span>
							</div>
						</div>
						<Dialog
							bind:isOpen={showConfirmAlertDeletion}
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
					{/each}
				{/if}
			</div>
		{:else}
			<div class="text-center">
				<p class="text-2xl mb-10">You currently do not have any price alert.</p>
				<a href="/alert/price-alert/" class="button">Create alert</a>
			</div>
		{/if}
	{:else}
		<div class="text-center">
			<p class="text-2xl mb-4">You need to login to view your alerts.</p>
			<a href={login_uri()} class="text-blue-500 hover:underline">Login</a>
		</div>
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
