<template>
    <div class="m-auto">
        <div class="min-h-screen flex flex-col justify-center items-center">
            <div class="max-w-xl mx-2 flex flex-col justify-center items-center w-full p-2">
                <img src="../assets/logo.png" width="64" alt="Veil Web Wallet">
                <div class="font-semibold my-1 text-xl uppercase">{{t("Core.AppName")}}</div>
                <router-view v-slot="{ Component, route }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" v-bind="route.params"></component>
                    </transition>
                </router-view>
                <QuickSettings />
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import QuickSettings from "@/components/QuickSettings.vue";

const { t } = useI18n();
</script>