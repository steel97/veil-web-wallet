<template>
    <div>
        <div class="text-center font-semibold text-sm mt-1">{{ t("FAQ.Title") }}</div>
        <div class="p-2 md:p-4">
            <div v-for="(entry, index) in (tm('FAQ.MainFAQ') as Array<string>)" :key="'coins-faq-' + index"
                v-html="entry">
            </div>
            <RouterButton to="/wallet" class="m-auto block mt-6 w-full max-w-xs">
                {{t("FAQ.Back")}}</RouterButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import RouterButton from "@/components/ui/RouterButton.vue";

const { t, tm } = useI18n();
</script>