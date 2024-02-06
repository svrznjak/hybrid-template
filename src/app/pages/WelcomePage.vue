<script setup lang="ts">
import appState from '@/appState';
import { useI18n } from 'vue-i18n';
import messages from './WelcomePage.i18n.json';
const { t } = useI18n({
  messages
});

//const router = f7.views.main.router;
appState.dispatch('setSidePanel', false);
</script>
<template>
  <f7-page name="welcome">
    <div>
      <f7-block>
        <h1>{{ t('welcome') }}</h1>
        <p>{{ t(`Here comes paragraph within content block. Donec et nulla auctor massa pharetra adipiscing ut sit amet
          sem.
          Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam mollis, vulputate turpis vel, sagittis
          felis.`) }}</p>

        <f7-button @click="$router.navigate({ name: 'emailLogin' })">{{ t(`Login using email and
          password`) }}</f7-button>
        <f7-button @click="$router.navigate({ name: 'register' })">{{ t('Register using email') }}</f7-button>
      </f7-block>
    </div>
  </f7-page>
</template>