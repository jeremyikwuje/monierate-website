import date from 'date-and-time'

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

export const format = (dt, d = "datetime") => {
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