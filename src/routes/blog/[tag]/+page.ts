import type { Post } from '$lib/articles/types'

export async function load({ fetch, params }) {
	const tag = params.tag || ''
	
	const response = await fetch(`/api/blog?tag=${tag}`)
	const posts: Post[] = await response.json()
	return { posts }
}
