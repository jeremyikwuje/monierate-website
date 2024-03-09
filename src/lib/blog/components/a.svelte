<script lang="ts">
	export let href: string
</script>

<a {href} rel="noopener" target="_blank" style="text-decoration: underline;">
	<slot />
</a>