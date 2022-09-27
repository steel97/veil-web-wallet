import { Logging, LogLevel } from "@/core/Logging";
import { IWallet } from "@/database/WalletDb";
import { IUtxo } from "@/models/IUtxo";
import { AccountType, Chainparams, Lightwallet, LightwalletAccount, LightwalletAddress, mainNetParams } from "veil-light";

export default class LightwalletService {
    public static params: Chainparams;
    public static addressViewUrl = "https://explorer.veil-project.com/address/";
    public static txViewUrl = "https://explorer.veil-project.com/tx/";

    private static _walletData: IWallet;
    private static _wallet: Lightwallet;
    private static _account: LightwalletAccount;

    private static _addresses: Array<LightwalletAddress> = [];
    private static _watching = false;

    public static getAddress(index = 0) {
        return LightwalletService._addresses[index];
    }

    public static async getAvailableBalance(index = 0) {
        const address = LightwalletService.getAddress(index);
        const locked = await LightwalletService.getLockedBalance(index);
        return (await address.getBalance()) - locked;
    }

    public static async getLockedBalance(index = 0) {
        const address = LightwalletService.getAddress(index);
        const utxos = await address.getUnspentOutputs();
        const pending = LightwalletService._walletData.pendingTxes;
        let locked = 0;
        utxos.forEach(utxo => {
            if (pending?.find(val => val == address.getStringAddress() + "_" + utxo.getId())) {
                locked += utxo.getAmount(LightwalletService.params);
            }
        });
        return locked;
    }

    public static formatAmount(amount: number) {
        return LightwalletService._account.formatAmount(amount);
    }

    public static async getUtxos(index: number) {
        const address = LightwalletService.getAddress(index);
        const utxos = (await address.getUnspentOutputs()).reverse();
        const pending = LightwalletService._walletData.pendingTxes;

        const targetUtxos: Array<IUtxo> = [];
        utxos.forEach(utxo => {
            const isPending = pending?.find(val => val == address.getStringAddress() + "_" + utxo.getId());
            targetUtxos.push({
                pending: isPending != undefined,
                txid: utxo.getId() ?? "",
                amount: LightwalletService.formatAmount(utxo.getAmount(LightwalletService.params)),
                amountUnformatted: utxo.getAmount(LightwalletService.params)
            });
        });

        return targetUtxos;
    }

    public static async setWallet(wallet: IWallet | undefined = undefined) {
        if (wallet == undefined) {
            LightwalletService._watching = false;
            return;
        }

        LightwalletService._walletData = wallet;
        LightwalletService.params = mainNetParams;

        LightwalletService._wallet = await Lightwallet.fromMnemonic(LightwalletService.params, wallet.mnemonic.split(" "));
        LightwalletService._account = new LightwalletAccount(LightwalletService._wallet);
        LightwalletService._addresses = [];

        LightwalletService._addresses.push(this._account.getAddress(AccountType.STEALTH));
        LightwalletService._addresses.push(this._account.getAddress(AccountType.CHANGE));

        LightwalletService._watching = true;

        await LightwalletService.fetchData();
    }

    public static run() {
        LightwalletService.watchWallet();
    }

    private static async watchWallet() {
        const reloadDelay = process.env.VUE_APP_WALLET_WATCH_DELAY ?? "60000";
        try {
            await LightwalletService.fetchData();
        } catch (e) {
            Logging.trace(e, LogLevel.ERROR);
        }
        setTimeout(LightwalletService.watchWallet, parseInt(reloadDelay));
    }

    public static async fetchData() {
        if (!LightwalletService._watching) return;

        for (const addr of LightwalletService._addresses) {
            await addr.fetchTxes();
            // TO-DO
            // remove pending txes if spent
        }
    }
}