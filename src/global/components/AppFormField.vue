<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [Number, String, Boolean],
    default: '',
  },
})

const thisInput: Ref<HTMLElement | null> = ref(null);

const focus = () => {
  if (thisInput.value) {
    thisInput.value.querySelector('input')?.focus();

  }
};

defineExpose({
  focus,
});

</script>

<template>
  <div ref="thisInput">
    <label :for="name">{{ label }}:</label>
    <VeeErrorMessage :name="name" class="input-error" />
    <VeeField class="field" :name="name" :label="label" :as="$attrs.as" :modelValue="modelValue"
      @input="$emit('modelUpdate', $event)" :id="name" v-bind="$attrs" data-error-message="Only numbers please!" />
  </div>
</template>

<style scoped>
.input-error {
  float: right;
  margin-right: 3px;
  text-align: right;
  color: var(--redColor);
}

.input-error+.field {
  border-color: var(--redColor);
}
</style>