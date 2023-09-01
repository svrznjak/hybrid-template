export default async function getDefaultTranslationsList() {
  return [
    await import('@vee-validate/i18n/dist/locale/ar.json'),
    await import('@vee-validate/i18n/dist/locale/az.json'),
    await import('@vee-validate/i18n/dist/locale/bg.json'),
    await import('@vee-validate/i18n/dist/locale/bn.json'),
    await import('@vee-validate/i18n/dist/locale/ca.json'),
    await import('@vee-validate/i18n/dist/locale/ckb.json'),
    await import('@vee-validate/i18n/dist/locale/cs.json'),
    await import('@vee-validate/i18n/dist/locale/cy.json'),
    await import('@vee-validate/i18n/dist/locale/da.json'),
    await import('@vee-validate/i18n/dist/locale/de.json'),
    await import('@vee-validate/i18n/dist/locale/el.json'),
    await import('@vee-validate/i18n/dist/locale/en.json'),
    await import('@vee-validate/i18n/dist/locale/es.json'),
    await import('@vee-validate/i18n/dist/locale/et.json'),
    await import('@vee-validate/i18n/dist/locale/eu.json'),
    await import('@vee-validate/i18n/dist/locale/fa.json'),
    await import('@vee-validate/i18n/dist/locale/fr.json'),
    await import('@vee-validate/i18n/dist/locale/he.json'),
    await import('@vee-validate/i18n/dist/locale/hr.json'),
    await import('@vee-validate/i18n/dist/locale/hu.json'),
    await import('@vee-validate/i18n/dist/locale/id.json'),
    await import('@vee-validate/i18n/dist/locale/it.json'),
    await import('@vee-validate/i18n/dist/locale/ja.json'),
    await import('@vee-validate/i18n/dist/locale/ka.json'),
    await import('@vee-validate/i18n/dist/locale/km.json'),
    await import('@vee-validate/i18n/dist/locale/ko.json'),
    await import('@vee-validate/i18n/dist/locale/kz.json'),
    await import('@vee-validate/i18n/dist/locale/lt.json'),
    await import('@vee-validate/i18n/dist/locale/lv.json'),
    await import('@vee-validate/i18n/dist/locale/mn.json'),
    await import('@vee-validate/i18n/dist/locale/ms_MY.json'),
    await import('@vee-validate/i18n/dist/locale/nb_NO.json'),
    await import('@vee-validate/i18n/dist/locale/ne.json'),
    await import('@vee-validate/i18n/dist/locale/nl.json'),
    await import('@vee-validate/i18n/dist/locale/nn_NO.json'),
    await import('@vee-validate/i18n/dist/locale/pl.json'),
    await import('@vee-validate/i18n/dist/locale/pt_BR.json'),
    await import('@vee-validate/i18n/dist/locale/pt_PT.json'),
    await import('@vee-validate/i18n/dist/locale/ro.json'),
    await import('@vee-validate/i18n/dist/locale/ru.json'),
    await import('@vee-validate/i18n/dist/locale/sk.json'),
    await import('@vee-validate/i18n/dist/locale/sl.json'),
    await import('@vee-validate/i18n/dist/locale/so.json'),
    await import('@vee-validate/i18n/dist/locale/sq.json'),
    await import('@vee-validate/i18n/dist/locale/sr.json'),
    await import('@vee-validate/i18n/dist/locale/sr_Latin.json'),
    await import('@vee-validate/i18n/dist/locale/sv.json'),
    await import('@vee-validate/i18n/dist/locale/th.json'),
    await import('@vee-validate/i18n/dist/locale/tr.json'),
    await import('@vee-validate/i18n/dist/locale/ug.json'),
    await import('@vee-validate/i18n/dist/locale/uk.json'),
    await import('@vee-validate/i18n/dist/locale/uz.json'),
    await import('@vee-validate/i18n/dist/locale/vi.json'),
    await import('@vee-validate/i18n/dist/locale/zh_CN.json'),
    await import('@vee-validate/i18n/dist/locale/zh_TW.json')
  ]
}
/*
import { ar } from '@vee-validate/i18n/dist/locale/ar.json';
import { az } from '@vee-validate/i18n/dist/locale/az.json';
import { bg } from '@vee-validate/i18n/dist/locale/bg.json';
import { bn } from '@vee-validate/i18n/dist/locale/bn.json';
import { ca } from '@vee-validate/i18n/dist/locale/ca.json';
import { ckb } from '@vee-validate/i18n/dist/locale/ckb.json';
import { cs } from '@vee-validate/i18n/dist/locale/cs.json';
import { cy } from '@vee-validate/i18n/dist/locale/cy.json';
import { da } from '@vee-validate/i18n/dist/locale/da.json';
import { de } from '@vee-validate/i18n/dist/locale/de.json';
import { el } from '@vee-validate/i18n/dist/locale/el.json';
import { en } from '@vee-validate/i18n/dist/locale/en.json';
import { es } from '@vee-validate/i18n/dist/locale/es.json';
import { et } from '@vee-validate/i18n/dist/locale/et.json';
import { eu } from '@vee-validate/i18n/dist/locale/eu.json';
import { fa } from '@vee-validate/i18n/dist/locale/fa.json';
import { fi } from '@vee-validate/i18n/dist/locale/fi.json';
import { fr } from '@vee-validate/i18n/dist/locale/fr.json';
import { he } from '@vee-validate/i18n/dist/locale/he.json';
import { hr } from '@vee-validate/i18n/dist/locale/hr.json';
import { hu } from '@vee-validate/i18n/dist/locale/hu.json';
import { id } from '@vee-validate/i18n/dist/locale/id.json';
import { it } from '@vee-validate/i18n/dist/locale/it.json';
import { ja } from '@vee-validate/i18n/dist/locale/ja.json';
import { ka } from '@vee-validate/i18n/dist/locale/ka.json';
import { km } from '@vee-validate/i18n/dist/locale/km.json';
import { ko } from '@vee-validate/i18n/dist/locale/ko.json';
import { kz } from '@vee-validate/i18n/dist/locale/kz.json';
import { lt } from '@vee-validate/i18n/dist/locale/lt.json';
import { lv } from '@vee-validate/i18n/dist/locale/lv.json';
import { mn } from '@vee-validate/i18n/dist/locale/mn.json';
import { ms_MY } from '@vee-validate/i18n/dist/locale/ms_MY.json';
import { nb_NO } from '@vee-validate/i18n/dist/locale/nb_NO.json';
import { ne } from '@vee-validate/i18n/dist/locale/ne.json';
import { nl } from '@vee-validate/i18n/dist/locale/nl.json';
import { nn_NO } from '@vee-validate/i18n/dist/locale/nn_NO.json';
import { pl } from '@vee-validate/i18n/dist/locale/pl.json';
import { pt_BR } from '@vee-validate/i18n/dist/locale/pt_BR.json';
import { pt_PT } from '@vee-validate/i18n/dist/locale/pt_PT.json';
import { ro } from '@vee-validate/i18n/dist/locale/ro.json';
import { ru } from '@vee-validate/i18n/dist/locale/ru.json';
import { sk } from '@vee-validate/i18n/dist/locale/sk.json';
import { sl } from '@vee-validate/i18n/dist/locale/sl.json';
import { so } from '@vee-validate/i18n/dist/locale/so.json';
import { sr_Latin } from '@vee-validate/i18n/dist/locale/sr_Latin.json';
import { sr } from '@vee-validate/i18n/dist/locale/sr.json';
import { sv } from '@vee-validate/i18n/dist/locale/sv.json';
import { th } from '@vee-validate/i18n/dist/locale/th.json';
import { tr } from '@vee-validate/i18n/dist/locale/tr.json';
import { ug } from '@vee-validate/i18n/dist/locale/ug.json';
import { uk } from '@vee-validate/i18n/dist/locale/uk.json';
import { uz } from '@vee-validate/i18n/dist/locale/uz.json';
import { vi } from '@vee-validate/i18n/dist/locale/vi.json';
import { zh_CN } from '@vee-validate/i18n/dist/locale/zh_CN.json';
import { zh_TW } from '@vee-validate/i18n/dist/locale/zh_TW.json';
*/
