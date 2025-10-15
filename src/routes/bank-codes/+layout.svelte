<script lang="ts">
    import AdBanner from "$lib/components/AdBanner.svelte";
    export let data;
</script>

<div class="bg-white dark:bg-gray-800">
	<div class="top-landscape mb-8">
		<AdBanner name="bank_codes" isMobile={data.isMobile}/>
	</div>
</div>

<slot />
