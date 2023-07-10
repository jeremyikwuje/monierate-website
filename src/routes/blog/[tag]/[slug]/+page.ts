import { error } from '@sveltejs/kit'

export async function load({ params }) {
	try {
		return {
			slug: params.slug
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}