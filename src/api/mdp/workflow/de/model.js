import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getWorkflowContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * act_de_model
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'id 主键',name:'name',modelKey:'model_key',description:'description',modelComment:'model_comment',created:'created',createdBy:'created_by',lastUpdated:'last_updated',lastUpdatedBy:'last_updated_by',version:'version',modelEditorJson:'model_editor_json',thumbnail:'thumbnail',modelType:'model_type',tenantId:'tenant_id'}
 **/
 
//普通查询 条件之间and关系  
export const listModel = params => { return axios.get(`${base}/mdp/workflow/de/model/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryModelById = params => { return axios.get(`${base}/mdp/workflow/de/model/queryById`, { params: params }); };

//删除一条act_de_model params={id:'id 主键'}
export const delModel = params => { return axios.post(`${base}/mdp/workflow/de/model/del`,params); };

//批量删除act_de_model  params=[{id:'id 主键'}]
export const batchAddModel = params => { return axios.post(`${base}/mdp/workflow/de/model/batchAdd`, params); };

//批量删除act_de_model  params=[{id:'id 主键'}]
export const batchDelModel = params => { return axios.post(`${base}/mdp/workflow/de/model/batchDel`, params); };

//修改一条act_de_model记录
export const editModel = params => { return axios.post(`${base}/mdp/workflow/de/model/edit`, params); };

//新增一条act_de_model
export const addModel = params => { return axios.post(`${base}/mdp/workflow/de/model/add`, params); };

//部署
export const deployModel = params => { return axios.post(`${base}/mdp/workflow/de/model/deploy`, params); };

//批量修改某些字段
export const editSomeFieldsModel = params => { return axios.post(`${base}/mdp/workflow/de/model/editSomeFields`, params); };