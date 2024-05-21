<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import appState from '@/appState';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { f7, theme } from 'framework7-vue';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { unsubscribeFromCollection, useCollection, type IActiveCollection } from "@/firestore/useCollection";
import ProjectAddSheet from '../components/ProjectAddSheet.vue';
import { watchThrottled } from '@vueuse/core'
import * as JsSearch from 'js-search';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});

import firestore, { collectionGroup, query, where, onSnapshot, Firestore, getFirestore, getDocs, collection, doc, orderBy, startAt, endAt } from "firebase/firestore";


import logo from '#/assets/appIcons/egm-logo.png';
import SearchResultsSheet from "../components/SearchResultsSheet.vue";

import type { ICompanyAssociative } from '#/types/company';
import type { IProject } from '#/types/project';
import { projectSchema } from '#/types/project';
import type { IResourceType } from '#/types/resourceType';
import { resourceTypeSchema } from '#/types/resourceType';

appState.dispatch('setSidePanel', false);

const selectedCompanyId = useStorage<undefined | string>('selectedCompanyId', undefined);
const selectedCompanyUserPermissions = useStorage<undefined | string>('selectedCompanyUserPermissions', undefined);

async function getCurrentUserCompanies(): Promise<ICompanyAssociative> {
  const currentUser = (await FirebaseAuthentication.getCurrentUser()).user!;
  const { snapshots } = await FirebaseFirestore.getCollection({
    reference: 'Companies',
    compositeFilter: {
      type: 'and',
      queryConstraints: [
        {
          type: 'where',
          fieldPath: `users.${currentUser.uid}`,
          opStr: 'in',
          value: ['admin', 'manager', 'employee']
        },
      ],
    },
  });
  const companies: ICompanyAssociative = {};
  snapshots.forEach((snap: any) => {
    companies[snap.id] = { ...snap.data, id: snap.id, path: snap.path };
  });
  return companies;
};

const companies = ref({} as ICompanyAssociative);
const projects = ref<IActiveCollection<IProject>>();
const resourceTypes = ref<IActiveCollection<IResourceType>>();

const callbckId = ref<string | undefined>(undefined);
const allCompanyResources = ref<any[]>([]);

onMounted(async () => {
  const currentUser = (await FirebaseAuthentication.getCurrentUser()).user!;
  companies.value = await getCurrentUserCompanies();
  console.log(companies.value);
  if (selectedCompanyId.value === undefined || selectedCompanyUserPermissions.value === undefined) {
    selectedCompanyId.value = Object.keys(companies.value)[0];
  }
  selectedCompanyUserPermissions.value = companies.value[selectedCompanyId.value].users[currentUser.uid];
  projects.value = (await useCollection<IProject>(companies.value[selectedCompanyId.value].path + "/projects", projectSchema.parse));
  console.log(projects.value);
  resourceTypes.value = (await useCollection<IResourceType>(companies.value[selectedCompanyId.value].path + "/resourceTypes", resourceTypeSchema.parse));
  console.log(resourceTypes.value)


  /*
  example of collectionGroup query with listener
    const resources = query(collectionGroup(getFirestore(), 'resources'));
    onSnapshot(resources, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  });

  what i need to do is to get all resources from all resourceTypes from selected company
  this is an example that might work, but i need to test it:
  const cityRef = firebase.firestore().doc('cities/cityId');

firebase.firestore().collectionGroup('attractions')
  .orderBy(firebase.firestore.FieldPath.documentId())
  .startAt(cityRef.path),
  .endAt(cityRef.path + "\uf8ff")
  .get()
  .then((querySnapshot) => {
    console.log("Found " + querySnapshot.size + " docs");
    querySnapshot.forEach((doc) => console.log("> " + doc.ref.path))
  })
  .catch((err) => {
    console.error("Failed to execute query", err);
  })
  
  following is a try according to upper example:
*/
  const companyRef = doc(getFirestore(), `Companies/${selectedCompanyId.value}`);
  console.log(companyRef);

  //const resources = query(collectionGroup(getFirestore(), 'resources'), orderBy('__name__'), startAt(companyRef.path), endAt(companyRef.path + "\uf8ff"));

  callbckId.value = await FirebaseFirestore.addCollectionGroupSnapshotListener({
    reference: 'resources',
    queryConstraints: [
      {
        type: 'orderBy',
        fieldPath: '__name__',
        directionStr: 'desc',
      },
    ],
    compositeFilter: {
      type: 'and',
      queryConstraints: [
        {
          type: 'where',
          fieldPath: '__name__',
          opStr: '>=',
          value: companyRef.path,
        },
        {
          type: 'where',
          fieldPath: '__name__',
          opStr: '<=',
          value: companyRef.path + "\uf8ff",
        },
      ],
    },

  },
    (event: any, error: any) => {
      if (error) {
        console.error(error);
      } else {
        allCompanyResources.value = event.snapshots.map((snap: any) => {
          return { ...snap.data, id: snap.id, path: snap.path };
        });
      }
    }
  );



  /*onSnapshot(resources, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data(), doc.ref.path);
    });
  });*/


});
onUnmounted(() => {
  if (callbckId.value !== undefined) {
    FirebaseFirestore.removeSnapshotListener({ callbackId: callbckId.value });
  }
});

watch(() => selectedCompanyId.value, async (newValue, oldValue) => {
  if (newValue === undefined || oldValue == undefined) return; // only run when selectedCompany is changed
  const currentUser = (await FirebaseAuthentication.getCurrentUser()).user;
  selectedCompanyUserPermissions.value = companies.value[newValue].users[currentUser!.uid];
  await unsubscribeFromCollection(companies.value[oldValue].path + "/projects");
  await unsubscribeFromCollection(companies.value[oldValue].path + "/resourceTypes");
  projects.value = (await useCollection<IProject>(companies.value[newValue].path + "/projects", projectSchema.parse));
  resourceTypes.value = (await useCollection<IResourceType>(companies.value[newValue].path + "/resourceTypes", resourceTypeSchema.parse));
});


const draftProjects = computed(() => {
  if (projects?.value?.data === undefined) return [];
  return projects.value.data.filter((project) => project.status === 'draft');
})

const confirmedProjects = computed(() => {
  if (projects?.value?.data === undefined) return [];
  return projects.value.data.filter((project) => project.status === 'confirmed');
})

const finishedProjects = computed(() => {
  if (projects?.value?.data === undefined) return [];
  return projects.value.data.filter((project) => project.status === 'finished');
})

const searchQuery = ref('');
const searchResults: any = ref([]);

const allResources = ref<any[]>([]);

watchThrottled(() => searchQuery.value, async (query) => {
  if (query === '') {
    return;
  }
  if (allResources.value.length === 0) {
    const result = await FirebaseFirestore.getCollectionGroup({
      reference: 'resources',
      // get only from current company. Company is a document in collection Companies that is a parent of collection resourceTypes, that is a parent of collection resources
    });
    allResources.value = result.snapshots.map((snap: any) => {
      return { ...snap.data, id: snap.id, path: snap.path }
    });
  }
  console.log(allResources.value)

  let search = new JsSearch.Search("id");
  search.addIndex("name");
  search.addDocuments(allResources.value);
  searchResults.value = search.search(searchQuery.value);
}, { throttle: 500 })

async function logOut() {
  try {
    await FirebaseAuthentication.signOut();
  } catch (err) {

    console.log(err);
  }
}

const isOpenAddNew = ref(false);

function userDialog() {
  const companiesButtons = Object.keys(companies.value).map((companyId) => {
    return {
      text: companies.value[companyId].name,
      onClick: () => {
        selectedCompanyId.value = companyId;
      }
    }
  });
  f7.dialog
    .create({
      title: 'Možnosti',
      buttons: [...companiesButtons,
      {
        text: 'Odjava',
        color: 'red',
        onClick: () => {
          logOut();
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



</script>
<template>
  <f7-page name="home">
    <f7-navbar>
      <f7-searchbar v-model:value="searchQuery" :disable-button="false"></f7-searchbar>
    </f7-navbar>
    <div id="page-content-search-resoults" v-if="selectedCompanyId !== undefined">
      <f7-block style="display: flex; gap: 10px;  justify-content: space-between;">
        <img :src="logo" height="40" />
        <div style="display: flex; gap: 10px;">
          <f7-button outline round style=" width: fit-content;"
            @click="$router.navigate(companies[selectedCompanyId].path + '/resourceTypes')">{{
        t('Viri')
      }}</f7-button>
          <f7-button fill round style="width: fit-content;" @click="isOpenAddNew = true">{{ t('Nov projekt')
            }}</f7-button>
        </div>
      </f7-block>
      <hr />
      <f7-block-title>{{ t('Aktivni projekti') }}</f7-block-title>
      <f7-list media-list dividers :inset="theme.md" strong-ios outline v-if="projects" class="fix-inset">
        <f7-list-item v-for="project in confirmedProjects" :key="project.id"
          :link="`${companies[selectedCompanyId].path}/projects/${project.id}`" :title="project.name"
          :subtitle="project.customerName">
          <div style="font-size:14px">{{ new Date(project.fromDate).toLocaleDateString() + ' - ' + new
        Date(project.toDate).toLocaleDateString() +
        '&nbsp;&nbsp;' }}</div>
        </f7-list-item>
      </f7-list>
      <f7-block-title>{{ t('Osnutki projektov') }}</f7-block-title>
      <f7-list media-list dividers :inset="theme.md" strong-ios outline v-if="projects" class="fix-inset">
        <f7-list-item v-for="project in draftProjects" :key="project.id"
          :link="`${companies[selectedCompanyId].path}/projects/${project.id}`" :title="project.name"
          :subtitle="project.customerName">
          <div style="font-size:14px">{{ new Date(project.fromDate).toLocaleDateString() + ' - ' + new
        Date(project.toDate).toLocaleDateString() +
        '&nbsp;&nbsp;' }}</div>
        </f7-list-item>
      </f7-list>
      <!--
      <f7-block-title>{{ t('Zaključeni projekti') }}</f7-block-title>
      <f7-list media-list dividers :inset="theme.md" strong-ios outline v-if="projects" class="fix-inset">
        <f7-list-item v-for="project in finishedProjects" :key="project.id"
          :link="`${companiesPaths[0]}/projects/${project.id}`" :title="project.name" :subtitle="project.customerName">
          <div style="font-size:14px">{{ new Date(project.fromDate).toLocaleDateString() + ' - ' + new
            Date(project.toDate).toLocaleDateString() +
            '&nbsp;&nbsp;' }}</div>
        </f7-list-item>
      </f7-list>
    -->
      <f7-block style="display: flex; gap: 10px;">
        <f7-button fill round style="width: 100px;" @click="userDialog()">Več</f7-button>
      </f7-block>
      <f7-block-title>tmp</f7-block-title>
      <f7-list media-list dividers :inset="theme.md" strong-ios outline v-if="allCompanyResources" class="fix-inset">
        <f7-list-item v-for="resource in allCompanyResources" :key="resource.id"
          :link="`${companies[selectedCompanyId].path}/resourceTypes/${resource.resourceType}/resources/${resource.id}`"
          :title="resource.name" :subtitle="resource.resourceType">
          <div style="font-size:14px">{{ resource.description }}</div>
        </f7-list-item>
      </f7-list>
      <ProjectAddSheet v-if="companies[selectedCompanyId] !== undefined"
        :collectionPath="companies[selectedCompanyId].path + '/projects'" :isOpen="isOpenAddNew"
        @close="isOpenAddNew = false" />
      <SearchResultsSheet v-if="searchQuery !== '' && resourceTypes !== undefined" :displayedResources="searchResults"
        :resourceTypes="resourceTypes.data" :opened="searchQuery !== ''" :isOpen="searchQuery !== ''" />
    </div>
  </f7-page>
</template>
<style>
/** Global fixes */
.md .list.fix-inset .item-inner {
  padding-right: 0px;
  margin-right: calc(var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-right));
}

.text-editor.text-editor-resizable {
  border-radius: var(--f7-list-inset-border-radius);
}

.text-editor.text-editor-resizable .text-editor-toolbar {
  border-radius: var(--f7-list-inset-border-radius);
  top: 10px;
}

.page-content::-webkit-scrollbar {
  display: none;
}

/* IOS input label white background */
.item-input-outline.item-content .item-label {
  background-color: var(--f7-sheet-bg-color);
}

/* Hide scrollbar for IE, Edge and Firefox */
.page-content {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>../../global/firestore/useCollection