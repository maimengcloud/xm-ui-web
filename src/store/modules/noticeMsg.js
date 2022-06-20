const noticeMsg = {
  state: { 
    noticeMsg:[
      /**{id:'消息编号 主键',sendUserid:'操作人id',sendUsername:'操作人名字',operTime:'操作时间',objType:'对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7',msg:'备注-完整描述',gloNo:'全局根踪号，用于跟踪日志',branchId:'机构编号',ip:'ip地址',bizId:'业务主键编号',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号',bizName:'对象名称',toUserid:'接收用户编号',toUsername:'接收用户名称',hadRead:'是否已读'} */
    ],
     
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
 
export default noticeMsg