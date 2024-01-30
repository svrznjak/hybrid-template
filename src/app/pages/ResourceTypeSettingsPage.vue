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
import { f7 } from 'framework7-vue';
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


const currentResourceType = ref();

const typeFields = computed(() => {
  if (currentResourceType.value && currentResourceType.value.data) {
    return JSON.parse(currentResourceType.value.data.typeFields);
  }
  return [];
})



onMounted(async () => {
  currentResourceType.value = await useDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId)
});

onUnmounted(async () => {
  await unsubscribeFromDocument('/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId);
});


const isAddMode = ref(false);

function editName() {
  f7.dialog.prompt('', t('Vnesite nov naslov'), async (value) => {
    if (value !== null && value !== undefined && value !== "") {
      try {
        f7.dialog.preloader(t('Shranjevanje'));
        await FirebaseFirestore.updateDocument({
          reference: '/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId,
          data: { name: value }
        });
        f7.dialog.close();
      } catch (e) {
        f7.dialog.close();
        f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
        console.log(e)
      }
    }
  });
}

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
        <f7-button @click="editName" style="width:fit-content;"><f7-icon f7="pencil"></f7-icon></f7-button>
      </div>
      <p style=" margin-bottom: 20px">{{ currentResourceType.data ? currentResourceType.data.description : "" }}</p>
    </f7-block>
    <f7-list media-list v-if="typeFields !== undefined" inset dividers strong-ios outline class="fix-inset">
      <f7-list-item v-for="typeField in typeFields" :key="typeField.id" :title="typeField.name">
        <span style="font-size: 13px;">{{ t('Oblika polja') }}: {{ typeField.type }}</span><br />
        <span style="font-size: 13px;">{{ t('Zahteve') }}: {{ typeField.rules }}</span>
        <template #after>
          <f7-button style="height: 20px;" @click="console.log('asd')">Uredi</f7-button>
        </template>
      </f7-list-item>
    </f7-list>
    <f7-block>
      <f7-button fill round-md>{{ t('Dodaj polje') }}</f7-button>
    </f7-block>
  </f7-page>
</template>
<style></style>