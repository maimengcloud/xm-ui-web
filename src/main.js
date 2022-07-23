import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
//import './mock' // simulation data
import * as echarts from 'echarts' 
import * as filters from './filters' // global filters
import Print from 'vue-print-nb'
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)


import DateRange from '@/components/dateRange/index'
import DictSelect from '@/components/DictSelect/index'
import DictTag from '@/components/DictTag/index'
import DictField from '@/components/DictField/index'
import MyInput from '@/components/MDinput/index'
import DateField from '@/components/DateField/index'
import DateRangeField from '@/components/DateRangeField/index'
import UserField from '@/components/UserField/index'

Vue.prototype.$echarts = echarts
Vue.use(Print); //注册
Vue.component('date-range',DateRange) 
Vue.component('dict-select',DictSelect)
Vue.component('dict-tag',DictTag)
Vue.component('dict-field',DictField)
Vue.component('my-input',MyInput)
Vue.component('date-field',DateField)
Vue.component('date-range-field',DateRangeField)
Vue.component('user-field',UserField)
Vue.use(Element, {
  size: 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
