<script setup lang="ts">
import appState from '@/appState';
import { f7Page, f7Navbar, f7Button, f7ready, f7Link, f7NavLeft, f7NavTitle } from 'framework7-vue';
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
  <f7Page name="home">
    <f7Navbar>
      <f7NavLeft>
        <f7Link icon-ios="f7:menu" icon-md="material:menu" panelOpen="left"></f7Link>
      </f7NavLeft>
      <f7NavTitle>Home</f7NavTitle>
    </f7Navbar>
    <f7Button fill>Button</f7Button>
    <f7Link href="/asd/">About Page</f7Link>

  </f7Page>
</template>