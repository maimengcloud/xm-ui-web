
var key='xm-iteration-info';
const iterationInfo = {
  state: {
    iterationInfo: null,
  },
  mutations: {
    SET_ITERATION_INFO: (state, iterationInfo) => {
      state.iterationInfo=iterationInfo
      if(iterationInfo && iterationInfo!='null' && iterationInfo!='undefined' ){
        sessionStorage.setItem(key,JSON.stringify(iterationInfo))
      }else{
        sessionStorage.removeItem(key)
      }
     
    }
  },
  actions: {
    setIterationInfo({ commit }, iterationInfo) {
      commit('SET_ITERATION_INFO', iterationInfo)
    }
  }
}
var iterationStr=sessionStorage.getItem(key)
if(iterationStr && iterationStr!='null' && iterationStr!='undefined' ){
  iterationInfo.state.iterationInfo=JSON.parse(iterationStr)
} 

export default iterationInfo
