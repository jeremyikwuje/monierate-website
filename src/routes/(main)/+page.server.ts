import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {

    try {
        let getRates = await fetch('/api/pairs?pair=usdngn');
        let rates = await getRates.json()

        if (rates.length == 0) {
            throw error(500, {
                message: "Unable to fetch rates data, try again in few minutes."
            })
        }

        delete rates.market

        const getChangers = await fetch(`/api/changer`);
        let providers = await getChangers.json()

        if (providers.length == 0) {
            throw error(500, {
                message: "Unable to fetch platforms data, try again in few minutes."
            })
        }
        
        // change changers to object with changer code as key
        let tmp_providers: any = {}
        for (const key in providers) {
            tmp_providers[providers[key].code] = providers[key]
        }

        providers = tmp_providers

        return {
            rates,
            providers
        }
    }
    catch(error: any) {
        throw error(500, {
            message: "Unable to display data, try again in few minutes."
        })
    }
    
}
