<script setup lang="ts">
import appState from '@/appState';
import messages from '../pages/HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { f7, } from 'framework7-vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { unsubscribeFromCollection, useCollection } from '../store/useCollection';
import getParentReference from '../utils/getParentReference';
appState.dispatch('setSidePanel', false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  projectInfo: {
    type: Object,
    required: true
  },
  projectDocumentPath: {
    type: String,
    required: true
  },
  resourceTypePath: {
    type: String,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const allResources = ref();

watch(() => props.resourceTypePath, async (newValue, oldValue) => {
  console.log(newValue + "/resources")
  await unsubscribeFromCollection(oldValue + "/resources");
  allResources.value = await useCollection(newValue + "/resources");
});


async function addResource(documentId: string) {
  try {
    f7.dialog.preloader(t('Ustvarjanje projekta'));
    await FirebaseFirestore.updateDocument({
      reference: props.projectDocumentPath,
      data: {
        selectedResources: [...props.projectInfo.selectedResources, props.resourceTypePath + "/resources/" + documentId]
      }
    });
    f7.dialog.close();
    emit('close');
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
};

</script>
<template>
  <f7-sheet :opened="isOpen && resourceTypePath !== undefined" backdrop :close-by-backdrop-click="false"
    :close-by-outside-click="false" style="height: 90%;">
    <f7-page-content>
      <f7-block>
        <h1>{{ t('Dodajanje virov') }}</h1>
      </f7-block>
      <f7-list dividers-ios strong-ios outline-ios>
        <f7-list-item v-for="resource in allResources?.data" :key="resource.id" :title="resource.name"
          :link="`#${resource.id}`" @click="addResource(resource.id)"></f7-list-item>
        <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
          <f7-button fill round style="width: 150px;" @click="emit('close')">{{ t('Zaključi dodajanje') }}</f7-button>
        </f7-block>
      </f7-list>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>