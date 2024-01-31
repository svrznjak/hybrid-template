<script setup lang="ts">
import appState from '@/appState';
import { onMounted, onUnmounted, ref } from 'vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { unsubscribeFromCollection, useCollection } from "../store/useCollection";
import ResourceTypeAddSheet from '../components/ResourceTypeAddSheet.vue';
appState.dispatch('setSidePanel', false);

const props = defineProps({
  companyId: {
    type: String,
    required: true
  }
})
console.log(props)


const resourceTypes = ref();

onMounted(async () => {
  resourceTypes.value = (await useCollection('/Companies/' + props.companyId + "/resourceTypes"));
});

onUnmounted(async () => {
  unsubscribeFromCollection('/Companies/' + props.companyId + "/resourceTypes");
});


const isOpenAddNew = ref(false);

</script>
<template>
  <f7-page name="resourceTypes">
    <f7-navbar style="z-index: 100;" back-link :title="t('Nazaj na projekte')">
    </f7-navbar>
    <f7-block style="display: flex; gap: 10px;  justify-content: space-between;">
      <h1 style="margin-bottom: 0px">{{ t('Vrste virov') }}</h1>
      <div style="display: flex; gap: 10px;">
        <f7-button fill round style="width: fit-content;" @click="isOpenAddNew = true">{{ t('Nova vrsta vira')
        }}</f7-button>
      </div>
    </f7-block>
    <f7-list dividers strong-ios outline-ios v-if="resourceTypes !== undefined" class="fix-inset">
      <f7-list-item v-for="resourceType in resourceTypes.data" :key="resourceType.id"
        :link="`${resourceType.id}/resources`" :title="resourceType.name">
      </f7-list-item>
    </f7-list>
    <ResourceTypeAddSheet :collectionPath="'/Companies/' + props.companyId + '/resourceTypes/'" :isOpen="isOpenAddNew"
      @close="isOpenAddNew = false" />
  </f7-page>
</template>
<style></style>