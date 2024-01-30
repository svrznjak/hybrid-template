<script setup lang="ts">
import appState from '@/appState';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { signOut } from '@/global/utils/userHelpers';

import { f7ready, f7 } from 'framework7-vue';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import messages from './VerifyEmailPage.i18n.json';
const { t } = useI18n({
  messages
});

appState.dispatch('setSidePanel', false);
const router = f7.views.main.router;

const currentUser = ref<any>('');


onMounted(async () => {
  currentUser.value = (await FirebaseAuthentication.getCurrentUser()).user;
  console.log(currentUser.value)
  if (!currentUser.value?.emailVerified) {
    let checker = setInterval(async () => {
      await FirebaseAuthentication.reload();
      if ((await FirebaseAuthentication.getCurrentUser()).user?.emailVerified) {
        clearInterval(checker);
        router.navigate('/')
      }
    }, 3000);
  }
});



async function sendEmailVerification() {
  f7.dialog.preloader()
  try {
    await FirebaseAuthentication.sendEmailVerification()
    f7.dialog.close()
    f7.dialog.alert('Verification email sent')
  } catch (e) {
    f7.dialog.alert('Error sending verification email')
  }
};

</script>
<template>
  <f7-page name="verifyEmail">
    <f7-block>
      <h1
        style="font-size: 24px; margin-top: 30px; margin-bottom: 10px; padding-bottom:30px; text-align:center; border-bottom: 1px solid var(--borderColor);">
        {{ t('email-verification') }}
      </h1>
      <p v-html="t('email-verification-sent', { email: currentUser!.email })"></p>
    </f7-block>
    <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
      <f7-button round-md @click="signOut">{{ t('sign-out') }}</f7-button>
      <f7-button fill round style="width: 100px;" type="button" @click="sendEmailVerification">{{
        t('resend-verification-email') }}</f7-button>
    </f7-block>
  </f7-page>
</template>