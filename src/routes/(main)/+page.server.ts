import { basicAuth, getEndpoint } from "$lib/helper";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types'
import { get_changers } from "$lib/server/changer.service";

export const load: PageServerLoad = async ({ fetch }) => {

    try {
        let providers = await get_changers();

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
            providers
        }
    }
    catch(error: any) {
        throw error(500, {
            message: "Unable to display data, try again in few minutes."
        })
    }
    
}
