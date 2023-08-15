import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import * as Countries from '$data/countries.json'
import * as Currencies from '$data/currencies.json'

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        // get currencies and country data
        const countries = JSON.parse(JSON.stringify(Countries))
        let currencies = JSON.parse(JSON.stringify(Currencies))
        
        // get url params
        const slug = params.slug
        const country_code = params.country.toUpperCase()

        // get currency from slug
        const splitSlug = slug.split('-')
        const currency_type = splitSlug[splitSlug.length - 1]
        const currency_code = splitSlug[1].toUpperCase()

        if (currency_type == 'crypto') {
            currencies = currencies.coins
        }
        else {
            currencies = currencies.fiat
        }

        // prepared country and currency data
        const country = {
            name: countries[country_code] || "",
            code: country_code
        }
        const currency = {
            code: currency_code,
            name: currencies[currency_code] || ""
        }

        if (country.name.length == 0) {
            throw error(500, `Country name couldn't be obtained`)
        }
        if (currency.name.length == 0) {
            throw error(500, `Currency name couldn't be obtained`)
        }

        let currencypair = `${currency.code.toLowerCase()}ngn`
        const getPair = await fetch(`/api/pairs?pair=${currencypair}`);
        const rates = await getPair.json()

        const getChangers = await fetch(`/api/changer`);
        let providers = await getChangers.json()

        let tmp_providers: any = {}
        for (const key in providers) {
            tmp_providers[providers[key].code] = providers[key]
        }

        providers = tmp_providers

        return {
            currency,
            country,
            rates,
            providers
        }
    }
    catch(e: any) {
        console.log(e)
        throw error(502, `Unable to fetch an important data`)
    }
}