import type { PageServerLoad } from "./$types"

export const load = (async ({ url }) => {
    let slug = url.pathname

    return {
        slug
    }

}) satisfies PageServerLoad