import { error } from '@sveltejs/kit'

export async function load({ params }) {
	try {
		const post = await import(`../../../blog/${params.slug}.md`)

		return {
			slug: params.slug,
			post: post
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}