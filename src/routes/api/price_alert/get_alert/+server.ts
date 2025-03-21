import { basicAccountAuth, getAccountEndpoint } from "$lib/server/utilities.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ cookies, fetch, url }: RequestEvent) {
    const user_token = cookies.get("auth_token");
    const alert_id = url.searchParams.get("alert_id");
    const payload = {
        user_token: user_token,
    };
    const endpoint = getAccountEndpoint("/alerts/" + alert_id);
    const res = await fetch(endpoint, basicAccountAuth('GET', payload));

    const result = await res.text();

    return json(result);
}
