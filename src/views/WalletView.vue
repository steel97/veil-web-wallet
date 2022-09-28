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
                        <div class="grow h-min mx-2 md:ml-24 md:mx-10 flex justify-center">
                            <button class="px-4 py-2 border-b-2"
                                :class="uiState.addressIndex == 0 ? 'border-blue-500 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700': 'border-gray-400'"
                                @click="switchAddress(0)">Main</button>
                            <button class="px-4 py-2 border-b-2"
                                :class="uiState.addressIndex == 1 ? 'border-blue-500 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700': 'border-gray-400'"
                                @click="switchAddress(1)">Change</button>
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
                    <div class="min-height">
                        <router-view v-slot="{ Component, route }">
                            <transition name="fade" mode="out-in">
                                <component :is="Component" v-bind="route.params"></component>
                            </transition>
                        </router-view>
                    </div>

                    <QuickSettings />
                </div>
            </transition>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { onMounted, ref } from "vue";
import LightwalletService from "@/lightwallet/LightwalletService";
import QuickSettings from "@/components/QuickSettings.vue";

const uiState = coreUIStore.getState();
const loading = ref(true);

const switchAddress = async (index: number) => {
    coreUIStore.setAddressIndex(index);
};

onMounted(async () => {
    coreUIStore.setWalletLoaded(true);
    await LightwalletService.setWallet(uiState.currentWallet);
    loading.value = false;
});
</script>

<style scoped>
.min-height {
    min-height: calc(100vh - 220px);
}
</style>