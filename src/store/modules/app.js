import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    language: Cookies.get('language') || 'zh'
  },
  mutations: {
    TOGGLE_SIDEBAR: (state,toOpen) => {
      if(toOpen==true){
        Cookies.set('sidebarStatus', 1)
        state.sidebar.opened =1
      }else if(toOpen==false){
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened =0
      }else{
        if (state.sidebar.opened) {
          Cookies.set('sidebarStatus', 1)
        } else {
          Cookies.set('sidebarStatus', 0)
        }
        state.sidebar.opened = !state.sidebar.opened

      }
     
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    }
  },
  actions: {
    toggleSideBar({ commit },toOpen) {
      commit('TOGGLE_SIDEBAR',toOpen)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    }
  }
}

export default app
