<template>
    <div>
        <div class="mt-2">
            <div class="flex flex-col items-center md:items-start md:flex-row">
                <div class="w-full md:w-fit flex items-center flex-col">
                    <qrcode-vue :size="120" :value="'veil:' + address">
                    </qrcode-vue>
                    <div class="flex items-center mt-2 w-full">
                        <div class="fixed-width">
                            <button @click="copyToClipboard(address)">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
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
                        <a :href="LightwalletService.addressViewUrl + address" target="_blank"
                            class="overflow-hidden truncate text-center static-width font-semibold text-xs underline underline-offset-3">
                            {{address}}
                        </a>
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
                                class="w-5 h-5">
                                <path fill-rule="evenodd"
                                    d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="text-sm">{{balanceLocked}}</div>
                    </div>
                    <div class="w-full md:w-fit">
                        <button @click="showSend()"
                            class="button m-auto mt-2 text-center block px-4 py-2 my-1 w-full rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                            {{t("Wallet.Send")}}</button>
                    </div>
                </div>
                <div class="w-2"></div>
                <div class="w-full grow">
                    <button
                        class="font-semibold text-md underline underline-offset-3 transition-colors hover:text-blue-600 dark:hover:text-blue-700"
                        @click="showTxes()">{{t("Wallet.Transactions")}}</button>
                    <transition name="fade" mode="out-in">
                        <TransactionsTable :addressIndex="addressIndex" v-if="!isSendState" />
                        <TransactionBuilder :addressIndex="addressIndex" v-else />
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import LightwalletService from "@/lightwallet/LightwalletService";
import { coreUIStore } from "@/store/modules/CoreUI";
import { computed } from "@vue/reactivity";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import TransactionsTable from "@/components/TransactionsTable.vue";
import TransactionBuilder from "@/components/TransactionBuilder.vue";
import QrcodeVue from "qrcode.vue";

const uiState = coreUIStore.getState();
const { t } = useI18n();
const addressIndex = ref(0);
const isSendState = ref(false);

watch(uiState, () => {
    if (addressIndex.value == uiState.addressIndex) return;
    addressIndex.value = uiState.addressIndex;
    scan();
});
const address = computed(() => {
    return LightwalletService.getAddress(addressIndex.value).getStringAddress();
});

const balanceAvailable = ref("0");
const balanceLocked = ref("0");

let stopScan = false;

const showTxes = () => {
    isSendState.value = false;
};

const showSend = () => {
    isSendState.value = true;
};

const scan = async () => {
    balanceAvailable.value = LightwalletService.formatAmount(await LightwalletService.getAvailableBalance(addressIndex.value));
    balanceLocked.value = LightwalletService.formatAmount(await LightwalletService.getLockedBalance(addressIndex.value));
};

const runScan = async () => {
    if (stopScan) return;
    try {
        scan();
    } catch {

    }
    setTimeout(runScan, 20000);
};

const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
};

onMounted(async () => {
    addressIndex.value = uiState.addressIndex;
    runScan();
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
</style>