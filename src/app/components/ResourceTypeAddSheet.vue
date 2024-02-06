<script setup lang="ts">
import appState from '@/appState';
import messages from '../pages/HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { useField, useForm } from 'vee-validate';
import FieldListInput from '@/global/components/FieldListInput.vue';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { f7, theme } from 'framework7-vue';
appState.dispatch('setSidePanel', false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  collectionPath: {
    type: String,
    required: true
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()


const { handleSubmit } = useForm({
  initialValues: {
    name: '',
    description: ''
  }
});
const name = useField('name', 'required', { label: t('Ime') });
const description = useField('description', '', { label: t('Opis') });
const saveNameAndDescription = handleSubmit(async values => {
  try {
    f7.dialog.preloader(t('Shranjevanje'));
    await FirebaseFirestore.addDocument({
      reference: props.collectionPath,
      data: {
        ...values,
        isActive: true,
        typeFields: [],
      }
    });
    f7.dialog.close();
    emit('close');
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
});

</script>
<template>
  <f7-sheet :opened="isOpen" backdrop :close-by-backdrop-click="false" :close-by-outside-click="false"
    style="height: 80%;">
    <f7-page-content>
      <div>
        <f7-block>
          <h1>{{ t('Dodajanje nove vrste vira') }}</h1>
        </f7-block>
        <f7-list form dividers-ios strong-ios outline-ios @submit="saveNameAndDescription">
          <FieldListInput :name="t('Ime')" :label="t('Ime')" type="text" outline :placeholder="t('Ime vrste')"
            :field="name" @input="name.value.value = $event.target.value" />
          <FieldListInput :name="t('Opis')" :label="t('Opis')" outline type="textarea" :placeholder="t('Opis')"
            :field="description" @input="description.value.value = $event.target.value" />
          <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
            <f7-button round-md @click="emit('close')">{{ t('Prekliči') }}</f7-button>
            <f7-button fill round style="width: 150px;" type="submit">{{ t('Shrani') }}</f7-button>
          </f7-block>
        </f7-list>
      </div>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>