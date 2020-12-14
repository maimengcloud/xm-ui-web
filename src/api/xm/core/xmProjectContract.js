import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_contract
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={htId:'合同编号 主键',projectId:'项目编号'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectContract = params => { return axios.get(`${base}/xm/core/xmProjectContract/list`, { params: params }); };

//模糊查询xm_project_contract 条件之间or关系  
//export const listXmProjectContractKey = params => { return axios.get(`${base}/xm/core/xmProjectContract/listKey`, { params: params }); };

//删除一条xm_project_contract params={htId:'合同编号 主键'}
export const delXmProjectContract = params => { return axios.post(`${base}/xm/core/xmProjectContract/del`,params); };

//批量删除xm_project_contract  params=[{htId:'合同编号 主键'}]
export const batchDelXmProjectContract = params => { return axios.post(`${base}/xm/core/xmProjectContract/batchDel`, params); };

//修改一条xm_project_contract记录
export const editXmProjectContract = params => { return axios.post(`${base}/xm/core/xmProjectContract/edit`, params); };

//新增一条xm_project_contract
export const addXmProjectContract = params => { return axios.post(`${base}/xm/core/xmProjectContract/add`, params); };