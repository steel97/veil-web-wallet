<template>
  <div class="transition-all" :class="uiState.darkTheme ? 'dark' : ''">
    <div class="transition-all bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-50">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import "./assets/styles/tailwind.css";
import "./assets/styles/transitions.css";
import "./assets/styles/loaders.css";
import "./assets/fonts/stylesheet.css";

import { Logging, LogLevel } from "@/core/Logging";
import { onMounted } from "vue";
import { useLocalization } from "@/composables/core/Localization";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import devTools, { DevToolsEvent } from "devtools-detect";
import { useTheming } from "./composables/core/Theming";
import { coreUIStore } from "./store/modules/CoreUI";
import { applyEncryptionMiddleware, cryptoOptions } from "dexie-encrypted";
import { hash } from "@/core/Core";
import { WalletDb } from "@/database/WalletDb";
import { PreferenceKey, Preferences } from "./core/Preferences";

const uiState = coreUIStore.getState();

const { setLocale, detectLocale } = useLocalization();
const { loadMode } = useTheming();
const { t } = useI18n();
const router = useRouter();

const printWarnMessage = () => {
  // eslint-disable-next-line
  console.log(t("Core.DevToolsWarn"));
};

onMounted(async () => {
  // eslint-disable-next-line

  loadMode();

  const detectedLocale = detectLocale();
  await setLocale(detectedLocale[0], detectedLocale[1]);


  // this should be registerd ASAP, so don't wait for registerEvents
  try {
    const useWarnMessage =
      process.env.VUE_APP_USE_DEVTOOLS_WARN?.toLowerCase() == "true";
    window.addEventListener("devtoolschange", (ev: DevToolsEvent) => {
      if (!ev.detail.isOpen || !useWarnMessage) return;
      printWarnMessage();
    });
    if (devTools.isOpen && useWarnMessage) printWarnMessage();
  } catch { }

  if (process.env.NODE_ENV == "production")
    Logging.setLogLevel(LogLevel.WARNING);
  else Logging.setLogLevel(LogLevel.DEBUG);


  /*const preloaderElement = document.getElementById("preloader");
  if (preloaderElement != null) {
    preloaderElement.style.opacity = "0.0";
    setTimeout(async () => {
      document.body.removeChild(preloaderElement);
    }, 250);
  }*/

  const walname = Preferences.getString(PreferenceKey.PRIMARY_WALLET, "");
  if (walname == "") return;

  const emptyHash = hash("");
  const symmetricKey = Buffer.from(emptyHash, "hex");
  const db = new WalletDb(walname);
  applyEncryptionMiddleware(db, symmetricKey, {
    wallets: cryptoOptions.NON_INDEXED_FIELDS
  }, async () => {
    // redirect to enter password state
    router.replace("/unlock");
  });

  db.setDb(2);

  const wallet = await db.wallets.get(1);
  if (wallet == undefined) {
    // drop table?
    return;
  }

  coreUIStore.setCurrentWallet(wallet);
  coreUIStore.setPasshash(emptyHash);

  router.replace("/wallet");
});
</script>
<style lang="scss">
#app {
  font-family: Rubik, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
