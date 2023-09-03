// capacitor imports
import '@capacitor/core'

// Vue imports
import { createApp } from 'vue'
// Framework7 imports
// @ts-ignore because types are not available
import Framework7 from 'framework7/lite-bundle'
// @ts-ignore because types are not available
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle'
import 'framework7/css/bundle'
// Import Icons and App Custom Styles
import '@/framework7css/icons.css'
Framework7.use(Framework7Vue)

import '#/assets/main.css'

import App from '@/App.vue'

const app = createApp(App)
registerComponents(app)

import registerGlobalComponents from '@/global/components/registerGlobalComponents'
registerGlobalComponents(app)

import VeeValidatePlugin from './plugins/VeeValidatePlugin'
app.use(VeeValidatePlugin)

import i18n from './i18n-setup'
app.use(i18n)

app.mount('#app')
