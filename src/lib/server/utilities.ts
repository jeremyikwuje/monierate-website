export function basicAuth(method: string, body: any, level = "api")
{
    const apiAuth = `changemoney_api:N4&**S%Vl0C7MubL`
    const systemAuth = `ikwuje:xaS@Di2t#7Qry19M`

    let basicToken = universalBtoa(apiAuth);

    if (level == 'system') {
        basicToken = universalBtoa(systemAuth);
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

function universalBtoa(str: any) {
    try {
      return btoa(str);
    } catch (err) {
      return Buffer.from(str, 'binary').toString('base64');
    }
};
  
function universalAtob(b64Encoded: any): any {
    try {
        return atob(b64Encoded);
    } catch (err) {
        return Buffer.from(b64Encoded, 'base64').toString('binary');
    }
};