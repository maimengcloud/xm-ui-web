
var key='xm-iteration';
const xmIteration = {
  state: {
    xmIteration: null,
  },
  mutations: {
    SET_XM_ITERATION: (state, xmIteration) => {
      state.xmIteration=xmIteration
      if(xmIteration && xmIteration!='null' && xmIteration!='undefined' ){
        sessionStorage.setItem(key,JSON.stringify(xmIteration))
      }else{
        sessionStorage.removeItem(key)
      }
     
    }
  },
  actions: {
    setXmIteration({ commit }, xmIteration) {
      commit('SET_XM_ITERATION', xmIteration)
    }
  }
}
var iterationStr=sessionStorage.getItem(key)
if(iterationStr && iterationStr!='null' && iterationStr!='undefined' ){
  xmIteration.state.xmIteration=JSON.parse(iterationStr)
} 

export default xmIteration
