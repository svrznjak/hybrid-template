<script setup lang="ts">
import { f7ready, f7Page, f7Link } from 'framework7-vue';
import { onMounted } from 'vue';

onMounted(() => {
  f7ready((f7) => {
  });
});
</script>
<template>
  <f7Page name="not-found">
    not found page
    <f7Link href="/">About Page</f7Link>
  </f7Page>
</template>