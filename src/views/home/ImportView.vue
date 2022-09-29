<template>
    <div class="w-full">
        <div class="text-center font-semibold text-sm">{{t("Import.Title")}}</div>
        <transition name="fade" mode="out-in">
            <div class="m-auto max-w-md text-sm text-center text-rose-600 dark:text-rose-500 mt-2"
                v-if="errorMessage != ''">
                <transition name="fade" mode="out-in">
                    {{errorMessage}}
                </transition>
            </div>
        </transition>
        <form @submit.prevent="importWallet">
            <div class="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-sm">
                <div v-for="(word, index) in mnemonic" :key="'word-'+index" class="flex justify-between items-center">
                    <span class="w-10">{{(index + 1)}})</span>
                    <span class="px-2 py-2 rounded w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-300">
                        <input type="text" v-model="mnemonic[index]"
                            class="!rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400 lowercase" />
                    </span>
                </div>
            </div>

            <BaseButton type="submit" @click="importWallet" class="m-auto mt-6 px-4 py-2 my-1 w-full max-w-xs">
                {{t("Import.Import")}}</BaseButton>
            <RouterButton to="/home" class="m-auto px-4 py-2 my-2 w-full max-w-xs">
                {{t("Import.Back")}}</RouterButton>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { Lightwallet } from "veil-light";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/BaseButton.vue";
import RouterButton from "@/components/ui/RouterButton.vue";

const mnemonic = ref<Array<string>>(new Array(24));

const { t } = useI18n();
const router = useRouter();
const errorMessage = ref("");

const importWallet = () => {
    const tprepared: Array<string> = [];
    mnemonic.value.forEach(val => tprepared.push(val.trim().toLocaleLowerCase()));
    const typeMnemonic = tprepared.join(" ");

    if (!Lightwallet.verifyMnemonic(typeMnemonic)) {
        errorMessage.value = t("Import.Errors.UserInputFailed");
    } else {
        coreUIStore.setIsNewWallet(false);
        coreUIStore.setTmpMnemonic(tprepared);
        router.replace("/home/save");
    }
};
</script>