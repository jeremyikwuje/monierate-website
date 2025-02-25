import type { PageServerLoad } from './$types'
import Currencies from '$data/currencies.json';
import { get_changers } from "$lib/server/changer.service";


export const load: PageServerLoad = async ({ params }) => {
    const currencies = Object.values(Currencies).reduce((acc, obj) => ({ ...acc, ...obj }), {});
    let providers = await get_changers();
    
    return {
        slug: params.slug,
        currencies,
        providers,
    }
}