<script lang="ts">
	import { formatDate } from '$lib/blog/utils'
	import * as config from '$lib/blog/config'

	export let data
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content="{config.description}">
	<meta property="og:type" content="website" />
	<meta property="og:title" content={config.title} />
	<meta property="og:description" content={config.description} />
	<meta property="og:url" content={config.url} />
</svelte:head>

<!-- Posts -->
<div class="container bg-white px-4">
	<section id="entries" class="mt-24">
		<ul class="posts">
			{#each data.posts as post}
				<li class="flex justify-between items-center mb-4 py-6 border-b-2 border-dotted border-gray-300 last:border-none">
					<span class="block">
						<a href="/blog/{post.tag}" class="inline-block text-green-500 font-semibold text-xs mb-1 leading-none">{post.tag.toUpperCase()}</a>
						<p></p>
						<a href="/blog/{post.tag}/{post.slug}" class="text-2xl text-gray-900 hover:underline">{post.title}</a>
					</span>
					<p class="date">{formatDate(post.createdAt)}</p>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	
</style>
