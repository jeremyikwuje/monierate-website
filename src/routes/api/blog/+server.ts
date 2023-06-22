import { json } from '@sveltejs/kit'
import type { Post } from '$lib/blog/types'

async function getPosts(tag: string = "") {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/blog/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const post = { ...metadata, slug } satisfies Post

			if (tag.length != 0) {
				if ( tag === post.tag || '') {
					post.published && posts.push(post)
				}
			}
            else {
				post.published && posts.push(post)
			}
		}
	}

	posts = posts.sort((first, second) =>
    	new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
	)

	return posts
}

export async function GET({ url }) {
	const params = url.searchParams
	const tag = params.get('tag') || ''

	const posts = await getPosts(tag)
	return json(posts)
}
