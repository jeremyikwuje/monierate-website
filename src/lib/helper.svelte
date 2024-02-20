
<script context="module">
import { env } from '$env/dynamic/private';

export async function request(method, endpoint, body = {}) {
    let options = {
        method: method.toUpperCase()
    }

    if (method != 'get') {
        options = {
            method: method.toUpperCase(),
            body: JSON.stringify(body)
        }
    }

    const res = await fetch(endpoint, options);
    const json = await res.json();
    console.log(json);

    return json;
}

export function basicAuth(method, body, level = "api")
{
    const apiAuth = `changemoney_api:N4&**S%Vl0C7MubL`
    const systemAuth = `ikwuje:xaS@Di2t#7Qry19M`

    let basicToken; 
    if (typeof btoa === 'function') {
        basicToken = btoa(apiAuth);
    } else {
        basicToken = Buffer.from(apiAuth).toString('base64');
    }

    if (level == 'system') {
        if (typeof btoa === 'function') {
            basicToken = btoa(systemAuth);
        } else {
            basicToken = Buffer.from(systemAuth).toString('base64');
        }
    }

    const request = {
        headers: {
            "Authorization": `Basic ${basicToken}`,
            "Content-Type": "application/json",
        },
        method: method,
    }

    if (method != 'GET')
        request.body = JSON.stringify(body);

    return request;
}

export function getEndpoint(endpoint)
{
    const server = env.SERVER
    let apiUrl = 'https://monierate-api.onrender.com'
    if (server == 'LOCAL') {
        apiUrl = 'http://localhost:3000'
    }
    console.log(env.SERVER);

    return `${apiUrl}${endpoint}`;
}
</script>
