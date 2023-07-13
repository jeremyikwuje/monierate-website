import { error } from '@sveltejs/kit'
import { formatDate } from '$lib/blog/utils'

export async function load({ params }) {
	const post = await import(`../../../../blog/${params.slug}.md`)

	try {
		return {
			slug: params.slug,
			post: post
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}

async function getPost() {
	const post = await import(`../../../../blog/${data.slug}.md`)

	console.log(post.default)
	console.log(post.metadata)

	return post
}