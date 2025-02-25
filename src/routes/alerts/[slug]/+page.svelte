<script class="alng">
    import Price from '$lib/components/alerts/Price.svelte';
    export let data;
    $: slug = data.slug;
</script>

<div class="container">
	<div class="flex gap-2 justify-center items-center">
		<a
			href="/alerts/price"
			class="inline-flex items-center gap-2 px-4 py-1 text-gray-700 dark:text-gray-300 rounded-tr-xl rounded-tl-xl text-sm font-medium bg-white dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 shadow-[0_-4px_6px_rgba(0,0,0,0.1)]"
		>
			<i class="fa fa-line-chart" /> Price
		</a>
		<a
			href="/alerts/periodic"
			class="inline-flex items-center gap-2 px-4 py-1 text-gray-700 dark:text-gray-300 rounded-tr-xl rounded-tl-xl text-sm font-medium"
		>
			<i class="fa fa-clock" /> Periodic
		</a>
	</div>

    {#if slug == "price"}
        <Price {data} />
    {/if}
	
</div>
