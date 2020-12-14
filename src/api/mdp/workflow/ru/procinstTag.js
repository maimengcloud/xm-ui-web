import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getWorkflowBasePath();


/**
 * mdp_ru_procinst_tag
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',procDefId:'流程编号',tag:'标签(arc.arc_tag表的id)',addUserid:'谁给我打的标签',addTime:'添加时间',state:'0无效1有效',tagName:'tag_name'}
 **/
 
//普通查询 条件之间and关系  
export const listProcinstTag = params => { return axios.get(`${base}/mdp/workflow/ru/procinstTag/list`, { params: params }); };

//模糊查询mdp_ru_procinst_tag 条件之间or关系  
//export const listProcinstTagKey = params => { return axios.get(`${base}/mdp/workflow/ru/procinstTag/listKey`, { params: params }); };

//删除一条mdp_ru_procinst_tag params={id:'id 主键'}
export const delProcinstTag = params => { return axios.post(`${base}/mdp/workflow/ru/procinstTag/del`,params); };

//批量删除mdp_ru_procinst_tag  params=[{id:'id 主键'}]
export const batchDelProcinstTag = params => { return axios.post(`${base}/mdp/workflow/ru/procinstTag/batchDel`, params); };

//修改一条mdp_ru_procinst_tag记录
export const editProcinstTag = params => { return axios.post(`${base}/mdp/workflow/ru/procinstTag/edit`, params); };

//新增一条mdp_ru_procinst_tag
export const addProcinstTag = params => { return axios.post(`${base}/mdp/workflow/ru/procinstTag/add`, params); };

// params=[{procInstId:'',procDefId:'',branchId:'',userid:'',tags:[{tagId:'',tagName:''}]}]
export const batchInsertOrDeleteTags = params => { return axios.post(`${base}/mdp/workflow/ru/procinstTag/batchInsertOrDeleteTags`, params); };

