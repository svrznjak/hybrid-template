
<script setup lang="ts">
import { signInWithEmailAndPassword } from '@/global/utils/userHelpers';
import { theme } from 'framework7-vue';
import { Form, useForm, useField } from 'vee-validate';
import appState from '@/appState';
import { useI18n } from 'vue-i18n';
import messages from './EmailLoginPage.i18n.json';
const { t } = useI18n({
  messages
});
appState.dispatch('setSidePanel', false);

const { handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
});
const email = useField('email', 'required|email', { validateOnValueUpdate: false, label: t('email') });
const password = useField('password', 'required|min:8', { label: t('password') });


const doLogin = handleSubmit(async values => {
  signInWithEmailAndPassword(values.email, values.password, t);
});

</script>
<template>
  <f7-page name="login">
    <f7-block>
      <h1>{{ t('login') }}</h1>
      <p>{{ t('description') }} </p>
    </f7-block>
    <Form @submit="doLogin()">
      <f7-list dividers-ios strong-ios inset-ios>
        <FieldListInput :name="t('email')" :label="t('email')" type="email" :outline="theme.md"
          :placeholder="t('your-email')" :field="email" @input="email.value.value = $event.target.value" clear-button />
        <FieldListInput :name="t('password')" :label="t('password')" :outline="theme.md" type="password"
          :placeholder="t('your-password')" :field="password" @input="password.value.value = $event.target.value"
          clear-button />
      </f7-list>
      <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
        <f7-button round-md @click="$router.navigate({ name: 'resetPassword' })">{{ t('forgot-password') }}</f7-button>
        <f7-button fill round style="width: 150px;" type="submit">{{ t('login') }}</f7-button>
      </f7-block>
    </Form>
  </f7-page>
</template>