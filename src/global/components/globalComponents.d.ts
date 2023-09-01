import AppDuration from './AppDuration.vue'
import AppTimeDistance from './AppTimeDistance.vue'
import FieldInput from '@/global/components/FieldInput.vue'
import FieldListInput from '@/global/components/FieldListInput.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AppDuration: typeof AppDuration
    AppTimeDistance: typeof AppTimeDistance
    FieldInput: typeof FieldInput
    FieldListInput: typeof FieldListInput
  }
}
