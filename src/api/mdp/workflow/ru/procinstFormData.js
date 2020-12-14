import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getWorkflowBasePath();


/**
 * mdp_ru_procinst_form_data
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',procInstId:'流程实例编号',formDataId:'表单数据编号'}
 **/
 
//普通查询 条件之间and关系  
export const listProcinstFormData = params => { return axios.get(`${base}/mdp/workflow/ru/procinstFormData/list`, { params: params }); };

//模糊查询mdp_ru_procinst_form_data 条件之间or关系  
//export const listProcinstFormDataKey = params => { return axios.get(`${base}/mdp/workflow/ru/procinstFormData/listKey`, { params: params }); };

//删除一条mdp_ru_procinst_form_data params={id:'主键 主键'}
export const delProcinstFormData = params => { return axios.post(`${base}/mdp/workflow/ru/procinstFormData/del`,params); };

//批量删除mdp_ru_procinst_form_data  params=[{id:'主键 主键'}]
export const batchDelProcinstFormData = params => { return axios.post(`${base}/mdp/workflow/ru/procinstFormData/batchDel`, params); };

//修改一条mdp_ru_procinst_form_data记录
export const editProcinstFormData = params => { return axios.post(`${base}/mdp/workflow/ru/procinstFormData/edit`, params); };

//新增一条mdp_ru_procinst_form_data
export const addProcinstFormData = params => { return axios.post(`${base}/mdp/workflow/ru/procinstFormData/add`, params); };