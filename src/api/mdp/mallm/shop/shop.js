import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

//普通查询 条件之间and关系  
export const createShopApi = params => { return axios.post(`${base}/mdp/mallm/shop/shop/createShop`, params); };


export const listShop = params => { return axios.get(`${base}/mdp/mallm/shop/shop/list`, {params:params}); };

