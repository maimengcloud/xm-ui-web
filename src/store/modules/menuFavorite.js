
const menuFavorite = {
  state: {
    //喜欢的菜单
    fMenu: [],
    loading: {search: false, add: false}

  },

  mutations: {
    
    getUserFavoriteMenuRequest(state) {
        state.loading.search = true;
    },

    getUserFavoriteMenuFailure(state) {
        state.loading.search = false;
    },

    getUserFavoriteMenuSuccess(state, {list}) {
        state.loading.search = false;
        console.log(list, "list--->");
        state.fMenu = list;
    },

    saveUserFavoriteMenuRequest(state) {
      state.loading.add = true;
    },

    saveUserFavoriteMenuFailure(state) {
      state.loading.add = false;
    },

    saveUserFavoriteMenuSuccess(state, {}) {
      state.loading.add = false;
    },

  },

  actions: {
    getUserFavoriteMenu({commit, state}, {userid}) {
      commit('getUserFavoriteMenuRequest');
      this.$mdp.userMenuFavoriteList({userid}).then(res => {
        commit('getUserFavoriteMenuSuccess', {list: res.data.data});
      }).catch(err => {
        commit('getUserFavoriteMenuFailure');
      })
    },

    saveUserFavoriteMenu({commit, state, dispatch}, form) {
      commit('saveUserFavoriteMenuRequest');
      this.$mdp.saveMenuFavoriteList(form).then(res => {
        dispatch('getUserFavoriteMenu', {userid: form.userid});
        commit('saveUserFavoriteMenuSuccess');
      }).catch(err => {
        commit('saveUserFavoriteMenuFailure');
      })
    } 



  }
}

export default menuFavorite