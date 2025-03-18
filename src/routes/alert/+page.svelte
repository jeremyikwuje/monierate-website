<script lang="ts">
	import { login_uri } from '$lib/functions';
	export let data;
	const user: any = data.user;
</script>

<svelte:head>
	<title>Price Alerts</title>
</svelte:head>

<div class="container">
	<h2 class="text-3xl mb-6 text-center">My alerts</h2>

	{#if user.isLogin}
		<div class="text-center">
            <p class="text-2xl mb-10">You currently do not have any price alert.</p>
            <a href="/alert/price-alert/" class="button">Create alert</a>
            </div>
	{:else}
		<div class="text-center">
			<p class="text-2xl mb-4">You need to login to view your alerts.</p>
			<a href={login_uri()} class="text-blue-500 hover:underline">Login</a>
		</div>
	{/if}
</div>
