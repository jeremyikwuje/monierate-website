import { basicAuth, getAccountEndpoint } from "$lib/server/utilities.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch }) {
  const payload = {};
  const endpoint = getAccountEndpoint("/pricing/get_all_pricing");
  const res = await fetch(endpoint, basicAuth("GET", payload));

  const result = await res.text();
  //console.log(result);

  return json(result);
}
