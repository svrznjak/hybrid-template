// import all default locales from @vee-validate/i18n
import { Form, defineRule, configure } from 'vee-validate'
import rules from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

import defaultVeeTranslation from './VeeValidateTranslations/en-US.json'
import locales from '@/global/data/locales.json'
import getDefaultTranslationsList from './VeeValidateTranslations/defaultTranslationsList'

import VueI18n from 'vue-i18n'

export default {
  install: (app: any) => {
    // Define all default rules from @vee-validate/rules
    Object.keys(rules).forEach((rule) => {
      defineRule(rule, rules[rule])
    })

    //Import all translations from i18n package
    ;(async () => {
      const translations = await getDefaultTranslationsList()
      translations.forEach((translation) => {
        const code = translation.code
        const messages = { messages: translation.messages }
        configure({
          generateMessage: localize(code, messages)
        })
      })
    })()

    //Import all translations from adjacent folder and overwrite translations
    ;(async () => {
      const imports = import.meta.glob('./VeeValidateTranslations/*.json')
      for (const path in imports) {
        const language: any = await imports[path]()
        const code = language.code
        const messages = { messages: language.messages }
        configure({
          generateMessage: localize(code.replace('_', '-'), messages)
        })
      }
    })()

    // register components to app (global)
    app.component('VeeForm', Form)
  }
}
