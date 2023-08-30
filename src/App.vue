<script setup lang="ts">
import { f7App, f7View, f7Panel, f7Page, f7Navbar, f7Block, useStore } from 'framework7-vue';
import routes from '@/app/routes';
import appState from './appState';
const sidePanelState = useStore(appState, 'getSidePanelState');
console.log(__APP_CONFIG__);

const f7params = {
  name: __APP_CONFIG__.APP_TITLE,
  routes,
}
console.log(sidePanelState.value)


</script>

<template>
  <f7App v-bind="f7params">

    <f7Panel v-if="sidePanelState" left reveal dark :visible-breakpoint="1024">
      <f7View>
        <f7Page>
          <f7Navbar title="Left Panel"></f7Navbar>
          <f7Block>Left panel content goes here</f7Block>
        </f7Page>
      </f7View>
    </f7Panel>
    <f7View main url="/" />
  </f7App>
</template>

<style scoped></style>