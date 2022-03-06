import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();
 

export const batchAddXmPhaseMenu = params => { return axios.post(`${base}/xm/core/xmPhaseMenu/batchAdd`, params); };

export const batchDelXmPhaseMenu = params => { return axios.post(`${base}/xm/core/xmPhaseMenu/batchDel`, params); };


