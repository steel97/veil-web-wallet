import { createI18n } from "vue-i18n";
import translation_enUS from "@/localization/en-US";
import translation_ruRU from "@/localization/ru-RU";

const i18n = createI18n({
    legacy: false,
    locale: "en-US",
    messages: {
        "en-US": translation_enUS,
        "ru-RU": translation_ruRU
    }
});

export default i18n;