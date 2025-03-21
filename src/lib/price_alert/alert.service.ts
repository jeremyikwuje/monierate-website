import { parseJSONSafe } from '$lib/functions';

type Alert_types = 'threshold' | 'periodic';
type Threshold_alert = {
    type: Alert_types;
};
type Periodic_alert = {
    type: Alert_types;
    quote: string;
    base: string;
    frequency: {
        type: "interval" | "interval" | "hourly" | "daily" | "weekly" | "monthly";
        value: number;
        day: number;
    };
    exchange: [string];
    channel: [string];
    note: string;
    disable_after_trigger: boolean;
    id: string;
    status: string;
};
type Response = {
    status: string;
    message: string;
    error: string;
    data: any;
}

export const create_alert = async (alert: Periodic_alert | Threshold_alert) => {
  
    const endpoint = '/api/price_alert/create';
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alert)
    });
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}

export const get_all_alerts = async (fetch_event?: any) => {
    
    const endpoint = '/api/price_alert/get_all';
    let res;
    if(fetch_event) {
        res = await fetch_event(endpoint, {
            method: 'GET',
        });
    } else {
        res = await fetch(endpoint, {
            method: 'GET',
        });
    }
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}

export const get_alert = async (alert_id: string, fetch_event?: any) => {
    
    const endpoint = '/api/price_alert/get_alert?alert_id=' + alert_id;
    let res;
    if(fetch_event) {
        res = await fetch_event(endpoint, {
            method: 'GET',
        });
    } else {
        res = await fetch(endpoint, {
            method: 'GET',
        });
    }
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}

export const delete_alert = async (id: string) => {
    const endpoint = '/api/price_alert/delete';
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({alert_id: id})
    });
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}

export const delete_all_alert = async () => {
    const endpoint = '/api/price_alert/delete_all';
    const res = await fetch(endpoint, {
        method: 'POST',
    });
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}

export const delete_all_disabled_alert = async () => {
    const endpoint = '/api/price_alert/delete_all_disabled';
    const res = await fetch(endpoint, {
        method: 'POST',
    });
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}

export const delete_all_enabled_alert = async () => {
    const endpoint = '/api/price_alert/delete_all_enabled';
    const res = await fetch(endpoint, {
        method: 'POST',
    });
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}

export const update_alert = async (alert: any) => {
  
    const endpoint = '/api/price_alert/update';
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alert)
    });
    const result = await res.json();
    return parseJSONSafe(result) as Response;
}