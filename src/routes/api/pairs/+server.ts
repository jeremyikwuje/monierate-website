import { getEndpoint, basicAuth  } from "$lib/helper.svelte";
import { json, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */

export async function GET({ url })
{
    let urlParams = url.searchParams
    const pair = urlParams.get('pair') || null
    
    let endpoint = getEndpoint(`/public/pairs/${pair}`);

    let res = await fetch(
        endpoint,
        basicAuth('GET', {})
    );
    const changer = (await res.json()).data || {}

    return json(changer);
}