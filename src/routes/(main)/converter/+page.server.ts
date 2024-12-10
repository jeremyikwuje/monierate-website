import { array_to_key_object } from '$lib/helper';
import { get_changers } from '$lib/server/changer.service';
import { get_currencies } from '$lib/server/currency.service';
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import Countries from '$data/countries.json';
import CountriesToCurrencies from '$data/countries-to-currencies.json';
import CountryCodeByCurrency from '$data/countryCodeByCurrency.json';

interface CountriesMap { [key: string]: string }
interface CountryCodeByCurrencyMap {
    [currencyCode: string]: string | string[];
}


export const load: PageServerLoad = async ({ fetch, params, url }) => {
    try {
        let urlParams = url.searchParams;
        const convert = {
            From: urlParams.get('From') || 'usd',
            To: urlParams.get('To') || 'ngn',
            Amount: urlParams.get('Amount') || 1
        };

        console.log(convert);

        const changers = await get_changers();
        const currencies = await get_currencies();
        const countries = Countries as CountriesMap;
        const countriesToCurrencies = CountriesToCurrencies as CountriesMap;
        const countryCodeByCurrency = CountryCodeByCurrency as CountryCodeByCurrencyMap;


        if (currencies.length == 0) {
            throw error(500, "Currencies data failed.")
        }

        return {
            changers: array_to_key_object(changers, 'code'),
            currencies,
            convert,
            countries,
            countriesToCurrencies,
            countryCodeByCurrency
        }
    }
    catch (e: any) {
        console.log(e)
        throw error(502, `Unable to fetch an important data`)
    }
}