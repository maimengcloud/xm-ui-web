import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getSysContext()

//普通查询 条件之间and关系  
export const selectshopLocationBySysDeptIdApi = params => { return axios.post(`${base}/mdp/mallm/shop/shopLocation/selectshopLocationBySysDeptId`, params); };

