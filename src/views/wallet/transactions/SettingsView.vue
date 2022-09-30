<template>
    <div>
        <transition name="fade" mode="out-in">
            <div class="absolute bg-gray-900/70 w-full h-screen top-0 left-0 flex justify-center items-center"
                v-if="deleteWindowActive">
                <div class="max-w-md bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-4 rounded text-sm">
                    <div>{{t("Settings.DeleteNotice")}}
                    </div>
                    <BadButton @click="deleteWallet" class="m-auto my-1 w-full">{{t("Settings.ConfirmDelete")}}
                    </BadButton>
                    <BaseButton @click="deleteWindowActive = false" class="m-auto my-1 w-full">
                        {{t("Unlock.Cancel")}}</BaseButton>
                </div>
            </div>
        </transition>
        <div class="text-center font-semibold text-sm mt-1">{{ t("Settings.Title") }}</div>
        <div class="flex justify-center">
            <transition name="fade" mode="out-in">
                <div class="max-w-md w-full" v-if="!changePasswordWindowActive">
                    <transition name="fade" mode="out-in">
                        <div class="m-auto max-w-md text-sm text-center text-lime-400 dark:text-lime-500 mt-2"
                            v-if="success != ''">
                            <transition name="fade" mode="out-in">
                                {{success}}
                            </transition>
                        </div>
                    </transition>
                    <form @submit.prevent="save">
                        <div class="mt-4">
                            <label for="node-url" class="block text-center">{{t("Settings.VeilNodeUrl")}}:</label>
                            <input v-model="nodeUrl"
                                class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="text" id="node-url" />
                            <button type="button"
                                class="m-auto block text-md underline underline-offset-3 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600"
                                @click="nodeUrl = LightwalletService.defaultNodeUrl">{{t("Settings.ResetToDefault")}}</button>
                        </div>
                        <div class="mt-4">
                            <label for="node-auth" class="block text-center">{{t("Settings.VeilNodeAuth")}}:</label>
                            <input v-model="nodeAuth"
                                class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="text" id="node-auth" />
                        </div>
                        <div class="mt-4">
                            <label for="tx-exp" class="block text-center">{{t("Settings.TxExplorer")}}:</label>
                            <input v-model="nodeTxExplorer"
                                class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="text" id="tx-exp" />
                            <button type="button"
                                class="m-auto block text-md underline underline-offset-3 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600"
                                @click="nodeTxExplorer = LightwalletService.defaultTxViewUrl">{{t("Settings.ResetToDefault")}}</button>
                        </div>
                        <div class="mt-4">
                            <label for="addr-exp" class="block text-center">{{t("Settings.AddressExplorer")}}:</label>
                            <input v-model="nodeAddressExplorer"
                                class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="text" id="addr-exp" />
                            <button type="button"
                                class="m-auto block text-md underline underline-offset-3 text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-600"
                                @click="nodeAddressExplorer = LightwalletService.defaultAddressViewUrl">{{t("Settings.ResetToDefault")}}</button>
                        </div>
                        <div class="mt-4 flex justify-center">
                            <input type="checkbox" id="minutxos" class="mr-2" v-model="useMinimumUtxos" />
                            <label for="minutxos">{{t("Settings.MinUtxos")}}</label>
                        </div>
                        <BaseButton type="submit" class="m-auto mt-2 my-1 w-full md:max-w-xs">
                            {{t("Settings.Save")}}</BaseButton>
                    </form>
                    <BaseButton type="submit" @click="changePasswordWindowActive = true"
                        class="m-auto mt-2 my-1 w-full md:max-w-xs">
                        {{t("Settings.ChangePassword")}}</BaseButton>
                    <BadButton @click="deleteWindowActive = true" class="m-auto mt-2 my-1 w-full md:max-w-xs">
                        {{t("Settings.DeleteWallet")}}</BadButton>
                </div>
                <div class="max-w-md w-full" v-else>
                    <transition name="fade" mode="out-in">
                        <div class="m-auto max-w-md text-sm text-center text-rose-600 dark:text-rose-500 mt-2"
                            v-if="errorMessage != ''">
                            <transition name="fade" mode="out-in">
                                {{errorMessage}}
                            </transition>
                        </div>
                    </transition>
                    <transition name="fade" mode="out-in">
                        <div class="m-auto max-w-md text-sm text-center text-lime-400 dark:text-lime-500 mt-2"
                            v-if="success != ''">
                            <transition name="fade" mode="out-in">
                                {{success}}
                            </transition>
                        </div>
                    </transition>
                    <form @submit.prevent="changePassword">
                        <div class="mt-4">
                            <label for="curpassword"
                                class="block text-center">{{t("Settings.CurrentPasswordTitle")}}:</label>
                            <input v-model="currentPassword"
                                class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="password" id="curpassword"
                                :placeholder="t('Settings.CurrentPasswordPlaceholder')" />
                        </div>
                        <div class="mt-4">
                            <label for="password" class="block text-center">{{t("Settings.PasswordTitle")}}:</label>
                            <input v-model="password"
                                class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="password" id="password" :placeholder="t('Settings.PasswordPlaceholder')" />
                        </div>
                        <div class="mt-4">
                            <label for="re-password"
                                class="block text-center">{{t("Settings.RePasswordTitle")}}:</label>
                            <input v-model="repassword"
                                class="grow text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                                type="password" id="re-password" :placeholder="t('Settings.RePasswordPlaceholder')" />
                        </div>

                        <BaseButton type="submit" class="m-auto mt-4 my-1 w-full md:max-w-xs">
                            {{t("Settings.UpdatePassword")}}</BaseButton>
                    </form>
                    <BaseButton type="submit" @click="closeChangeWindow" class="m-auto mt-2 my-1 w-full md:max-w-xs">
                        {{t("Settings.Back")}}</BaseButton>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { RpcRequester } from "veil-light";
import { coreUIStore } from "@/store/modules/CoreUI";
import { IEncryptedWallet, IWallet, WalletDb } from "@/database/WalletDb";
import { decrypt, encrypt } from "@/core/Crypto";
import BadButton from "@/components/ui/BadButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import LightwalletService from "@/lightwallet/LightwalletService";
import { PreferenceKey, Preferences } from "@/core/Preferences";
import Dexie from "dexie";
import { useRouter } from "vue-router";
import { hash } from "@/core/Core";

const { t } = useI18n();

const uiState = coreUIStore.getState();
const router = useRouter();

const changePasswordWindowActive = ref(false);
const deleteWindowActive = ref(false);

const success = ref("");
const errorMessage = ref("");

const currentPassword = ref("");
const password = ref("");
const repassword = ref("");

const nodeUrl = ref(RpcRequester.NODE_URL);
const nodeAuth = ref(RpcRequester.NODE_PASSWORD);
const nodeTxExplorer = ref(LightwalletService.txViewUrl);
const nodeAddressExplorer = ref(LightwalletService.addressViewUrl);
const useMinimumUtxos = ref(LightwalletService.useMinimumUtxos);

const save = async () => {
    success.value = "";
    // update current settings
    RpcRequester.NODE_URL = nodeUrl.value;
    RpcRequester.NODE_PASSWORD = nodeAuth.value;

    LightwalletService.txViewUrl = nodeTxExplorer.value;
    LightwalletService.addressViewUrl = nodeAddressExplorer.value;
    LightwalletService.useMinimumUtxos = useMinimumUtxos.value;

    // assemble new IWallet
    const nwallet = JSON.parse(JSON.stringify(uiState.currentWallet)) as IWallet; // stupid way to clone object lol
    if (nwallet == null) return;
    nwallet.nodeUrl = RpcRequester.NODE_URL;
    nwallet.nodePassword = RpcRequester.NODE_PASSWORD;
    nwallet.txViewUrl = LightwalletService.txViewUrl;
    nwallet.addressViewUrl = LightwalletService.addressViewUrl;
    nwallet.minimumPossibleUtxos = LightwalletService.useMinimumUtxos;

    // encrypt and save
    const db = new WalletDb(nwallet.name);
    await db.open();

    const encryptedWallet = await db.wallets.where("name").equals(nwallet.name).first();
    if (encryptedWallet == null) return;
    const newEncryptedWallet = await encrypt(uiState.passHash, encryptedWallet.salt, JSON.stringify(nwallet));

    await db.wallets.where("name").equals(nwallet.name).delete();
    await db.wallets.add({
        name: nwallet.name,
        salt: encryptedWallet.salt,
        encryptedData: newEncryptedWallet
    });

    db.close();

    // save current IWallet to ui store
    coreUIStore.setCurrentWallet(nwallet);

    success.value = t("Settings.Saved");
};

const deleteWallet = async () => {
    try {
        const walname = Preferences.getString(PreferenceKey.PRIMARY_WALLET, "");
        if (walname == "") return;

        Preferences.setString(PreferenceKey.PRIMARY_WALLET, "");
        await Dexie.delete(walname);

        router.replace("/home");
    } catch {
    }
};

const changePassword = async () => {
    errorMessage.value = "";
    success.value = "";
    const minPassLen = parseInt(process.env.VUE_APP_MIN_PASS_LEN ?? "5");
    // verify password
    if (password.value.length > 0 && password.value.length < minPassLen) {
        errorMessage.value = t("Settings.Errors.PasswordTooShort", { len: minPassLen });
        return;
    }

    if (password.value.length > 0 && password.value != repassword.value) {
        errorMessage.value = t("Settings.Errors.PasswordNotMatch");
        return;
    }

    const walname = Preferences.getString(PreferenceKey.PRIMARY_WALLET, "");
    if (walname == "") return;

    const db = new WalletDb(walname);
    await db.open();

    let curEncryptedWallet: IEncryptedWallet | undefined;
    try {
        curEncryptedWallet = await db.wallets.where("name").equals(walname).first();
        if (curEncryptedWallet == undefined) {
            errorMessage.value = t("Settings.Errors.Failed");
            return;
        }

        // try decrypt
        const wallet = JSON.parse(await decrypt(hash(currentPassword.value), curEncryptedWallet.salt, curEncryptedWallet.encryptedData)) as IWallet;
        if (wallet.control != "dbencrypted") {
            errorMessage.value = t("Settings.Errors.InvalidPassword");
            db.close();
            return;
        }
    } catch {
        errorMessage.value = t("Settings.Errors.InvalidPassword");
        db.close();
        return;
    }
    // change password
    const nwallet = JSON.parse(JSON.stringify(uiState.currentWallet)) as IWallet; // stupid way to clone object lol

    // encrypt and save
    const npassHash = hash(password.value);
    const encryptedWallet = await db.wallets.where("name").equals(nwallet.name).first();
    if (encryptedWallet == null) return;
    const newEncryptedWallet = await encrypt(npassHash, encryptedWallet.salt, JSON.stringify(nwallet));

    await db.wallets.where("name").equals(nwallet.name).delete();
    await db.wallets.add({
        name: nwallet.name,
        salt: encryptedWallet.salt,
        encryptedData: newEncryptedWallet
    });

    db.close();

    // save current IWallet to ui store
    coreUIStore.setCurrentWallet(nwallet);
    coreUIStore.setPasshash(npassHash);

    success.value = t("Settings.PasswordUpdated");
};

const closeChangeWindow = () => {
    currentPassword.value = "";
    password.value = "";
    repassword.value = "";
    errorMessage.value = "";
    success.value = "";
    changePasswordWindowActive.value = false;
};
</script>