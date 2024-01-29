import 'vue';
import { Router } from 'framework7/modules/router/router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router;
  }
}
