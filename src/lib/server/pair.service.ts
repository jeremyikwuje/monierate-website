import { getEndpoint } from "$lib/helper";
import { basicAuth } from "./utilities";

export const get_pairs = async (code: string | null = null) => {
  let endpoint = getEndpoint(`/pairs/get_all_pairs?page=1`);
  if (code != null) {
    endpoint = getEndpoint(`/pairs/get_pair?code=${code}`);
  }

  let res = await fetch(
    endpoint,
    basicAuth('GET', {}),
  );
  const pair = (await res.json()).data || {};

  if (pair.result) {
    return pair.result;
  }

  return pair;
}