<script lang="ts">
	import * as config from '$lib/blog/config'
	import { formatDate } from '$lib/blog/utils'

	export let data

	async function getPost() {
		const post = await import(`../../../../blog/${data.slug}.md`)

		console.log(post.default)
		console.log(post.metadata)

		return post
	}

	let post = getPost()
</script>

<!-- SEO -->
<svelte:head>
	{#await getPost()}
		<title></title>
    {:then value}
	<title>{value.metadata.title} &mdash; Monierate</title>
	<meta name="description" content={value.metadata.description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={value.metadata.title} />
	<meta property="og:description" content={value.metadata.description} />
	<meta property="og:image" content={value.metadata.image} />
	<meta property="og:url" content={config.url}/{value.metadata.tag}/{value.metadata.slug} />
	{:catch error}
		{error.message}
	{/await}
</svelte:head>


<main class="container mt-8 mb-8 pb-8 md:mt-16 md:mb-8 min-h-[100vh]">
	{#await getPost()}
        <span class="loading">Loading...</span>
    {:then value}
	<header class="mb-4 md:mb-6 not-format text-center">
		<!-- Tags -->
		<div class="tags text-center">
			<a href="/blog/{value.metadata.tag}" class="inline-block text-gray-600 dark:text-green-500 font-semibold text-xs mb-4 leading-none mr-2 last:mr-0">&num;{value.metadata.tag.toUpperCase()}</a>
		</div>
		<!-- Title -->
		<h1 class="mb-2 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-2 lg:text-4xl dark:text-gray-300 dark:font-semibold">{value.metadata.title}</h1>
		<p>Published {formatDate(value.metadata.createdAt)}</p>
	</header>

	<div class="bg-white dark:bg-black flex justify-between px-4 mx-auto max-w-screen-xl">
		<article id="entry" class="mx-auto w-full max-w-2xl format text-gray-800 dark:text-gray-300 format-sm sm:format-base lg:format-lg format-primary dark:format-invert lg:w-[700px]">
			<!-- Post -->
			<div class="post-content">
				<svelte:component this={value.default} />
			</div>
		</article>
	</div>
    {:catch error}
        {error.message}
    {/await}
</main>

<style>
	
</style>
