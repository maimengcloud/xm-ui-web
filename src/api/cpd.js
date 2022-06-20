import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


//export const getNoticeMsg = params => { return axios.get(`${base}/mallm/cpd/index/toHandleOrdersCount`, { params: params }); };

export const getNoticeMsg = params => { 
      return axios.get(`${base}/sys/notifyMsg/list`, { params: params }); 
 };
