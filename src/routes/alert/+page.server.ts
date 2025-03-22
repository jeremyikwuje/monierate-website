import type { PageServerLoad } from './$types'
import { get_all_alerts } from '$lib/price_alert/alert.service';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
    let alerts: any = [];
    try {

        let getAlerts = await get_all_alerts(fetch);
        alerts = getAlerts.data;

    } catch(error: any) {
        console.log(error.message)
    }
    
    return {
        alerts,
    }
    
}
