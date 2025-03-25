import { basicAccountAuth, getAccountEndpoint } from "$lib/server/utilities.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ cookies, fetch }: RequestEvent) {
    const user_token = cookies.get("auth_token");
    const payload = {
        user_token: user_token,
    };
    const endpoint = getAccountEndpoint("/alerts/get-all");
    const res = await fetch(endpoint, basicAccountAuth('GET', payload));

    const result = await res.text();

    return json(result);
}