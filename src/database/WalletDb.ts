import { Dexie } from "dexie";

export class WalletDb extends Dexie {
    wallets!: Dexie.Table<IWallet, number>;

    constructor(databaseName: string) {
        super(databaseName);

        this.setDb();
    }

    public setDb(version = 1) {
        this.version(version).stores({
            wallets: "++id"
        });

        this.wallets = this.table("wallets");
    }
}

export interface IWallet {
    id?: number;
    name: string;
    mnemonic: string;
    walletEncryptPassword: string;
    minimumPossibleUtxos: boolean;
    nodeUrl: string;
    nodePassword: string;
    addressViewUrl: string;
    txViewUrl: string;
}