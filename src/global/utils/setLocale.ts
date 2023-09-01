import { useI18n } from 'vue-i18n'
import { setLocale as setVeeValidateLocale } from '@vee-validate/i18n'

let i18n: any = undefined

export default function setLocale(newLocale: string) {
  if (!i18n) i18n = useI18n()
  i18n.locale.value = newLocale
  setVeeValidateLocale(newLocale)
}
