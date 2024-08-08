import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ request }) => {
    
    const selected_partner_top = selectTopPartnerBanner();

    let get_parallel_rate = getParallelRate();
    let get_pairs_rate = getPairsRate();
   
    const rates = await get_pairs_rate;
    if (rates === null) {
        
    }
    
    const parallel_avg = (await get_parallel_rate).parallel_avg || 0;

    return {
        market_avg: await get_pairs_rate,
        parallel_avg: parallel_avg,
        selected_partner_top: selected_partner_top,
    }

}) satisfies LayoutServerLoad

const getDeviceName = (request: any) => {
    const headers = request.headers;
    const userAgent = headers.get('user-agent') || '';
    console.log(userAgent)

    let detectedDevice = 'Unknown';

    if (userAgent.includes('iPhone')) {
        detectedDevice = 'iphone';
    } else if (userAgent.includes('Android')) {
        detectedDevice = 'Android';
    } else {
        detectedDevice = 'Unknown';
    }

    return detectedDevice;
}

const getParallelRate = async () => {

    let get_parallel_rate = await fetch(
        getEndpoint("/public/rates/parallel"),
        basicAuth('GET', {})
    );

    if (get_parallel_rate.status != 200) {
        return null;
    }

    const parallel_rate = (await get_parallel_rate.json()).data;

    console.log(parallel_rate);

    return parallel_rate;
}

const getPairsRate = async () => {
    let endpoint = getEndpoint("/public/rates/averages");
    let get_pairs_rate = await fetch(endpoint, basicAuth('GET', {}));

    if (get_pairs_rate.status != 200) {
        return null;
    }

    const rates = (await get_pairs_rate.json()).data;

    return rates;
}

const sponsored_partners = [
    {
        image: 'https://bit.ly/3svJGhQ',
        text: 'Send Pounds & Euros to 55+ Countries, Including UK on ',
        link: 'https://tinyurl.com/cambridge-currences-top-banner',
        brand: 'Cambridge Currencies'
    },
    {
        image: 'https://bit.ly/3svJGhQ',
        text: 'Send money from Nigeria to your suppliers abroad on ',
        link: 'https://tinyurl.com/4zuasuhv',
        brand: 'Cedar App'
    },
];

const selectTopPartnerBanner = () => {
    const random_index = Math.floor(Math.random() * sponsored_partners.length);
    return sponsored_partners[random_index];
}