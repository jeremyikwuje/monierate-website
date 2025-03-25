import { basicAccountAuth, getAccountEndpoint } from "$lib/server/utilities.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, fetch, request }) {
    const user_token = cookies.get("auth_token");
    const body = await request.json();
    if(!body.id) {
        return new Response("Missing id", { status: 400 });
    }
    const id = body.id;
    delete body.id;
    const payload = {
        user_token: user_token,
        ...body
    };
    const endpoint = getAccountEndpoint("/alerts/" + id);
    const res = await fetch(endpoint, basicAccountAuth('PATCH', payload));

    const result = await res.text();

    return json(result);
}