<script setup lang="ts">
import appState from '@/appState';
import messages from '../pages/HomePage.i18n.json';
import { useI18n } from "vue-i18n";
import { computed, watch } from 'vue';

import getDocumentIdFromPath from '../utils/getDocumentIdFromPath';
import getParentDocument from "../utils/getParentReference";
import _ from 'lodash';

const { t } = useI18n({
  messages
});
appState.dispatch('setSidePanel', false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  displayedResources: {
    type: Array<any>,
    required: true
  },
  resourceTypes: {
    type: Array<any>,
    required: true
  }
});

const resourceTypesWithResources = computed(() => {
  return props.resourceTypes.map((resourceType: any) => {
    const resources = props.displayedResources.filter((resource: any) => getDocumentIdFromPath(getParentDocument(resource.path, 2)) === resourceType.id);
    return { ...resourceType, resources };
  })
});

watch(() => resourceTypesWithResources.value, (newValue) => {
  console.log(newValue);
});


function generateCustomFieldsText(resource: any, resourceType: any) {
  let text = "";
  if (resourceType?.typeFields === undefined || !_.isArray(resourceType.typeFields)) return text;
  const displayedCustomFields = resourceType.typeFields.filter((field: any) => field.showInList);
  displayedCustomFields.forEach((field: any, index: any) => {
    if (index > 0) text += " | ";
    if (resource[field.id] !== undefined) {
      if (field.type.input === 'checkbox') {
        const options: any = [];
        for (const option in resource[field.id]) {
          if (resource[field.id][option]) options.push(option);
        }
        text += field.name + ": " + options.join(', ');
      } else if (field.type.input === 'toggle') {
        text += field.name + ": " + (resource[field.id] ? t("Da") : t("Ne"));
      } else if (field.type.input === 'date') {
        text += field.name + ": " + new Date(resource[field.id]).toLocaleDateString();
      }
      else {
        text += field.name + ": " + resource[field.id];
      }
    } else {
      text += field.name + ": " + t("///");
    }
  });
  return text
}

</script>
<template>
  <f7-sheet top :opened="isOpen" container-el='#page-content-search-resoults' :close-by-backdrop-click="false"
    :close-by-outside-click="false" style="height: 100%;">
    <f7-page-content>
      <div style="padding-top:70px">
        <template v-for="resourceType in resourceTypesWithResources" :key="resourceType.id">
          <f7-block-title v-if="resourceType.resources.length > 0">{{ resourceType.name }}</f7-block-title>
          <f7-list media-list dividers strong-ios outline-ios class="fix-inset">
            <f7-list-item v-for="resource in resourceType.resources" :key="resource.id" :link="`${resource.path}`"
              :title="resource.name" :badge="!resource.isActive ? t('Ni aktiven') : undefined"
              :text="generateCustomFieldsText(resource, resourceType)">
            </f7-list-item>
          </f7-list>
        </template>
      </div>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>