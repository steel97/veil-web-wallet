import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import localization from "@/localization";
import "@/registerServiceWorker";


createApp(App).use(router).use(localization).mount("#app");
