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
        <div>
            <div class="mt-4">
                <label for="password" class="block text-center">{{t("Unlock.PasswordTitle")}}:</label>
                <input v-model="password"
                    class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                    type="password" id="password" :placeholder="t('Unlock.PasswordPlaceholder')" />
            </div>
        </div>

        <div>
            <button @click="unlock"
                class="m-auto mt-6 text-center block px-4 py-2 my-1 w-full max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                {{t("Unlock.Unlock")}}</button>
        </div>
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