import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import WelcomeView from "@/views/home/WelcomeView.vue";
import CreateView from "@/views/home/CreateView.vue";
import VerifyView from "@/views/home/VerifyView.vue";
import ImportView from "@/views/home/ImportView.vue";
import SaveView from "@/views/home/SaveView.vue";
import UnlockView from "@/views/home/UnlockView.vue";
import WalletView from "@/views/WalletView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "/",
        name: "welcome",
        component: WelcomeView
      },
      {
        path: "/create",
        name: "create",
        component: CreateView
      },
      {
        path: "/verify",
        name: "verify",
        component: VerifyView
      },
      {
        path: "/import",
        name: "import",
        component: ImportView
      },
      {
        path: "/save",
        name: "save",
        component: SaveView
      },
      {
        path: "/unlock",
        name: "unlock",
        component: UnlockView
      }
    ]
  },
  {
    path: "/wallet",
    name: "wallet",
    component: WalletView
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
