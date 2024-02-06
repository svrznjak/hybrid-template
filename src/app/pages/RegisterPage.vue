<script setup lang="ts">
import { signUpWithEmailAndPassword } from '@/global/utils/userHelpers';
import { f7, theme } from 'framework7-vue';
import { Form, useForm, useField } from 'vee-validate';
import appState from '@/appState';
import { useI18n } from 'vue-i18n';
import messages from './RegisterPage.i18n.json';
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
const email = useField('email', 'required|email', { label: t('email'), validateOnValueUpdate: false });
const password = useField('password', 'required|min:8', { label: t('password') });

const doRegister = handleSubmit(async values => {
  signUpWithEmailAndPassword(values.email, values.password, t);
});

function routeToWelcome() {
  const router = f7.view.main.router;
  if (router.previousRoute.name === 'welcome') {
    router.back();
  } else {
    router.navigate({ name: 'welcome' });
  }
}
</script>
<template>
  <f7-page name="register">
    <div>
      <f7-block>
        <h1>{{ t('register') }}</h1>
        <p>{{ t(`description`) }} </p>
      </f7-block>
      <Form @submit="doRegister()">
        <f7-list dividers-ios strong-ios inset-ios>
          <FieldListInput :name="t('email')" :label="t('email')" type="email" :placeholder="t('your-email')"
            :field="email" @input="email.value.value = $event.target.value" :outline="theme.md" clear-button />
          <FieldListInput :name="t('password')" :label="t('password')" type="password" :placeholder="t('your-password')"
            :field="password" @input="password.value.value = $event.target.value" :outline="theme.md" clear-button />
        </f7-list>
        <f7-block style="display: flex; gap: 10px; justify-content: space-between; flex-wrap: wrap-reverse;">
          <f7-button round-md @click="routeToWelcome">{{ t('cancel') }}</f7-button>
          <f7-button fill round style="width: fit-content;" type="submit">{{ t('register') }}</f7-button>
        </f7-block>
      </Form>
    </div>
  </f7-page>
</template>