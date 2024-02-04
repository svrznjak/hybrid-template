<script setup lang="ts">
import appState from '@/appState';
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue';
import ProjectEditSheet from '../components/ProjectEditSheet.vue';
import ProjectResourceSelectorSheet from '../components/ProjectResourceSelectorSheet.vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { unsubscribeFromDocument, useDocument } from '../store/useDocument';
import { f7 } from 'framework7-vue';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { unsubscribeFromCollection, useCollection } from '../store/useCollection';
import _ from 'lodash';
import getParentDocument from '../utils/getParentReference';

appState.dispatch('setSidePanel', false);

const props = defineProps({
  companyId: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
})


const currentProject = ref();
const resourceTypes = ref();
const selectedResources = ref();

const isEditMode = ref(false);

const editor = reactive({
  currentValue: undefined,
  changedSaved: true,
})

async function saveEditorChanges() {
  if (currentProject.value.data.description === editor.currentValue) {
    editor.changedSaved = true;
    return;
  }
  try {
    await FirebaseFirestore.updateDocument({
      reference: '/Companies/' + props.companyId + "/projects/" + props.projectId,
      data: { description: editor.currentValue }
    });
    if (currentProject.value.data.description === editor.currentValue)
      editor.changedSaved = true;
  } catch (e) {
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
}

watchEffect(() => {
  if (currentProject?.value?.data === undefined) return;
  if (currentProject?.value?.data?.description) {
    editor.currentValue = currentProject.value.data.description;
  }
});

watch([() => currentProject?.value?.data?.selectedResources, () => resourceTypes?.value?.data], async (nextValue, prevValue) => {
  if (currentProject?.value?.data?.selectedResources === undefined || resourceTypes?.value?.data === undefined) return;
  if (nextValue !== undefined && !_.isEqual(prevValue, nextValue)) {
    selectedResources.value = {};
    for (const resourceType of resourceTypes.value.data) {
      selectedResources.value["/Companies/" + props.companyId + "/resourceTypes/" + resourceType.id] = [];
    }

    for (const resourcePath of currentProject.value.data.selectedResources) {
      const resourceTypePath = getParentDocument(resourcePath, 2);
      if (selectedResources.value[resourceTypePath] === undefined) {
        selectedResources.value[resourceTypePath] = [];
      }
      const resource = FirebaseFirestore.getDocument({
        reference: resourcePath
      });
      const resourceProjects = FirebaseFirestore.getCollectionGroup({
        reference: 'projects',
        compositeFilter: {
          type: 'and',
          queryConstraints: [
            {
              type: 'where',
              fieldPath: `selectedResources`,
              opStr: 'array-contains',
              value: resourcePath
            },
          ],
        },
      })
      Promise.all([resource, resourceProjects]).then((values) => {
        console.log(values)
        selectedResources.value[resourceTypePath].push({
          ...values[0].snapshot.data, projects: values[1].snapshots.map((project) => {
            return {
              name: project.data.name,
              customer: project.data.customer,
              from: project.data.fromDate,
              to: project.data.toDate,
              status: project.data.status
            }
          })
        });
      });
    }
    console.log(selectedResources.value);
  }
});

let intervalListener: any = undefined;

onMounted(async () => {
  resourceTypes.value = await useCollection('/Companies/' + props.companyId + "/resourceTypes");
  currentProject.value = await useDocument('/Companies/' + props.companyId + "/projects/" + props.projectId)

  //set interval listener for save editor changes every 5 seconds
  intervalListener = setInterval(() => {
    if (!editor.changedSaved) {
      saveEditorChanges();
    }
  }, 5000);
});

onUnmounted(async () => {
  await unsubscribeFromDocument('/Companies/' + props.companyId + "/projects/" + props.projectId);
  await unsubscribeFromCollection('/Companies/' + props.companyId + "/resourceTypes");

  //clear interval listener
  clearInterval(intervalListener);
});


const statusInText = computed(() => {
  if (currentProject.value && currentProject.value.data && currentProject.value.data.status) {
    switch (currentProject.value.data.status) {
      case 'draft':
        return t('Osnutek');
      case 'active':
        return t('Aktiven');
      case 'finished':
        return t('Zaključen');
      default:
        return t('Neznan');
    }
  } else {
    return '';
  }
});



const selectResourcesPath = ref<string | undefined>(undefined);


</script>
<template>
  <f7-page name="resources">
    <f7-navbar style="z-index: 100;" :back-link="currentProject?.data?.name ? currentProject.data.name : ''"
      :title="currentProject?.data?.name ? currentProject.data.name : ''">
    </f7-navbar>
    <f7-block style="display: flex; gap: 10px;  justify-content: space-between; flex-wrap: wrap;" v-if="currentProject">
      <div>
        <h1 style="margin-bottom: 0px; margin-top: 0px;">{{ currentProject.data ? currentProject.data.name : "" }}
          <f7-chip style="margin-left: 10px;">{{
            statusInText }}</f7-chip>
        </h1>
        <h3 style="margin-top: 0px; margin-bottom: 0px;">{{ currentProject.data ? currentProject.data.customerName : "" }}
        </h3>
        <h4 style="margin-top: 0px; margin-bottom: 0px;">{{ currentProject.data ? new
          Date(currentProject.data.fromDate).toLocaleDateString() : "" }} -
          {{ currentProject.data ? new Date(currentProject.data.toDate).toLocaleDateString() : "" }}</h4>
      </div>
      <f7-button v-if="currentProject?.data?.status !== 'finished'" fill round style="width: fit-content;"
        @click="isEditMode = true"><f7-icon f7="pencil" size="25"></f7-icon></f7-button>
    </f7-block>

    <f7-text-editor resizable v-if="editor.currentValue !== undefined" :value="editor.currentValue"
      @texteditor:change="(v) => { editor.currentValue = v; editor.changedSaved = false; }" />
    <f7-block>
      <p style="positon: relative; font-size: 12px; height: 0px; margin-top: -32px; margin-bottom: 0px;"
        v-show="!editor.changedSaved">
        Shranjujem...</p>
    </f7-block>
    <template v-if="resourceTypes?.data !== undefined">
      <div v-for="resource, key in selectedResources" :key="key">
        <f7-block style="margin-top: 10px; margin-bottom: 0px;">
          <div style="display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap; ">
            <h2 large color="black" style="margin-top: 5px; margin-bottom: 5px;">{{
              resourceTypes.data.find((type) => `/Companies/${props.companyId}/resourceTypes/${type.id}` == key)?.name
            }}
            </h2>
            <f7-button style="width: fit-content;" @click="selectResourcesPath = key"><f7-icon f7="plus"
                size="25"></f7-icon>
            </f7-button>
          </div>
        </f7-block>
        <f7-list media-list inset dividers strong-ios outline class="fix-inset" style="margin-top: 10px;">
          <f7-list-item v-for="resource of selectedResources[key]" :key="resource.id" :title="resource.name"
            @click="f7.dialog.alert('xx')">
            {{ resource.projects[0].name }}
          </f7-list-item>
        </f7-list>
      </div>
    </template>
    <ProjectEditSheet v-if="currentProject?.data !== undefined"
      :documentPath="'/Companies/' + props.companyId + '/projects/' + props.projectId" :projectInfo="currentProject.data"
      :isOpen="isEditMode" @close="isEditMode = false" />
    <ProjectResourceSelectorSheet v-if="currentProject?.data !== undefined"
      :projectDocumentPath="'/Companies/' + props.companyId + '/projects/' + props.projectId"
      :projectInfo="currentProject.data" :resourceTypePath="selectResourcesPath"
      :isOpen="selectResourcesPath !== undefined" @close="selectResourcesPath = undefined" />
  </f7-page>
</template>
<style></style>