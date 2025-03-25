import { basicAccountAuth, getAccountEndpoint } from "$lib/server/utilities.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, fetch }) {
    const user_token = cookies.get("auth_token");
    const payload = {
        user_token: user_token,
    };
    const endpoint = getAccountEndpoint("/alerts/disabled");
    const res = await fetch(endpoint, basicAccountAuth('DELETE', payload));

    const result = await res.text();

    return json(result);
}