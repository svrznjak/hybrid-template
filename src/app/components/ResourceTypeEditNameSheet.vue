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
import { ref } from 'vue';
appState.dispatch('setSidePanel', false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  documentPath: {
    type: String,
    required: true
  },
  fields: { // vue proptype array of objects
    type: Object,
    required: true
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  name.setValue(props.fields.name)
  description.setValue(props.fields.description)
  emit('close');
}
console.log(props);


const { handleSubmit } = useForm({
  initialValues: {
    name: props.fields.name,
    description: props.fields.description
  }
});
const name = useField('name', 'required', { label: t('Ime') });
const description = useField('description', '', { label: t('Opis') });
console.log(props.fields)
const isActive = ref(props.fields.isActive);
const saveNameAndDescription = handleSubmit(async values => {
  try {
    f7.dialog.preloader(t('Shranjevanje'));
    await FirebaseFirestore.updateDocument({
      reference: props.documentPath,
      data: {
        ...values,
        isActive: isActive.value
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
        <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
          <h1 style="margin-bottom: 0;">{{ t('Urejanje imena in opisa') }}</h1>
          <f7-toggle color=" green" v-model:checked="isActive"></f7-toggle>
        </f7-block>
        <hr />
        <f7-list form @submit="saveNameAndDescription">
          <FieldListInput :name="t('Ime')" :label="t('Ime')" type="text" outline :placeholder="t('Ime vrste')"
            :field="name" @input="name.value.value = $event.target.value" clear-button />
          <FieldListInput :name="t('Opis')" :label="t('Opis')" outline type="textarea" :placeholder="t('Opis')"
            :field="description" @input="description.value.value = $event.target.value" clear-button />
          <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
            <f7-button round-md @click="close">{{ t('Prekliči') }}</f7-button>
            <f7-button fill round style="width: 150px;" type="submit">{{ t('Shrani') }}</f7-button>
          </f7-block>
        </f7-list>
      </div>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>