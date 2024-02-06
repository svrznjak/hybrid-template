<script setup lang="ts">
import appState from '@/appState';
import messages from '../pages/HomePage.i18n.json';
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  messages
});
appState.dispatch('setSidePanel', false);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  displayedResources: {
    type: Array<any>,
  },
});

</script>
<template>
  <f7-sheet top :opened="isOpen" container-el='#page-content-search-resoults' :close-by-backdrop-click="false"
    :close-by-outside-click="false" style="height: 90%;">
    <f7-page-content>
      <div style="padding-top:50px">
        <f7-list media-list dividers strong-ios outline-ios class="fix-inset" v-if="props.displayedResources">
          <f7-list-item v-for="resource in props.displayedResources" :key="resource.id" :link="`${resource.path}`"
            :title="resource.name" :badge="!resource.isActive ? t('Ni aktiven') : undefined">
          </f7-list-item>
        </f7-list>
      </div>
    </f7-page-content>
  </f7-sheet>
</template>
<style></style>