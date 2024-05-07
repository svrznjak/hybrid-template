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
  if (currentProject?.value?.data?.description !== undefined) {
    editor.currentValue = currentProject.value.data.description;
  }
});

watch([() => currentProject?.value?.data?.selectedResources, () => resourceTypes?.value?.data], async (nextValue, prevValue) => {
  if (currentProject?.value?.data?.selectedResources === undefined || resourceTypes?.value?.data === undefined) return;
  if (nextValue !== undefined && !_.isEqual(prevValue, nextValue)) {
    const newSelectedResources: any = {};
    for (const resourceType of resourceTypes.value.data) {
      if (resourceType.isActive)
        newSelectedResources["/Companies/" + props.companyId + "/resourceTypes/" + resourceType.id] = [];
    }

    for (const resourcePath of currentProject.value.data.selectedResources) {
      const resourceTypePath = getParentDocument(resourcePath, 2);
      if (newSelectedResources[resourceTypePath] === undefined) {
        newSelectedResources[resourceTypePath] = [];
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
      await Promise.all([resource, resourceProjects]).then((values) => {
        console.log(values)
        newSelectedResources[resourceTypePath].push({
          ...values[0].snapshot.data, id: values[0].snapshot.id, _relatedProjects: values[1].snapshots.map((project) => {
            return {
              id: project.id,
              name: project.data.name,
              customer: project.data.customer,
              fromDate: project.data.fromDate,
              toDate: project.data.toDate,
              status: project.data.status
            }
          })
        });
      });
    }
    selectedResources.value = newSelectedResources;
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
  switch (currentProject?.value?.data?.status) {
    case 'draft':
      return t('Osnutek');
    case 'confirmed':
      return t('Aktiven');
    case 'finished':
      return t('Zaključen');
    default:
      return '';
  }
});


async function removeResourceFromProject(resourcePath: string) {
  try {
    f7.dialog.preloader(t('Odstranjevanje vira iz projekta'));
    await FirebaseFirestore.updateDocument({
      reference: '/Companies/' + props.companyId + "/projects/" + props.projectId,
      data: {
        selectedResources: currentProject.value.data.selectedResources.filter((path: string) => path !== resourcePath)
      }
    });
    f7.dialog.close();
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Odstranjevanje ni uspelo.'));
    console.log(e)
  }
}

async function confirmProject() {
  try {
    f7.dialog.preloader(t('Potrjevanje projekta'));
    await FirebaseFirestore.updateDocument({
      reference: '/Companies/' + props.companyId + "/projects/" + props.projectId,
      data: { status: 'confirmed' }
    });
    f7.dialog.close();
    f7.dialog.alert(t('Projekt je bil uspešno potrjen.'), t('Projekt potrjen'));
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
}
async function deleteProject() {
  try {
    f7.dialog.preloader(t('Brisanje projekta'));
    if (currentProject.value.data.status === 'confirmed' || currentProject.value.data.status === 'finished') {
      f7.dialog.close();
      f7.dialog.alert(t('Napaka'), t('Brisati je mogoče samo prijekte s statusom "osnutek".'));
      return;
    }
    await FirebaseFirestore.deleteDocument({
      reference: '/Companies/' + props.companyId + "/projects/" + props.projectId,
    });
    f7.dialog.close();
    f7.dialog.alert(t('Projekt je bil uspešno izbrisan.'), t('Projekt izbrisan'), () => {
      f7.views.main.router.back();
    });
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Brisanje ni uspelo.'));
    console.log(e)
  }
}

async function backToDraft() {
  try {
    f7.dialog.preloader(t('Spreminjanje statusa projekta'));
    await FirebaseFirestore.updateDocument({
      reference: '/Companies/' + props.companyId + "/projects/" + props.projectId,
      data: { status: 'draft' }
    });
    f7.dialog.close();
    f7.dialog.alert(t('Status projekta je bil spremenjen v osnutek.'), t('Projekt vrnjen v osnutek'));
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
}

async function finishProject() {
  try {
    f7.dialog.preloader(t('Zaključevenje projekta'));
    await FirebaseFirestore.updateDocument({
      reference: '/Companies/' + props.companyId + "/projects/" + props.projectId,
      data: { status: 'finished' }
    });
    f7.dialog.close();
    f7.dialog.alert(t('Projekt je bil uspešno zaključen. Nadaljne spremembe niso mogoče'), t('Projekt je zaključen'));
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
}

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

function generateUsedInProjectsText(resource: any) {
  if (resource._relatedProjects === undefined || !_.isArray(resource._relatedProjects)) return '';
  let text = `<div style='display: flex; flex-direction: row; gap:10px; flex-wrap: wrap;'>`;
  resource._relatedProjects.forEach((project: any) => {
    if (project.status !== 'finished' && project.id !== props.projectId) {
      if (project.status === 'draft') { text += "<div class='chip chip-outline'><div class='chip-label '>"; }
      else if (project.status === 'confirmed') { text += "<div class='chip color-blue' ><div class='chip-label'>"; }
      text += `${new Date(project.fromDate).toLocaleDateString()} - ${new Date(project.toDate).toLocaleDateString()} <b>(${project.name})</b> </div></div>`;
    }
  });
  text += "</div>";
  console.log(text);
  return text
}


const selectResourcesPath = ref<string | undefined>(undefined);


</script>
<template>
  <f7-page name="resources">
    <f7-navbar style="z-index: 115;" :back-link="currentProject?.data?.name ? currentProject.data.name : ''"
      :title="currentProject?.data?.name ? currentProject.data.name : ''">
      <f7-nav-right>
        <f7-button style="width: fit-content;" @click="$router.back('/', { force: true })"><f7-icon f7="house"
            size="25"></f7-icon></f7-button>
      </f7-nav-right>
    </f7-navbar>
    <div>
      <f7-block style="display: flex; gap: 10px;  justify-content: space-between; flex-wrap: wrap;"
        v-if="currentProject">
        <div>
          <h1 style="margin-bottom: 0px; margin-top: 0px;">{{ currentProject.data ? currentProject.data.name : "" }}
            <f7-chip style="margin-left: 10px;">{{
      statusInText }}</f7-chip>
          </h1>
          <h3 style="margin-top: 0px; margin-bottom: 0px;">{{ currentProject.data ? currentProject.data.customerName :
      ""
            }}
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
        <template v-for="selectedResource, key in selectedResources" :key="key">
          <f7-block style="margin-top: 10px; margin-bottom: 0px;">
            <div style="display: flex; flex-direction: row; justify-content: space-between; flex-wrap: wrap; ">
              <h2 large color="black" style="margin-top: 5px; margin-bottom: 5px;">{{
      resourceTypes.data.find((type: any) => `/Companies/${props.companyId}/resourceTypes/${type.id}` ==
        String(key))?.name
    }} ({{ selectedResource.length }})
              </h2>
              <f7-button v-if="currentProject?.data?.status !== 'finished'" style="width: fit-content;"
                @click="selectResourcesPath = String(key)"><f7-icon f7="plus" size="25"></f7-icon>
              </f7-button>
            </div>
          </f7-block>
          <f7-list media-list inset dividers strong-ios outline class="fix-inset" style="margin-top: 10px;">
            <f7-list-item v-for="resource of selectedResources[key]" :key="resource.id" :title="resource.name">
              <template #after v-if="currentProject?.data?.status !== 'finished'">
                <f7-button style="height: 20px;" @click="f7.dialog.confirm('Želite odstaniti ta vir iz projekta', 'Odstranjevanje vira', () => {
      removeResourceFromProject(`${key}/resources/${resource.id}`)
    })"><f7-icon f7="equal_square
" size="15"></f7-icon></f7-button>
              </template>
              <p style="font-size:13px">{{ generateCustomFieldsText(resource, resourceTypes.data.find((type: any) =>
      `/Companies/${props.companyId}/resourceTypes/${type.id}` == String(key))) }}</p>
              <div v-html="generateUsedInProjectsText(resource)"></div>
            </f7-list-item>
          </f7-list>
        </template>
        <f7-block v-if="currentProject?.data?.status === 'draft'"
          style="display: flex; gap: 10px;  justify-content: space-between; flex-wrap: wrap;">
          <f7-button round @click="deleteProject">{{ t('Izbriši osnutek projekta') }}</f7-button>
          <f7-button fill round @click="confirmProject">
            {{ t('Potrdi projekt') }}</f7-button>
        </f7-block>
        <f7-block v-if="currentProject?.data?.status === 'confirmed'"
          style="display: flex; gap: 10px;  justify-content: space-between; flex-wrap: wrap;">
          <f7-button round @click="backToDraft">{{ t('Nazaj v osnutek') }}</f7-button>
          <f7-button fill round @click="finishProject">
            {{ t('Zaključi projekt') }}</f7-button>
        </f7-block>
      </template>
    </div>
    <ProjectEditSheet
      v-if="currentProject?.data !== undefined && resourceTypes?.data !== undefined && currentProject?.data?.status !== 'finished'"
      :documentPath="'/Companies/' + props.companyId + '/projects/' + props.projectId"
      :projectInfo="currentProject.data" :isOpen="isEditMode" @close="isEditMode = false" />
    <ProjectResourceSelectorSheet
      v-if="currentProject?.data !== undefined && resourceTypes?.data !== undefined && currentProject?.data?.status !== 'finished'"
      :projectDocumentPath="'/Companies/' + props.companyId + '/projects/' + props.projectId"
      :projectInfo="currentProject.data" :resourceTypePath="selectResourcesPath" :resourceType="resourceTypes.data.find((type: any) =>
      `/Companies/${props.companyId}/resourceTypes/${type.id}` == selectResourcesPath)"
      :isOpen="selectResourcesPath !== undefined" @close="selectResourcesPath = undefined" />
  </f7-page>
</template>
<style></style>