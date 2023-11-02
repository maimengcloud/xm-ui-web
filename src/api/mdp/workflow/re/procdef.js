import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getWorkflowContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * act_re_procdef
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id_ 主键',rev:'rev_',category:'category_',name:'name_',key:'key_',version:'version_',deploymentId:'deployment_id_',resourceName:'resource_name_',dgrmResourceName:'dgrm_resource_name_',description:'description_',hasStartFormKey:'has_start_form_key_',hasGraphicalNotation:'has_graphical_notation_',suspensionState:'suspension_state_',tenantId:'tenant_id_',engineVersion:'engine_version_',derivedFrom:'derived_from_',derivedFromRoot:'derived_from_root_',derivedVersion:'derived_version_'}
 **/
 
//普通查询 条件之间and关系  
export const listProcdef = params => { return axios.get(`${base}/mdp/workflow/re/procdef/list`, { params: params }); };

//普通查询
export const listCategorys = params => { return axios.get(`${base}/mdp/workflow/re/procdef/categorys`, { params: params }); };

//删除一条act_re_procdef params={id:'id_ 主键'}
export const delProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/del`,params); };

//批量删除act_re_procdef  params=[{id:'id_ 主键'}]
export const batchAddProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/batchAdd`, params); };

//批量删除act_re_procdef  params=[{id:'id_ 主键'}]
export const batchDelProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/batchDel`, params); };

//修改一条act_re_procdef记录
export const editProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/edit`, params); };

//修改一个
export const suspendProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/suspend`, params); };

//修改一个
export const activateProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/activate`, params); };

//新增一个
export const addProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/add`, params); };

//批量修改某些字段
export const editSomeFieldsProcdef = params => { return axios.post(`${base}/mdp/workflow/re/procdef/editSomeFields`, params); };