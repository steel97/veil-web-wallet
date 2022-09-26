import { Logging, LogLevel } from "@/core/Logging";
import { IWallet } from "@/database/WalletDb";
import { AccountType, Lightwallet, LightwalletAccount, LightwalletAddress, mainNetParams } from "veil-light";

export default class LightwalletService {
    private static _wallet: Lightwallet;
    private static _account: LightwalletAccount;

    private static _addresses: Array<LightwalletAddress> = [];
    private static _watching = false;

    public static async setWallet(wallet: IWallet | undefined = undefined) {
        if (wallet == undefined) {
            this._watching = false;
            return;
        }

        this._wallet = await Lightwallet.fromMnemonic(mainNetParams, wallet.mnemonic.split(" "));
        this._account = new LightwalletAccount(this._wallet);
        this._addresses = [];

        this._addresses.push(this._account.getAddress(AccountType.STEALTH));
        this._addresses.push(this._account.getAddress(AccountType.CHANGE));

        this._watching = true;

        await LightwalletService.fetchData();
    }

    public static run() {
        LightwalletService.watchWallet();
    }

    private static async watchWallet() {
        const reloadDelay = process.env.VUE_APP_WALLET_WATCH_DELAY ?? "60000";
        try {
            await this.fetchData();
        } catch (e) {
            Logging.trace(typeof e === "string" ? e : "watchWallet failed", LogLevel.ERROR);
        }
        setTimeout(LightwalletService.watchWallet, parseInt(reloadDelay));
    }

    public static async fetchData() {
        if (!LightwalletService._watching) return;

        for (const addr of this._addresses) {
            await addr.fetchTxes();
        }
    }
}