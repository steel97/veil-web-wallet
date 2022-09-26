import { sha256 } from "js-sha256";
//import { DateTime } from "luxon";

// async
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// helpers
export const replaceAll = (target: string, search: string, replacement: string) => target.split(search).join(replacement);

// time
//export const getUTCTimeMs = () => DateTime.utc().toMillis();

export const getParameterByName = (name: string, url?: string): string | null | undefined => {
    if (!url) url = window.location.href;
    name = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

// math
export const random = (from: number, to: number) => {
    const dist = (to - from);
    return to - Math.random() * dist;
};

export const randomInt = (from: number, to: number) => Math.floor(random(from, to));

// everything inclusive
export const randomRaw = (from: number, to: number) => ~~(Math.random() * to) + from;

export const randomString = (size = 16) => {
    let result = "";

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const clen = characters.length;

    for (let i = 0; i < size; i++) {
        result += characters.charAt(Math.floor(Math.random() * clen));
    }

    return result;
};

export const pad = (num: number, size: number) => {
    let numAsString = num.toString();
    while (numAsString.length < size) numAsString = "0" + num;
    return numAsString;
};




export const hash = (base: string) => sha256(base);



// timestamp
export const timestampMS = () => Date.now();
export const timestamp = () => timestampMS() / 1000;

/*export const formatDateGlobal = (timestampUTCms: number, format: string) => {
    const date = DateTime.fromMillis(timestampUTCms);
    return date.toFormat(format);
};*/