<template>
    <div class="flex justify-center">
        <transition name="fade" mode="out-in">
            <div class="absolute bg-gray-900/70 w-full h-screen top-0 left-0 flex justify-center items-center"
                v-if="showQr">
                <div class="max-w-xs bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-4 rounded">
                    <qrcode-stream @decode="onQrDecode"></qrcode-stream>
                    <qrcode-drop-zone @decode="onQrDecode"></qrcode-drop-zone>
                    <qrcode-capture @decode="onQrDecode"></qrcode-capture>
                    <button @click="closeQr"
                        class="m-auto text-center block px-4 py-2 my-1 w-full rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                        {{t("Wallet.Back")}}</button>
                </div>
            </div>
        </transition>
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
                            <div class="flex">
                                <div class="h-5 w-5"></div>
                                <input v-model="address"
                                    class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                    type="text" id="address" :placeholder="t('Wallet.TargetAddressPlaceholder')" />
                                <button @click="showQr = true">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor"
                                        class="w-6 h-6 text-blue-500 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-700 transition-colors">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="mt-4">
                            <label for="amount" class="block text-center">{{t("Wallet.Amount")}}:</label>
                            <div class="flex">
                                <div class="h-5 w-5"></div>
                                <input v-model="amount"
                                    class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                    type="text" id="amount" :placeholder="t('Wallet.AmountPlaceholder')" />
                                <div class="fixed-width">
                                    <img src="../assets/logo.png" width="20" alt="Veil coin" class="block ml-1 my-1">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="!loading">
                        <button @click="next"
                            class="m-auto mt-6 text-center block px-4 py-2 my-1 w-full md:max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                            {{t("Wallet.Next")}}</button>
                        <button @click="back"
                            class="m-auto text-center block px-4 py-2 my-1 w-full md:max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                            {{t("Wallet.Back")}}</button>
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
                        <div class="border-b-1 border-gray-400 py-1 px-1">{{t("Wallet.Form.Recipient")}}:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1 overflow-hidden truncate">{{address}}</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">{{t("Wallet.Form.AmountSend")}}:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1 text-right">{{computeAmount}}</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">{{t("Wallet.Form.Fee")}}:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1 text-right">{{computeFee}}</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1">{{t("Wallet.Form.Total")}}:</div>
                        <div class="border-b-1 border-gray-400 py-1 px-1 text-right">{{computeTotal}}</div>
                    </div>
                    <div v-if="successMessage != ''">
                        <div class="flex items-center justify-center">
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
                        <div>
                            <div class="border-b-1 border-gray-400 py-1 px-1 overflow-hidden truncate">
                                <a class="p-2 w-full text-sm overflow-hidden truncate text-center underline underline-offset-3 transition-colors hover:text-blue-600 dark:hover:text-blue-700"
                                    :href="LightwalletService.txViewUrl + txid" target="_blank">Txid: {{txid}}</a>
                            </div>
                            <button @click="back"
                                class="m-auto text-center block px-4 py-2 my-1 w-full md:max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                {{t("Wallet.Continue")}}</button>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="!loading">
                            <button @click="publish"
                                class="m-auto mt-6 text-center block px-4 py-2 my-1 w-full md:max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                {{t("Wallet.Publish")}}</button>
                            <button @click="back"
                                class="m-auto text-center block px-4 py-2 my-1 w-full md:max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                {{t("Wallet.Back")}}</button>
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
import { computed } from "@vue/reactivity";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";
import LightwalletService from "@/lightwallet/LightwalletService";
import { getParameterByName } from "@/core/Core";

// eslint-disable-next-line
const props = defineProps({
    addressIndex: { type: Number, required: true }
});
// eslint-disable-next-line
const emit = defineEmits<{
    (event: "close"): void
}>();

enum TxBuildState {
    INFORMATION,
    BUILT
}

const { t } = useI18n();
const loading = ref(false);
const step = ref(TxBuildState.INFORMATION);

const showQr = ref(false);

const closeQr = () => {
    showQr.value = false;
};

const onQrDecode = (decodedString: string) => {
    // check veil:<> address
    let target = "";
    if (decodedString.indexOf(":") !== -1) {
        const dstr = decodedString.split(":");
        if (dstr[0].toLowerCase() == "veil") {
            target = dstr[1];
        } else {
            return;
        }
    } else {
        target = decodedString;
    }

    // check amounts
    const localAmount = getParameterByName("amount", target);
    console.log(localAmount);

    target = target.split("?")[0];

    // verify address
    if (!LightwalletService.isAddressValid(target)) {
        return;
    }
    if (localAmount != undefined) {
        const amountNum = parseFloat(localAmount.replaceAll(",", "."));
        if (amountNum > 0 && isFinite(amountNum) && !isNaN(amountNum)) {
            amount.value = LightwalletService.formatAmount(amountNum);
        }
    }

    address.value = target;
    closeQr();
};

const errorMessage = ref("");
const successMessage = ref("");

const address = ref("");
const amount = ref("");
const txid = ref("");

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

const back = () => {
    emit("close");
};

const next = async () => {
    errorMessage.value = "";
    try {
        loading.value = true;
        const tamount = parseFloat(amount.value);
        rawTx = await LightwalletService.buildTransaction(props.addressIndex, tamount, address.value);
        if (rawTx == undefined) throw new Error();
        step.value = TxBuildState.BUILT;
    } catch {
        errorMessage.value = t("Wallet.Errors.Unknown");
    } finally {
        loading.value = false;
    }
};

const publish = async () => {
    errorMessage.value = "";
    try {
        loading.value = true;
        const res = await LightwalletService.publishTransaction(props.addressIndex, rawTx!);
        if (res == undefined) throw new Error();
        txid.value = res;
        successMessage.value = t("Wallet.TxSent");
    } catch {
        errorMessage.value = t("Wallet.Errors.Unknown");
    } finally {
        loading.value = false;
    }
};
</script>