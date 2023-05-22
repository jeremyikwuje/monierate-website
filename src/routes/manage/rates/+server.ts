import { basicAuth, getEndpoint  } from "$lib/helper.svelte";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies })
{
    const { changer_code, currency, rate } = await request.json();
    const payload = {
        changer_code,
        currency,
        rate
    };
    const endpoint = getEndpoint("/rates");
    const res = await fetch(endpoint, basicAuth('POST', payload, 'system'));

    const result = await res.json();
    console.log(result);

    return json(result);
}

export async function GET({ request, cookies })
{
    const endpoint = getEndpoint("/public/rates");
    const res = await fetch(endpoint, basicAuth('GET', {}, 'api'));

    const result = await res.json();
    console.log(result);

    return json(result);
}

