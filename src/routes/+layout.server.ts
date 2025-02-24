import { basicAuth, getEndpoint } from "$lib/helper";
import type { LayoutServerLoad } from "./$types";
import { parseJSONSafe } from '$lib/functions';

export const load: LayoutServerLoad = async ({ request, cookies, fetch }) => {

    const authToken = cookies.get('auth_token');
    const user = {
        isLogin: false,
        userToken: null,
        userData: null,
    } as {
        isLogin: boolean,
        userToken: string | null,
        userData: any,
    }

    if (authToken) {
        const response = await fetch(`/api/users/get_user?user_token=${authToken}`);
        if (response.ok) {
            let userData = await response.json();
            userData = parseJSONSafe(userData);

            if (userData.status === 'success') {
                user.isLogin = true;
                user.userToken = authToken;
                user.userData = userData;
            }
        }
    }

    const selected_partner_top = selectTopPartnerBanner();
    const get_pairs = await getPairs();
    const pairs = get_pairs.result;
    const top_pairs = select_top_pairs(pairs);

    const market_avg_rate = top_pairs.usdngn.price;

    return {
        pairs,
        top_pairs,
        market_avg_rate,
        selected_partner_top,
        user,
    }

};

const select_top_pairs = (pairs: any) => {
    // hardcoded top pairs for now, dynamic in the future based on user IP
    const top_pairs = ['usdngn', 'usdtngn', 'btcngn', 'eurngn', 'gbpngn', 'cadngn'];
    // filter pairs to get top selected pairs by code
    // but filter should be in order of the top pairs hardcoded above
    // then sort them by price in descending order
    const top_selected_pairs = top_pairs.map(
        (pair_code: string) => pairs.find(
            (pair: any) => pair.code === pair_code)
    );

    // convert selected pair from array to key object 
    const top_selected_pairs_obj: Record<string, any> = {};
    top_selected_pairs.forEach((pair: any) => {
        // split the pair code to base and qoute currency code
        const quote = 'NGN';
        const split_code = pair.code.toUpperCase().split(quote);
        const base = split_code[0].toUpperCase();

        top_selected_pairs_obj[pair.code] = {
            price: pair.price.current,
            name: `${base}/${quote}`,
            from: base,
            to: quote,
            price_change_percent_24hr: pair.price_change_percent_24hr,
        };
    });

    return top_selected_pairs_obj;
}

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

const getPairs = async () => {
    let endpoint = getEndpoint("/pairs/get_all_pairs?page=1&limit=100");
    let response = await fetch(endpoint, basicAuth('GET', {}));

    if (response.status != 200) {
        return null;
    }

    const pairs = (await response.json()).data;

    return pairs;
}

const sponsored_partners = [
    {
        image: 'https://bit.ly/3svJGhQ',
        text: 'Sell your crypto for Naira',
        link: 'https://tinyurl.com/koyn-top-sponsored-link',
        brand: 'Koyn',
        cta: 'Sell Crypto'
    },
    // {
    //     image: 'https://bit.ly/3svJGhQ',
    //     text: 'Send & Receive Cross-border Payments Globally.',
    //     link: 'https://bit.ly/47lmfHX',
    //     brand: 'Cedar App',
    //     cta: 'Start Sending'
    // },
    {
        image: 'https://bit.ly/3svJGhQ',
        text: 'Send & Receive Cross-border Payments Globally.',
        link: 'https://tinyurl.com/cedar-get-alert-link',
        brand: 'Cedar Money',
        cta: 'Start Sending'
    }
];

const selectTopPartnerBanner = () => {
    const random_index = Math.floor(Math.random() * sponsored_partners.length);
    return sponsored_partners[random_index];
}