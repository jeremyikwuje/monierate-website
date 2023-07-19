<script lang="ts">
	export let href: string
</script>

<a {href} target="_blank" style="text-decoration: none;">
	<slot />
</a>