import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getMallmBasePath();


//export const getNoticeMsg = params => { return axios.get(`${base}/mallm/cpd/index/toHandleOrdersCount`, { params: params }); };

export const getNoticeMsg = params => {
    if(process.env.CONTEXT=='mallm'){
      return axios.get(`${base}/mallm/cpd/index/toHandleOrdersCount`, { params: params });
    }else{
      return new Promise((resolve, reject) => {
          var res={
            data:{
              tips:{
                isOk:true,
                msg:'请求成功'
              },
              data:{
                toPayNum:0,
                toSendNum:0,
                toReceNum:0,
                toApprovaNum:0,
                hadApprovaNum:0,
                hadFinishNum:0,
                hadCloseNum:0,
                hadCancelNum:0,
                totalNum:0,
              }
            }
          }
          resolve(res)
      })
    }
 };
