import { createI18n } from "vue-i18n";
import translation_enUS from "@/localization/en-US";

const i18n = createI18n({
    legacy: false,
    locale: "en-US",
    messages: {
        "en-US": translation_enUS
    }
});

export default i18n;