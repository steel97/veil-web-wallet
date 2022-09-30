import { Dexie } from "dexie";
import { EncryptionResult } from "@/core/Crypto";

export class WalletDb extends Dexie {
    wallets!: Dexie.Table<IEncryptedWallet, number>;

    constructor(databaseName: string) {
        super(databaseName);

        this.version(1).stores({
            wallets: "&name"
        });

        this.wallets = this.table("wallets");
    }
}

export interface IEncryptedWallet {
    name: string,
    salt: string,
    encryptedData: EncryptionResult
}

export interface IWallet {
    name: string;
    control: string;
    mnemonic: string;
    walletEncryptPassword: string;
    minimumPossibleUtxos?: boolean;
    nodeUrl?: string;
    nodePassword?: string;
    addressViewUrl?: string;
    txViewUrl?: string;
}