<script setup lang="ts">
import { useStore, f7 } from 'framework7-vue';
import setLocale from '@/global/utils/setLocale';
import routes from '@/app/routes';
import appState from './appState';
import LeftPanel from './app/LeftPanel.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const sidePanelState = useStore(appState, 'getSidePanelState');
console.log(__APP_CONFIG__);

// set locale and initiate setLocale related vars
setLocale(__APP_CONFIG__.DEFAULT_LOCALE);
const f7params = {
  name: __APP_CONFIG__.APP_TITLE,
  swipeBack: false,
  routes,
  view: {
    browserHistory: true,
    browserHistorySeparator: "#app",
    browserHistoryInitialMatch: true,
  },
  dialog: {
    title: __APP_CONFIG__.APP_TITLE,
    buttonOk: t('dialog.OK'),
    buttonCancel: t('dialog.cancel'),
  },
  darkTheme: true
}


</script>

<template>
  <f7-app v-bind="f7params">
    <f7-panel v-if="sidePanelState" left reveal dark :visible-breakpoint="1024">
      <LeftPanel />
    </f7-panel>
    <f7-view main class="safe-areas" url="/" />
  </f7-app>
</template>

<style scoped></style>