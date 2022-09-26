import { Store } from "@/store/Store";

interface CoreUI extends Object {
    darkTheme: boolean;
    tmpMnemonic: Array<string>;
}

class CoreUIStore extends Store<CoreUI> {
    constructor() {
        super({
            darkTheme: false,
            tmpMnemonic: []
        });
    }

    setTheme(state: boolean) {
        this.state.darkTheme = state;
    }

    setTmpMnemonic(state: Array<string>) {
        this.state.tmpMnemonic = state;
    }
}

export const coreUIStore = new CoreUIStore();