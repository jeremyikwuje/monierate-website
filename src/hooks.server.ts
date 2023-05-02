
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({event, resolve}) => {
    const sessionid = event.cookies.get('access_token');

    if (!sessionid) {
        return await resolve(event);
    }

    event.locals.access = {
        token: sessionid
    };

    return await resolve(event);
}

