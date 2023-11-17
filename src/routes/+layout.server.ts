import { basicAuth, getEndpoint } from "$lib/helper.svelte";
import type { LayoutServerLoad } from "./$types"

export const load = (async ({ request }) => {
    let parallel_avg = "NULL"

    const userDevice = getDeviceName(request)
    const sponsorAdLink = getSponsorAdLink(userDevice)

    let endpoint = getEndpoint("/public/rates/averages");
    let res = await fetch(endpoint, basicAuth('GET', {}));

    console.log(res.status)
    if (res.status != 200) {
        console.log(res)
    }

    const rates = (await res.json()).data
    parallel_avg = rates.usdngn.average || 0

    return {
        market_avg: rates,
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