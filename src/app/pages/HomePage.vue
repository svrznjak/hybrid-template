<script setup lang="ts">
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import appState from '@/appState';
import { computed, onMounted, ref, watch } from 'vue';
import { theme } from 'framework7-vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { useCollection } from "../store/useCollection";
import ProjectAddSheet from '../components/ProjectAddSheet.vue';
import { watchThrottled } from '@vueuse/core'
import * as JsSearch from 'js-search';

import logo from '#/assets/appIcons/egm-logo.png';
import SearchResultsSheet from "../components/SearchResultsSheet.vue";
appState.dispatch('setSidePanel', false);

const getUsersCompanies = async (userId: string) => {
  const { snapshots } = await FirebaseFirestore.getCollection({
    reference: 'Companies',
    compositeFilter: {
      type: 'and',
      queryConstraints: [
        {
          type: 'where',
          fieldPath: `users`,
          opStr: 'array-contains',
          value: userId
        },
      ],
    },
  });
  console.log(snapshots);
  const companiesReferences = snapshots.map((snap: any) => {
    return snap.path
  });
  return companiesReferences;
};

const companiesPaths = ref<string[]>([]);
const projects = ref()

onMounted(async () => {
  const currentUser = (await FirebaseAuthentication.getCurrentUser()).user;
  companiesPaths.value = (await getUsersCompanies(currentUser!.uid));
  projects.value = (await useCollection(companiesPaths.value[0] + "/projects"));
});


const draftProjects = computed(() => {
  if (projects?.value?.data === undefined) return [];
  return projects.value.data.filter((project: any) => project.status === 'draft');
})

const confirmedProjects = computed(() => {
  if (projects?.value?.data === undefined) return [];
  return projects.value.data.filter((project: any) => project.status === 'confirmed');
})

const finishedProjects = computed(() => {
  if (projects?.value?.data === undefined) return [];
  return projects.value.data.filter((project: any) => project.status === 'finished');
})

const searchQuery = ref('');
const searchResults: any = ref([]);

const allResources = ref<any[]>([]);

watchThrottled(() => searchQuery.value, async (query, previousQuery) => {
  if (query === '') {
    return;
  }
  if (allResources.value.length === 0) {
    const result = await FirebaseFirestore.getCollectionGroup({
      reference: 'resources',
    });
    allResources.value = result.snapshots.map((snap: any) => {
      return { ...snap.data, id: snap.id, path: snap.path }
    });
  }

  let search = new JsSearch.Search("_id");
  search.addIndex("name");
  search.addDocuments(allResources.value);
  searchResults.value = search.search(searchQuery.value);
}, { throttle: 1000 })

async function logOut() {
  try {
    await FirebaseAuthentication.signOut();
  } catch (err) {

    console.log(err);
  }
}

const isOpenAddNew = ref(false);

</script>
<template>
  <f7-page name="home">
    <f7-navbar>
      <f7-searchbar v-model:value="searchQuery" :disable-button="false"></f7-searchbar>
    </f7-navbar>
    <div id="page-content-search-resoults">
      <f7-block style="display: flex; gap: 10px;  justify-content: space-between;">
        <img :src="logo" height="40" />
        <div style="display: flex; gap: 10px;">
          <f7-button outline round style=" width: fit-content;"
            @click="$router.navigate(companiesPaths[0] + '/resourceTypes')">{{
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
          :link="`${companiesPaths[0]}/projects/${project.id}`" :title="project.name" :subtitle="project.customerName">
          <div style="font-size:14px">{{ new Date(project.fromDate).toLocaleDateString() + ' - ' + new
            Date(project.toDate).toLocaleDateString() +
            '&nbsp;&nbsp;' }}</div>
        </f7-list-item>
      </f7-list>
      <f7-block-title>{{ t('Osnutki projektov') }}</f7-block-title>
      <f7-list media-list dividers :inset="theme.md" strong-ios outline v-if="projects" class="fix-inset">
        <f7-list-item v-for="project in draftProjects" :key="project.id"
          :link="`${companiesPaths[0]}/projects/${project.id}`" :title="project.name" :subtitle="project.customerName">
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
        <!--<f7-button fill round style="width: 100px;" @click="logOut()">Logout</f7-button>-->
      </f7-block>
      <ProjectAddSheet :collectionPath="companiesPaths[0] + '/projects'" :isOpen="isOpenAddNew"
        @close="isOpenAddNew = false" />
      <SearchResultsSheet v-if="searchQuery !== ''" :displayedResources="searchResults" :opened="searchQuery !== ''"
        :isOpen="searchQuery !== ''" />
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

.page-content:::-webkit-scrollbar {
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
</style>