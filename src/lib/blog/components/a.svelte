<script lang="ts">
	export let href: string
</script>

<a {href} rel="nofollow" target="_blank" style="text-decoration: none;">
	<slot />
</a>