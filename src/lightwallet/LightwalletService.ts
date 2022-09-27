import { Logging, LogLevel } from "@/core/Logging";
import { IWallet } from "@/database/WalletDb";
import { IUtxo } from "@/models/IUtxo";
import { coreUIStore } from "@/store/modules/CoreUI";
import { AccountType, Chainparams, CVeilAddress, CWatchOnlyTxWithIndex, Lightwallet, LightwalletAccount, LightwalletAddress, mainNetParams } from "veil-light";

export default class LightwalletService {
    public static params: Chainparams;
    public static addressViewUrl = "https://explorer.veil-project.com/address/";
    public static txViewUrl = "https://explorer.veil-project.com/tx/";

    private static _walletData: IWallet;
    private static _wallet: Lightwallet;
    private static _account: LightwalletAccount;

    private static _addresses: Array<LightwalletAddress> = [];
    private static _watching = false;
    private static _pendingUtxos: Array<string> = [];
    private static _lockedUtxos: Array<string> = [];
    private static _scanned = false;

    public static getScanned() {
        return LightwalletService._scanned;
    }

    public static getAddress(index = 0) {
        return LightwalletService._addresses[index];
    }

    public static getFee() {
        return (Number(LightwalletService.params.CENT) / Number(LightwalletService.params.COIN));
    }

    public static isAddressValid(address: string) {
        try {
            CVeilAddress.parse(LightwalletService.params, address);
            return true;
        } catch {

        }
        return false;
    }

    public static async buildTransaction(index: number, amount: number, recipient: string) {
        try {
            const address = LightwalletService.getAddress(index);
            const recipientAddress = CVeilAddress.parse(LightwalletService.params, recipient);

            const utxos = (await address.getUnspentOutputs()).sort((a, b) => a.getAmount(LightwalletService.params) - b.getAmount(LightwalletService.params));
            const pending = LightwalletService._lockedUtxos;

            const targetUtxos: Array<CWatchOnlyTxWithIndex> = [];
            const fee = LightwalletService.getFee();
            const targetAmount = amount + fee;
            let currentAmount = 0;
            LightwalletService._pendingUtxos = [];
            for (const utxo of utxos) {
                const isPending = pending?.find(val => val == address.getStringAddress() + "_" + utxo.getId());
                if (isPending) break;
                currentAmount += utxo.getAmount(LightwalletService.params);
                targetUtxos.push(utxo);
                LightwalletService._pendingUtxos.push(utxo.getId()!);
                if (currentAmount >= targetAmount)
                    break;
            }
            const rawTx = await address.buildTransaction(amount, recipientAddress, targetUtxos);
            if (rawTx == undefined) return undefined;

            return rawTx;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    public static async publishTransaction(index: number, rawTx: string) {
        try {
            const address = LightwalletService.getAddress(index);
            const res = await Lightwallet.publishTransaction(rawTx);
            if (res.errorCode != null) {
                return undefined;
            }
            // TO-DO save walletData to dexie database
            // TO-DO return from build transaction which utxos was used
            if (res.txid != undefined) {
                LightwalletService._pendingUtxos.forEach(utxo => {
                    LightwalletService._lockedUtxos.push(address.getStringAddress() + "_" + utxo);
                });
            }

            try {
                await LightwalletService.reloadTxes(address);
            } catch {

            }
            coreUIStore.incrementForceScan();
            return res.txid;
        } catch {
            return undefined;
        }
    }

    public static async getAvailableBalance(index = 0) {
        const address = LightwalletService.getAddress(index);
        const balance = await address.getBalance();
        return balance;
    }

    public static async getLockedBalance(index = 0) {
        const address = LightwalletService.getAddress(index);
        return await address.getBalanceLocked();
    }

    public static formatAmount(amount: number) {
        return LightwalletService._account.formatAmount(amount);
    }

    public static async getUtxos(index: number) {
        const address = LightwalletService.getAddress(index);
        const utxos = (await address.getAllOutputs() ?? []).slice();
        const pending = LightwalletService._lockedUtxos;

        const targetUtxos: Array<IUtxo> = [];
        const indexNum = 0;
        utxos.forEach(utxo => {
            const isPending = pending?.find(val => val == address.getStringAddress() + "_" + utxo.getId());
            targetUtxos.unshift({
                rid: indexNum,
                pending: isPending != undefined,
                txid: utxo.getId() ?? "",
                amount: LightwalletService.formatAmount(utxo.getAmount(LightwalletService.params)),
                amountUnformatted: utxo.getAmount(LightwalletService.params)
            });
            index++;
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

        const walletEncryptPassword = LightwalletService._walletData.walletEncryptPassword.length > 0 ? LightwalletService._walletData.walletEncryptPassword : undefined;
        LightwalletService._wallet = await Lightwallet.fromMnemonic(LightwalletService.params, wallet.mnemonic.split(" "), walletEncryptPassword);
        LightwalletService._account = new LightwalletAccount(LightwalletService._wallet);
        LightwalletService._addresses = [];

        LightwalletService._addresses.push(this._account.getAddress(AccountType.STEALTH));
        LightwalletService._addresses.push(this._account.getAddress(AccountType.CHANGE));

        LightwalletService._watching = true;

        await LightwalletService.fetchData();
        let scanned = true;
        for (const addr of LightwalletService._addresses) {
            const syncStatus = addr.getSyncStatus();
            if (syncStatus == "scanning") {
                scanned = false;
                break;
            }
        }
        LightwalletService._scanned = scanned;
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
        // TO-DO fill _lockedUtxos from db
        setTimeout(LightwalletService.watchWallet, parseInt(reloadDelay));
    }

    public static async reloadTxes(addr: LightwalletAddress) {
        await addr.fetchTxes();
        const utxos = (await addr.getUnspentOutputs() ?? []);
        LightwalletService._lockedUtxos = LightwalletService._lockedUtxos.filter(a => utxos.find(b => b.getId() == a) != undefined);
    }

    public static async fetchData() {
        if (!LightwalletService._watching) return;

        for (const addr of LightwalletService._addresses) {
            await LightwalletService.reloadTxes(addr);
        }
    }
}