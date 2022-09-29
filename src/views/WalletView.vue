<template>
    <div class="min-h-screen flex flex-col items-center">
        <transition name="fade" mode="out-in">
            <div class="absolute bg-gray-900/70 w-full h-screen top-0 left-0 flex justify-center items-center"
                v-if="failedToLoad">
                <div
                    class="max-w-xs bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-4 rounded flex items-center justify-center">
                    <div class="text-center">{{t("Wallet.LoadFailedRetrying")}}</div>
                    <div v-if="loading" class="flex justify-center h-screen items-center">
                        <span class="loader"></span>
                    </div>
                </div>
            </div>
        </transition>
        <div class="max-w-5xl w-full p-2">
            <router-view v-slot="{ Component, route }">
                <transition name="fade" mode="out-in">
                    <div v-if="loading" class="flex justify-center h-screen items-center">
                        <span class="loader"></span>
                    </div>
                    <div v-else>
                        <div class="flex justify-between w-full">
                            <button class="flex items-center md:mr-16" @click="navigateToTx">
                                <img src="../assets/logo.png" width="42" alt="Veil Web Wallet" class="block">
                                <div class="font-semibold ml-1 text-xs uppercase hidden sm:block">
                                    {{uiState.currentWallet?.name}}
                                </div>
                            </button>
                            <div class="grow h-min mx-2 md:ml-24 md:mx-10 justify-center hidden md:flex">
                                <button class="px-4 py-2 border-b-2"
                                    :class="uiState.addressIndex == 0 ? 'border-blue-500 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600': 'border-gray-400'"
                                    @click="switchAddress(0)">{{t("Wallet.Addresses.Main")}}</button>
                                <button class="px-4 py-2 border-b-2"
                                    :class="uiState.addressIndex == 1 ? 'border-blue-500 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600': 'border-gray-400'"
                                    @click="switchAddress(1)">{{t("Wallet.Addresses.Change")}}</button>
                            </div>
                            <div class="ml-8 h-min flex md:hidden">
                                <select name="select" v-model="uiState.addressIndex"
                                    class="p-2 px-3 text-center rounded bg-gray-200 text-gray-600 dark:bg-gray-500 dark:text-gray-300">
                                    <option :value="0">
                                        {{t("Wallet.Addresses.Main")}}</option>
                                    <option :value="0">
                                        {{t("Wallet.Addresses.Change")}}</option>
                                </select>
                            </div>
                            <div class="flex items-center">
                                <router-link to="/wallet/faq"
                                    class="mr-2 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-8 h-8 ">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                </router-link>
                                <button
                                    class="text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-8 h-8">
                                        <path fill-rule="evenodd"
                                            d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="min-height">
                            <transition name="fade" mode="out-in">
                                <component :is="Component" v-bind="route.params"></component>
                            </transition>
                        </div>

                        <QuickSettingsWidget />
                    </div>
                </transition>
            </router-view>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { sleep } from "@/core/Core";
import { useRouter } from "vue-router";
import LightwalletService from "@/lightwallet/LightwalletService";
import QuickSettingsWidget from "@/components/widgets/QuickSettingsWidget.vue";

const uiState = coreUIStore.getState();
const loading = ref(true);
const { t } = useI18n();
const failedToLoad = ref(false);
const router = useRouter();

const switchAddress = async (index: number) => {
    coreUIStore.setAddressIndex(index);
};

const navigateToTx = () => {
    router.replace("/wallet");
};

const tryReloadWallet = async () => {
    while (true) {
        try {
            await LightwalletService.setWallet(uiState.currentWallet);
            failedToLoad.value = false;
            loading.value = false;
            return;
        } catch {

        }
        await sleep(3000);
    }
};

onMounted(async () => {
    coreUIStore.setWalletLoaded(true);
    let loaded = false;
    for (let i = 0; i < 3; i++) {
        try {
            await LightwalletService.setWallet(uiState.currentWallet);
            loaded = true;
            break;
        } catch {

        }
    }
    if (!loaded) {
        failedToLoad.value = true;
        tryReloadWallet();
    } else {
        loading.value = false;
    }
});
</script>

<style scoped>
.min-height {
    min-height: calc(100vh - 220px);
}
</style>