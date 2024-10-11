import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const countryCode = params.country;
    const bankCode = params.bank;
		
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}