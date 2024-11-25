import { get_pairs_changers } from "$lib/server/pair.service.js";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  let urlParams = url.searchParams;
  const currenypair = urlParams.get('pair') || '';

  let changers = await get_pairs_changers(currenypair);

  return json(changers);
}