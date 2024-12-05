import { get_pairs_changers } from "$lib/server/pair.service.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  let urlParams = url.searchParams;
  const pair_code = urlParams.get('pair_code') || '';
  const changer_service = urlParams.get('changer_service') || '';

  let changers = await get_pairs_changers(pair_code, changer_service);
  
  return json(changers);
}