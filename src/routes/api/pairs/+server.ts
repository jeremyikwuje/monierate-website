import { getEndpoint, basicAuth  } from "$lib/helper.svelte";
import { json, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */

export async function GET({ url })
{
    let urlParams = url.searchParams
    const currenypair = urlParams.get('pair') || null
    
    let endpoint = getEndpoint(`/public/pairs/${currenypair}`);

    let res = await fetch(
        endpoint,
        basicAuth('GET', {})
    );
    const pairRates = (await res.json()).data || {}

    return json(pairRates);
}