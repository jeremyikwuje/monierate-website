import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types'
import { get_changers } from "$lib/server/changer.service";
import { get_pairs_changers } from "$lib/server/pair.service";

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        let providers = await get_changers();
        let remittance = await get_pairs_changers(`usdngn`, 'remittance');
        let ramp = await get_pairs_changers(`usdngn`, 'ramp');
        let card = await get_pairs_changers(`usdngn`, 'card');

        if (providers.length == 0) {
            throw error(500, {
                message: "Unable to fetch platforms data, try again in few minutes."
            })
        }
        
        // change changers to object with changer code as key
        let tmp_providers: any = {}
        for (const key in providers) {
            tmp_providers[providers[key].code] = providers[key];
        }

        providers = tmp_providers;

        return {
            providers,
            remittance,
            ramp,
            card
        }
    }
    catch(error: any) {
        throw error(500, {
            message: "Unable to display data, try again in few minutes."
        })
    }
    
}
