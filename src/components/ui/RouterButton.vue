<template>
    <router-link :to="props.to"
        class="px-4 py-2 block rounded transition-colors text-center text-gray-50 bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600">
        <slot />
    </router-link>
</template>
<script lang="ts" setup>
// eslint-disable-next-line
const props = defineProps({
    to: { type: String, required: true }
});
</script>