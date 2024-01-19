import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        let slug = params.slug.split('-')
        let provider_code = slug[0]

        if (slug.length > 3) {
            provider_code = slug[0] + '-' + slug[1]
        }

        if (provider_code.length == 0) {
            throw error(404, `Provider not found`)
        }

        const getChangers = await fetch(`/api/changer?code=${provider_code}`);
        let provider = await getChangers.json()

        return {
            provider,
        }
    }
    catch(e: any) {
        console.log(e)
        throw error(500, `Unable to fetch provider data`)
    }
}