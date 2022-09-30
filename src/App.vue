<template>
  <div class="transition-all" :class="uiState.darkTheme ? 'dark' : ''">
    <transition name="fade" mode="out-in">
      <div class="absolute z-50 bg-gray-900/70 w-full h-screen top-0 left-0 flex justify-center items-center"
        v-if="updateAvailable">
        <div class="max-w-md w-full bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 p-4 rounded">
          {{t("Core.UpdateAvailable")}}
          <BaseButton @click="update" class="m-auto my-1 w-full">
            {{t("Core.Reload")}}</BaseButton>
        </div>
      </div>
    </transition>
    <div class="transition-all bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" v-bind="route.params"></component>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import "./assets/styles/tailwind.css";
import "./assets/styles/transitions.css";
import "./assets/styles/loaders.css";
import "./assets/fonts/stylesheet.css";

import { Logging, LogLevel } from "@/core/Logging";
import { onMounted, ref } from "vue";
import { useLocalization } from "@/composables/core/Localization";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import devTools, { DevToolsEvent } from "devtools-detect";
import { useTheming } from "./composables/core/Theming";
import { coreUIStore } from "./store/modules/CoreUI";
import { hash, sleep } from "@/core/Core";
import { IWallet, WalletDb } from "@/database/WalletDb";
import { PreferenceKey, Preferences } from "./core/Preferences";
import LightwalletService from "./lightwallet/LightwalletService";
import BaseButton from "./components/ui/BaseButton.vue";
import { decrypt } from "./core/Crypto";

const uiState = coreUIStore.getState();

const { setLocale, detectLocale } = useLocalization();
const { loadMode } = useTheming();
const { t } = useI18n();
const router = useRouter();
const updateAvailable = ref(false);

const update = () => {
  try {
    // eslint-disable-next-line
    // @ts-ignore: Unreachable code error
    location.reload(true);
  } catch {
    location.reload();
  }
};

const printWarnMessage = () => {
  // eslint-disable-next-line
  console.log(t("Core.DevToolsWarn"));
};

onMounted(async () => {
  // frame ancestors not work in html meta tags, and github pages doesn't allow to send custom headers, so...
  if (window.self != window.top) {
    location.replace("https://veil-project.com");
    return;
  }

  // eslint-disable-next-line
  window.addEventListener("appUpdated", () => updateAvailable.value = true);
  //window.addEventListener("appUpdateFound", () => updateAvailable.value = true);

  loadMode();

  const detectedLocale = detectLocale();
  await setLocale(detectedLocale[0], detectedLocale[1]);

  // this should be registerd ASAP
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

  await sleep(100);

  LightwalletService.run();

  const walname = Preferences.getString(PreferenceKey.PRIMARY_WALLET, "");
  if (walname == "") {
    router.replace("/home");
    return;
  }

  const emptyHash = hash("");
  let db: WalletDb | undefined;
  try {
    db = new WalletDb(walname);
    await db.open();

    const encryptedWallet = await db.wallets.where("name").equals(walname).first();
    if (encryptedWallet == undefined) {
      db.close();
      router.replace("/home");
      return;
    }
    // try decrypt
    const wallet = JSON.parse(await decrypt(emptyHash, encryptedWallet.salt, encryptedWallet.encryptedData)) as IWallet;
    if (wallet.control != "dbencrypted") {
      router.replace("/home/unlock");
      db.close();
      return;
    }
    db.close();


    coreUIStore.setCurrentWallet(wallet);
    coreUIStore.setPasshash(emptyHash);

    db.close();
    router.replace("/wallet");
  } catch (error: any) {
    const name = error.name;
    try {
      db?.close();
      if (name == "VersionError") {
        router.replace("/home");
        return;
      }

      router.replace("/home/unlock");

    } catch {
      router.replace("/home");
    }
  }
});
</script>
<style lang="scss">
#app {
  font-family: Rubik, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
