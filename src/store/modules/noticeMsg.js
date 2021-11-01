const noticeMsg = {
  state: { 
    noticeMsg:{ 
       toPayNum:0,
       toSendNum:0,
       toReceNum:0,
       toApprovaNum:0,
       hadApprovaNum:0,
       hadFinishNum:0,
       hadCloseNum:0,
       hadCancelNum:0,
       totalNum:0,
    },
     
  },

  mutations: {
     
    SET_NOTICE_MSG:(state,noticeMsg)=>{
      state.noticeMsg = noticeMsg
    },
     
  },

  actions: {
     setNoticeMsg({ commit }, noticeMsg){ 
      return new Promise((resolve, reject) => {
        commit("SET_NOTICE_MSG",noticeMsg)
        localStorage.setItem("noticeMsg",JSON.stringify(noticeMsg));
        resolve(noticeMsg)
      })
     }
 
  }
} 
var noticeMsgLocal=localStorage.getItem("noticeMsg");
if(noticeMsgLocal){
   
  noticeMsg.state.noticeMsg=Object.assign( noticeMsg.state.noticeMsg,JSON.parse(noticeMsgLocal))
}
export default noticeMsg