import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ fetch, params, url }) => {
    try {
        let resPairs = fetch(`/api/pairs`)
        let resCurrencies = fetch(`/api/currencies`);
        let resChanger = fetch(`/api/changer`);

        let urlParams = url.searchParams
        const convert = {
            From: urlParams.get('From') || 'usd',
            To: urlParams.get('To') || 'ngn',
            Amount: urlParams.get('Amount') || 1
        }

        const pairs = (await (await resPairs).json())
        const changers = (await (await resChanger).json())
        const currencies = (await (await resCurrencies).json())

        if (Object.keys(pairs).length == 0) {
            throw error(500, "Pairs data failed.")
        }
        if (Object.keys(currencies).length == 0) {
            throw error(500, "Currencies data failed.")
        }
        if (Object.keys(changers).length == 0) {
            throw error(500, "Changer data failed.")
        }

        console.log(pairs)

        return {
            pairs,
            changers,
            currencies,
            convert
        }
    }
    catch(e: any) {
        console.log(e)
        throw error(502, `Unable to fetch an important data`)
    }
}