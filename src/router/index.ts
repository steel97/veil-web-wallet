import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { coreUIStore } from "@/store/modules/CoreUI";
import LoadingView from "@/views/LoadingView.vue";
import HomeView from "@/views/HomeView.vue";
import WelcomeView from "@/views/home/WelcomeView.vue";
import CreateView from "@/views/home/CreateView.vue";
import VerifyView from "@/views/home/VerifyView.vue";
import ImportView from "@/views/home/ImportView.vue";
import SaveView from "@/views/home/SaveView.vue";
import UnlockView from "@/views/home/UnlockView.vue";
import WalletView from "@/views/WalletView.vue";
import TransactionsView from "@/views/wallet/TransactionsView.vue";
import TransactionsTableView from "@/views/wallet/transactions/TransactionsTableView.vue";
import TransactionBuilderView from "@/views/wallet/transactions/TransactionBuilderView.vue";
import FAQView from "@/views/wallet/transactions/FAQView.vue";
import SettingsView from "@/views/wallet/transactions/SettingsView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "loading",
    component: LoadingView,
    meta: {
      skipLoad: true
    }
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "/home",
        name: "welcome",
        component: WelcomeView
      },
      {
        path: "/home/create",
        name: "create",
        component: CreateView
      },
      {
        path: "/home/verify",
        name: "verify",
        component: VerifyView
      },
      {
        path: "/home/import",
        name: "import",
        component: ImportView
      },
      {
        path: "/home/save",
        name: "save",
        component: SaveView
      },
      {
        path: "/home/unlock",
        name: "unlock",
        component: UnlockView
      }
    ]
  },
  {
    path: "/wallet",
    name: "wallet",
    component: WalletView,
    meta: {
      skipLoad: true,
      wallet: true
    },
    children: [
      {
        path: "/wallet",
        name: "transactions",
        component: TransactionsView,
        children: [
          {
            path: "/wallet",
            name: "transactionstable",
            component: TransactionsTableView,
            meta: {
              isTxList: true
            }
          },
          {
            path: "/wallet/maketx",
            name: "transactionbuilder",
            component: TransactionBuilderView
          },
          {
            path: "/wallet/faq",
            name: "faq",
            component: FAQView
          },
          {
            path: "/wallet/settings",
            name: "settings",
            component: SettingsView
          }
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(route => {
  if (!route.meta.skipLoad && !coreUIStore.getState().walletLoaded) {
    router.replace("/");
    return;
  }

  if (!route.meta.wallet)
    return;

  const cwallet = coreUIStore.getState().currentWallet;
  if (cwallet == undefined) {
    router.replace("/");
    return;
  }
});

export default router;
