<script setup lang="ts">
import { useStore } from 'framework7-vue';
import routes from '@/app/routes';
import appState from './appState';
import LeftPanel from './app/LeftPanel.vue';
const sidePanelState = useStore(appState, 'getSidePanelState');
console.log(__APP_CONFIG__);

const f7params = {
  name: __APP_CONFIG__.APP_TITLE,
  routes,
}
console.log(sidePanelState.value)


</script>

<template>
  <f7-app v-bind="f7params">

    <f7-panel v-if="sidePanelState" left reveal dark :visible-breakpoint="1024">
      <LeftPanel />
    </f7-panel>
    <f7-view main url="/" />
  </f7-app>
</template>

<style scoped></style>