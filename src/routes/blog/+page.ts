
import type { Post } from '$lib/blog/types'

export async function load({ params }) {
    const posts = await getPosts()

    return {
        posts: posts
    }
}

async function getPosts() {
    const response = await fetch(`/api/blog`)
    const posts: Post[] = await response.json()
    return posts
}