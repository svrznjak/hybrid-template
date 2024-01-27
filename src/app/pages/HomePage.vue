<script setup lang="ts">
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import appState from '@/appState';
import { f7ready } from 'framework7-vue';
import { onMounted } from 'vue';

onMounted(() => {
  f7ready((f7) => {
    appState.dispatch('setSidePanel', true);
    console.log('Home page f7ready');
    f7.panel.close();
  });
});
console.log(appState);

async function logOut() {
  try {
    await FirebaseAuthentication.signOut();
  } catch (err) {

    console.log(err);
  }
}

</script>
<template>
  <f7-page name="home">
    <f7-block>
      <h1>home</h1>
      <p>Here comes paragraph within content block. Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam mollis, vulputate turpis vel, sagittis
        felis. </p>
    </f7-block>
    <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
      <f7-button fill round style="width: 100px;" @click="logOut()">Logout</f7-button>
    </f7-block>
  </f7-page>
</template>