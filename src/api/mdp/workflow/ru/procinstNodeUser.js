import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getWorkflowContext();


/**
 * mdp_ru_procinst_node_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',nodeId:'node_info中的id',userid:'用户编号',username:'用户名称',ctime:'新增时间'}
 **/
 
//普通查询 条件之间and关系  
export const listProcinstNodeUser = params => { return axios.get(`${base}/mdp/workflow/ru/procinstNodeUser/list`, { params: params }); };

//模糊查询mdp_ru_procinst_node_user 条件之间or关系  
//export const listProcinstNodeUserKey = params => { return axios.get(`${base}/mdp/workflow/ru/procinstNodeUser/listKey`, { params: params }); };

//删除一条mdp_ru_procinst_node_user params={id:'主键 主键'}
export const delProcinstNodeUser = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeUser/del`,params); };

//批量删除mdp_ru_procinst_node_user  params=[{id:'主键 主键'}]
export const batchDelProcinstNodeUser = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeUser/batchDel`, params); };

//修改一条mdp_ru_procinst_node_user记录
export const editProcinstNodeUser = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeUser/edit`, params); };

//新增一条mdp_ru_procinst_node_user
export const addProcinstNodeUser = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeUser/add`, params); };