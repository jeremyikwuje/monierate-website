export const load = (async ({ params, url, fetch }) => {

    let resChanger = fetch(`/api/changer?code=${params.changer}`);
    let resMarket = fetch(`/api/market?changer=${params.changer}`);
    let resCurrencies = fetch(`/api/currencies`);

    let urlParams = url.searchParams
    const convert = {
        From: urlParams.get('From') || '',
        To: urlParams.get('To') || '',
        Amount: urlParams.get('Amount') || 0
    }

    console.log('yeah')

    const changer = (await (await resChanger).json())
    const market = (await (await resMarket).json())
    const currencies = (await (await resCurrencies).json())
    
    return {
        changer,
        market,
        convert,
        currencies
    }
})