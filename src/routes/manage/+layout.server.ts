import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const splitPath = url.pathname.split('/')

    if (!splitPath.includes('auth')) {
        
        if (!locals.access) {
            //throw redirect(302, "/manage/auth/login");
        }
    }
}