import { getEndpoint } from "$lib/helper";
import { basicAuth } from "./utilities";

export const get_changers = async (code: string | null = null) => {
  let endpoint = getEndpoint(`/changers/get_all_changers?page=1`);
  if (code != null) {
    endpoint = getEndpoint(`/changers/get_changer?code=${code}`);
  }

  let res = await fetch(
    endpoint,
    basicAuth('GET', {}),
  );
  const changer = (await res.json()).data || {};

  if (changer.result) {
    return changer.result;
  }

  return changer;
}