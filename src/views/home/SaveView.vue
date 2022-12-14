<template>
    <div class="w-full">
        <div class="text-center font-semibold text-sm">{{t("Save.SetInformation")}}</div>
        <transition name="fade" mode="out-in">
            <div class="m-auto max-w-md text-sm text-center text-rose-600 dark:text-rose-500 mt-2"
                v-if="errorMessage != ''">
                <transition name="fade" mode="out-in">
                    {{errorMessage}}
                </transition>
            </div>
        </transition>
        <form @submit.prevent="save">
            <div>
                <div class="mt-4">
                    <label for="name" class="block text-center">{{t("Save.WalletName")}}:</label>
                    <input v-model="name"
                        class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                        type="text" id="name" placeholder="Default" />
                </div>
                <div class="mt-4">
                    <label for="password" class="block text-center">{{t("Save.PasswordTitle")}}:</label>
                    <input v-model="password"
                        class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                        type="password" id="password" :placeholder="t('Save.PasswordPlaceholder')" />
                </div>
                <div class="mt-4" v-if="password.length > 0">
                    <label for="re-password" class="block text-center">{{t("Save.RePasswordTitle")}}:</label>
                    <input v-model="repassword"
                        class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                        type="password" id="re-password" :placeholder="t('Save.RePasswordPlaceholder')" />
                </div>
                <div class="mt-4">
                    <label for="wpassword" class="block text-center">{{t("Save.WalletPasswordTitle")}}:</label>
                    <input v-model="walletPassword"
                        class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                        type="password" id="wpassword" :placeholder="t('Save.WalletPasswordTitlePlaceholder')" />
                </div>
                <div class="mt-4" v-if="walletPassword.length > 0">
                    <label for="re2-password" class="block text-center">{{t("Save.RePasswordTitle")}}:</label>
                    <input v-model="walletRePassword"
                        class="text-center !rounded-none !outline-none !focus:ring-transparent bg-transparent w-full border-b-2 border-gray-400"
                        type="password" id="re2-password" :placeholder="t('Save.RePasswordPlaceholder')" />
                </div>
            </div>

            <div v-if="!loading">
                <BaseButton type="submit" @click="save" class="m-auto mt-6 px-4 py-2 my-1 w-full max-w-xs">
                    {{t("Save.Save")}}</BaseButton>
                <RouterButton to="/home" class="m-auto px-4 py-2 my-2 w-full max-w-xs">
                    {{t("Save.Back")}}</RouterButton>
            </div>
            <div v-else>
                <div class="mt-6 mb-4 text-center">
                    <span class="loader"></span>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { AccountType, Lightwallet, LightwalletAccount, mainNetParams, RpcRequester, GetBlockchainInfo } from "veil-light";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { WalletDb, IWallet } from "@/database/WalletDb";
import { PreferenceKey, Preferences } from "@/core/Preferences";
import { encrypt } from "@/core/Crypto";
import { hash, randomString } from "@/core/Core";
import BaseButton from "@/components/ui/BaseButton.vue";
import RouterButton from "@/components/ui/RouterButton.vue";

const { t } = useI18n();
const router = useRouter();
const uiState = coreUIStore.getState();

const errorMessage = ref("");
const loading = ref(false);

const name = ref("");
const password = ref("");
const repassword = ref("");

const walletPassword = ref("");
const walletRePassword = ref("");

const save = async () => {
    const minPassLen = parseInt(process.env.VUE_APP_MIN_PASS_LEN ?? "5");
    const maxNameLen = parseInt(process.env.VUE_APP_MAX_NAME_LEN ?? "32");
    const genMnemonic = uiState.tmpMnemonic.join(" ");
    // double check mnemonic
    if (!Lightwallet.verifyMnemonic(genMnemonic)) {
        errorMessage.value = t("Import.Errors.UserInputFailed");
        return;
    }

    // verify password
    if (password.value.length > 0 && password.value.length < minPassLen) {
        errorMessage.value = t("Save.Errors.PasswordTooShort", { len: minPassLen });
        return;
    }

    if (password.value.length > 0 && password.value != repassword.value) {
        errorMessage.value = t("Save.Errors.PasswordNotMatch");
        return;
    }

    if (name.value.length > maxNameLen) {
        errorMessage.value = t("Save.Errors.NameTooLong", { len: maxNameLen });
        return;
    }

    // verify encrypt password
    if (walletPassword.value.length > 0 && walletPassword.value.length < minPassLen) {
        errorMessage.value = t("Save.Errors.PasswordTooShort", { len: minPassLen });
        return;
    }

    if (walletPassword.value.length > 0 && walletPassword.value != walletRePassword.value) {
        errorMessage.value = t("Save.Errors.PasswordNotMatch");
        return;
    }

    loading.value = true;

    // try import
    const wallet = await Lightwallet.fromMnemonic(mainNetParams, genMnemonic.split(" "));
    const account = new LightwalletAccount(wallet);

    // import main address
    const mainAddress = account.getAddress(AccountType.STEALTH);
    const changeAddress = account.getAddress(AccountType.CHANGE);

    let fromBlock = 0;
    if (uiState.isNewWallet) {
        try {
            const chainInfo = await RpcRequester.send<GetBlockchainInfo>({
                jsonrpc: "1.0",
                method: "getblockchaininfo",
                params: []
            });
            fromBlock = chainInfo.result.blocks;
        } catch {
            errorMessage.value = t("Save.Errors.UnknownError");
            loading.value = false;
            return;
        }
    }

    let mainAddressRemote = "";
    try {
        mainAddressRemote = await mainAddress.syncWithNode(fromBlock);
    } catch {
        errorMessage.value = t("Save.Errors.CantSync");
        loading.value = false;
        return;
    }

    let changeAddressRemote = "";
    try {
        changeAddressRemote = await changeAddress.syncWithNode(fromBlock);
    } catch {
        errorMessage.value = t("Save.Errors.CantSync");
        loading.value = false;
        return;
    }

    if (mainAddress.getStringAddress() != mainAddressRemote || changeAddress.getStringAddress() != changeAddressRemote) {
        errorMessage.value = t("Save.Errors.VerifyFailed");
        return;
    }

    // save wallet
    const walname = name.value.length > 0 ? name.value : "Default";
    Preferences.setString(PreferenceKey.PRIMARY_WALLET, walname);

    const curHash = hash(password.value);

    const db = new WalletDb(walname);
    await db.open();

    const dbWal: IWallet = {
        name: walname,
        control: "dbencrypted",
        mnemonic: genMnemonic,
        walletEncryptPassword: walletPassword.value,
        minimumPossibleUtxos: undefined,
        nodeUrl: undefined,
        nodePassword: undefined,
        addressViewUrl: undefined,
        txViewUrl: undefined
    };

    const salt = randomString(32);
    const encodedWallet = await encrypt(curHash, salt, JSON.stringify(dbWal));

    await db.wallets.add({
        name: dbWal.name,
        salt: salt,
        encryptedData: encodedWallet
    });

    db.close();

    // save current IWallet to ui store
    coreUIStore.setCurrentWallet(dbWal);
    coreUIStore.setPasshash(curHash);

    // show loading
    loading.value = false;

    router.replace("/wallet");
};
</script>