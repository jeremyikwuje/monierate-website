
<script context="module">
import { env } from '$env/dynamic/private';

export function toBase64(str) {
  try {
    return btoa(str);
  } catch (err) {
    return Buffer.from(str, 'utf8').toString('base64');
  }
};

export function fromBase64(base64) {
  try {
    return atob(base64);
  } catch (err) {
    return Buffer.from(base64, 'base64').toString('utf8');
  }
};

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

    let basicToken = toBase64(apiAuth);

    if (level == 'system') {
        basicToken = toBase64(systemAuth);
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
    let apiUrl = env.API_URL || 'https://monierate-api.onrender.com'
    if (server == 'LOCAL') {
        apiUrl = 'http://localhost:3000'
    }
    console.log(env.SERVER);

    return `${apiUrl}${endpoint}`;
}
</script>
