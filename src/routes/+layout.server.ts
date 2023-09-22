import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import type { LayoutServerLoad } from "./$types"

export const load = (async ({  }) => {
    let parallel_avg = "NULL"

    let endpoint = getEndpoint("/public/rates/parallel");
    let res = await fetch(endpoint, basicAuth('GET', {}));

    console.log(res.status)
    if (res.status != 200) {
        console.log(res)
    }

    const rate = (await res.json()).data
    parallel_avg = rate.parallel_avg

    return {
        market_avg: { 
            parallel: parallel_avg
        }
    }

}) satisfies LayoutServerLoad