
import type { Post } from '$lib/blog/types'

export async function load({ params }) {
	const tag = params.tag
    const posts = await getPosts(tag || '')

    return {
        posts: posts,
		tag: tag
    }
}

async function getPosts(tag: string) {
    const response = await fetch(`/api/blog?tag=${tag}`)
    const posts: Post[] = await response.json()
    return posts
}