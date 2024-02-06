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
import { f7 } from 'framework7-vue';
import _ from 'lodash';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';

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
      description: currentResourceType.value.data.description,
      isActive: currentResourceType.value.data.isActive
    }
  }
  return undefined;
})

// resourceTypeEditSheet
const isEditOpen = ref(false);
const editingFieldId = ref<undefined | string>(undefined);

function moreOptionsPopup(typeFieldIndex: number) {
  f7.dialog
    .create({
      title: 'Možnosti',
      buttons: [
        {
          text: 'Uredi',
          color: 'blue',
          onClick: () => {
            isEditOpen.value = true;
            editingFieldId.value = typeFields.value[typeFieldIndex].id;
          },
        },
        {
          text: 'Premakni gor',
          color: 'blue',
          onClick: () => {
            moveUp(typeFieldIndex);
          },
        },
        {
          text: 'Premakni dol',
          color: 'blue',
          onClick: () => {
            moveDown(typeFieldIndex);
          },
        },
        {
          text: 'Izbriši',
          color: 'red',
          onClick: () => {
            f7.dialog.confirm(
              'Če želite obnoviti polje in podatke, ki so bili vneseni v to polje, boste morali ročno dodati novo polje z istim id-jem (' + typeFields.value[typeFieldIndex].id + ') in istimi nastavitvami.',
              'Ali ste prepričani, da želite izbrisati to polje?',
              () => {
                deleteField(typeFieldIndex);
              }
            );
          },
        },
        {
          text: 'Prekliči',
          close: true,
          color: 'blue',
        }
      ],
      verticalButtons: true,
    })
    .open();
}

function moveUp(typeFieldIndex: number) {
  const typeFields = _.clone(currentResourceType.value.data.typeFields);
  if (typeFieldIndex > 0) {
    const temp = typeFields[typeFieldIndex - 1];
    typeFields[typeFieldIndex - 1] = typeFields[typeFieldIndex];
    typeFields[typeFieldIndex] = temp;
    currentResourceType.value.data.typeFields = typeFields;
    saveTypeFields(typeFields);
  }
}
function moveDown(typeFieldIndex: number) {
  const typeFields = _.clone(currentResourceType.value.data.typeFields);
  if (typeFieldIndex < typeFields.length - 1) {
    const temp = typeFields[typeFieldIndex + 1];
    typeFields[typeFieldIndex + 1] = typeFields[typeFieldIndex];
    typeFields[typeFieldIndex] = temp;
    currentResourceType.value.data.typeFields = typeFields;
    saveTypeFields(typeFields);
  }
}

function deleteField(typeFieldIndex: number) {
  const typeFields = _.clone(currentResourceType.value.data.typeFields);
  typeFields.splice(typeFieldIndex, 1);
  currentResourceType.value.data.typeFields = typeFields;
  saveTypeFields(typeFields);
}

async function saveTypeFields(typeFields: any) {
  try {
    f7.dialog.preloader(t('Shranjevanje'));
    await FirebaseFirestore.updateDocument({
      reference: '/Companies/' + props.companyId + '/resourceTypes/' + props.resourceTypeId,
      data: {
        typeFields: typeFields
      }
    });
    f7.dialog.close();
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
}

</script>
<template>
  <f7-page name="resourcesTypeSettings">
    <f7-navbar back-link :title="t('Nazaj na vire')">
      <f7-nav-right>
        <f7-button style="width: fit-content;" @click="$router.back('/', { force: true })"><f7-icon f7="house"
            size="25"></f7-icon></f7-button>
      </f7-nav-right>
    </f7-navbar>
    <div>
      <f7-block v-if="currentResourceType" inset outline strong-ios>
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap-reverse;">
          <h1 style="margin-bottom: 0px; ">{{ currentResourceType.data ?
            currentResourceType.data.name : "" }} <f7-chip
              v-if="currentResourceType.data !== undefined && !currentResourceType.data.isActive">{{ t('Ni aktiven')
              }}</f7-chip>
          </h1>
          <f7-button @click="isOpenNameEdit = true" style="width:fit-content;"><f7-icon f7="pencil"></f7-icon></f7-button>
        </div>
        <p style=" margin-bottom: 20px">{{ currentResourceType.data ? currentResourceType.data.description : "" }}</p>
      </f7-block>
      <f7-list media-list v-if="typeFields !== undefined" inset dividers strong-ios outline class="fix-inset">
        <f7-list-item v-for="typeField, index in typeFields" :key="typeField.id" :title="typeField.name">
          <span style="font-size: 13px;">{{ t('Oblika polja') }}: {{ typeField.type }}</span><br />
          <span style="font-size: 13px;">{{ t('Zahteve') }}: {{ typeField.rules }}</span>
          <template #after>
            <f7-button style="height: 20px;" @click="moreOptionsPopup(index)">več</f7-button>
          </template>
        </f7-list-item>
      </f7-list>
      <f7-block>
        <f7-button fill round-md @click="isEditOpen = true">{{ t('Dodaj polje') }}</f7-button>
      </f7-block>
    </div>
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