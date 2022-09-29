<template>
    <div class="flex justify-center h-screen items-center">
        <span class="loader"></span>
    </div>
</template>

<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { onMounted } from "vue";

onMounted(() => coreUIStore.setWalletLoaded(true));
</script>