import { getEndpoint } from "$lib/helper";
import { basicAuth } from "./utilities";

export const get_currencies = async (code: string | null = null) => {
  let endpoint = getEndpoint(`/currencies/get_all_currencies?page=1`);
  if (code != null) {
    endpoint = getEndpoint(`/currencies/get_currency?code=${code}`);
  }

  let res = await fetch(
    endpoint,
    basicAuth('GET', {}),
  );
  const currency = (await res.json()).data || {};

  return currency;
}