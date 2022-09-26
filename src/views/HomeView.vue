<template>
    <div class="m-auto">
        <div class="min-h-screen flex flex-col justify-center items-center">
            <div class="max-w-xl mx-2 flex flex-col justify-center items-center w-full p-2">
                <img src="../assets/logo.png" width="64" alt="Veil Web Wallet">
                <div class="font-semibold my-1 text-xl uppercase">{{t("Core.AppName")}}</div>
                <router-view v-slot="{ Component, route }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" v-bind="route.params"></component>
                    </transition>
                </router-view>
                <div class="mt-2">
                    <select name="select" v-model="selectedLocale"
                        class="p-2 px-3 rounded bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                        <option v-for="(loc, index) in availableLocales" :key="index" :value="loc">
                            {{localeNames[index]}}</option>
                    </select>
                </div>
                <div class="mt-2">
                    <button @click="toggleTheme">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-10 h-10 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700 transition-colors"
                            v-if="!uiState.darkTheme">
                            <path fill-rule="evenodd"
                                d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                                clip-rule="evenodd" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-10 h-10 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700 transition-colors"
                            v-else>
                            <path
                                d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                    </button>
                </div>
                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Version: {{version}}
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { useLocalization } from "@/composables/core/Localization";
import { useTheming } from "@/composables/core/Theming";
import { PreferenceKey, Preferences } from "@/core/Preferences";
import { availableLocales, localeNames } from "@/localization/Definition";
import { coreUIStore } from "@/store/modules/CoreUI";
import { computed } from "@vue/reactivity";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const uiState = coreUIStore.getState();
const { t, locale } = useI18n();
const { setDarkMode } = useTheming();
const { setLocale } = useLocalization();
const selectedLocale = ref("");

const version = computed(() => process.env.VUE_APP_COMMIT_HASH ?? "Unknown");

watch(selectedLocale, (nval) => {
    const split = nval.split("-");
    Preferences.setString(PreferenceKey.LOCALE, nval);
    setLocale(split[0], split[1]);
});

const toggleTheme = () => {
    setDarkMode(!uiState.darkTheme);
};

onMounted(() => {
    // stupid hack
    setTimeout(() => {
        selectedLocale.value = locale.value;
    }, 50);
});
</script>