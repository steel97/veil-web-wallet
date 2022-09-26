import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import WelcomeView from "@/views/home/WelcomeView.vue";
import CreateView from "@/views/home/CreateView.vue";
import VerifyView from "@/views/home/VerifyView.vue";
import ImportView from "@/views/home/ImportView.vue";

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
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
