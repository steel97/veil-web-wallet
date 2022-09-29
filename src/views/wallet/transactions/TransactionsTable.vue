<template>
    <div class="w-full" v-if="utxos.length > 0">
        <a v-for="utx in utxos" :key="utx.txid + '-'+utx.rid"
            class="p-2 border-b-2 border-gray-400 w-full text-sm flex justify-between items-center"
            :href="LightwalletService.txViewUrl + utx.txid" target="_blank">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="text-blue-500 dark:text-blue-500 w-6 h-6 mr-2" v-if="!utx.pending">
                    <path fill-rule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clip-rule="evenodd" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="text-blue-500 dark:text-blue-500 w-6 h-6 mr-2 pending" v-else>
                    <path fill-rule="evenodd"
                        d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
                        clip-rule="evenodd" />
                </svg>
            </div>
            <div class="flex items-center overflow-hidden truncate">

                <div class="overflow-hidden truncate text-center fixed-tx-w">
                    {{utx.txid}}
                </div>
            </div>
            <div class="w-2 grow"></div>
            <div>
                <div class="flex items-center">
                    <div class="text-sm">{{utx.amount}}</div>
                    <div class="fixed-width">
                        <img src="../../../assets/logo.png" width="20" alt="Veil coin" class="block ml-1 my-1">
                    </div>
                </div>
            </div>
        </a>
    </div>
    <div v-else>
        <div class="font-semibold flex justify-center mt-20">
            {{t("Wallet.NoTransactions")}}
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { IUtxo } from "@/models/IUtxo";
import { useI18n } from "vue-i18n";
import { coreUIStore } from "@/store/modules/CoreUI";
import LightwalletService from "@/lightwallet/LightwalletService";

const { t } = useI18n();
const forceScan = ref(0);
const uiState = coreUIStore.getState();

// eslint-disable-next-line
const props = defineProps({
    addressIndex: { type: Number, required: true }
});

const addressIndex = ref(0);

watch(props, (nval) => {
    if (addressIndex.value != nval.addressIndex) {
        addressIndex.value = nval.addressIndex;
        scan();
        return;
    }

    if (forceScan.value < uiState.forceScan) {
        forceScan.value = uiState.forceScan;
        scan();
        return;
    }
});

const utxos = ref<Array<IUtxo>>([]);

let stopScan = false;

const scan = async () => {
    // fetch utxos    
    const utx = await LightwalletService.getUtxos(addressIndex.value);
    utxos.value = utx.slice(0, parseInt(process.env.VUE_APP_TRANSACTIONS_LOG ?? "10"));
};

const runScan = async () => {
    if (stopScan) return;
    try {
        scan();
    } catch {

    }
    setTimeout(runScan, 20000);
};

onMounted(async () => {
    forceScan.value = uiState.forceScan;
    runScan();
});

onUnmounted(() => stopScan = true);
</script>
<style scoped>
.fixed-width {
    width: 24px;
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