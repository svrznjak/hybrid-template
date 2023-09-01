// import all default locales from @vee-validate/i18n
import defaultTranslationsList from './VeeValidateTranslations/defaultTranslationsList'

import { Form, defineRule, configure } from 'vee-validate'
import FieldInput from '@/global/components/FieldInput.vue'
import FieldListInput from '@/global/components/FieldListInput.vue'
import rules from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'

import defaultVeeTranslation from './VeeValidateTranslations/en-US.json'
import locales from '@/global/data/locales.json'
import { get } from 'http'
import getDefaultTranslationsList from './VeeValidateTranslations/defaultTranslationsList'

export default {
  install: (app: any) => {
    // Define all default rules from @vee-validate/rules
    Object.keys(rules).forEach((rule) => {
      defineRule(rule, rules[rule])
    })

    // Set en-US as translation for all languages to ensure default is working well
    for (const locale in locales) {
      configure({
        generateMessage: localize(locale, { messages: defaultVeeTranslation.messages })
      })
    }

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
      console.log(imports)
      for (const path in imports) {
        const language: any = await imports[path]()
        const code = language.code
        const messages = { messages: language.messages }
        configure({
          generateMessage: localize(code, messages)
        })
      }
    })()

    // register components to app (global)
    app.component('VeeForm', Form)
  }
}
