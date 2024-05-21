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
import { f7 } from 'framework7-vue';
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
  projectInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'close'): void
}>()


const { handleSubmit } = useForm({
  initialValues: {
    name: props.projectInfo.name || '',
    customerName: props.projectInfo.customerName || '',
    fromDate: props.projectInfo.fromDate || '',
    toDate: props.projectInfo.toDate || '',
  }
});
const name = useField('name', 'required', { label: t('Ime') });
const customerName = useField('customerName', '', { label: t('Ime Stranke') });
const fromDate = useField('fromDate', 'required', { label: t('Od') });
const toDate = useField('toDate', 'required', { label: t('Do') });


const saveInfo = handleSubmit(async values => {
  try {
    f7.dialog.preloader(t('Ustvarjanje projekta'));
    await FirebaseFirestore.updateDocument({
      reference: props.documentPath,
      data: {
        ...values,
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
    style="height: 98%;">
    <f7-page-content>
      <div>
        <f7-block>
          <h1>{{ t('Urejanje informacij projekta') }}</h1>
        </f7-block>
        <f7-list form dividers @submit="saveInfo">
          <FieldListInput :name="t('Ime')" :label="t('Ime')" type="text" outline :placeholder="t('Ime vrste')"
            :field="name" @input="name.value.value = $event.target.value" />
          <FieldListInput :name="t('Ime Stranke')" :label="t('Ime Stranke')" type="text" outline
            :placeholder="t('Ime Stranke')" :field="customerName"
            @input="customerName.value.value = $event.target.value" />
          <FieldListInput :name="t('Od')" :label="t('Od')" outline type="date" :placeholder="t('Od')" :field="fromDate"
            @input="fromDate.value.value = $event.target.value" />
          <FieldListInput :name="t('Do')" :label="t('Do')" outline type="date" :placeholder="t('Do')" :field="toDate"
            @input="toDate.value.value = $event.target.value" />
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