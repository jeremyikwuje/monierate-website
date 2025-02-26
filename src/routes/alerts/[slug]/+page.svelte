<script class="alng">
    import Price from '$lib/components/alerts/Price.svelte';
    import Periodic from '$lib/components/alerts/Periodic.svelte';
    export let data;
    $: slug = data.slug;
</script>

<div class="container">
	<div class="flex gap-2 justify-center items-center">
		<a
			href="/alerts/price"
			class="inline-flex items-center gap-2 px-4 py-1 text-gray-700 dark:text-gray-300 rounded-tr-xl rounded-tl-xl text-sm font-medium {slug === 'price' ? 'tab-active-link' : ''}"
		>
			<i class="fa fa-line-chart" /> Price
		</a>
		<a
			href="/alerts/periodic"
			class="inline-flex items-center gap-2 px-4 py-1 text-gray-700 dark:text-gray-300 rounded-tr-xl rounded-tl-xl text-sm font-medium {slug === 'periodic' ? 'tab-active-link' : ''}"
		>
			<i class="fa fa-clock" /> Periodic
		</a>
	</div>

    {#if slug == "price"}
        <Price {data} />
	{:else if slug == "periodic"}
        <Periodic {data} />
    {/if}
	
</div>

<style>
	.tab-active-link {
		@apply bg-white border-t border-gray-300 dark:border-none dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 dark:shadow-[0_-4px_6px_rgba(0,0,0,0.1)]
	}
</style>
