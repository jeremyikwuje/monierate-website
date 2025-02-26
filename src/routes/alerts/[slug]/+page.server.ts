import type { PageServerLoad } from './$types'
import { get_changers } from "$lib/server/changer.service";
import { get_currencies } from '$lib/server/currency.service';


export const load: PageServerLoad = async ({ params }) => {
    const providers = await get_changers();
    const currencies = await get_currencies();
    
    return {
        slug: params.slug,
        currencies,
        providers,
    }
}