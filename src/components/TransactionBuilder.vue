<template>
    <div class="flex justify-center">
        <div class="max-w-md w-full">
            <transition name="fade" mode="out-in">
                <div class="m-auto max-w-md text-sm text-center text-rose-600 dark:text-rose-500 mt-2"
                    v-if="errorMessage != ''">
                    <transition name="fade" mode="out-in">
                        {{errorMessage}}
                    </transition>
                </div>
            </transition>
            <transition name="fade" mode="out-in">
                <div v-if="step == TxBuildState.INFORMATION">
                    <div>
                        <div class="mt-4">
                            <label for="address" class="block text-center">{{t("Wallet.TargetAddress")}}:</label>
                            <input v-model="address"
                                class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="text" id="address" :placeholder="t('Wallet.TargetAddressPlaceholder')" />
                        </div>
                        <div class="mt-4">
                            <label for="amount" class="block text-center">{{t("Wallet.Amount")}}:</label>
                            <input v-model="amount"
                                class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="text" id="amount" :placeholder="t('Wallet.AmountPlaceholder')" />
                        </div>
                    </div>

                    <div v-if="!loading">
                        <button @click="next"
                            class="m-auto mt-6 text-center block px-4 py-2 my-1 w-full max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                            {{t("Wallet.Next")}}</button>
                    </div>
                    <div v-else>
                        <div class="mt-6 mb-4 text-center">
                            <span class="loader"></span>
                        </div>
                    </div>
                </div>
                <div v-else-if="step == TxBuildState.BUILT">
                    <div class="font-semibold text-md">Summary:</div>
                    <div class="grid grid-cols-2 text-xs">
                        <div class="border-b-1 border-gray-400 py-1 px-1">Recipient:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1 overflow-hidden truncate">{{address}}</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">Amount to send:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">{{computeAmount}}</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">Fee:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">{{computeFee}}</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">Total:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">{{computeTotal}}</div>
                    </div>
                    <div v-if="successMessage != ''">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-10 h-10 text-green-400 mr-2">
                                <path fill-rule="evenodd"
                                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                    clip-rule="evenodd" />
                            </svg>
                            <div class="font-semibold text-md">
                                {{successMessage}}
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="!loading">
                            <button @click="publish"
                                class="m-auto mt-6 text-center block px-4 py-2 my-1 w-full rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                {{t("Wallet.Publish")}}</button>
                        </div>
                        <div v-else>
                            <div class="mt-6 mb-4 text-center">
                                <span class="loader"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import LightwalletService from "@/lightwallet/LightwalletService";
import { computed } from "@vue/reactivity";

// eslint-disable-next-line
const props = defineProps({
    addressIndex: { type: Number, required: true }
});

enum TxBuildState {
    INFORMATION,
    BUILT
}

const { t } = useI18n();
const loading = ref(false);
const step = ref(TxBuildState.INFORMATION);

const errorMessage = ref("");
const successMessage = ref("");

const address = ref("");
const amount = ref("");

const fee = ref(LightwalletService.getFee());
const computeFee = computed(() => LightwalletService.formatAmount(fee.value));
const camount = computed(() => {
    try {
        return parseFloat(amount.value);
    } catch {
        return 0;
    }
});
const computeAmount = computed(() => {
    return LightwalletService.formatAmount(camount.value);
});
const computeTotal = computed(() => LightwalletService.formatAmount(camount.value + fee.value));

let rawTx: string | undefined = "";

const next = async () => {
    try {
        loading.value = true;
        const tamount = parseFloat(amount.value);
        rawTx = await LightwalletService.buildTransaction(props.addressIndex, tamount, address.value);
        if (rawTx == undefined) throw new Error();
        step.value = TxBuildState.BUILT;
    } catch {
        errorMessage.value = t("Wallet.Errors.UnknownError");
    } finally {
        loading.value = false;
    }
};

const publish = async () => {
    try {
        loading.value = true;
        const res = await LightwalletService.publishTransaction(rawTx!);
        if (res == undefined) throw new Error();
        successMessage.value = t("Wallet.TxSent");
    } catch {
        errorMessage.value = t("Wallet.Errors.UnknownError");
    } finally {
        loading.value = false;
    }
};
</script>