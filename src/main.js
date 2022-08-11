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


import MdpFieldX from '@/components/MdpFieldX/index'
import MdpDateX from '@/components/MdpDateX/index'
import MdpDateRange from '@/components/MdpDateRange/index'
import MdpDateRangeX from '@/components/MdpDateRangeX/index'
import MdpSelectDict from '@/components/MdpSelectDict/index'
import MdpSelectDictTag from '@/components/MdpSelectDictTag/index'
import MdpSelectDictX from '@/components/MdpSelectDictX/index'
import MdpSelectUserX from '@/components/MdpSelectUserX/index'
import MyInput from '@/components/MDinput/index'

Vue.prototype.$echarts = echarts
Vue.use(Print); //注册
Vue.component('mdp-date-range',MdpDateRange) 
Vue.component('mdp-field-x',MdpFieldX) 
Vue.component('mdp-select-dict',MdpSelectDict)
Vue.component('mdp-select-dict-tag',MdpSelectDictTag)
Vue.component('mdp-select-dict-x',MdpSelectDictX)
Vue.component('my-input',MyInput)
Vue.component('mdp-date-x',MdpDateX)
Vue.component('mdp-date-range-x',MdpDateRangeX)
Vue.component('mdp-select-user-x',MdpSelectUserX)
 

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
