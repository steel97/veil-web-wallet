<template>
    <div class="w-full">
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
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { applyEncryptionMiddleware, cryptoOptions } from "dexie-encrypted";
import { hash } from "@/core/Core";
import { WalletDb } from "@/database/WalletDb";
import { PreferenceKey, Preferences } from "@/core/Preferences";
import BaseButton from "@/components/ui/BaseButton.vue";

const { t } = useI18n();
const router = useRouter();

const errorMessage = ref("");

const password = ref("");

const unlock = async () => {
    const walname = Preferences.getString(PreferenceKey.PRIMARY_WALLET, "");
    if (walname == "") return;

    const symmetricKey = Buffer.from(hash(password.value), "hex");
    const db = new WalletDb(walname);
    applyEncryptionMiddleware(db, symmetricKey, {
        wallets: cryptoOptions.NON_INDEXED_FIELDS
    }, async () => {
        errorMessage.value = t("Unlock.Errors.InvalidPassword");
    });

    db.setDb(2);

    const wallet = await db.wallets.get(1);
    if (wallet == undefined) {
        // drop table?
        return;
    }

    coreUIStore.setCurrentWallet(wallet);

    router.replace("/wallet");
};
</script>