
var key='xm-project-info';
const projectInfo = {
  state: {
    projectInfo: null,
  },
  mutations: {
    SET_PROJECT_INFO: (state, projectInfo) => {
      state.projectInfo=projectInfo
      if(projectInfo && projectInfo!='null' && projectInfo!='undefined' ){
        sessionStorage.setItem(key,JSON.stringify(projectInfo))
      }else{
        sessionStorage.removeItem(key)
      }
     
    }
  },
  actions: {
    setProjectInfo({ commit }, projectInfo) {
      commit('SET_PROJECT_INFO', projectInfo)
    }
  }
}
var projectStr=sessionStorage.getItem(key)
if(projectStr && projectStr!='null' && projectStr!='undefined' ){
  projectInfo.state.projectInfo=JSON.parse(projectStr)
} 

export default projectInfo
