import { get_changers } from '$lib/server/changer.service';
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const changers = await get_changers();

        return {
            changers
        }

    } catch (e) {
        throw error(500, `Could not find providers data`)
    }
}