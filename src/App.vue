<script setup lang="ts">
import { f7, useStore } from 'framework7-vue';
import setLocale from '@/global/utils/setLocale';
import routes from '@/app/routes';
import appState from './appState';
import LeftPanel from './app/LeftPanel.vue';
import { useI18n } from 'vue-i18n';
import { onMounted, watch, type WritableComputedRef } from 'vue';
import { useDark } from '@vueuse/core';

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
    //browserHistoryInitialMatch: true,
  },
  dialog: {
    title: __APP_CONFIG__.APP_TITLE,
    buttonOk: t('dialog.OK'),
    buttonCancel: t('dialog.cancel'),
  },
  darkTheme: true,
}

const isDark = useDark();
watch(() => isDark.value, (value) => {
  f7.setDarkMode(value);
});

onMounted(() => {
  f7.setColorTheme("#e4262d");
  f7.setDarkMode(isDark.value);
})
</script>

<template>
  <f7-app v-bind="f7params">
    <f7-panel v-if="sidePanelState" left reveal dark :visible-breakpoint="1024">
      <LeftPanel />
    </f7-panel>
    <f7-view :ios-swipe-back="false" main class="safe-areas" url="/" color-theme="red" />
  </f7-app>
</template>

<style>
/*
:root {
  --f7-primary-color: #000 !important;
  --f7-theme-color: #000 !important;
  --f7-md-surface-2: #efefef !important;
}
*/
</style>