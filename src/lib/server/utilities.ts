import { Buffer } from "buffer";
import { env } from '$env/dynamic/private';

export function basicAuth(method: string, body: any, level = "api")
{
    const apiAuth = `changemoney_api:N4&**S%Vl0C7MubL`
    const systemAuth = `ikwuje:xaS@Di2t#7Qry19M`

    let basicToken = toBase64(apiAuth);

    if (level == 'system') {
        basicToken = toBase64(systemAuth);
    }

    const request: any = {
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

function fromBase64(base64: any) {
    try {
        return atob(base64);
    } catch (err) {
        return Buffer.from(base64, 'base64').toString('utf8');
    }
};
  
function toBase64(str: any): any {
    try {
        return btoa(str);
    } catch (err) {
        return Buffer.from(str, 'utf8').toString('base64');
    }
};

export function getEndpointV1(endpoint: string)
{
  const server = env.SERVER
  let apiUrl = env.API_URL_V1 || 'https://monierate-api.onrender.com';
  if (server == 'LOCAL') {
    apiUrl = 'http://localhost:3000';
  }

  return `${apiUrl}${endpoint}`;
}