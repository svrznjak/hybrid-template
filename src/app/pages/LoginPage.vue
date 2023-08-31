
<script setup lang="ts">
import appState from '@/appState';
import { f7ready } from 'framework7-vue';
import { onMounted } from 'vue';
import { Form } from 'vee-validate';
import AppFormField from '@/global/components/AppFormField.vue';

onMounted(() => {
  console.log('Home page mounted');
  f7ready((f7) => {
    console.log('Home page f7ready');
    f7.panel.close();
  });
});
console.log(appState)
</script>
<template>
  <f7-page name="home">
    <!-- <f7-navbar>
      <f7-nav-left>
        <f7-link icon-ios="f7:chevron_left" icon-md="material:menu" panelOpen="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>Home</f7-nav-title>
      <f7-nav-right>
        <f7-button md-round large>Save</f7-button>
      </f7-nav-right>
    </f7-navbar> -->
    <f7-block>
      <h1>Login</h1>
      <p>Here comes paragraph within content block. Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam mollis, vulputate turpis vel, sagittis
        felis. </p>
    </f7-block>
    <form>
      <f7-list dividers-ios strong-ios inset-ios>
        <f7-list-input label="E-mail" type="text" placeholder="Your name" clear-button />
        <f7-list-input label="Password" type="password" placeholder="Your password" clear-button />
      </f7-list>
      <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
        <f7-button round-md>Forgot my password</f7-button>
        <f7-button fill round style="width: 100px;">Login</f7-button>
      </f7-block>
    </form>
  </f7-page>
</template>