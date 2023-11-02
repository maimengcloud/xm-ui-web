import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getWorkflowContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * act_re_deployment
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id_ 主键',name:'name_',category:'category_',key:'key_',tenantId:'tenant_id_',deployTime:'deploy_time_',derivedFrom:'derived_from_',derivedFromRoot:'derived_from_root_',parentDeploymentId:'parent_deployment_id_',engineVersion:'engine_version_'}
 **/
 
//普通查询 条件之间and关系  
export const listDeployment = params => { return axios.get(`${base}/mdp/workflow/re/deployment/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryDeploymentById = params => { return axios.get(`${base}/mdp/workflow/re/deployment/queryById`, { params: params }); };

//删除一条act_re_deployment params={id:'id_ 主键'}
export const delDeployment = params => { return axios.post(`${base}/mdp/workflow/re/deployment/del`,params); };

//批量删除act_re_deployment  params=[{id:'id_ 主键'}]
export const batchAddDeployment = params => { return axios.post(`${base}/mdp/workflow/re/deployment/batchAdd`, params); };

//批量删除act_re_deployment  params=[{id:'id_ 主键'}]
export const batchDelDeployment = params => { return axios.post(`${base}/mdp/workflow/re/deployment/batchDel`, params); };

//修改一条act_re_deployment记录
export const editDeployment = params => { return axios.post(`${base}/mdp/workflow/re/deployment/edit`, params); };

//新增一条act_re_deployment
export const addDeployment = params => { return axios.post(`${base}/mdp/workflow/re/deployment/add`, params); };

//批量修改某些字段
export const editSomeFieldsDeployment = params => { return axios.post(`${base}/mdp/workflow/re/deployment/editSomeFields`, params); };