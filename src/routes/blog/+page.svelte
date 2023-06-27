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

<div class="mt-8 mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 text-center">
		<h1 class="text-2xl md:text-4xl">
			Make the right money move
		</h1>
	</div>
	
	<!-- Posts -->
	<div class="container bg-white px-4 shadow-md">
		<section id="entries" class="mt-8">
			<ul class="posts">
				{#each data.posts as post}
					<li class="flex flex-col md:flex-row justify-between item-left md:items-center mb-4 py-6 border-b-2 border-dotted border-gray-300 last:border-none">
						<span class="block">
							<a href="/blog/{post.tag}" class="inline-block text-green-500 font-semibold text-xs mb-1 leading-none">{post.tag.toUpperCase()}</a>
							<p></p>
							<a href="/blog/{post.tag}/{post.slug}" class="text-lg md:text-2xl text-gray-900 hover:underline">{post.title}</a>
						</span>
						<p class="text-sm md:text-lg text-gray-500">{formatDate(post.createdAt)}</p>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>


<style>
	
</style>