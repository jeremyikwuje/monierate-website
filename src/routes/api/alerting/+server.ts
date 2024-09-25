import { bearer } from "$lib/functions.js";
import { getEndpoint  } from "$lib/helper";
import { basicAuth, getEndpointV1 } from "$lib/server/utilities.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, fetch })
{
    const { email, interval } = await request.json();
    const payload = {
        email,
        interval
    };
    const endpoint = getEndpointV1("/alerting");
    const res = await fetch(endpoint, basicAuth('PUT', payload, 'system'));

    const result = await res.json();

    return json(result);
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, fetch, cookies })
{
    const { id } = await request.json();
    const auth_token: string = cookies.get('auth') || ''
    const endpoint = getEndpointV1(`/auth/alerting?id=${id}`);
    console.log(auth_token)
    const res = await fetch(endpoint, bearer('DELETE', auth_token, {}));

    const result = await res.json();
    console.log(result);

    return json(result);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch })
{
    const { email } = await request.json();
    const payload = {
        email,
    };
    const endpoint = getEndpointV1("/public/alerting/signin");
    const res = await fetch(endpoint, basicAuth('POST', payload, 'system'));

    const result = await res.json();
    console.log(result);

    return json(result);
}