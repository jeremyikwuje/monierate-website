import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ }) => {
    try {
        const dataPath = `../../../../../data`
        let major_currencies = await import(`${dataPath}/currencies-major.json`)
        let african_currencies = await import(`${dataPath}/currencies-africa.json`)

        major_currencies = JSON.parse(JSON.stringify(major_currencies.default))
        african_currencies = JSON.parse(JSON.stringify(african_currencies.default))

        return {
            major_currencies,
            african_currencies,
        }

    } catch (e) {
        throw error(500, `Could not find currencies data`)
    }
}