import axios from '@/utils/request'


import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext();


//export const getNoticeMsg = params => { return axios.get(`${base}/mallm/cpd/index/toHandleOrdersCount`, { params: params }); };

export const getNoticeMsg = params => { 
      return axios.get(`${base}/sys/notifyMsg/list`, { params: params }); 
 };
 export const goToPage = (that,item) => { 

      var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net 
      if(item.objType=='1'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/project/overview",query:{projectId:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/project/overview?projectId="+item.bizId)
            }
      }else if(item.objType=='2'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/task/detail",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/task/detail?id="+item.bizId)
            }
      }else if(item.objType=='3'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/product/overview",query:{productId:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/product/overview?productId="+item.bizId)
            }
      }else if(item.objType=='4'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/menu/detail",query:{menuId:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/menu/detail?menuId="+item.bizId)
            }
      }else if(item.objType=='5'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/question/detail",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/question/detail?id="+item.bizId)
            }
      }else if(item.objType=='6'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/iteration/detail",query:{id:item.bizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/iteration/detail?id="+item.bizId)
            }
      }else if(item.objType=='7'){
            if(process.env.CONTEXT=='xm'){
            that.$router.push({path:"/xm/core/group/detail",query:{projectId:item.pbizId}})
            }else{
            window.open(curlDomain+"/xm/"+process.env.VERSION+"/#/xm/core/group/detail?projectId="+item.pbizId)
            }
      }
} 