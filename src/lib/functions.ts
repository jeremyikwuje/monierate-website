import { browser } from '$app/environment';
import { invalidate, invalidateAll } from '$app/navigation';
import date from 'date-and-time';
import { Timezone } from './stores/timezone';

export const timezone = Timezone('UTC');

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

// get the user timezone
function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export const format = (dt: any, d = "datetime") => {

    dt = changeTimeZone(dt)

    if (d == 'date') {
        return date.format(dt, 'ddd, MMM DD YYYY')
    }

    return date.format(dt, 'ddd, MMM DD YYYY h:mm:ss A')
}

export function friendlyDate(dt: any, d = "datetime") {
    let getTimezone = timezone.get();
    if(browser) {
        getTimezone = getUserTimezone();
    }
    const dateString = format(dt, d);
    const date = new Date(dateString);
    const now = new Date();
    //console.log(getTimezone)

    // Convert dates to the user's timezone
    const userDate = new Date(date.toLocaleString('en-US', { timeZone: getTimezone }));
    const userNow = new Date(now.toLocaleString('en-US', { timeZone: getTimezone }));

    const diffInSeconds = Math.floor((userNow.getTime() - userDate.getTime()) / 1000);

    const isSameDay = userDate.getDate() === userNow.getDate() &&
                      userDate.getMonth() === userNow.getMonth() &&
                      userDate.getFullYear() === userNow.getFullYear();

    if (diffInSeconds < 900) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (isSameDay) {
        return `Today, ${userDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: getTimezone 
        })}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

// ✅ Or get a Date object with the specified Time zone
function changeTimeZone(date: any) {
    let timeZone = timezone.get();
    if(browser) {
        timeZone = getUserTimezone();
    }
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
    if (browser) {
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }
}

export function getCookie(key: string) {
    if (browser) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }
    
    return null
}

function eraseCookie(key: string) {
    var keyValue = getCookie(key) || '';
    setCookie(key, keyValue, -1);
}

export function changeParam(param: string, value: number | string) {
    const url = new URL(window.location.toString())
    url.searchParams.set(param, `${value}`)
    history.replaceState(history.state, '', url);
    invalidateAll()
}

export function changePath(path: string) {
    const url = new URL(window.location.toString());
    url.pathname = path;
    history.replaceState(history.state, '', url);
    invalidateAll();
}

export function sortRates(rates: any) {
    // sort rates in decending order by price_buy;
    rates.sort((a: any, b: any) => a.price_buy - b.price_buy);
    // filter out rate with price_buy as 0
    const filtered_non_zero_rates = rates.filter((rate: any) => rate.price_buy > 0);
    const filtered_zero_rates = rates.filter((rate: any) => rate.price_buy <= 0);
    // soirt rates in descending order by price_buy
    filtered_zero_rates.sort((a: any, b: any) => b.price_sell - a.price_sell);
    // merge both rates
    rates = filtered_non_zero_rates.concat(filtered_zero_rates);

    return rates;
}

export async function fireInvalidateAll() {
    if (browser) {
        await invalidate
    }
}

export function scrollToSection(id: string, options = { 
    duration: 500, 
    offset: 0,  // Offset from the top in pixels
    behavior: 'smooth' as ScrollBehavior 
  }) {
    const element = document.getElementById(id);
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - options.offset;
  
      // Add a CSS class for animation
      element.classList.add('highlight-section');
  
      window.scrollTo({
        top: offsetPosition,
        behavior: options.behavior
      });
  
      // Remove the animation class after it completes
      setTimeout(() => {
        element.classList.remove('highlight-section');
      }, options.duration);
    }
  }

  export function parseJSONSafe(data: any): object | null {
    if (typeof data === "object" && data !== null) {
      return data;
    }
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Invalid JSON string:", data);
        return null;
      }
    }
    console.error("Data is neither a valid JSON string nor an object:", data);
    return null;
  }

  export function formatISODateTime(
    isoDate: string,
    includeTime = false,
    includeTimezone = false,
  ) {
    const dateObj = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    if (!includeTime) {
      delete options.hour;
      delete options.minute;
      delete options.second;
    }
    if (!includeTimezone) {
      delete options.timeZoneName;
    }
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  }
  
  export function formatNumber(
    value: number,
    locales: string = "en-US",
    options: Intl.NumberFormatOptions = {},
  ): string {
    const formatter = new Intl.NumberFormat(locales, options);
    return formatter.format(value);
  }

  export function login_uri() {
    if(browser) {
      let url = "https://account.monierate.com/login";
      let current_url = window.location.href;
      url += "?callback_url=" + encodeURIComponent(current_url);
      return url;
    }
    return null;
  }