import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import type { LayoutServerLoad } from "./$types"

export const load = (async ({ request }) => {
    let parallel_avg = "NULL"

    const userDevice = getDeviceName(request)
    const sponsorAdLink = getSponsorAdLink(userDevice)

    let get_parallel_rate = getParallelRate();
    let get_pairs_rate = getPairsRate();
   
    const rates = await get_pairs_rate;
    if (rates === null) {
        
    }
    
    parallel_avg = (await get_parallel_rate).parallel_avg || 0

    return {
        market_avg: await get_pairs_rate,
        parallel_avg: parallel_avg,
        sponsorLink: sponsorAdLink,
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

const getSponsorAdLink = (device: string) => {
    console.log(device)

    const links = [
        'https://bit.ly/3svJGhQ',
        'https://bit.ly/monierate-sponsor-click',
        'https://bit.ly/monierate-sponsor-click'
    ]

    if (device === 'Android') {
        return links[0]
    }
    else if (device === 'iPhone') {
        return links[1]
    }
    else {
        return links[2]
    }
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