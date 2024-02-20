import { bearer } from "$lib/functions.js";
import { getEndpoint  } from "$lib/helper.svelte";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, fetch })
{
    const { email, interval } = await request.json();
    const payload = {
        email,
        interval
    };
    const endpoint = getEndpoint("/alerting");
    const res = await fetch(endpoint, basicAuth('PUT', payload, 'system'));

    const result = await res.json();
    console.log(result);

    return json(result);
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, fetch, cookies })
{
    const { id } = await request.json();
    const auth_token: string = cookies.get('auth') || ''
    const endpoint = getEndpoint(`/auth/alerting?id=${id}`);
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
    const endpoint = getEndpoint("/public/alerting/signin");
    const res = await fetch(endpoint, basicAuth('POST', payload, 'system'));

    const result = await res.json();
    console.log(result);

    return json(result);
}

function universalBtoa(str: any) {
    try {
      return btoa(str);
    } catch (err) {
      return Buffer.from(str, 'binary').toString('base64');
    }
};
  
function universalAtob(b64Encoded: any): any {
    try {
        return atob(b64Encoded);
    } catch (err) {
        return Buffer.from(b64Encoded, 'base64').toString('binary');
    }
};


function basicAuth(method: string, body: any, level = "api")
{
    const apiAuth = `changemoney_api:N4&**S%Vl0C7MubL`
    const systemAuth = `ikwuje:xaS@Di2t#7Qry19M`

    let basicToken = universalBtoa(apiAuth);

    if (level == 'system') {
        basicToken = universalBtoa(systemAuth);
    }

    const request: any = {
        headers: {
            "Authorization": `Basic ${basicToken}`,
            "Content-Type": "application/json",
        },
        method: method,
    }

    if (method != 'GET')
        request.body = JSON.stringify(body);

    return request;
}