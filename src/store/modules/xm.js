
var iterationKey='xm-iteration-store';
var productKey='xm-product-store';
var projectKey='xm-project-info-store';
var testCasedbKey='xm-test-casedb-store';

const xm = {
  state: {
    xmIteration: null,
    xmProduct:null,
    projectInfo:null,
    testCasedb:null,
  },
  mutations: {
    SET_XM_ITERATION: (state, xmIteration) => {
      state.xmIteration=xmIteration
      if(xmIteration && xmIteration!='null' && xmIteration!='undefined' ){
        sessionStorage.setItem(iterationKey,JSON.stringify(xmIteration))
      }else{
        sessionStorage.removeItem(iterationKey)
      }
     
    },
    
    SET_XM_PRODUCT: (state, xmProduct) => {
      state.xmProduct=xmProduct
      if(xmProduct && xmProduct!='null' && xmProduct!='undefined' ){
        sessionStorage.setItem(productKey,JSON.stringify(xmProduct))
      }else{
        sessionStorage.removeItem(productKey)
      }
     
    },

    
    SET_PROJECT_INFO: (state, projectInfo) => {
      state.projectInfo=projectInfo
      if(projectInfo && projectInfo!='null' && projectInfo!='undefined' ){
        sessionStorage.setItem(projectKey,JSON.stringify(projectInfo))
      }else{
        sessionStorage.removeItem(projectKey)
      }
     
    },

    SET_TEST_CASEDB: (state, testCasedb) => {
      state.testCasedb=testCasedb
      if(testCasedb && testCasedb!='null' && testCasedb!='undefined' ){
        sessionStorage.setItem(testCasedbKey,JSON.stringify(testCasedb))
      }else{
        sessionStorage.removeItem(testCasedbKey)
      }
     
    },

  },
  actions: {
    setXmIteration({ commit }, xmIteration) {
      commit('SET_XM_ITERATION', xmIteration)
    },
    
    setXmProduct({ commit }, xmProduct) {
      commit('SET_XM_PRODUCT', xmProduct)
    },
    
    setProjectInfo({ commit }, projectInfo) {
      commit('SET_PROJECT_INFO', projectInfo)
    },
    
    setTestCasedb({ commit }, testCasedb) {
      commit('SET_TEST_CASEDB', testCasedb)
    }
  }
}
var iterationStr=sessionStorage.getItem(iterationKey)
if(iterationStr && iterationStr!='null' && iterationStr!='undefined' ){
  xm.state.xmIteration=JSON.parse(iterationStr)
} 

var xmProductStr=sessionStorage.getItem(productKey)
if(xmProductStr && xmProductStr!='null' && xmProductStr!='undefined' ){
  xm.state.xmProduct=JSON.parse(xmProductStr)
} 

var projectStr=sessionStorage.getItem(projectKey)
if(projectStr && projectStr!='null' && projectStr!='undefined' ){
  xm.state.projectInfo=JSON.parse(projectStr)
} 

var testCasedbStr=sessionStorage.getItem(testCasedbKey)
if(testCasedbStr && testCasedbStr!='null' && testCasedbStr!='undefined' ){
  xm.state.testCasedb=JSON.parse(testCasedbStr)
} 

export default xm
