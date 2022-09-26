<template>
    <div class="min-h-screen flex flex-col items-center">
        <div class="max-w-5xl w-full p-2">
            <transition name="fade" mode="out-in">
                <div v-if="loading" class="flex justify-center h-screen items-center">
                    <span class="loader"></span>
                </div>
                <div v-else>
                    <div class="flex justify-between w-full">
                        <div class="flex items-center">
                            <img src="../assets/logo.png" width="42" alt="Veil Web Wallet" class="block">
                            <div class="font-semibold ml-1 text-xs uppercase hidden sm:block">
                                {{uiState.currentWallet?.name}}
                            </div>
                        </div>
                        <div class="grow h-min mx-2 md:mx-10 flex justify-center">
                            <button
                                class="px-4 py-2 border-b-2 border-blue-500 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700">Main</button>
                            <button class="px-4 py-2 border-b-2 border-gray-400">Change</button>
                        </div>
                        <div>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-9 h-9 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700 transition-colors">
                                    <path fill-rule="evenodd"
                                        d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                                        clip-rule="evenodd" />
                                </svg>

                            </button>
                        </div>
                    </div>
                    <div class="mt-2">
                        <div class="flex flex-col items-center md:items-start md:flex-row">
                            <div class="w-full md:w-fit flex items-center flex-col">
                                <qrcode-vue :size="120"
                                    :value="'sv1qqp3twtj249e226mvg55jm0ec36y99xsh5ytnm6hcgvetthuptj2kugpqwcnw6tpnvwrrvutsltnghkg46ayqpw40g6p3knppy3kwgvhr34mkqqqeedkfp'">
                                </qrcode-vue>
                                <div class="flex items-center mt-2 w-full">
                                    <div class="fixed-width">
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor"
                                                class="w-5 h-5 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700 transition-colors">
                                                <path fill-rule="evenodd"
                                                    d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                                                    clip-rule="evenodd" />
                                                <path fill-rule="evenodd"
                                                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div
                                        class="overflow-hidden truncate text-center static-width font-semibold text-xs">
                                        sv1qqp3twtj249e226mvg55jm0ec36y99xsh5ytnm6hcgvetthuptj2kugpqwcnw6tpnvwrrvutsltnghkg46ayqpw40g6p3knppy3kwgvhr34mkqqqeedkfp
                                    </div>
                                </div>
                                <div class="flex items-center w-fit md:w-full">
                                    <div class="fixed-width">
                                        <img src="../assets/logo.png" width="20" alt="Veil coin"
                                            class="block grow mr-1 my-1">
                                    </div>
                                    <div class="text-sm">1000.004005</div>
                                </div>
                                <div class="flex items-center w-fit md:w-full">
                                    <div class="fixed-width">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                            class="w-5 h-5">
                                            <path fill-rule="evenodd"
                                                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="text-sm">1000.004005</div>
                                </div>
                                <div class="w-full md:w-fit">
                                    <button
                                        class="m-auto mt-2 text-center block px-4 py-2 my-1 w-full rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                        {{t("Wallet.Send")}}</button>
                                </div>
                            </div>
                            <div class="w-2"></div>
                            <div class="w-full grow">
                                <div class="font-semibold text-md">{{t("Wallet.Transactions")}}</div>
                                <TransactionsTable />
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useLocalization } from "@/composables/core/Localization";
import { useTheming } from "@/composables/core/Theming";
import { PreferenceKey, Preferences } from "@/core/Preferences";
import LightwalletService from "@/lightwallet/LightwalletService";
import { availableLocales, localeNames } from "@/localization/Definition";
import { coreUIStore } from "@/store/modules/CoreUI";
import { computed } from "@vue/reactivity";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import TransactionsTable from "@/components/TransactionsTable.vue";
import QrcodeVue from "qrcode.vue";

const uiState = coreUIStore.getState();
const { t, locale } = useI18n();
const loading = ref(true);

onMounted(async () => {
    await LightwalletService.setWallet(uiState.currentWallet);
    loading.value = false;
});
</script>

<style>
.static-width {
    width: 100%;
}

@media (min-width: 768px) {
    .static-width {
        width: 106px;
    }
}

.fixed-width {
    width: 24px;
}
</style>