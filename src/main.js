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

Vue.prototype.$echarts = echarts
Vue.use(Print); //注册  

//mdp-ui 基础组件
import MdpComponents from '@/components/mdp-ui/index.js'
Vue.use(MdpComponents)

//拓展的组件
import MdpExtComponents from '@/components/mdp-ui-ext/index.js'
Vue.use(MdpExtComponents) 

// 公共api
import mdp_pub from "@/api/mdp_pub"; 
Vue.prototype.$mdp = mdp_pub; 


Vue.prototype.$echarts = echarts
Vue.use(Print); //注册

import vueToPdf from 'vue-to-pdf';
Vue.use(vueToPdf);


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
