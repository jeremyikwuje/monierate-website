import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {

    try {
        let endpoint = getEndpoint("/public/rates");
        let res = await fetch(
            endpoint,
            basicAuth('GET', {})
        );

        console.log(res.status)
        if (res.status != 200) {
            throw error(500, {
                message: "Unable to fetch data, try again in few minutes."
            })
        }

        const rates = (await res.json()).data || []

        if (rates.length == 0) {
            throw error(500, {
                message: "Unable to fetch data, try again in few minutes."
            })
        }

        console.log(rates)

        return {
            rates
        }
    }
    catch(error: any) {
        throw error(500, {
            message: "Unable to display data, try again in few minutes."
        })
    }
    
}
