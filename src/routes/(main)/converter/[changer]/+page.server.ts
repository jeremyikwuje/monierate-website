import type { PageServerLoad } from './$types'
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = (async ({ params, url, fetch }) => {

    try {    
        let resChanger = fetch(`/api/changer?code=${params.changer}`);
        let resMarket = fetch(`/api/market?changer=${params.changer}`);
        let resCurrencies = fetch(`/api/currencies`);

        let urlParams = url.searchParams
        const convert = {
            From: urlParams.get('From') || '',
            To: urlParams.get('To') || '',
            Amount: urlParams.get('Amount') || 0
        }

        console.log(params.changer)

        const changer = (await (await resChanger).json())
        const market = (await (await resMarket).json())
        const currencies = (await (await resCurrencies).json())

        console.log(market)

        if (Object.keys(market).length == 0) {
            throw error(500, "Market data failed.")
        }
        if (Object.keys(currencies).length == 0) {
            throw error(500, "Currencies data failed.")
        }
        if (Object.keys(changer).length == 0) {
            throw error(500, "Changer data failed.")
        }
        
        return {
            changer,
            market,
            convert,
            currencies
        }
    }
    catch(e: any) {
        throw error(500, e.message)
    }
})