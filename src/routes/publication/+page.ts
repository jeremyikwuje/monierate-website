import type { Post } from '$lib/articles/types'

export async function load({ fetch }) {
	const response = await fetch(`/api/publication`)
	const posts: Post[] = await response.json()
	return { posts }
}
