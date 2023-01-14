
var key='xm-project-info';
const projectInfo = {
  state: {
    projectInfo: {}
  },
  mutations: {
    SET_PROJECT: (state, projectInfo) => {
      state.projectInfo=projectInfo
      if(projectInfo && projectInfo!='null' && projectInfo!='undefined' ){
        sessionStorage.setItem(key,JSON.stringify(projectInfo))
      }else{
        sessionStorage.removeItem(key)
      }
     
    }
  },
  actions: {
    setProject({ commit }, projectInfo) {
      commit('SET_PROJECT', projectInfo)
    }
  }
}
var projectStr=sessionStorage.getItem(key)
if(projectStr && projectStr!='null' && projectStr!='undefined' ){
  projectInfo.state.projectInfo=JSON.parse(projectStr)
} 

export default projectInfo
