<template>
    <div>
        <div class="text-center font-semibold text-sm mt-1">{{ t("Wallet.NewTransaction") }}</div>
        <div class="flex justify-center">
            <transition name="fade" mode="out-in">
                <div class="absolute bg-gray-900/70 w-full h-screen top-0 left-0 flex justify-center items-center"
                    v-if="showQr">
                    <div class="max-w-xs bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-4 rounded">
                        <qrcode-stream @decode="onQrDecode"></qrcode-stream>
                        <qrcode-drop-zone @decode="onQrDecode"></qrcode-drop-zone>
                        <qrcode-capture @decode="onQrDecode"></qrcode-capture>
                        <BaseButton @click="closeQr" class="m-auto my-1 w-full">
                            {{t("Wallet.Back")}}</BaseButton>
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
                        <form @submit.prevent="next">
                            <div>
                                <div class="mt-4">
                                    <label for="address"
                                        class="block text-center">{{t("Wallet.TargetAddress")}}:</label>
                                    <div class="flex">
                                        <div class="h-5 w-5"></div>
                                        <input v-model="address"
                                            class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                            type="text" id="address"
                                            :placeholder="t('Wallet.TargetAddressPlaceholder')" />
                                        <button type="button" @click="showQr = true">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor"
                                                class="w-6 h-6 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 transition-colors">
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
                                            <img src="../../../assets/logo.png" width="20" alt="Veil coin"
                                                class="block ml-1 my-1">
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-4 flex justify-center">
                                    <input type="checkbox" id="substract" class="mr-2" v-model="substractFee" />
                                    <label for="substract">{{t("Wallet.SubstractFeeFromAmount")}}</label>
                                </div>
                                <div class="flex justify-center mt-2 items-center">
                                    <div class="mr-2">
                                        {{t("Wallet.AvailableBanalce")}}:
                                    </div>
                                    <div class="fixed-width">
                                        <img src="../../../assets/logo.png" width="24" alt="Veil coin"
                                            class="block grow mr-1 my-1">
                                    </div>
                                    <button type="button"
                                        class="text-md underline underline-offset-3 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600"
                                        @click="setAmount(balanceAvailable)">{{balanceAvailable}}</button>
                                </div>
                            </div>

                            <div v-if="!loading">
                                <BaseButton type="submit" class="m-auto mt-2 my-1 w-full md:max-w-xs">
                                    {{t("Wallet.Next")}}</BaseButton>
                                <BaseButton @click="back" class="m-auto my-1 w-full md:max-w-xs">
                                    {{t("Wallet.Back")}}</BaseButton>
                            </div>
                            <div v-else>
                                <div class="mt-6 mb-4 text-center">
                                    <span class="loader"></span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="step == TxBuildState.BUILT">
                        <!--<div class="font-semibold text-sm text-center">{{t("Wallet.TxSummary")}}</div>-->
                        <div class="grid grid-cols-2 text-xs bg-gray-200 dark:bg-gray-700 rounded p-2 mt-2">
                            <div class="border-b border-gray-400 py-1 px-1">{{t("Wallet.Form.Recipient")}}:</div>
                            <a :href="LightwalletService.addressViewUrl.replace('{address}', address)" target="_blank"
                                class="py-1 px-1 overflow-hidden truncate underline underline-offset-3 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 border-b border-gray-400">{{address}}</a>
                            <div class="border-b border-gray-400 py-1 px-1">{{t("Wallet.Form.AmountSend")}}:</div>
                            <div class="border-b border-gray-400 py-1 px-1 text-right">{{computeAmount}}</div>
                            <div class="border-b border-gray-400 py-1 px-1">{{t("Wallet.Form.Fee")}}:</div>
                            <div class="border-b border-gray-400 py-1 px-1 text-right">{{computeFee}}</div>
                            <div class="border-b py-1 px-1">{{t("Wallet.Form.Total")}}:</div>
                            <div class="border-b py-1 px-1 text-right">{{computeTotal}}</div>
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
                                    <a class="p-2 w-full text-sm overflow-hidden truncate text-center underline underline-offset-3 transition-colors hover:text-blue-500 dark:hover:text-blue-600"
                                        :href="LightwalletService.txViewUrl.replace('{txid}', txid)"
                                        target="_blank">Txid:
                                        {{txid}}</a>
                                </div>
                                <BaseButton @click="back" class="m-auto my-1 w-full md:max-w-xs">
                                    {{t("Wallet.Continue")}}</BaseButton>
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="!loading">
                                <BaseButton @click="publish" class="m-auto mt-4 my-1 w-full md:max-w-xs">
                                    {{t("Wallet.Publish")}}</BaseButton>
                                <BaseButton @click="back" class="m-auto my-1 w-full md:max-w-xs">
                                    {{t("Wallet.Back")}}</BaseButton>
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
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { computed } from "@vue/reactivity";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";
import { getParameterByName } from "@/core/Core";
import { useRouter } from "vue-router";
import LightwalletService, { BuildTransactionException } from "@/lightwallet/LightwalletService";
import BaseButton from "@/components/ui/BaseButton.vue";
import { BuildTransactionResult } from "veil-light";

// eslint-disable-next-line
const props = defineProps({
    addressIndex: { type: Number, required: true },
    balanceAvailable: { type: String, required: true }
});

enum TxBuildState {
    INFORMATION,
    BUILT
}

const { t } = useI18n();
const loading = ref(false);
const step = ref(TxBuildState.INFORMATION);
const router = useRouter();
const showQr = ref(false);
const substractFee = ref(false);

const closeQr = () => {
    showQr.value = false;
};

const setAmount = (amountStr: string) => {
    amount.value = amountStr;
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

const fee = ref(0);
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
    router.replace("/wallet");
};

const next = async () => {
    errorMessage.value = "";
    try {
        loading.value = true;
        const tamount = parseFloat(amount.value);

        if (tamount < 0) {
            errorMessage.value = t("Wallet.Errors.AmountMustNotBeNegative");
            return;
        }

        if (substractFee.value && tamount <= 0) {
            errorMessage.value = t("Wallet.Errors.CantExtractFeeFromZero");
            return;
        }

        const available = await LightwalletService.getAvailableBalance(props.addressIndex);
        if (available < tamount + (substractFee.value ? 0 : LightwalletService.getFee())) {
            errorMessage.value = t("Wallet.Errors.AmountOverBalance");
            return;
        }

        const addr = address.value;
        if (!LightwalletService.isAddressValid(addr)) {
            errorMessage.value = t("Wallet.Errors.InvalidAddress");
            return;
        }

        const txBuildRes = await LightwalletService.buildTransaction(props.addressIndex, tamount, addr, substractFee.value);
        if ((txBuildRes as BuildTransactionException).errorName != undefined) {
            errorMessage.value = t("Wallet.Errors.UnknownRes", { error: (txBuildRes as BuildTransactionException).errorName });
            return;
        }

        const txBuilt = (txBuildRes as BuildTransactionResult);
        fee.value = LightwalletService.toDisplayValue(txBuilt.fee ?? 0);
        rawTx = txBuilt.txid;
        amount.value = LightwalletService.formatAmount(LightwalletService.toDisplayValue(txBuilt.amountSent ?? 0));
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