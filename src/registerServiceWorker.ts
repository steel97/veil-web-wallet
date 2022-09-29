/* eslint-disable no-console */

import { register } from "register-service-worker";
import { Logging, LogLevel } from "./core/Logging";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      Logging.trace("App is being served from cache by a service worker", LogLevel.INFO);
    },
    registered() {
      Logging.trace("Service worker has been registered.", LogLevel.INFO);
    },
    cached() {
      Logging.trace("Content has been cached for offline use.", LogLevel.INFO);
    },
    updatefound(reg) {
      Logging.trace("New content is downloading.", LogLevel.INFO);
      window.dispatchEvent(new CustomEvent("appUpdateFound"));
      reg.update();
    },
    updated() {
      Logging.trace("New content is available; please refresh.", LogLevel.INFO);
      window.dispatchEvent(new CustomEvent("appUpdated"));
    },
    offline() {
      Logging.trace("No internet connection found. App is running in offline mode.", LogLevel.INFO);
    },
    error(error) {
      Logging.trace(`Error during service worker registration: ${error}`, LogLevel.ERROR);
    }
  });
}
