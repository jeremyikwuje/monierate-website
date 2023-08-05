import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import * as CurrenciesMajor from '$data/currencies-major.json'
import * as CurrenciesAfrica from '$data/currencies-africa.json'

export const load: PageServerLoad = async ({ }) => {
    try {
        let major_currencies = JSON.parse(JSON.stringify(CurrenciesMajor))
        let african_currencies = JSON.parse(JSON.stringify(CurrenciesAfrica))

        return {
            major_currencies,
            african_currencies,
        }

    } catch (e) {
        throw error(500, `Could not find currencies data`)
    }
}