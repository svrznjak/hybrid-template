<script setup lang="ts">
import appState from '@/appState';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ResourceEditSheet from '../components/ResourceEditSheet.vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { unsubscribeFromDocument, useDocument } from '../store/useDocument';
appState.dispatch('setSidePanel', false);

const props = defineProps({
  companyId: {
    type: String,
    required: true
  },
  resourceTypeId: {
    type: String,
    required: true
  },
  resourceId: {
    type: String,
    required: true
  }
})


const currentResourceType = ref();
const resource = ref();

const isEditMode = ref(false);

const customFields = computed(() => {
  if (currentResourceType.value && currentResourceType.value.data && resource.value && resource.value.data) {
    const resourceTypeFields = currentResourceType.value.data.typeFields;
    const customFields = [];
    for (const field of resourceTypeFields) {
      customFields.push({
        id: field.id,
        name: field.name,
        value: resource.value.data[field.id],
        rules: field.rules,
        type: field.type
      });
    }
    console.log(customFields)
    return customFields;
  }
  return [];
});

const allFields = computed(() => {
  console.log(resource.value)
  if (resource.value === undefined || resource.value.data === undefined || resource.value.data.name === undefined) return [];
  return [{
    id: "name",
    name: "Ime",
    rules: "required",
    type: "text",
    value: resource.value.data.name,
  }, ...customFields.value];

});


onMounted(async () => {
  currentResourceType.value = await useDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId)
  resource.value = await useDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId + "/resources/" + props.resourceId);
});

onUnmounted(async () => {
  await unsubscribeFromDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId);
  await unsubscribeFromDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId + "/resources/" + props.resourceId);
});


function openEditMode() {
  isEditMode.value = true;
}
function closeEditMode() {
  isEditMode.value = false;
}


</script>
<template>
  <f7-page name="resources">
    <f7-navbar :back-link="currentResourceType ? currentResourceType.data.name : ''"
      :title="currentResourceType ? currentResourceType.data.name : ''">
    </f7-navbar>
    <f7-block style="display: flex; gap: 10px;  justify-content: space-between; flex-wrap: wrap;" v-if="resource">
      <h1 style="margin-bottom: 0px">{{ resource.data ? resource.data.name : "" }}</h1>
      <f7-button fill round style="width: fit-content;" @click="openEditMode"><f7-icon f7="pencil"
          size="25"></f7-icon></f7-button>
    </f7-block>
    <f7-list inset dividers strong-ios outline class="fix-inset">
      <f7-list-item v-for="field of customFields" :key="field.id" :title="field.value" :after="field.name">
      </f7-list-item>
    </f7-list>
    <ResourceEditSheet v-if="allFields.length > 0"
      :documentPath="'/Companies/' + props.companyId + '/resourceTypes/' + props.resourceTypeId + '/resources/' + props.resourceId"
      :fields="allFields" :isOpen="isEditMode" @close="closeEditMode" />
  </f7-page>
</template>
<style></style>