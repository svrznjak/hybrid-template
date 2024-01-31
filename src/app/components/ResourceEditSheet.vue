<script setup lang="ts">
import appState from '@/appState';
import { type PropType } from 'vue';
import messages from '../pages/HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { useField, useForm } from 'vee-validate';
import FieldListInput from '@/global/components/FieldListInput.vue';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { f7 } from 'framework7-vue';
appState.dispatch('setSidePanel', false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  documentPath: {
    type: String,
  },
  collectionPath: {
    type: String,
  },
  fields: { // vue proptype array of objects
    type: Array as PropType<Object[]>,
    required: true
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()


const initialValues = {};

props.fields.forEach(field => {
  initialValues[field.id] = field.value || '';
});

const { handleSubmit } = useForm({
  initialValues
});
const inputFields: any = {};

console.log(props.fields)

for (const field of props.fields) {
  inputFields[field.id] = useField(field.id, field.rules, { validateOnValueUpdate: false, label: field.name });
}
console.log(inputFields)


const saveResource = handleSubmit(async values => {
  try {
    f7.dialog.preloader(t('Shranjevanje'));
    if (props.documentPath === undefined && props.collectionPath !== undefined) {
      await FirebaseFirestore.addDocument({
        reference: props.collectionPath,
        data: values
      });
    } else if (props.documentPath !== undefined && props.collectionPath === undefined) {
      await FirebaseFirestore.updateDocument({
        reference: props.documentPath,
        data: values
      });
    }
    f7.dialog.close();
    emit('close');
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
});


function getFieldById(id: number) {
  return props.fields.find(field => field.id == id.toString());
}

</script>
<template>
  <f7-sheet :opened="isOpen" backdrop :close-by-backdrop-click="false" :close-by-outside-click="false"
    style="height: 80%;">
    <f7-page-content>
      <f7-block>
        <h1>{{ t('Urejanje') }}</h1>
      </f7-block>
      <f7-list form dividers outline-ios @submit="saveResource">
        <span v-for="field, index of inputFields" :key="field.id">
          <FieldListInput v-if="getFieldById(index)?.type.input !== 'checkbox'"
            :type="getFieldById(index)?.type.input || 'text'" :label="getFieldById(index)?.name || ''" :field="field"
            @input="field.value.value = $event.target.value" clear-button>
            <option v-if="getFieldById(index)?.type.input === 'select'"
              v-for="option of getFieldById(index)?.type.options.split(';') || []" :key="option" :value="option">{{
                option }}</option>
          </FieldListInput>
          <f7-block-title v-if="getFieldById(index)?.type.input === 'checkbox'">{{
            getFieldById(index).name }}</f7-block-title>
          <f7-list v-if="getFieldById(index)?.type.input === 'checkbox'" outline inset-md>
            <f7-list-item checkbox v-model:checked="jobIsDone"
              v-for="option of getFieldById(index)?.type.options.split(';') || []" :title="option"></f7-list-item>
          </f7-list>
        </span>
        <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
          <f7-button round-md @click="$emit('close')">{{ t('Prekliči') }}</f7-button>
          <f7-button fill round style="width: 150px;" type="submit">{{ t('Shrani') }}</f7-button>
        </f7-block>
      </f7-list>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>