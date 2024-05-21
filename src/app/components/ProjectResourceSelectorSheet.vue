<script setup lang="ts">
import appState from '@/appState';
import messages from '../pages/HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { f7, } from 'framework7-vue';
import { ref, watch } from 'vue';
import _ from 'lodash';
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
  resourceType: {
    type: Object,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const allResourcesOfSelectedType = ref();

watch(() => props.resourceTypePath, async (newValue, oldValue) => {
  if (newValue === undefined) return

  allResourcesOfSelectedType.value = (await FirebaseFirestore.getCollection({
    reference: newValue + "/resources"
  })).snapshots.map((snapshot) => {
    return {
      ...snapshot.data,
      id: snapshot.id,
    }
  });

  // filter out inactive resources
  allResourcesOfSelectedType.value = allResourcesOfSelectedType.value.filter((resource: any) => {
    return resource.isActive;
  });

  allResourcesOfSelectedType.value.forEach((resource, index) => {
    FirebaseFirestore.getCollectionGroup({
      reference: 'projects',
      compositeFilter: {
        type: 'and',
        queryConstraints: [
          {
            type: 'where',
            fieldPath: `selectedResources`,
            opStr: 'array-contains',
            value: newValue + "/resources/" + resource.id
          },
        ],
      },
    }).then((result) => {
      result.snapshots.forEach((snapshot) => {
        if (allResourcesOfSelectedType.value[index]._relatedProjects === undefined) allResourcesOfSelectedType.value[index]._relatedProjects = [];
        allResourcesOfSelectedType.value[index]._relatedProjects.push({
          ...snapshot.data,
          id: snapshot.id,
        });
      })
    });
  });
});


async function addResource(documentId: string) {
  try {
    f7.dialog.preloader(t('Dodajanje vira'));
    await FirebaseFirestore.updateDocument({
      reference: props.projectDocumentPath,
      data: {
        selectedResources: [...props.projectInfo.selectedResources, props.resourceTypePath + "/resources/" + documentId]
      }
    });
    f7.dialog.close();
  } catch (e) {
    f7.dialog.close();
    f7.dialog.alert(t('Napaka'), t('Shranjevanje ni uspelo.'));
    console.log(e)
  }
};


function generateCustomFieldsText(resource, resourceType) {
  let text = "";
  if (resourceType?.typeFields === undefined || !_.isArray(resourceType.typeFields)) return text;
  const displayedCustomFields = resourceType.typeFields.filter(field => field.showInList);
  displayedCustomFields.forEach((field, index) => {
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

function generateUsedInProjectsText(resource) {
  console.log(resource.isActive);
  if (resource._relatedProjects === undefined || !_.isArray(resource._relatedProjects)) return '';
  let text = `<div style='display: flex; flex-direction: row; gap:10px; flex-wrap: wrap;'>`;
  resource._relatedProjects.forEach(project => {
    if (project.status !== 'finished' && project.id !== props.projectInfo.id) {
      if (project.status === 'draft') text += "<div class='chip chip-outline'><div class='chip-label '>";
      else if (project.status === 'confirmed') text += "<div class='chip color-blue' ><div class='chip-label'>";
      text += `${new Date(project.fromDate).toLocaleDateString()} - ${new Date(project.toDate).toLocaleDateString()} <b>(${project.name})</b> </div></div>`;
    }
  });
  text += "</div>";
  return text
}


function isResourceUsedInThisProject(resourceId: string): boolean {
  console.log(props.projectInfo.selectedResources);
  return props.projectInfo.selectedResources.some((selectedResource) => {
    console.log(selectedResource);
    return selectedResource === `${props.resourceTypePath}/resources/${resourceId}`
  });

}

</script>
<template>
  <f7-sheet :opened="isOpen && resourceTypePath !== undefined" backdrop :close-by-backdrop-click="false"
    :close-by-outside-click="false" style="height: 98%;">
    <f7-page-content>
      <div>
        <f7-block>
          <h1>{{ t('Dodajanje virov') }}</h1>
        </f7-block>

        <f7-list media-list inset dividers strong-ios outline class="fix-inset" style="margin-top: 10px;">
          <f7-list-item v-for="resource of allResourcesOfSelectedType" :key="resource.id" :title="resource.name">
            <template #after v-if="!isResourceUsedInThisProject(resource.id)">
              <f7-button style="height: 20px;" @click="addResource(resource.id)"><f7-icon f7="plus_circle_fill"
                  size="20"></f7-icon></f7-button>
            </template>
            <p style="font-size:13px">{{ generateCustomFieldsText(resource, props.resourceType) }}</p>
            <div v-html="generateUsedInProjectsText(resource)"></div>
          </f7-list-item>
        </f7-list>

        <f7-block style="display: flex; gap: 10px; justify-content: space-between;">
          <f7-button fill round @click="emit('close')">{{ t('Zaključi dodajanje') }}</f7-button>
        </f7-block>
      </div>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>