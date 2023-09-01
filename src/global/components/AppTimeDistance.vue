<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { formatDistance } from 'date-fns'
import type { Locale } from 'date-fns';
import { computed } from 'vue';
import * as fnsLocales from 'date-fns/locale';
const { locale } = useI18n();


const props = defineProps({
  from: {
    type: Number,
    required: true,
  },
  to: {
    type: Number,
    required: true,
  },
  format: {
    type: (Array as () => string[]),
    required: false,
  }
});

const fnsLocale = computed(() => {
  const formatedLocale = locale.value.replace('-', '');
  if (fnsLocales[formatedLocale as keyof Locale['code']] !== undefined)
    return fnsLocales[formatedLocale as keyof Locale['code']];
  if (fnsLocales[formatedLocale.substring(0, 2) as keyof Locale['code']] !== undefined)
    return fnsLocales[formatedLocale.substring(0, 2) as keyof Locale['code']];
  return fnsLocales["enUS"];
})

const formattedDistance = computed(() => {
  return formatDistance(props.to, props.from, { locale: fnsLocale.value, addSuffix: true, });
})

</script>

<template >
  <span>
    {{ formattedDistance || '/' }}
  </span>
</template>