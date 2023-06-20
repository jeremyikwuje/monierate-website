import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({locals}) => {

    let endpoint = getEndpoint("/public/rates");
    let res = await fetch(
        endpoint,
        basicAuth('GET', {})
    );

    const rates = (await res.json()).data || {}

    console.log(rates)

    return {
        rates
    }
}
