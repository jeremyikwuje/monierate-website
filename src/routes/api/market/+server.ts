import { getEndpoint, basicAuth  } from "$lib/helper.svelte";
import { json, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */

export async function GET({ url })
{
    let urlParams = url.searchParams
    const changer = urlParams.get('changer') || null
    
    let endpoint = getEndpoint(`/public/market`);
    if (changer != null) {
        endpoint = getEndpoint(`/public/market?changer=${changer}`);
    }

    let res = await fetch(
        endpoint,
        basicAuth('GET', {})
    );
    const market = (await res.json()).data || {}

    return json(market);
}