import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getLcodeContext();
 
//在线生成crud代码并下载
export const crudCodeGen = params => { return axios.get(`${base}/mdp/dev/code/gen`, {params:params}); };


//查询数据源列表
export const dataSourceList = params => { return axios.get(`${base}/mdp/dev/db/dataSource/list`, {params:params}); };