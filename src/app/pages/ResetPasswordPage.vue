<script setup lang="ts">
import { Form, useForm, useField } from 'vee-validate';
import appState from '@/appState';
import { f7, theme } from 'framework7-vue';
import { sendPasswordResetEmailToUser } from '@/global/utils/userHelpers';
import { useI18n } from 'vue-i18n';
import messages from './ResetPasswordPage.i18n.json';
const { t } = useI18n({
  messages
});
appState.dispatch('setSidePanel', false);

const { handleSubmit } = useForm({
  initialValues: {
    email: '',
  },
});

const sendPasswordResetEmail = handleSubmit(async values => {
  sendPasswordResetEmailToUser(values.email, t);
});

const email = useField('email', 'required|email', { validateOnValueUpdate: false, label: t('email') });


function routeToLogin() {
  const router = f7.view.main.router;
  if (router.previousRoute.name === 'emailLogin') {
    router.back();
  } else {
    router.navigate({ name: 'emailLogin' });
  }
}

</script>
<template>
  <f7-page name="resetPassword">
    <div>
      <f7-block>
        <h1>{{ t('reset-password') }}</h1>
        <p>{{ t('description') }} </p>
      </f7-block>
      <Form @submit="sendPasswordResetEmail()">
        <f7-list dividers-ios strong-ios inset-ios>
          <FieldListInput :name="t('email')" :label="t('email')" type="email" :outline="theme.md"
            :placeholder="t('your-email')" :field="email" @input="email.value.value = $event.target.value" clear-button />
        </f7-list>
        <f7-block style="display: flex; gap: 10px; justify-content: space-between; flex-wrap: wrap-reverse;">
          <f7-button round-md @click="routeToLogin">{{ t('back-to-login') }}</f7-button>
          <f7-button fill round style="width: fit-content;" type="submit">{{ t('send-reset-link') }}</f7-button>
        </f7-block>
      </Form>
    </div>
  </f7-page>
</template>