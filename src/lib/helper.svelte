
<script context="module">
import { env } from '$env/dynamic/private';
global.Buffer = global.Buffer || require('buffer').Buffer;

export const universalBtoa = str => {
  try {
    return btoa(str);
  } catch (err) {
    return Buffer.from(str, 'binary').toString('base64');
  }
};

export const universalAtob = b64Encoded => {
  try {
    return atob(b64Encoded);
  } catch (err) {
    return Buffer.from(b64Encoded, 'base64').toString('binary');
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

    let basicToken = universalBtoa(apiAuth);

    if (level == 'system') {
        basicToken = universalBtoa(systemAuth);
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
