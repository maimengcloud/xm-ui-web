import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


//export const getNoticeMsg = params => { return axios.get(`${base}/mallm/cpd/index/toHandleOrdersCount`, { params: params }); };

export const getNoticeMsg = params => { 
      return axios.get(`${base}/sys/notifyMsg/list`, { params: params }); 
 };
 export const goToPage = (that,item) => { 

      var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net 
      if(item.objType=='1'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/xmProject/XmProjectInfoRoute",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmProject/XmProjectInfoRoute?id="+item.bizId)
            }
      }else if(item.objType=='2'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/xmTask/XmTaskDetailRoute",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmTask/XmTaskDetailRoute?id="+item.bizId)
            }
      }else if(item.objType=='3'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/xmProduct/XmProductInfoRoute",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmProduct/XmProductInfoRoute?id="+item.bizId)
            }
      }else if(item.objType=='4'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/xmMenu/XmMenuDetailRoute",query:{menuId:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmMenu/XmMenuDetailRoute?menuId="+item.bizId)
            }
      }else if(item.objType=='5'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/xmQuestion/XmQuestionDetailRoute",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmQuestion/XmQuestionDetailRoute?id="+item.bizId)
            }
      }else if(item.objType=='6'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/xmIteration/XmIterationInfoRoute",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmIteration/XmIterationInfoRoute?id="+item.bizId)
            }
      }else if(item.objType=='7'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/xmGroup/xmGroupRoute",query:{projectId:item.pbizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/xmGroup/xmGroupRoute?projectId="+item.pbizId)
            }
      }
} 