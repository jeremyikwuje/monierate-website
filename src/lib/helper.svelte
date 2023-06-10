
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

    let basicToken = btoa(apiAuth)
    if (level == 'system') {
        basicToken = btoa(systemAuth)
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

export function toggleMessage(message, type = "error")
{
    let alert = document.querySelector("#alert");

    if (alert != null) {
        alert.classList.add("animate-bounce");
        alert.classList.remove("hidden");
        alert.textContent = message;

        if (type == "error") {
            alert.classList.add("text-red-800");
        } else {
            alert.classList.add("text-primary");
        }

        setTimeout(() => {
            alert.classList.remove("animate-bounce");
        }, 2000);

        setTimeout(() => {
            alert.classList.add("hidden");
        }, 3000)
    }
}

export function toggleButtonLoad(selector, timeout = 3000)
{
    let button = document.querySelector(selector);

    if (button != null)
    {
        button.classList.add("loading");
        button.disabled = true;

        setTimeout(() => {
            button.classList.remove("loading");
            button.disabled = false;
        }, timeout)
    }
}

export function back()
{
    return history.back();
}

export function getEndpoint(endpoint)
{
    const server = env.SERVER
    let apiUrl = 'https://monierate-api-production.up.railway.app'
    if (server == 'LOCAL') {
        apiUrl = 'http://localhost:3000'
    }
    console.log(env.SERVER);

    return `${apiUrl}${endpoint}`;
}
</script>
