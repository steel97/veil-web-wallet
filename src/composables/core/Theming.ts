import { PreferenceKey, Preferences } from "@/core/Preferences";
import { coreUIStore } from "@/store/modules/CoreUI";


export const useTheming = () => {
    const setDarkMode = (state: boolean) => {
        coreUIStore.setTheme(state);
        Preferences.setBool(PreferenceKey.DARK_THEME, state);
    };

    const loadMode = () => {
        let useDarkTheme = false;
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            useDarkTheme = true;
        }
        const pref = Preferences.getBool(PreferenceKey.DARK_THEME, useDarkTheme);
        setDarkMode(pref);
    };

    return { setDarkMode, loadMode };
};