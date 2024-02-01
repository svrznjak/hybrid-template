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
import { useCollection, unsubscribeFromCollection } from '../store/useCollection';
appState.dispatch('setSidePanel', false);

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

const resources = ref();

onMounted(async () => {
  currentResourceType.value = await useDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId)
  resources.value = await useCollection('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId + "/resources")
});

onUnmounted(async () => {
  await unsubscribeFromDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId);
  await unsubscribeFromCollection('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId + "/resources");
});

const allFields = computed(() => {
  if (currentResourceType.value && currentResourceType.value.data && currentResourceType.value.data.typeFields && currentResourceType.value.data.typeFields.length > 0) {
    const resourceTypeFields = currentResourceType.value.data.typeFields;
    const customFields = [];
    for (const field of resourceTypeFields) {
      customFields.push({
        id: field.id,
        name: field.name,
        value: '',
        rules: field.rules,
        type: field.type,
        showInList: field.showInList,
      });
    }
    console.log(customFields)
    return [{
      id: "name",
      name: "Ime",
      rules: "required",
      type: {
        input: "text",
        options: []
      },
      value: '',
    }, {
      id: "isActive",
      name: "Aktiven",
      rules: "",
      type: {
        input: "toggle",
        options: []
      },
      value: true,
    }, ...customFields];
  }
  return [];
});

const displayedCustomFields = computed(() => {
  return allFields.value.filter(field => field.showInList);
});

function generateCustomFieldsText(resource) {
  let text = "";
  console.log(resource)
  console.log(displayedCustomFields.value)
  displayedCustomFields.value.forEach(field => {
    if (resource[field.id] !== undefined) {
      if (field.type.input === 'checkbox') {
        const options = [];
        for (const option in resource[field.id]) {
          if (resource[field.id][option]) options.push(option);
        }
        text += field.name + ": " + options.join(', ') + " | ";
      } else if (field.type.input === 'toggle') {
        text += field.name + ": " + (resource[field.id] ? t("Da") : t("Ne")) + " | ";
      } else if (field.type.input.type === 'date') {
        text += field.name + ": " + new Date(resource[field.id]).toLocaleDateString() + " | ";
      }
      else {
        text += field.name + ": " + resource[field.id] + " | ";
      }
    } else {
      text += field.name + ": " + t("///") + " | ";
    }
  });
  return text
}

const isAddMode = ref(false);

</script>
<template>
  <f7-page name="resources">
    <f7-navbar back-link :title="t('Nazaj na vrste virov')">
    </f7-navbar>
    <f7-block style="display: flex; gap: 10px;  justify-content: space-between; flex-wrap: wrap;"
      v-if="currentResourceType">
      <h1 style="margin-bottom: 0px">{{ currentResourceType.data ? currentResourceType.data.name : "" }} <f7-chip
          v-if="currentResourceType.data !== undefined && !currentResourceType.data.isActive">{{ t('Ni aktiven')
          }}</f7-chip></h1>
      <div style="display: flex; gap: 10px;">
        <f7-button outline round style="width: fit-content;"
          @click="$router.navigate('/Companies/' + props.companyId + '/resourceTypes/' + props.resourceTypeId + '/settings/')"><f7-icon
            f7="gear" size="25"></f7-icon></f7-button>
        <f7-button fill round style="width: fit-content;" @click="isAddMode = true">{{ t('Dodaj')
        }}</f7-button>
      </div>
    </f7-block>
    <f7-list media-list dividers strong-ios outline-ios v-if="resources">
      <f7-list-item v-for="resource in resources.data" :key="resource.id" :link="`${resource.id}`" :title="resource.name"
        :badge="!resource.isActive ? t('Ni aktiven') : undefined">
        <span style="font-size:13px">{{ generateCustomFieldsText(resource) }}</span>
      </f7-list-item>
    </f7-list>
    <ResourceEditSheet v-if="allFields.length > 0"
      :collectionPath="'/Companies/' + props.companyId + '/resourceTypes/' + props.resourceTypeId + '/resources/'"
      :fields="allFields" :isOpen="isAddMode" @close="isAddMode = false" />
  </f7-page>
</template>
<style></style>