<script lang="ts">
	import * as config from '$lib/blog/config'
	import { formatDate } from '$lib/blog/utils'

	export let data
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title} &mdash; Monierate</title>
	<meta name="description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:image" content={data.meta.image} />
	<meta property="og:url" content={config.url}/{data.meta.tag}/{data.slug} />
</svelte:head>


<main class="container mt-8 mb-8 pb-8 md:mt-16 md:mb-8">
	<header class="mb-4 md:mb-6 not-format text-center">
		<!-- Tags -->
		<div class="tags text-center">
			<a href="/blog/{data.meta.tag}" class="inline-block text-green-500 font-semibold text-xs mb-1 leading-none mr-2 last:mr-0">&num;{data.meta.tag.toUpperCase()}</a>
		</div>
		<!-- Title -->
		<h1 class="mb-2 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-2 lg:text-4xl dark:text-gray-300 dark:font-semibold">{data.meta.title}</h1>
		<p>Published {formatDate(data.meta.createdAt)}</p>
	</header>

	<div class="bg-white dark:bg-black flex justify-between px-4 mx-auto max-w-screen-xl">
		<article id="entry" class="mx-auto w-full max-w-2xl format text-gray-800 dark:text-gray-300 format-sm sm:format-base lg:format-lg format-primary dark:format-invert lg:w-[700px]">
			<!-- Post -->
			<div class="post-content">
				<svelte:component this={data.content} />
			</div>
		</article>
	</div>
</main>

<style>
	
</style>
