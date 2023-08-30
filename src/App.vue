<script setup lang="ts">
import { f7App, f7View } from 'framework7-vue';
import routes from '@/app/routes';
console.log(__APP_CONFIG__);

const f7params = {
  name: __APP_CONFIG__.APP_TITLE,
  routes,
}


</script>

<template>
  <f7App v-bind="f7params">
    <f7View main url="/" />
  </f7App>
</template>

<style scoped></style>
./app/routes