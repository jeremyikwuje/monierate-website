import { basicAuth, getEndpoint  } from "$lib/helper.svelte";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies })
{
    const { id, password } = await request.json();
    const payload = {
        password,
        id,
    };
    const endpoint = getEndpoint("/public/auth/login");
    const res = await fetch(endpoint, basicAuth('POST', payload));

    const result = await res.json();
    console.log(result);

    if (result.status == "success")
    {
        await cookies.delete('access_token');
        
        cookies.set("access_token", result.data.token, {
            path: "/manage",
            maxAge: 60 * 30,
        })
    }

    return json(result);
}