import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getWorkflowBasePath();


/**
 * mdp_biz_model
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',bizName:'业务名称',bizKey:'业务编码',modelKey:'模型编码',modelName:'模型名称',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listBizModel = params => { return axios.get(`${base}/mdp/workflow/biz/bizModel/list`, { params: params }); };

//模糊查询mdp_biz_model 条件之间or关系  
//export const listBizModelKey = params => { return axios.get(`${base}/mdp/workflow/biz/bizModel/listKey`, { params: params }); };

//删除一条mdp_biz_model params={id:'主键 主键'}
export const delBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/del`,params); };

//批量删除mdp_biz_model  params=[{id:'主键 主键'}]
export const batchDelBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/batchDel`, params); };

//修改一条mdp_biz_model记录
export const editBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/edit`, params); };

//新增一条mdp_biz_model
export const addBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/add`, params); };