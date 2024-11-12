
import type { Handle } from '@sveltejs/kit';
import { setTimezone } from '$lib/server/store';

const securityHeaders = {
    //'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'X-XSS-Protection': '1; mode=block',
    "X-Xss-Protection" : "1; mode=block",
    'X-Frame-Options': 'SAMEORIGIN',
	"X-Content-Type-Options" : "nosniff",
    "Content-Security-Policy" : "upgrade-insecure-requests",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	"Referrer-Policy" : "strict-origin-when-cross-origin",
}

const removeHeaders = [
    "Public-Key-Pins",
    "X-Powered-By",
    "X-AspNet-Version",
]

export const handle: Handle = async ({event, resolve}) => {
    const response = await resolve(event);
    Object.entries(securityHeaders).forEach(
        ([header, value]) => response.headers.set(header, value)
    );

    // remove headers we don't want exposed
    removeHeaders.forEach( (name) => {
		response.headers.delete(name)
	})

    const cookieHeader = event.request.headers.get('cookie');
    let timezone = 'UTC'; // default value
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
        const timezoneCookie = cookies.find(cookie => cookie.startsWith('timezone='));
        if (timezoneCookie) {
            timezone = timezoneCookie.split('=')[1];
        }
    }
    setTimezone(timezone);

    return response;
}

