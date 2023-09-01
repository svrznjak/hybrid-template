<script lang="ts">
import { f7Input } from 'framework7-vue';
export default {
  name: 'f7-input',
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import type { FieldContext } from 'vee-validate';
import type { PropType } from 'vue';

defineProps({
  field: {
    type: Object as PropType<FieldContext>,
    required: true,
  },


})
</script>

<template>
  <f7-input :value="field.value.value" @input="$emit('input', $event)"
    :error-message-force="field.errors.value[0] !== undefined" :error-message="field.errors.value[0]" v-bind="$attrs">
    <slot></slot>
  </f7-input>
</template>