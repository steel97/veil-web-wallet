// taken from here https://stackoverflow.com/questions/62102034/javascript-how-to-encrypt-string-with-only-password-in-2020
// modified
export interface EncryptionResult {
    cipherText: ArrayBuffer;
    IV: Uint8Array;
}

async function deriveKey(password: string, salt: string) {
    const algo = {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: new TextEncoder().encode(salt),
        iterations: 1000
    };
    return crypto.subtle.deriveKey(
        algo,
        await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            {
                name: algo.name
            },
            false,
            ["deriveKey"]
        ),
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["encrypt", "decrypt"]
    );
}

// Encrypt function
export async function encrypt(password: string, salt: string, text: string) {
    const algo = {
        name: "AES-GCM",
        length: 256,
        iv: crypto.getRandomValues(new Uint8Array(12))
    };
    const res: EncryptionResult = {
        cipherText: await crypto.subtle.encrypt(
            algo,
            await deriveKey(password, salt),
            new TextEncoder().encode(text)
        ),
        IV: algo.iv
    };
    return res;
}

// Decrypt function
export async function decrypt(password: string, salt: string, encrypted: EncryptionResult) {
    const algo = {
        name: "AES-GCM",
        length: 256,
        iv: encrypted.IV
    };
    return new TextDecoder().decode(
        await crypto.subtle.decrypt(
            algo,
            await deriveKey(password, salt),
            encrypted.cipherText
        )
    );
}