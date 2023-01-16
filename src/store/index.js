import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import noticeMsg from './modules/noticeMsg'
import projectInfo from './modules/projectInfo'
import xmProduct from './modules/xmProduct'
import xmIteration from './modules/xmIteration'

import getters from './getters' 

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    noticeMsg, 
    projectInfo,
    xmProduct,
    xmIteration,
  },
  getters
})

export default store
