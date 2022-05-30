import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import zhSysLocale from './zh_sys'
import zhWorkflowLocale from './zh_workflow'

import zhFormLocale from './zh_form'

Vue.use(VueI18n)
 
let allZhLocale= Object.assign({},zhLocale,zhSysLocale);

allZhLocale.route=Object.assign(allZhLocale.route,zhWorkflowLocale.route,zhFormLocale.route)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...elementZhLocale,
    ...allZhLocale
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh', // set locale
  messages // set locale messages
})

export default i18n
