import date from 'date-and-time'

export function bearer(method: string, bearer: string, body: object)
{

    const request: any = {
        headers: {
            "Authorization": `Bearer ${bearer}`,
            "Content-Type": "application/json",
        },
        method: method,
    }

    if (method != 'GET')
        request.body = JSON.stringify(body);

    return request;
}

export function toggleMessage(message: string, type = "error")
{
    let alert = document.querySelector("#alert");

    if (alert != null) {
        alert.classList.add("animate-bounce");
        alert.classList.remove("hidden");
        alert.classList.remove("text-red-600");
        alert.classList.remove("text-primary");

        alert.textContent = message;

        if (type == "error") {
            alert.classList.add("text-red-600");
        } else {
            alert.classList.add("text-primary");
        }

        setTimeout(() => {
            alert?.classList.remove("animate-bounce");
        }, 2000);

        setTimeout(() => {
            alert?.classList.add("hidden");
        }, 3000)
    }
}

export function togglePopup(response: any)
{
    let popup: any = document.querySelector("#popup");
    let message: any = document.querySelector("#popup-message");

    if (alert === null)
        return

    popup.classList.remove("hidden");
    message.classList.remove("text-red-600");

    message.textContent = response.message;

    if (response.status == "error") {
        message.classList.add("text-red-600");
    }
}

export function clearPopup() {
    let popup: any = document.querySelector("#popup");
    popup.classList.add("hidden");

    return
}

export function toggleButtonLoad(selector: string, timeout = 3000)
{
    let button: any = document.querySelector(selector);

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

export const format = (dt, d = "datetime") => {

    dt = changeTimeZone(dt)
    
    if (typeof(dt) === "string") {
        dt = new Date(dt)
    }

    if (d == 'date') {
        return date.format(dt, 'ddd, MMM DD YYYY')
    }

    return date.format(dt, 'ddd, MMM DD YYYY h:mm:ss A')
}

// ✅ Or get a Date object with the specified Time zone
function changeTimeZone(date: any, timeZone: string = "Africa/Lagos") {
    if (typeof date === 'string') {
      return new Date(
        new Date(date).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }
  
    return new Date(
      date.toLocaleString('en-US', {
        timeZone,
      }),
    );
}

export function setCookie(key: string, value: string, days: number) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

export function getCookie(key: string) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function eraseCookie(key: string) {
    var keyValue = getCookie(key) || '';
    setCookie(key, keyValue, -1);
}