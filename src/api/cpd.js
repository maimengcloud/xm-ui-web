import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getMallmBasePath(); 


export const getNoticeMsg = params => { return axios.get(`${base}/mallm/cpd/index/toHandleOrdersCount`, { params: params }); };
 