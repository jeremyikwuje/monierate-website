import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const getChangers = await fetch(`/api/changer`);
        let providers = await getChangers.json()

        return {
            providers
        }

    } catch (e) {
        throw error(500, `Could not find providers data`)
    }
}