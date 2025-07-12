<script lang="ts">
	import { formatNumber, capitalizeAndJoin } from '$lib/functions';

	export let data: any;
	let currencySymbols: any = data.currencySymbols;
	let subscriptionPlans: any = data.subscriptionPlans
		.sort((a: any, b: any) => b.price - a.price)
		.slice(0, 3);
</script>

<div class="grid md:grid-cols-3 gap-4 mb-16">
	{#if subscriptionPlans}
		{#each subscriptionPlans as plan, i}
			<div
				class="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md py-6 {plan.code ===
				'free'
					? 'md:col-span-3 md:place-self-center'
					: ''}"
			>
				<div class="mb-6 px-6">
					<span
						class="block text-2xl font-bold mb-2 text-blue-500"
					>
						{plan.name}
					</span>
					{#if plan.description}
					<span
						class="block text-md"
					>
						{plan.description}
					</span>
					{/if}
				</div>
				<div class="px-6 bg-blue-500/5 dark:bg-blue-500/10 py-4 mb-4">
					<p class="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100 mb-5">
						{currencySymbols[plan.currency]
							? currencySymbols[plan.currency]
							: plan.currency}{formatNumber(plan.price)}<span class="text-lg text-gray-500 dark:text-gray-400"> / yr</span>
					</p>
					<a
						href="https://account.monierate.com/subscription/{plan._id}"
						class="w-full button block text-center text-[17px] font-md bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md mb-2"
						>Buy now</a
					>
				</div>
				<div class="px-6 py-4">
					<p class="text-gray-700 dark:text-gray-300 font-bold text-md">Currency API:</p>
					<ul class="mt-6 space-y-4">
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
							<span class="font-medium"
								>{formatNumber(plan.requests_limit_per_month)} request per month</span
							>
						</li>
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							{#if plan.features.minute_updates}
								<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
								<span class="font-medium">
									{formatNumber(plan.features.minute_updates)}
									minute updates
								</span>
							{:else}
								<i class="fa fa-times-circle text-red-500 mr-3" />
								<span class="font-medium"> No limit updates </span>
							{/if}
						</li>
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
							<span class="font-medium"
								>{formatNumber(plan.requests_limit_per_minute)} request limit per minute</span
							>
						</li>
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							{#if plan.features.supports_premium_currencies === true}
								<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
								<span class="font-medium"> Supports premium currencies </span>
							{:else}
								<i class="fa fa-times-circle text-red-500 mr-3" />
								<span class="font-medium"> Does not support premium currencies </span>
							{/if}
						</li>
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							{#if plan.features.custom_reports === true}
								<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
								<span class="font-medium"> With custom historical reports </span>
							{:else}
								<i class="fa fa-times-circle text-red-500 mr-3" />
								<span class="font-medium"> No custom historical reports </span>
							{/if}
						</li>
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							{#if plan.features.available_markets}
								<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
								<span class="font-medium"> Rate supported: {capitalizeAndJoin(plan.features.available_markets)}</span>
							{:else}
								<i class="fa fa-times-circle text-red-500 mr-3" />
								<span class="font-medium"> No rate supported </span>
							{/if}
						</li>
					</ul>
				</div>
				<div class="px-6 py-4">
					<p class="text-gray-700 dark:text-gray-300 font-bold text-md">Other:</p>
					<ul class="mt-6 space-y-4">
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							{#if plan.features.minute_updates}
								<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
								<span class="font-medium">
									Unlimited rate alert
								</span>
							{:else}
								<i class="fa fa-times-circle text-red-500 mr-3" />
								<span class="font-medium"> 1 rate alert </span>
							{/if}
						</li>
						<li class="flex items-center text-gray-800 dark:text-gray-400">
							{#if plan.features.minute_updates}
								<i class="fa fa-check-circle text-blue-500 mr-2 text-lg" />
								<span class="font-medium">
								    Seamless Currency Swaps
								</span>
							{:else}
								<i class="fa fa-times-circle text-red-500 mr-3" />
								<span class="font-medium"> No instant swap </span>
							{/if}
						</li>
					</ul>
				</div>
			</div>
		{/each}
	{/if}
</div>
