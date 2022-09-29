<template>
    <div class="w-full">
        <div class="text-center font-semibold text-sm">{{t("Create.YourMnemonic")}}</div>
        <div class="w-full grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-sm">
            <div v-for="(word, index) in mnemonic" :key="'word-'+index" class="flex justify-between items-center">
                <span class="w-10">{{(index + 1)}})</span>
                <span class="px-2 py-2 rounded w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-300">
                    {{word}}
                </span>
            </div>
        </div>
        <div class="flex justify-center mt-2">
            <a href="javascript:void(0)" class="underline"
                @click="downloadConfig()">{{t("Create.DownloadMnemonic")}}</a>
        </div>
        <div class="m-auto max-w-md text-sm text-center text-rose-600 dark:text-rose-500 mt-2">
            {{(tm('Create.Notice') as Array<string>).join(' ')}}
        </div>
        <RouterButton to="/home/verify" class="m-auto mt-6 px-4 py-2 my-1 w-full max-w-xs">
            {{t("Create.Next")}}</RouterButton>
        <RouterButton to="/home" class="m-auto px-4 py-2 my-2 w-full max-w-xs">
            {{t("Create.Back")}}</RouterButton>
    </div>
</template>

<script lang="ts" setup>
import { coreUIStore } from "@/store/modules/CoreUI";
import { Lightwallet } from "veil-light";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import RouterButton from "@/components/ui/RouterButton.vue";

const { t, tm } = useI18n();
const mnemonic = ref<Array<string>>([]);

const downloadConfig = () => {
    // compose mnemonic
    let counter = 0;
    let composed = "";
    for (const index in mnemonic.value) {
        composed += mnemonic.value[index] + " ";
        counter++;
        if (counter == 6) {
            composed += "\r\n";
            counter = 0;
        }
    }

    const a = window.document.createElement("a");
    a.style.opacity = "0";
    a.href = window.URL.createObjectURL(
        new Blob([composed], {
            type: "text/plain",
        })
    );
    a.download = "mnemonic.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
};

onMounted(() => {
    mnemonic.value = Lightwallet.generateMnemonic();
    coreUIStore.setIsNewWallet(true);
    coreUIStore.setTmpMnemonic(mnemonic.value);
});
</script>