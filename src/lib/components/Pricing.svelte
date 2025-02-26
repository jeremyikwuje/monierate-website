<script lang="ts">
	import { formatNumber } from '$lib/functions';

	export let data: any;
	let currencySymbols: any = data.currencySymbols;
	let subscriptionPlans: any = data.subscriptionPlans
		.sort((a: any, b: any) => b.price - a.price)
		.slice(0, 3);
</script>

<div class="grid md:grid-cols-3 gap-5 mb-16">
	{#if subscriptionPlans}
		{#each subscriptionPlans as plan, i}
			<div
				class="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 {i === 1
					? 'border-blue-500/50 outline outline-2 outline-blue-500/10 outline-offset-2'
					: 'border-gray-200 dark:border-gray-700'} rounded-lg shadow-md p-6 hover:scale-105 transition-all duration-300 {plan.code ===
				'free'
					? 'md:col-span-3 md:place-self-center'
					: ''}"
			>
				<div class="">
					<div class="mb-6">
						<span
							class="inline-block text-lg {i === 0
								? 'text-yellow-800 dark:text-yellow-200 bg-yellow-800/10'
								: i === 1
								? 'text-blue-500 bg-blue-800/10'
								: i === 2
								? 'text-green-500 bg-green-800/10'
								: 'text-gray-800 dark:text-gray-200 bg-gray-800'} rounded-lg p-1 px-4"
						>
							{plan.name}
						</span>
					</div>
					<p class="mt-2 text-5xl font-bold text-gray-900 dark:text-gray-100">
						{currencySymbols[plan.currency]
							? currencySymbols[plan.currency]
							: plan.currency}{formatNumber(plan.price)}
					</p>
				</div>
				<ul class="mt-6 space-y-4">
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						<i class="fa-regular fa-check-circle text-blue-500 mr-2 text-lg" />
						<span class="font-medium"
							>{formatNumber(plan.requests_limit_per_month)} request per month</span
						>
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						{#if plan.features.minute_updates}
							<i class="fa-regular fa-check-circle text-blue-500 mr-2 text-lg" />
							<span class="font-medium">
								{formatNumber(plan.features.minute_updates)}
								minute updates
							</span>
						{:else}
							<i class="fa-regular fa-times-circle text-red-500 ml-1 mr-3" />
							<span class="font-medium"> No limit updates </span>
						{/if}
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						<i class="fa-regular fa-check-circle text-blue-500 mr-2 text-lg" />
						<span class="font-medium"
							>{formatNumber(plan.requests_limit_per_minute)} request limit per minute</span
						>
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						{#if plan.features.supports_premium_currencies === true}
							<i class="fa-regular fa-check-circle text-blue-500 mr-2 text-lg" />
							<span class="font-medium"> Supports premium currencies </span>
						{:else}
							<i class="fa-regular fa-times-circle text-red-500 ml-1 mr-3" />
							<span class="font-medium"> Does not support premium currencies </span>
						{/if}
					</li>
					<li class="flex items-center text-gray-800 dark:text-gray-400">
						{#if plan.features.custom_reports === true}
							<i class="fa-regular fa-check-circle text-blue-500 mr-2 text-lg" />
							<span class="font-medium"> With custom historical reports </span>
						{:else}
							<i class="fa-regular fa-times-circle text-red-500 ml-1 mr-3" />
							<span class="font-medium"> No custom historical reports </span>
						{/if}
					</li>
				</ul>
				<div class="mt-6">
					<a
						href="https://account.monierate.com/subscription/{plan._id}"
						class="w-full button block text-center {i === 1
							? 'bg-blue-500 hover:bg-blue-600 text-white'
							: 'bg-transparent hover:bg-blue-500/5 border border-blue-500 text-blue-500'} font-medium py-3 px-4 rounded"
						>Select Plan</a
					>
				</div>
			</div>
		{/each}
	{/if}
</div>
