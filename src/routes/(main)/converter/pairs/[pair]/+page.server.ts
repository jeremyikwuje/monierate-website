import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ fetch, params, url }) => {
    try {
        let urlParams = url.searchParams
        // get url params
        const pair = params.pair

        const getPair = await fetch(`/api/pairs?pair=${pair}`);
        const rates = await getPair.json()

        const getChangers = await fetch(`/api/changer`);
        let changers = await getChangers.json()

        console.log(rates)
        console.log(changers)

        return {
            rates,
            changers
        }
    }
    catch(e: any) {
        console.log(e)
        throw error(502, `Unable to fetch an important data`)
    }
}