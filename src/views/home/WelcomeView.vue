<template>
  <div class="flex flex-col items-center justify-center">
    <router-link to="/create"
      class="mt-4 text-center block px-4 py-2 my-1 w-full max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
      {{t("Welcome.Create")}}</router-link>
    <router-link to="/import"
      class="text-center block px-4 py-2 my-1 w-full max-w-xs rounded transition-colors text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
      {{t("Welcome.Import")}}</router-link>
    <div class="my-4 mt-8">
      <div class="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          class="w-14 h-14 text-red-600 dark:text-red-500" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <div class="max-w-md text-sm text-center text-rose-600 dark:text-rose-500">
          {{(tm('Welcome.Notice') as Array<string>).join(' ')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t, tm } = useI18n();
</script>
<style>

</style>