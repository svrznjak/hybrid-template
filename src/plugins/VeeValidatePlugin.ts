// import all default locales from @vee-validate/i18n
import { Form, defineRule, configure } from 'vee-validate';
import rules from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

import defaultVeeTranslation from './VeeValidateTranslations/en-US.json';
import locales from '@/global/data/locales.json';
import defaultTranslationsList from './VeeValidateTranslations/defaultTranslationsList';

export default {
  install: async (app: any) => {
    // Define all default rules from @vee-validate/rules
    Object.keys(rules).forEach((rule) => {
      defineRule(rule, rules[rule]);
    });

    // Set en-US as translation for all languages to ensure default is working well
    for (const locale in locales) {
      configure({
        generateMessage: localize(locale, { messages: defaultVeeTranslation.messages })
      });
    }

    //Import all translations from i18n package
    (async () => {
      const translations = await Promise.all(defaultTranslationsList);
      translations.forEach((translation) => {
        const code = translation.code;
        const messages = { messages: translation.messages };
        configure({
          generateMessage: localize(code.replace('_', '-'), messages)
        });
      });
    })();

    //Import all translations from adjacent folder and overwrite translations
    (async () => {
      const imports = await import.meta.glob('./VeeValidateTranslations/*.json');
      for (const path in imports) {
        const language: any = await imports[path]();
        const code = language.code;
        const messages = { messages: language.messages };
        configure({
          generateMessage: localize(code, messages)
        });
      }
    })();

    // register components to app (global)
    app.component('VeeForm', Form);
  }
};
