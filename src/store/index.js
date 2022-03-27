import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import noticeMsg from './modules/noticeMsg'
import getters from './getters'
import menuFavorite from './modules/menuFavorite'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    noticeMsg,
    menuFavorite
  },
  getters
})

export default store
