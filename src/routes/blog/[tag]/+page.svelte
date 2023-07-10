<script lang="ts">
	import { formatDate } from '$lib/blog/utils'
	import * as config from '$lib/blog/config'

	export let data
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
		<section id="entries">
			<ul class="posts">
				{#each data.posts as post}
					<li class="flex justify-between items-center mb-4 py-6 border-b-2 border-dotted border-gray-300 last:border-none">
						<span class="block">
							<a href="/blog/{post.tag}" class="inline-block text-green-500 font-semibold text-xs mb-1 leading-none">{post.tag.toUpperCase()}</a>
							<p></p>
							<a href="/blog/{post.tag}/{post.slug}" class="text-2xl text-gray-900 dark:text-gray-300 hover:underline">{post.title}</a>
						</span>
						<p class="text-sm md:text-lg text-gray-500 dark:text-gray-300">{formatDate(post.createdAt)}</p>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>

<style>
	
</style>
