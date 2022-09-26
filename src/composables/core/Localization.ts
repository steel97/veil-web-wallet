import { useI18n } from "vue-i18n";
import { getParameterByName } from "@/core/Core";
import { Logging, LogLevel } from "@/core/Logging";
import { PreferenceKey, Preferences } from "@/core/Preferences";
import { availableLocales, defaultLanguage, defaultRegion } from "@/localization/Definition";

export const useLocalization = () => {

    const { setLocaleMessage, locale } = useI18n();

    const setLocale = async (lang: string, region: string) => {
        let regionHandled = region.toUpperCase();

        Logging.trace(`requested locale change to ${lang}-${regionHandled}`, LogLevel.DEBUG);
        const localeExists = localeSupported(lang, regionHandled);
        if (!localeExists) {
            let overrideRegion = "";
            for (const localeCurrent of availableLocales) {
                if (localeCurrent.indexOf(`${lang}-`) === 0) {
                    overrideRegion = localeCurrent.split("-")[1];
                    break;
                }
            }
            if (overrideRegion != "" && overrideRegion != null) {
                Logging.trace(`specified region not available ${regionHandled} falling back to ${overrideRegion}`, LogLevel.WARNING);
                regionHandled = overrideRegion.toUpperCase();
            }
            else {
                Logging.trace(`specified region not available and no fallback region was found, using ${defaultLanguage}-${defaultRegion}`);
                await setLocale(defaultLanguage, defaultRegion);
                return;
            }
        }


        const localeTarget = `${lang}-${regionHandled}`;
        Logging.trace(`using locale ${localeTarget}`);
        const messages = await import(
        /* webpackChunkName: "locale-[request]" */ `@/localization/${localeTarget}/index`
        );
        // set locale and locale message
        setLocaleMessage(localeTarget, messages.default);
        locale.value = localeTarget;

        document.querySelector("html")?.setAttribute("lang", localeTarget);
    };

    const localeSupported = (lang: string, region: string, strictRegion = true): boolean => {
        const basicLocale = `${lang}-${region.toUpperCase()}`;
        if (availableLocales.indexOf(basicLocale) != -1) return true;
        else if (strictRegion) return false;

        // iterate through locales and detect first suitable region
        for (const locale of availableLocales) {
            if (locale.indexOf(lang) === 0) {
                return true;
            }
        }
        return false;
    };

    const detectLocale = (): string[] => {
        let langDef = defaultLanguage;
        let regionDef = defaultRegion;

        let navLang = navigator.language;
        let navRegion = defaultRegion;
        if (navLang != null && navLang.indexOf("-") > -1) {
            const navLangParsed = navLang.split("-");
            navLang = navLangParsed[0];
            navRegion = navLangParsed[1];
        }
        if (localeSupported(navLang, navRegion, false)) {
            langDef = navLang;
            regionDef = navRegion;
        }

        const storageLocale = Preferences.getString(PreferenceKey.LOCALE).split("-");
        if (storageLocale.length > 1 && localeSupported(storageLocale[0], storageLocale[1], false)) {
            langDef = storageLocale[0];
            regionDef = storageLocale[1];
        }

        const localeSet = getParameterByName("iy_locale")?.split("-");
        if (localeSet != null && localeSet.length > 1 && localeSupported(localeSet[0], localeSet[1], false)) {
            langDef = localeSet[0];
            regionDef = localeSet[1];
        }
        return [langDef, regionDef];
    };

    return { setLocale, localeSupported, detectLocale };
};