import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getWorkflowContext();


/**
 * mdp_re_procdef_tag
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',procInstId:'流程实例编号',tagId:'标签(arc.arc_tag表的id)',addUserid:'谁给我打的标签',addTime:'添加时间',state:'0无效1有效',procDefId:'流程定义编号',tagName:'tag_name'}
 **/
 
//普通查询 条件之间and关系  
export const listProcdefTag = params => { return axios.get(`${base}/mdp/workflow/re/procdefTag/list`, { params: params }); };

//模糊查询mdp_re_procdef_tag 条件之间or关系  
//export const listProcdefTagKey = params => { return axios.get(`${base}/mdp/workflow/re/procdefTag/listKey`, { params: params }); };

//删除一条mdp_re_procdef_tag params={id:'id 主键'}
export const delProcdefTag = params => { return axios.post(`${base}/mdp/workflow/re/procdefTag/del`,params); };

//批量删除mdp_re_procdef_tag  params=[{id:'id 主键'}]
export const batchDelProcdefTag = params => { return axios.post(`${base}/mdp/workflow/re/procdefTag/batchDel`, params); };

//修改一条mdp_re_procdef_tag记录
export const editProcdefTag = params => { return axios.post(`${base}/mdp/workflow/re/procdefTag/edit`, params); };

//新增一条mdp_re_procdef_tag
export const addProcdefTag = params => { return axios.post(`${base}/mdp/workflow/re/procdefTag/add`, params); };


// params=[{procDefId:'',branchId:'',userid:'',tags:[{tagId:'',tagName:''}]}]
export const batchInsertOrDeleteTags = params => { return axios.post(`${base}/mdp/workflow/re/procdefTag/batchInsertOrDeleteTags`, params); };