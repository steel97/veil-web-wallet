import { Sha256 } from "@aws-crypto/sha256-js";
//import { DateTime } from "luxon";

// hex
export const toHex = (input: Uint8Array, reverse = false) => reverse ? Buffer.from(input.reverse()).toString("hex") : Buffer.from(input).toString("hex");
export const fromHex = (input: string, reverse = false) => reverse ? Buffer.from(input, "hex").reverse() : Buffer.from(input, "hex");

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




export const hash = (base: string) => {
    const hash = new Sha256();
    hash.update(base);
    const result = hash.digestSync();
    return toHex(result);
};



// timestamp
export const timestampMS = () => Date.now();
export const timestamp = () => timestampMS() / 1000;

/*export const formatDateGlobal = (timestampUTCms: number, format: string) => {
    const date = DateTime.fromMillis(timestampUTCms);
    return date.toFormat(format);
};*/