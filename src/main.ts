// Vue imports
import { createApp } from 'vue'
// Framework7 imports
// @ts-ignore because types are not available
import Framework7 from 'framework7/lite-bundle'
// @ts-ignore because types are not available
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle'
import 'framework7/css/bundle'
// Import Icons and App Custom Styles
import './framework7css/icons.css'
Framework7.use(Framework7Vue)

import '#/assets/main.css'

import App from '@/App.vue'

const app = createApp(App)

// register all Framework7 Vue components
registerComponents(app)

app.mount('#app')
