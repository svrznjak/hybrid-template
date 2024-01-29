<script setup lang="ts">
import { f7ready, f7Page, f7Link } from 'framework7-vue';
import { onMounted } from 'vue';
import { useI18n } from "vue-i18n";
import messages from './NotFoundPage.i18n.json';
const { t } = useI18n({
  messages
});

onMounted(() => {
  f7ready((f7) => {
  });
});
</script>
<template>
  <f7Page name="not-found">
    not found page
    <f7Link href="/">Go home</f7Link>
  </f7Page>
</template>