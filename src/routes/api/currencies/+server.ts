import { getEndpoint, basicAuth  } from "$lib/helper.svelte";
import { json, redirect } from "@sveltejs/kit";
/** @type {import('./$types').RequestHandler} */

export async function GET({ url })
{
    let urlParams = url.searchParams
    const code = urlParams.get('code') || null
    
    let endpoint = getEndpoint(`/public/currencies`);
    if (code != null) {
        endpoint = getEndpoint(`/public/currencies?code=${code}`);
    }

    let res = await fetch(
        endpoint,
        basicAuth('GET', {})
    );
    const currencies = (await res.json()).data || {}

    return json(currencies);
}