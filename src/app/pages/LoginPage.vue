
<script setup lang="ts">
import appState from '@/appState';
import { f7ready, f7ListInput } from 'framework7-vue';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { Form, useForm, useField } from 'vee-validate';

onMounted(() => {
  console.log('Home page mounted');
  f7ready((f7) => {
    console.log('Home page f7ready');
    f7.panel.close();
  });
  nextTick(() => {
    mounted.value = true;
  });
});

const mounted = ref(false)


const { handleSubmit } = useForm({
  initialValues: {
    email: 'test',
    gender: 'Male',
    password: '',
  },
});
const email = useField('email', 'required|email', { validateOnValueUpdate: false });
const gender = useField('gender');
const password = useField('password', 'required|min:8');


const doLogin = handleSubmit(async values => {
  alert(JSON.stringify(values, null, 2));
  /*try {
    const auth: any = getAuth();
    await setPersistence(auth, browserLocalPersistence);
    await FirebaseAuthentication.signInWithEmailAndPassword({
      email: values.email, password: values.password
    });
  } catch (err) {
    console.log(err);
  }*/
});


</script>
<template>
  <f7-page name="login">
    <f7-block>
      <h1>Login</h1>
      <p>Here comes paragraph within content block. Donec et nulla auctor massa pharetra adipiscing ut sit amet sem.
        Suspendisse molestie velit vitae mattis tincidunt. Ut sit amet quam mollis, vulputate turpis vel, sagittis
        felis. </p>
    </f7-block>
    <Form @submit="doLogin()">
      <f7-list dividers-ios strong-ios inset-ios>
        <FieldListInput name="email" label="E-mail" type="email" placeholder="Your name" :field="email"
          @input="email.value.value = $event.target.value" clear-button />
        <FieldListInput name="gender" label="Gender" type="select" :field="gender"
          @input="gender.value.value = $event.target.value" clear-button>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </FieldListInput>

        <FieldListInput name="password" label="Password" type="password" placeholder="Your password" :field="password"
          @input="password.value.value = $event.target.value" clear-button />
      </f7-list>
      <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
        <f7-button round-md>Forgot my password</f7-button>
        <f7-button fill round style="width: 100px;" type="submit">Login</f7-button>
      </f7-block>
    </Form>
  </f7-page>
</template>