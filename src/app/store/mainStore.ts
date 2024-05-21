import { reactive, ref, watch } from 'vue';
import { companySchema, type ICompany } from '#/types/company';
import type { IResource } from '../types/resource';
import {
  unsubscribeFromDocument,
  useDocument,
  type IActiveDocument
} from '@/firestore/useDocument';
import type { IActiveCollection } from '@/firestore/useCollection';

const emptyCompany = {
  id: '',
  name: '',
  users: {},
  projects: [],
  resourceTypes: [],
  path: ''
};

const currentCompanyId = ref<string | undefined>(undefined);

const mainStore = reactive<ICompany>(emptyCompany);

const allResourcesOfSelectedCompany = reactive<IResource[]>([]);

const companySnapshot = ref<IActiveDocument<ICompany>>();

export async function useAppStore(companyId: string): Promise<ICompany> {
  // in case requested company is already loaded in the store return it
  if (currentCompanyId.value === companyId) return mainStore;

  // in case any company is already loaded in the store, clear it
  if (currentCompanyId.value) {
    Object.assign(mainStore, emptyCompany);
    Object.assign(allResourcesOfSelectedCompany, []);
    unsubscribeFromDocument(`companies/${currentCompanyId.value}`);
  }
  currentCompanyId.value = companyId;

  // load company doc snapshot listener from firestore
  companySnapshot.value = await useDocument<ICompany>(
    `companies/${companyId}`,
    companySchema.parse
  );

  return mainStore;
}

watch(
  () => companySnapshot.value,
  async (newVal) => {
    if (newVal === undefined) return;
    if (newVal.data.id !== mainStore.id) mainStore.id = newVal.data.id;
    if (newVal.data.name !== mainStore.name) mainStore.name = newVal.data.name;
  }
);
