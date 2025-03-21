import type { PageServerLoad } from './$types'
import { get_changers } from "$lib/server/changer.service";
import { get_all_alerts } from '$lib/price_alert/alert.service';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
    let providers: any = [];
    let alerts: any = [];
    try {
        providers = await get_changers();

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

        let getAlerts = await get_all_alerts(fetch);
        alerts = getAlerts.data;

    } catch(error: any) {
        console.log(error.message)
    }
    
    return {
        providers,
        alerts,
    }
    
}
