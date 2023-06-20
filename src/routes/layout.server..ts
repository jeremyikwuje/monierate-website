import type { PageServerLoad } from "./$types"

export const load = (async ({ url }) => {
    let slug = url.pathname
    console.log(url)

    console.log('yeah')

    return {
        slug
    }

}) satisfies PageServerLoad