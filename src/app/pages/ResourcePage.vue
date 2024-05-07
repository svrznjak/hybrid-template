<script setup lang="ts">
import appState from '@/appState';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import _ from 'lodash';
import ResourceEditSheet from '../components/ResourceEditSheet.vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { unsubscribeFromDocument, useDocument } from '../store/useDocument';
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
  },
  resourceId: {
    type: String,
    required: true
  }
})


const currentResourceType = ref();
const resource = ref();

const isEditMode = ref(false);

const customFields: any = computed(() => {
  if (currentResourceType.value && currentResourceType.value.data && resource.value && resource.value.data) {
    const resourceTypeFields = currentResourceType.value.data.typeFields;
    const customFields: any = [];
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
    type: {
      input: "text",
      options: []
    },
    value: resource.value.data.name,
  }, {
    id: "isActive",
    name: "Aktiven",
    rules: "",
    type: {
      input: "toggle",
      options: []
    },
    value: resource.value.data.isActive === undefined ? true : resource.value.data.isActive,
  }, ...customFields.value];

});

const relatedProjects = ref<any>([]);

watch(() => resource?.value?.data, async (newValue) => {
  if (newValue?.id !== undefined) {
    const result = await FirebaseFirestore.getCollectionGroup({
      reference: 'projects',
      compositeFilter: {
        type: 'and',
        queryConstraints: [
          {
            type: 'where',
            fieldPath: `selectedResources`,
            opStr: 'array-contains',
            value: '/Companies/' + props.companyId + "/resourceTypes/" + props.resourceTypeId + "/resources/" + newValue.id
          },
        ],
      },
    });
    relatedProjects.value = result.snapshots.map((snapshot) => {
      return {
        ...snapshot.data,
        id: snapshot.id,
      }
    });
  }
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

function generateTitleText(title: any, inputType: string) {
  if (typeof title === "string") {
    if (inputType === "date") {
      return new Date(title).toLocaleDateString();
    } else return title;
  }
  if (typeof title === "boolean") {
    return title ? t("Da") : t("Ne");
  } else if (typeof title === "object") {
    let text = "";
    for (const key in title) {
      if (title[key]) text += key + ", ";
    }
    return text;
  }
  return "";
}
function generateLink(title: any, inputType: string) {
  if (inputType === "tel") {
    return `tel:${title}`;
  } else if (inputType === "email") {
    return `mailto:${title}`;
  } else return false;

}

function generateBadgeText(status: string): string {
  if (status === "draft") return t("Osnutek");
  else if (status === "confirmed") return t("Aktiven");
  else if (status === "finished") return t("Zaključen");
  else return '';
}
function generateBadgeColor(status: string): string {
  if (status === "draft") return '';
  else if (status === "confirmed") return 'blue';
  else if (status === "finished") return 'green';
  else return '';
}


</script>
<template>
  <f7-page name="resources">
    <f7-navbar style="z-index: 104;" :back-link="currentResourceType?.data?.name ? currentResourceType.data.name : ''"
      :title="currentResourceType?.data?.name ? currentResourceType.data.name : ''">
      <f7-nav-left>
        <f7-badge v-if="!currentResourceType?.data?.isActive">{{ t('Vrsta vira ni aktivna') }}</f7-badge>
      </f7-nav-left>
      <f7-nav-right>
        <f7-button style="width: fit-content;" @click="$router.back('/', { force: true })"><f7-icon f7="house"
            size="25"></f7-icon></f7-button>
      </f7-nav-right>
    </f7-navbar>
    <div>
      <f7-block style="display: flex; gap: 10px;  justify-content: space-between; flex-wrap: wrap;" v-if="resource">
        <h1 style="margin-bottom: 0px">{{ resource.data ? resource.data.name : "" }} <f7-chip
            v-if="!resource?.data?.isActive">{{ t('Ni aktiven') }}</f7-chip></h1>
        <f7-button fill round style="width: fit-content;" @click="openEditMode"><f7-icon f7="pencil"
            size="25"></f7-icon></f7-button>
      </f7-block>
      <f7-list inset dividers strong-ios outline class="fix-inset">
        <f7-list-item v-for="field of customFields" :key="field.id"
          :title="generateTitleText(field.value, field.type.input)" :after="field.name"
          :link="generateLink(field.value, field.type.input)" prevent-router external>
        </f7-list-item>
      </f7-list>
      <f7-block-title>{{ t('Povezani projekti') }}</f7-block-title>
      <f7-list media-list dividers strong-ios outline-ios class="fix-inset" v-if="_.isArray(relatedProjects)">
        <f7-list-item v-for="project of relatedProjects" :key="project.id" :title="project.name"
          :link="`/Companies/${props.companyId}/projects/${project.id}`" :subtitle="project.customerName"
          :badge="generateBadgeText(project.status)" :badge-color="generateBadgeColor(project.status)">
          <div style="font-size:14px">{{ new Date(project.fromDate).toLocaleDateString() + ' - ' + new
            Date(project.toDate).toLocaleDateString() +
            '&nbsp;&nbsp;' }}</div>
        </f7-list-item>
      </f7-list>
    </div>
    <ResourceEditSheet v-if="allFields.length > 0"
      :documentPath="'/Companies/' + props.companyId + '/resourceTypes/' + props.resourceTypeId + '/resources/' + props.resourceId"
      :fields="allFields" :isOpen="isEditMode" @close="closeEditMode" />
  </f7-page>
</template>
<style></style>