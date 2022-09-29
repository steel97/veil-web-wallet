<template>
    <div>
        <div class="mt-2">
            <div class="flex flex-col items-center md:items-start md:flex-row">
                <AddressWidget class="hidden md:flex" :balanceAvailable="balanceAvailable"
                    :balanceOverall="balanceOverall" :balanceLocked="balanceLocked" :balancePending="balancePending"
                    :addressIndex="addressIndex" :scanned="scanned" />
                <transition name="fade" mode="out-in">
                    <AddressWidget class="md:hidden" :balanceAvailable="balanceAvailable"
                        :balanceOverall="balanceOverall" :balanceLocked="balanceLocked" :balancePending="balancePending"
                        :addressIndex="addressIndex" :scanned="scanned" v-show="route.meta.isTxList" />
                </transition>
                <div class="w-2 hidden md:block"></div>
                <div class="w-full grow">
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
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import LightwalletService from "@/lightwallet/LightwalletService";
import AddressWidget from "@/components/widgets/AddressWidget.vue";
import "vue3-toastify/dist/index.css";


const uiState = coreUIStore.getState();
const addressIndex = ref(0);
const scanned = ref(false);
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

const balanceAvailable = ref("0");
const balanceOverall = ref("");
const balanceLocked = ref("0");
const balancePending = ref("0");
const forceScan = ref(0);

let stopScan = false;

const scan = async () => {
    const available = await LightwalletService.getAvailableBalance(addressIndex.value);
    const locked = await LightwalletService.getLockedBalance(addressIndex.value);
    const pending = await LightwalletService.getPendingBalance(addressIndex.value);

    balanceAvailable.value = LightwalletService.formatAmount(available);
    balanceLocked.value = LightwalletService.formatAmount(locked);
    balancePending.value = LightwalletService.formatAmount(pending);
    balanceOverall.value = LightwalletService.formatAmount(pending + available);

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

onMounted(async () => {
    forceScan.value = uiState.forceScan;
    addressIndex.value = uiState.addressIndex;
    runScan();
    scanned.value = LightwalletService.getScanned();
});

onUnmounted(() => stopScan = true);
</script>