import { useI18n } from 'vue-i18n'
import { setLocale as setVeeValidateLocale } from '@vee-validate/i18n'
import defaultTranslationsList from '@/plugins/VeeValidateTranslations/defaultTranslationsList'

let i18n: any = undefined

export default async function setLocale(newLocale: string) {
  if (!i18n) i18n = useI18n()
  i18n.locale.value = newLocale

  // set vee-validate locale
  // get all available locales
  const translations = defaultTranslationsList
  const codes = (await Promise.all(translations)).map((translation) => {
    return translation.code.replace('_', '-')
  })

  // if newLocale is in codes, set it
  if (codes.includes(newLocale)) {
    setVeeValidateLocale(newLocale)
  } else {
    // if newLocale is not in codes, try to set it with the first two letters
    const newLocaleShort = newLocale.substring(0, 2)
    if (codes.includes(newLocaleShort)) {
      setVeeValidateLocale(newLocaleShort)
    } else {
      // if newLocale is not in codes, set it to english
      setVeeValidateLocale('en')
    }
  }
}
