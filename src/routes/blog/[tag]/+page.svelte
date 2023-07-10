<script lang="ts">
	import { formatDate } from '$lib/blog/utils'
	import type { Post } from '$lib/blog/types'

	export let data

	async function getPosts() {
		const response = await fetch(`/api/blog?tag=${data.tag}`)
		const posts: Post[] = await response.json()
		return posts
	}
</script>

<svelte:head>
	<title>{data.tag.toUpperCase()} | Blog</title>
	<meta name="description" content="Find content about {data.tag} on Monierate.">
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{data.tag.toUpperCase()} | Blog" />
	<meta property="og:description" content="Find content about {data.tag} on Monierate." />
</svelte:head>

<div class="mt-8 mb-8">
	<div class="w-[95%] md:w-[70%] px-8 py-4 mx-auto mb-4 md:mb-4 text-center">
		<h1 class="text-2xl md:text-4xl">
			TAG: {data.tag.toUpperCase()}
		</h1>
	</div>

	<!-- Posts -->
	<div class="container bg-white px-4 shadow-md dark:bg-black">
		<section id="entries" class="mt-8 min-h-[100vh]">
			{#await getPosts()}
				<span class="loading">Loading...</span>
			{:then values}
			<ul class="posts">
				{#each values as post}
					<li class="flex flex-col md:flex-row justify-between item-left md:items-center mb-4 py-6 border-b-2 border-dotted border-gray-300 dark:border-gray-500 last:border-none">
						<span class="block">
							<a href="/blog/{post.tag}" class="inline-block text-gray-600 dark:text-green-500 font-semibold text-xs mb-1 leading-none mb-4">{post.tag.toUpperCase()}</a>
							<p></p>
							<a href="/blog/{post.tag}/{post.slug}" class="text-lg md:text-2xl text-gray-900 hover:underline dark:text-gray-300">{post.title}</a>
						</span>
						<p class="text-sm md:text-lg text-gray-500 dark:text-gray-300">{formatDate(post.createdAt)}</p>
					</li>
				{/each}
			</ul>
			{:catch error}
				{error.message}
			{/await}
		</section>
	</div>
</div>

<style>
	
</style>
