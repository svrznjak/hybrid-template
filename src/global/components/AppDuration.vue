<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { intervalToDuration, formatDuration } from 'date-fns'
import type { Locale } from 'date-fns';
import { computed } from 'vue';
import * as fnsLocales from 'date-fns/locale';
const { locale } = useI18n();


const props = defineProps({
  milliseconds: {
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

const formattedDuration = computed(() => {
  const duration = intervalToDuration({ start: 0, end: props.milliseconds });
  return formatDuration(duration, { locale: fnsLocale.value, format: props.format });
})

</script>

<template >
  <span>
    {{ formattedDuration || '/' }}
  </span>
</template>