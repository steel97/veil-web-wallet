import { IWallet } from "@/database/WalletDb";
import { Store } from "@/store/Store";

interface CoreUI extends Object {
    darkTheme: boolean;
    isNewWallet: boolean;
    tmpMnemonic: Array<string>;
    currentWallet: IWallet | undefined;
    passHash: string;
}

class CoreUIStore extends Store<CoreUI> {
    constructor() {
        super({
            darkTheme: false,
            isNewWallet: false,
            tmpMnemonic: [],
            currentWallet: undefined,
            passHash: ""
        });
    }

    setIsNewWallet(state: boolean) {
        this.state.isNewWallet = state;
    }

    setTheme(state: boolean) {
        this.state.darkTheme = state;
    }

    setTmpMnemonic(state: Array<string>) {
        this.state.tmpMnemonic = state;
    }

    setCurrentWallet(state: IWallet) {
        this.state.currentWallet = state;
    }

    setPasshash(state: string) {
        this.state.passHash = state;
    }
}

export const coreUIStore = new CoreUIStore();