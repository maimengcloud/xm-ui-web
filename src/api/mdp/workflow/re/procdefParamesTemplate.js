import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getWorkflowBasePath();


/**
 * mdp_re_procdef_parames_template
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',isRefForm:'是否关联自定义表单',monitors:'监控人多个',sponsors:'主办人多个默认为发起人',formId:'表单编号',procDefId:'流程定义编号',userid:'创建人',lastDate:'最后更新时间',mainContext:'流程正文',mainTitle:'流程标题',bizUrl:'业务功能跳转',bizName:'业务功能名称',categoryId:'所属分类编号',branchId:'云用户机构编号',formShowType:'智能表单展示方式form/table',fp:'备用字段1',sp:'备用字段2',tp:'备用字段3',pconfig:'5个备用字段',fo:'备用字段4',fi:'备用字段5',tagNames:'标签名称逗号分隔',tagIds:'标签编号逗号分隔',mainQx:'1-是否控制节点权限-2是否有正文-3是否发起人外其它人可修改正文-4是否控制附件权限',modelKey:'模型key，来自act_de_model.key_'}
 **/
 
//普通查询 条件之间and关系  
export const listProcdefParamesTemplate = params => { return axios.get(`${base}/mdp/workflow/re/procdefParamesTemplate/list`, { params: params }); };

//模糊查询mdp_re_procdef_parames_template 条件之间or关系  
//export const listProcdefParamesTemplateKey = params => { return axios.get(`${base}/mdp/workflow/re/procdefParamesTemplate/listKey`, { params: params }); };

//删除一条mdp_re_procdef_parames_template params={id:'主键 主键'}
export const delProcdefParamesTemplate = params => { return axios.post(`${base}/mdp/workflow/re/procdefParamesTemplate/del`,params); };

//批量删除mdp_re_procdef_parames_template  params=[{id:'主键 主键'}]
export const batchDelProcdefParamesTemplate = params => { return axios.post(`${base}/mdp/workflow/re/procdefParamesTemplate/batchDel`, params); };

//修改一条mdp_re_procdef_parames_template记录
export const editProcdefParamesTemplate = params => { return axios.post(`${base}/mdp/workflow/re/procdefParamesTemplate/edit`, params); };

//新增一条mdp_re_procdef_parames_template
export const addProcdefParamesTemplate = params => { return axios.post(`${base}/mdp/workflow/re/procdefParamesTemplate/add`, params); };


//新增或者修改模板
export const addOrUpdateTemplate = params => { return axios.post(`${base}/mdp/workflow/re/procdefParamesTemplate/addOrUpdate`, params); };