import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import type { LayoutServerLoad } from "./$types"

export const load = (async ({  }) => {
    let parallel_avg = "NULL"

    let endpoint = getEndpoint("/public/rates/averages");
    let res = await fetch(endpoint, basicAuth('GET', {}));

    console.log(res.status)
    if (res.status != 200) {
        console.log(res)
    }

    const rates = (await res.json()).data
    parallel_avg = rates.usdngn.average || 0

    console.log(rates)

    return {
        market_avg: rates,
    }

}) satisfies LayoutServerLoad