import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getWorkflowContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',bizName:'业务名称',bizKey:'业务编码',modelKey:'模型编码',modelName:'模型名称',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listBizModel = params => { return axios.get(`${base}/mdp/workflow/biz/bizModel/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryBizModelById = params => { return axios.get(`${base}/mdp/workflow/biz/bizModel/queryById`, { params: params }); };

//删除一条业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批 params={id:'主键 主键'}
export const delBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/del`,params); };

//批量删除业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批  params=[{id:'主键 主键'}]
export const batchAddBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/batchAdd`, params); };

//批量删除业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批  params=[{id:'主键 主键'}]
export const batchDelBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/batchDel`, params); };

//修改一条业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批记录
export const editBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/edit`, params); };

//新增一条业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批
export const addBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/add`, params); };

//批量修改某些字段
export const editSomeFieldsBizModel = params => { return axios.post(`${base}/mdp/workflow/biz/bizModel/editSomeFields`, params); };