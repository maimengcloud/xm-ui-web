import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getWorkflowBasePath();


/**
 * mdp_re_procdef_node_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',nodeId:'node_info中的id',userid:'用户编号',username:'用户名称',ctime:'新增时间'}
 **/
 
//普通查询 条件之间and关系  
export const listProcdefNodeUser = params => { return axios.get(`${base}/mdp/workflow/re/procdefNodeUser/list`, { params: params }); };

//模糊查询mdp_re_procdef_node_user 条件之间or关系  
//export const listProcdefNodeUserKey = params => { return axios.get(`${base}/mdp/workflow/re/procdefNodeUser/listKey`, { params: params }); };

//删除一条mdp_re_procdef_node_user params={id:'主键 主键'}
export const delProcdefNodeUser = params => { return axios.post(`${base}/mdp/workflow/re/procdefNodeUser/del`,params); };

//批量删除mdp_re_procdef_node_user  params=[{id:'主键 主键'}]
export const batchDelProcdefNodeUser = params => { return axios.post(`${base}/mdp/workflow/re/procdefNodeUser/batchDel`, params); };

//修改一条mdp_re_procdef_node_user记录
export const editProcdefNodeUser = params => { return axios.post(`${base}/mdp/workflow/re/procdefNodeUser/edit`, params); };

//新增一条mdp_re_procdef_node_user
export const addProcdefNodeUser = params => { return axios.post(`${base}/mdp/workflow/re/procdefNodeUser/add`, params); };