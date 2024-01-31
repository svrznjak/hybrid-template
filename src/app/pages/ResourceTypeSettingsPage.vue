<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import ResourceTypeEditSheet from '../components/ResourceTypeEditSheet.vue';
import ResourceTypeEditNameSheet from '../components/ResourceTypeEditNameSheet.vue';
import { unsubscribeFromDocument, useDocument } from '../store/useDocument';

const props = defineProps({
  companyId: {
    type: String,
    required: true
  },
  resourceTypeId: {
    type: String,
    required: true
  }
})
console.log(props)


const currentResourceType = ref();

const typeFields = computed(() => {
  if (currentResourceType.value && currentResourceType.value.data) {
    return currentResourceType.value.data.typeFields;
  }
  return [];
})



onMounted(async () => {
  currentResourceType.value = await useDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId)
});

onUnmounted(async () => {
  await unsubscribeFromDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId);
});


// name and description edit
const isOpenNameEdit = ref(false);

const nameAndDescription = computed(() => {
  if (currentResourceType.value && currentResourceType.value.data) {
    return {
      name: currentResourceType.value.data.name,
      description: currentResourceType.value.data.description
    }
  }
  return undefined;
})

// resourceTypeEditSheet
const isEditOpen = ref(false);
const editingFieldId = ref<undefined | string>(undefined);


</script>
<template>
  <f7-page name="resourcesTypeSettings">
    <f7-navbar back-link :title="t('Nazaj na vire')">
    </f7-navbar>
    <f7-block v-if="currentResourceType" inset outline strong-ios>
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap-reverse;">
        <h1 style="margin-bottom: 0px; ">{{ currentResourceType.data ?
          currentResourceType.data.name : "" }}
        </h1>
        <f7-button @click="isOpenNameEdit = true" style="width:fit-content;"><f7-icon f7="pencil"></f7-icon></f7-button>
      </div>
      <p style=" margin-bottom: 20px">{{ currentResourceType.data ? currentResourceType.data.description : "" }}</p>
    </f7-block>
    <f7-list media-list v-if="typeFields !== undefined" inset dividers strong-ios outline class="fix-inset">
      <f7-list-item v-for="typeField in typeFields" :key="typeField.id" :title="typeField.name">
        <span style="font-size: 13px;">{{ t('Oblika polja') }}: {{ typeField.type }}</span><br />
        <span style="font-size: 13px;">{{ t('Zahteve') }}: {{ typeField.rules }}</span>
        <template #after>
          <f7-button style="height: 20px;"
            @click="() => { editingFieldId = typeField.id; isEditOpen = true }">Uredi</f7-button>
        </template>
      </f7-list-item>
    </f7-list>
    <f7-block>
      <f7-button fill round-md @click="isEditOpen = true">{{ t('Dodaj polje') }}</f7-button>
    </f7-block>
    <ResourceTypeEditNameSheet v-if="nameAndDescription !== undefined"
      :documentPath="'/Companies/' + props.companyId + '/resourceTypes/' + props.resourceTypeId"
      :fields="nameAndDescription" :isOpen="isOpenNameEdit" @close="isOpenNameEdit = false" />
    <ResourceTypeEditSheet :isOpen="isEditOpen"
      :documentPath="'/Companies/' + props.companyId + '/resourceTypes/' + props.resourceTypeId"
      :resource-type-custom-fields="typeFields" :editing-field-id="editingFieldId"
      @close="() => { editingFieldId = undefined; isEditOpen = false }" />
  </f7-page>
</template>
<style></style>