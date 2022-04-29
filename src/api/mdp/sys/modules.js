import axios from '@/utils/request'
import config from '@/common/config'

let base = config.getSysBasePath();


export const getAllMenuModule = params => { return axios.get(`${base}/sys/sys/mdp/menu/menuModule/list`, {params: params }); };
export const getBuyMenuModule = params => { return axios.get(`${base}/sys/sys/mdp/menu/menuModuleBranch/list`, {params: params }); };
