import { Logging, LogLevel } from "@/core/Logging";
import { IWallet } from "@/database/WalletDb";
import { IUtxo } from "@/models/IUtxo";
import { coreUIStore } from "@/store/modules/CoreUI";
import { AccountType, Chainparams, CVeilAddress, CWatchOnlyTxWithIndex, Lightwallet, LightwalletAccount, LightwalletAddress, mainNetParams, RpcRequester, GetRawMempool } from "veil-light";

export interface BuildTransactionException {
    errorName: string
}

export default class LightwalletService {
    public static params: Chainparams;
    public static defaultNodeUrl = process.env.VUE_APP_NODE_URL ?? "";
    public static defaultAddressViewUrl = process.env.VUE_APP_ADDRESS_VIEW_URL ?? "";
    public static defaultTxViewUrl = process.env.VUE_APP_TX_VIEW_URL ?? "";
    public static addressViewUrl = LightwalletService.defaultAddressViewUrl;
    public static txViewUrl = LightwalletService.defaultTxViewUrl;
    public static useMinimumUtxos = false;

    private static _walletData: IWallet;
    private static _wallet: Lightwallet;
    private static _account: LightwalletAccount;

    private static _addresses: Array<LightwalletAddress> = [];
    private static _watching = false;
    private static _mempool: Array<string> = [];
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

    public static toDisplayValue(input: number) {
        return (input / Number(LightwalletService.params.COIN));
    }

    public static isAddressValid(address: string) {
        try {
            CVeilAddress.parse(LightwalletService.params, address);
            return true;
        } catch {

        }
        return false;
    }

    public static validateAddress(address: string) {
        const recipientAddress = CVeilAddress.parse(LightwalletService.params, address);
        return recipientAddress.isValid() || recipientAddress.isValidStealthAddress();
    }

    public static async buildTransaction(index: number, amount: number, recipient: string, substractFee = false) {
        try {
            const address = LightwalletService.getAddress(index);
            const recipientAddress = CVeilAddress.parse(LightwalletService.params, recipient);

            const preparedUtxos = (await address.getUnspentOutputs()).filter(utxo => LightwalletService._mempool.indexOf(utxo.getId() ?? "") === -1);
            const utxos = preparedUtxos.sort((a, b) => a.getAmount(LightwalletService.params) - b.getAmount(LightwalletService.params));

            const targetUtxos: Array<CWatchOnlyTxWithIndex> = [];
            const fee = LightwalletService.getFee(); // TO-DO, real fee calculation
            const amountPrepared = substractFee ? amount - fee : amount;
            const targetAmount = substractFee ? amountPrepared + fee : amountPrepared;

            let currentAmount = 0;
            for (const utxo of utxos) {
                currentAmount += utxo.getAmount(LightwalletService.params);
                targetUtxos.push(utxo);
                if (currentAmount >= targetAmount)
                    break;
            }
            const rawTx = await address.buildTransaction(amountPrepared, recipientAddress, targetUtxos, LightwalletService.useMinimumUtxos);
            if (rawTx == undefined) {
                const txError: BuildTransactionException = {
                    errorName: "unknown"
                };
                return txError;
            }

            return rawTx;
        } catch (e) {
            Logging.trace(`can't build tx ${e}`, LogLevel.ERROR);
            let errorName = "unknown";
            try {
                errorName = (e as any).name as string;
            } catch {

            }
            const txError: BuildTransactionException = {
                errorName: errorName
            };
            return txError;
        }
    }

    public static async publishTransaction(index: number, rawTx: string) {
        try {
            const address = LightwalletService.getAddress(index);
            const res = await Lightwallet.publishTransaction(rawTx);
            if (res.errorCode != null) {
                return undefined;
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
        const balance = await address.getBalance(this._mempool);
        return balance;
    }

    public static async getPendingBalance(index = 0) {
        const address = LightwalletService.getAddress(index);
        const balance = await address.getBalance();
        const balanceAvailable = await address.getBalance(this._mempool);
        return balance - balanceAvailable;
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

        const targetUtxos: Array<IUtxo> = [];
        let indexNum = 0;
        utxos.forEach(utxo => {
            const isPending = LightwalletService._mempool.find(val => val == utxo.getId());
            targetUtxos.unshift({
                rid: indexNum,
                pending: isPending != undefined,
                txid: utxo.getId() ?? "",
                amount: LightwalletService.formatAmount(utxo.getAmount(LightwalletService.params)),
                amountUnformatted: utxo.getAmount(LightwalletService.params)
            });
            indexNum++;
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

        const walletEncryptPassword = (LightwalletService._walletData.walletEncryptPassword != undefined && LightwalletService._walletData.walletEncryptPassword.length > 0) ? LightwalletService._walletData.walletEncryptPassword : undefined;
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

        setTimeout(LightwalletService.watchWallet, parseInt(reloadDelay));
    }

    public static async reloadTxes(addr: LightwalletAddress) {
        // fetch txes
        await addr.fetchTxes();
        // fetch mempool
        const result = await RpcRequester.send<GetRawMempool>({
            jsonrpc: "1.0",
            method: "getrawmempool",
            params: []
        });

        if (result.error == null)
            LightwalletService._mempool = result.result;
    }

    public static async fetchData() {
        if (!LightwalletService._watching) return;

        for (const addr of LightwalletService._addresses) {
            await LightwalletService.reloadTxes(addr);
        }
    }
}