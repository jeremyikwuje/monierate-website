import { get_changers } from '$lib/server/changer.service';
import { get_currencies } from '$lib/server/currency.service';
import type { PageServerLoad } from './$types'
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = (async ({ params, url, fetch }) => {

    try {
        const changer_code = params.changer;

        let urlParams = url.searchParams
        const convert = {
            From: urlParams.get('From') || 'usd',
            To: urlParams.get('To') || 'ngn',
            Amount: urlParams.get('Amount') || 1
        }

        const changer = await get_changers(changer_code);
        const currencies = await get_currencies();

        if (Object.keys(currencies).length == 0) {
            throw error(500, "Currencies data failed.")
        }
        if (Object.keys(changer).length == 0) {
            throw error(500, "Changer data failed.")
        }
        
        return {
            changer,
            convert,
            currencies
        }
    }
    catch(e: any) {
        console.log(e)
        throw error(502, `Unable to fetch an important data`)
    }
})