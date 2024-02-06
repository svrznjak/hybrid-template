<script setup lang="ts">
import appState from '@/appState';
import { ref, type PropType, reactive } from 'vue';
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

const initialValues: any = {};

props.fields.forEach((field: any) => {
  if (field.type.input === 'checkbox') {
    initialValues[field.id] = field.value || {};
  }
  else
    if (field.type.input === 'toggle') initialValues[field.id] = field.value || false;
    else initialValues[field.id] = field.value || '';
});

const { handleSubmit } = useForm({
  initialValues
});
const inputFields: any = {};


const arrayOfCheckboxes: any = [];

props.fields.forEach((field: any) => {
  if (field.id === 'isActive') return;
  if (field.type.input === 'checkbox') {
    arrayOfCheckboxes.push(field.id);
    inputFields[field.id] = reactive({
    });

    field.type.options.split(';').forEach((option: any) => {
      inputFields[field.id][option] = false;
    });

    for (const initialValueKey in initialValues[field.id]) {
      inputFields[field.id][initialValueKey] = initialValues[field.id][initialValueKey]
    }
  } else {
    inputFields[field.id] = useField(field.id, field.rules, { validateOnValueUpdate: false, label: field.name });
  }
});


const isActive = ref(getFieldById('isActive')?.value);

const saveResource = handleSubmit(async values => {
  try {
    f7.dialog.preloader(t('Shranjevanje'));
    // add checkboxes to values
    arrayOfCheckboxes.forEach((checkboxKey: any) => {
      values[checkboxKey] = inputFields[checkboxKey];
    })

    if (props.documentPath === undefined && props.collectionPath !== undefined) {
      await FirebaseFirestore.addDocument({
        reference: props.collectionPath,
        data: { ...values, isActive: isActive.value }
      });
    } else if (props.documentPath !== undefined && props.collectionPath === undefined) {
      await FirebaseFirestore.updateDocument({
        reference: props.documentPath,
        data: { ...values, isActive: isActive.value }
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

function getFieldById(id: string | number): any {
  return props.fields.find((field: any) => field.id == id.toString());
}

</script>
<template>
  <f7-sheet :opened="isOpen" backdrop :close-by-backdrop-click="false" :close-by-outside-click="false"
    style="height: 90%;">
    <f7-page-content>
      <div>
        <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
          <h1 style="margin-bottom: 0;">{{ t('Podatki vira') }}</h1>
          <f7-toggle color="green" v-model:checked="isActive"></f7-toggle>
        </f7-block>
        <hr />
        <f7-list form dividers @submit="saveResource">
          <template v-for="field, index of inputFields" :key="field.id">
            <FieldListInput
              v-if="getFieldById(index)?.type.input !== 'checkbox' && getFieldById(index)?.type.input !== 'toggle'"
              :type="getFieldById(index)?.type.input || 'text'" :label="getFieldById(index)?.name || ''" :field="field"
              @input="field.value.value = $event.target.value" outline>
              <option v-if="getFieldById(index)?.type.input === 'select'"
                v-for="option of getFieldById(index)?.type.options.split(';') || []" :key="option" :value="option">{{
                  option }}</option>
            </FieldListInput>
            <f7-list v-if="getFieldById(index)?.type.input === 'checkbox'" outline inset
              style="margin-bottom:10px; margin-top: 10px">
              <f7-list-item style="margin-left: -30px" checkbox v-model:checked="field[option]"
                v-for="option, i of getFieldById(index)?.type.options.split(';') || []" :title="option"></f7-list-item>
            </f7-list>
            <f7-list-item v-if="getFieldById(index)?.type.input === 'toggle'" outline inset>
              <span>{{ getFieldById(index)?.name }}</span>
              <f7-toggle v-model:checked="field.value.value"></f7-toggle>
            </f7-list-item>
          </template>
          <hr />
          <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
            <f7-button round-md @click="$emit('close')">{{ t('Prekliči') }}</f7-button>
            <f7-button fill round style="width: 150px;" type="submit">{{ t('Shrani') }}</f7-button>
          </f7-block>
        </f7-list>
      </div>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>