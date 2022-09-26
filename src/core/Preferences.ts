export enum PreferenceKey {
    LOCALE = "vww.storage.locale",
    INITIAL_RUN = "vww.core.initial_run",
    DARK_THEME = "vww.core.dark_theme",
    PRIMARY_WALLET = "vww.wallet.primary"
}

export class Preferences {
    public static getString(key: string, def = ""): string {
        const storageItem = localStorage.getItem(key);
        if (storageItem == null) return def;
        return storageItem;
    }

    public static getBool(key: string, def = false): boolean {
        const storageItem = localStorage.getItem(key);
        if (storageItem == null) return def;
        return storageItem == "1" ? true : false;
    }

    public static getInt(key: string, def = 0): number {
        const storageItem = localStorage.getItem(key);
        if (storageItem == null) return def;
        return Number.parseInt(storageItem!);
    }

    public static getFloat(key: string, def = 0.0): number {
        const storageItem = localStorage.getItem(key);
        if (storageItem == null) return def;
        return Number.parseFloat(storageItem!);
    }


    public static setString(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public static setBool(key: string, value: boolean) {
        localStorage.setItem(key, value ? "1" : "0");
    }

    public static setInt(key: string, value: number) {
        localStorage.setItem(key, value.toString());
    }

    public static setFloat(key: string, value: number) {
        localStorage.setItem(key, value.toString());
    }
}