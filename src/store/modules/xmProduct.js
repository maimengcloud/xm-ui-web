
var key='xm-product';
const xmProduct = {
  state: {
    xmProduct: null,
  },
  mutations: {
    SET_XM_PRODUCT: (state, xmProduct) => {
      state.xmProduct=xmProduct
      if(xmProduct && xmProduct!='null' && xmProduct!='undefined' ){
        sessionStorage.setItem(key,JSON.stringify(xmProduct))
      }else{
        sessionStorage.removeItem(key)
      }
     
    }
  },
  actions: {
    setXmProduct({ commit }, xmProduct) {
      commit('SET_XM_PRODUCT', xmProduct)
    }
  }
}
var xmProductStr=sessionStorage.getItem(key)
if(xmProductStr && xmProductStr!='null' && xmProductStr!='undefined' ){
  xmProduct.state.xmProduct=JSON.parse(xmProductStr)
} 

export default xmProduct
