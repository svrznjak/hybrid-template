<script setup lang="ts">
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import appState from '@/appState';
import { onMounted, onUnmounted, ref } from 'vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
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


const currentResourceType = ref<any>(null);

const resources = ref<any>([]);
const resourcesListenerId = ref<any>(null);

onMounted(async () => {
  currentResourceType.value = (await FirebaseFirestore.getDocument({
    reference: '/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId,
  })).snapshot;
  console.log(currentResourceType.value)
  currentResourceType.value = {
    id: currentResourceType.value.id,
    ...currentResourceType.value.data
  }

  resourcesListenerId.value = await FirebaseFirestore.addCollectionSnapshotListener(
    {
      reference: '/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId + "/resources",
    },
    (event: any, error: any) => {
      if (error) {
        console.error(error);
      } else {
        resources.value = event.snapshots.map((snap: any) => {
          return {
            id: snap.id,
            ...snap.data,
          };
        })
      }
    }
  );
});

onUnmounted(async () => {
  /*await FirebaseFirestore.removeSnapshotListener({
    callbackId: resourcesListenerId.value,
  });*/
});

</script>
<template>
  <f7-page name="resources">
    <f7-navbar back-link :title="t('Nazaj na vrste virov')">
    </f7-navbar>
    <f7-block style="display: flex; gap: 10px;  justify-content: space-between;">
      <h1 style="margin-bottom: 0px">{{ currentResourceType ? currentResourceType.name : "" }}</h1>
      <div style="display: flex; gap: 10px;">
        <f7-button fill round style="width: fit-content;" @click="console.log('asd')">{{ t('Dodaj')
        }}</f7-button>
      </div>
    </f7-block>
    <f7-list dividers-md dividers-ios strong-ios outline-ios>
      <f7-list-item v-for="resource in resources" :key="resource.id" :link="`${resource.id}`" :title="resource.name">
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<style></style>