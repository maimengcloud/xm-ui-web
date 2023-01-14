const productInfo = {
  state: {
    productInfo: {}
  },
  mutations: {
    SET_PRODUCT: (state, productInfo) => {
      state.productInfo=productInfo
    }
  },
  actions: {
    setProduct({ commit }, productInfo) {
      commit('SET_PRODUCT', productInfo)
    }
  }
}

export default productInfo
