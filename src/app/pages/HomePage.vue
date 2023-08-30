<script setup lang="ts">
import appState from '@/appState';
import { f7ready } from 'framework7-vue';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Home page mounted');
  f7ready((f7) => {
    console.log('Home page f7ready');
  });
});
console.log(appState)
</script>
<template>
  <f7-page name="home">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-md="material:menu" panelOpen="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>Home</f7-nav-title>
    </f7-navbar>
    <f7-button fill>Button</f7-button>
    <f7-link href="/asd/">About Page</f7-link>

  </f7-page>
</template>