<template>
    <div class="w-full">
        <transition name="fade" mode="out-in">
            <div class="absolute bg-gray-900/70 w-full h-screen top-0 left-0 flex justify-center items-center"
                v-if="deleteWindowActive">
                <div class="max-w-md bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-4 rounded text-sm">
                    <div>{{t("Unlock.DeleteNotice")}}
                    </div>
                    <BadButton @click="forceDelete" class="m-auto my-1 w-full">{{t("Unlock.ForceDelete")}}</BadButton>
                    <BaseButton @click="deleteWindowActive = false" class="m-auto my-1 w-full">
                        {{t("Unlock.Cancel")}}</BaseButton>
                </div>
            </div>
        </transition>
        <div class="text-center font-semibold text-sm">{{t("Unlock.Information")}}</div>
        <transition name="fade" mode="out-in">
            <div class="m-auto max-w-md text-sm text-center text-rose-600 dark:text-rose-500 mt-2"
                v-if="errorMessage != ''">
                <transition name="fade" mode="out-in">
                    {{errorMessage}}
                </transition>
            </div>
        </transition>
        <form @submit.prevent="unlock">
            <div>
                <div class="mt-4">
                    <label for="password" class="block text-center">{{t("Unlock.PasswordTitle")}}:</label>
                    <input v-model="password"
                        class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                        type="password" id="password" :placeholder="t('Unlock.PasswordPlaceholder')" />
                </div>
            </div>

            <div>
                <BaseButton @click="unlock" class="m-auto mt-6 my-1 w-full max-w-xs">
                    {{t("Unlock.Unlock")}}</BaseButton>
                <BadButton @click="deleteWindowActive = true" class="m-auto mt-2 my-1 w-full max-w-xs">
                    {{t("Unlock.Delete")}}</BadButton>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { IWallet, WalletDb } from "@/database/WalletDb";
import { PreferenceKey, Preferences } from "@/core/Preferences";
import BaseButton from "@/components/ui/BaseButton.vue";
import BadButton from "@/components/ui/BadButton.vue";
import Dexie from "dexie";
import { decrypt } from "@/core/Crypto";
import { hash } from "@/core/Core";

const { t } = useI18n();
const router = useRouter();

const errorMessage = ref("");
const password = ref("");
const deleteWindowActive = ref(false);

const forceDelete = async () => {
    try {
        const walname = Preferences.getString(PreferenceKey.PRIMARY_WALLET, "");
        if (walname == "") return;

        Preferences.setString(PreferenceKey.PRIMARY_WALLET, "");
        await Dexie.delete(walname);

        router.replace("/home");
    } catch {
    }
};

const unlock = async () => {
    const walname = Preferences.getString(PreferenceKey.PRIMARY_WALLET, "");
    if (walname == "") return;

    const db = new WalletDb(walname);
    await db.open();

    try {
        const encryptedWallet = await db.wallets.where("name").equals(walname).first();
        if (encryptedWallet == undefined) {
            errorMessage.value = t("Unlock.Errors.Failed");
            return;
        }

        // try decrypt
        const wallet = JSON.parse(await decrypt(hash(password.value), encryptedWallet.salt, encryptedWallet.encryptedData)) as IWallet;
        if (wallet.control != "dbencrypted") {
            errorMessage.value = t("Unlock.Errors.InvalidPassword");
            db.close();
            return;
        }
        db.close();

        coreUIStore.setCurrentWallet(wallet);
        router.replace("/wallet");
    } catch {
        errorMessage.value = t("Unlock.Errors.InvalidPassword");
    }
};
</script>