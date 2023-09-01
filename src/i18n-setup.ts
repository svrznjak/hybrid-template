import { createI18n } from 'vue-i18n'
import messages from './globalMessages.i18n.json'

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: 'en-US', // set locale
  fallbackLocale: 'en-US', // set fallback locale
  fallbackWarn: false,
  missingWarn: false,
  warnHtmlMessage: false,
  globalInjection: true,

  messages: messages
})

export default i18n
