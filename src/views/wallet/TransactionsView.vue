<template>
    <div>
        <div class="mt-2">
            <transition name="fade" mode="out-in">
                <div class="absolute bg-gray-900/70 w-full h-screen top-0 left-0 flex justify-center items-center"
                    v-if="coinsFAQActive">
                    <div
                        class="max-w-md bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-4 rounded text-sm">
                        <div v-for="(entry, index) in (tm('FAQ.CoinsFAQ') as Array<string>)" :key="'coins-faq-' + index"
                            v-html="entry">
                        </div>
                        <button @click="showCoinsFAQ(false)"
                            class="m-auto text-center block px-4 py-2 my-1 w-full rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                            {{t("Wallet.Close")}}</button>
                    </div>
                </div>
            </transition>
            <div class="flex flex-col items-center md:items-start md:flex-row">
                <div class="w-full md:w-fit flex items-center flex-col">
                    <div class="text-center font-semibold text-sm mb-2">
                        {{t("Wallet.CurrentAddress")}}
                    </div>
                    <vue-qr :logoCornerRadius="4" :margin="10" :size="126" :text="'veil:' + address" qid="testid">
                    </vue-qr>
                    <div class="flex items-center mt-2 w-full">
                        <div class="fixed-width">
                            <button @click="copyToClipboard(address)">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-5 h-5 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 transition-colors">
                                    <path fill-rule="evenodd"
                                        d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                                        clip-rule="evenodd" />
                                    <path fill-rule="evenodd"
                                        d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <a :href="LightwalletService.addressViewUrl + address" target="_blank"
                            class="overflow-hidden truncate text-center static-width font-semibold text-xs underline underline-offset-3 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600">
                            {{address}}
                        </a>
                    </div>
                    <div class="flex md:w-full" v-if="!scanned">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-4 h-4 mr-2 pending">
                            <path fill-rule="evenodd"
                                d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                                clip-rule="evenodd" />
                        </svg>
                        <div class="font-semibold text-sm">{{t("Wallet.Scanning")}}</div>
                    </div>
                    <div class="flex items-center w-fit md:w-full">
                        <div class="fixed-width">
                            <img src="../../assets/logo.png" width="20" alt="Veil coin" class="block grow mr-1 my-1">
                        </div>
                        <div class="text-sm">{{balanceAvailable}}</div>
                    </div>
                    <div class="flex items-center w-fit md:w-full">
                        <div class="fixed-width">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-5 h-5 text-blue-500 dark:text-blue-500">
                                <path fill-rule="evenodd"
                                    d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-sm">{{balanceLocked}}</div>
                    </div>
                    <div class="text-xs mt-1">
                        <button @click="showCoinsFAQ(true)"
                            class="underline underline-offset-3 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600">{{t("Wallet.NoCoins")}}</button>
                    </div>
                    <div class="w-full hidden md:block md:w-fit">
                        <BaseButton @click="showSend()" class="button m-auto mt-2 w-full">
                            {{t("Wallet.Send")}}</BaseButton>
                    </div>
                    <div class="w-full md:hidden" v-if="!route.meta.isMakeTx">
                        <BaseButton @click="showSend()" class="button m-auto my-1 mt-2 w-full">
                            {{t("Wallet.Send")}}</BaseButton>
                    </div>
                </div>
                <div class="w-2"></div>
                <div class="w-full grow">
                    <div class="text-center font-semibold text-sm" v-if="!route.meta.isMakeTx">
                        {{t("Wallet.Transactions")}}
                    </div>
                    <div class="text-center font-semibold text-sm" v-else>{{ t("Wallet.NewTransaction") }}</div>
                    <router-view v-slot="{ Component, route }">
                        <transition name="fade" mode="out-in">
                            <component :is="Component" v-bind="route.params" :addressIndex="addressIndex"></component>
                        </transition>
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { computed } from "@vue/reactivity";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import LightwalletService from "@/lightwallet/LightwalletService";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import "vue3-toastify/dist/index.css";
import { useRouter, useRoute } from "vue-router";


const uiState = coreUIStore.getState();
const { t, tm } = useI18n();
const addressIndex = ref(0);
const scanned = ref(false);
const router = useRouter();
const route = useRoute();

watch(uiState, () => {
    if (addressIndex.value != uiState.addressIndex) {
        addressIndex.value = uiState.addressIndex;
        scan();
    }

    if (forceScan.value < uiState.forceScan) {
        forceScan.value = uiState.forceScan;
        scan();
    }
});

const address = computed(() => {
    return LightwalletService.getAddress(addressIndex.value).getStringAddress();
});

const showCoinsFAQ = (show: boolean) => {
    coinsFAQActive.value = show;
};

const coinsFAQActive = ref(false);
const balanceAvailable = ref("0");
const balanceLocked = ref("0");
const forceScan = ref(0);

let stopScan = false;

const showSend = async () => {
    router.replace("/wallet/maketx");
};

const scan = async () => {
    balanceAvailable.value = LightwalletService.formatAmount(await LightwalletService.getAvailableBalance(addressIndex.value));
    balanceLocked.value = LightwalletService.formatAmount(await LightwalletService.getLockedBalance(addressIndex.value));
    scanned.value = LightwalletService.getScanned();
};

const runScan = async () => {
    if (stopScan) return;
    try {
        await scan();
    } catch {

    }
    setTimeout(runScan, 20000);
};

const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast(t("Wallet.AddressCopied"), {
        autoClose: 1000,
        theme: uiState.darkTheme ? "light" : "light" // for now use light everywhere
    });
};

onMounted(async () => {
    forceScan.value = uiState.forceScan;
    addressIndex.value = uiState.addressIndex;
    runScan();
    scanned.value = LightwalletService.getScanned();
});

onUnmounted(() => stopScan = true);
</script>

<style scoped>
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

.button {
    min-width: 130px;
}

.pending {
    animation-name: spin-p;
    animation-duration: 5000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes spin-p {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>