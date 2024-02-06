<script setup lang="ts">
import appState from '@/appState';
import { watch, type PropType, computed } from 'vue';
import messages from '../pages/HomePage.i18n.json';
import { useI18n } from "vue-i18n";
import _ from 'lodash';
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
    required: true
  },
  documentPath: {
    type: String,
    required: true
  },
  resourceTypeCustomFields: { // vue proptype array of objects
    type: Object,
    required: true
  },
  editingFieldId: {
    type: String,
  }
})
const emit = defineEmits<{
  (e: 'close'): void
}>()

function getEditingFieldById(id: string) {
  return props.resourceTypeCustomFields.find(field => field.id == id);
}

watch(() => props.editingFieldId, () => {
  if (props.editingFieldId === undefined) {
    id.setValue('')
    name.setValue('')
    input.setValue('')
    options.setValue('')
    rules.setValue('')
    showInList.setValue(false)
    return;
  }
  id.setValue(getEditingFieldById(props.editingFieldId
  ).id)
  name.setValue(getEditingFieldById(props.editingFieldId
  ).name)
  input.setValue(getEditingFieldById(props.editingFieldId
  ).type.input)
  options.setValue(getEditingFieldById(props.editingFieldId
  ).type.options)
  rules.setValue(getEditingFieldById(props.editingFieldId
  ).rules)
  showInList.setValue(getEditingFieldById(props.editingFieldId
  ).showInList)
})

function close() {
  emit('close');
}

const { handleSubmit } = useForm({
  initialValues: {
    id: '',
    name: '',
    input: '',
    options: '',
    rules: '',
    showInList: false
  }
});

const id = useField('id', 'required|alpha_dash', { label: t('Id polja') });
const name = useField('name', 'required', { label: t('Ime polja') });
const input = useField<string>('input', 'required', { label: t('Oblika polja') });
const options = useField('options', '', { label: t('Možnosti polja') });
const rules = useField('rules', '', { label: t('Pravila polja') });
const showInList: any = useField('showInList', '', { label: t('Prikaži na seznamih') });

const saveResource = handleSubmit(async values => {
  console.log(values)
  const newFieldOptions = {
    id: values.id,
    name: values.name,
    type: {
      input: values.input,
      options: values.options
    },
    rules: values.rules,
    showInList: values.showInList,
  };
  const options = _.clone(props.resourceTypeCustomFields);


  if (props.editingFieldId === undefined) {
    options.push(newFieldOptions);
  } else {
    Object.keys(options).forEach(key => {
      if (options[key].id == newFieldOptions.id) {
        options[key] = newFieldOptions;
      }
    });
  }


  try {
    f7.dialog.preloader(t('Shranjevanje'));
    await FirebaseFirestore.updateDocument({
      reference: props.documentPath,
      data: {
        typeFields: options
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
          <h1>{{ t('Polje vrste vira') }}</h1>
        </f7-block>
        <hr />
        <f7-list form @submit="saveResource">
          <FieldListInput :name="t('Id')" :disabled="props.editingFieldId !== undefined" :label="t('Id polja')"
            type="text" outline inset:placeholder="t('Id polja (npr. stevilka-izkaznice)')" :field="id"
            @input="id.value.value = $event.target.value" />
          <FieldListInput :name="t('Ime')" :label="t('Ime polja')" type="text" outline inset
            :placeholder="t('Ime polja npr. Številka izkaznice')" :field="name"
            @input="name.value.value = $event.target.value" />
          <FieldListInput :name="t('Oblika')" :label="t('Oblika polja')" type="select"
            :disabled="props.editingFieldId !== undefined" outline inset :field="input"
            @input="input.value.value = $event.target.value">
            <option value="text">{{ t('Besedilo') }}</option>
            <option value="textarea">{{ t('Večvrstično besedilo') }}</option>
            <option value="number">{{ t('Številka') }}</option>
            <option value="date">{{ t('Datum') }}</option>
            <option value="select">{{ t('Izbira ene vrednosti') }}</option>
            <option value="checkbox">{{ t('Izbira večih vrednosti') }}</option>
            <option value="toggle">{{ t('Izbira "Da" ali "Ne"') }}</option>
          </FieldListInput>
          <FieldListInput v-if="input.value.value === 'select' || input.value.value === 'checkbox'" :name="t('Možnosti')"
            :label="t('Možnosti polja')" type="text" outline inset
            :placeholder="t('Možnosti polja vnesena s podpičjem. Npr. električar;mehanik;varilec')" :field="options"
            @input="options.value.value = $event.target.value" />
          <FieldListInput
            v-if="input.value.value === 'text' || input.value.value === 'textbox' || input.value.value === 'number'"
            :name="t('Pravila')" :label="t('Pravila polja')" type="text" outline inset
            :placeholder="t('Pravila polja npr. `required|min:8`')" :field="rules"
            @input="rules.value.value = $event.target.value" />
          <f7-list-item style="margin-top:-15px; font-size:12px">
            <a href="https://vee-validate.logaretm.com/v2/guide/rules.html">Navodila za pripravo pravil</a>
          </f7-list-item>
          <f7-list-item>
            <span>{{ t('Prikaži v seznamih') }}</span>
            <f7-toggle v-model:checked="showInList.value.value"></f7-toggle>
          </f7-list-item>
          <hr />
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