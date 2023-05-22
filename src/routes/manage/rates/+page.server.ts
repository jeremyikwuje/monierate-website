import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'
import { basicAuth, getEndpoint  } from "$lib/helper.svelte";
 
export const load: PageServerLoad = async ({ params }) => {
    /** Get changers */
    const endpoint = getEndpoint("/changer");
    const res = await fetch(endpoint, basicAuth('GET', {}, 'system'));

    const changers = await res.json();
    console.log(changers);

    return {
        changers: changers.data
    }
}
