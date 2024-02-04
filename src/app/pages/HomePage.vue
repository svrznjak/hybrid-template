<script setup lang="ts">
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import appState from '@/appState';
import { onMounted, ref } from 'vue';
import messages from './HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { useCollection } from "../store/useCollection";
import ProjectAddSheet from '../components/ProjectAddSheet.vue';
import getParentReference from "../utils/getParentReference";
import logo from '#/assets/appIcons/egm-logo.png';
appState.dispatch('setSidePanel', false);

const getUsersCompanies = async (userId: string) => {
  const { snapshots } = await FirebaseFirestore.getCollectionGroup({
    reference: 'resources',
    compositeFilter: {
      type: 'and',
      queryConstraints: [
        {
          type: 'where',
          fieldPath: `uid`,
          opStr: '==',
          value: userId
        },
      ],
    },
  });
  const companiesReferences = snapshots.map((snap: any) => {
    return getParentReference(snap.path, 4);
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
      <f7-searchbar></f7-searchbar>
    </f7-navbar>
    <f7-block style="display: flex; gap: 10px;  justify-content: space-between;">
      <img :src="logo" height="40" />
      <div style="display: flex; gap: 10px;">
        <f7-button outline round style=" width: fit-content;"
          @click="$router.navigate(companiesPaths[0] + '/resourceTypes')">{{
            t('Viri')
          }}</f7-button>
        <f7-button fill round style="width: fit-content;" @click="isOpenAddNew = true">{{ t('Nov projekt') }}</f7-button>
      </div>
    </f7-block>
    <f7-block-title>{{ t('Aktivni') }}</f7-block-title>
    <f7-list media-list dividers strong-ios outline-ios v-if="projects">
      <f7-list-item v-for="project in projects.data" :key="project.id"
        :link="`${companiesPaths[0]}/projects/${project.id}`" :title="project.name" after="od junija do maja"
        :subtitle="project.customer" text="10 zaposlenih | 2 avtomobila | 2 kartici">
      </f7-list-item>
    </f7-list>
    <f7-block style="display: flex; gap: 10px;">
      <f7-button fill round style="width: 100px;" @click="logOut()">Logout</f7-button>
    </f7-block>
    <ProjectAddSheet :collectionPath="companiesPaths[0] + '/projects'" :isOpen="isOpenAddNew"
      @close="isOpenAddNew = false" />
  </f7-page>
</template>
<style>
/** Global fixes */
.md .list.fix-inset .item-inner {
  padding-right: 0px;
  margin-right: calc(var(--f7-list-item-padding-horizontal) + var(--f7-safe-area-right));
}
</style>