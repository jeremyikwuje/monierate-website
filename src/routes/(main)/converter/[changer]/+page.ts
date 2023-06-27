export const load = (async ({ params, url, fetch }) => {
    let res: any

    res = await fetch(`/api/changer?code=${params.changer}`);
    const changer = (await res.json())

    res = await fetch(`/api/market?changer=${params.changer}`);
    const market = (await res.json())

    res = await fetch(`/api/currencies`);
    const currencies = (await res.json())

    let urlParams = url.searchParams
    const convert = {
        From: urlParams.get('From') || '',
        To: urlParams.get('To') || '',
        Amount: urlParams.get('Amount') || 0
    }

    console.log('yeah')

    return {
        changer,
        market,
        convert,
        currencies
    }
})