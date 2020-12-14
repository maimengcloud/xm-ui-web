import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getWorkflowBasePath();


/**
 * mdp_ru_procinst_parames
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',isRefForm:'是否关联自定义表单',monitors:'监控人多个',sponsors:'主办人多个默认为发起人',procInstId:'流程实例编号',formId:'表单编号',procDefId:'流程定义编号',userid:'创建人',startDate:'发起时间',isTemplate:'是否存为模板',mainContext:'流程正文',mainTitle:'流程标题',deptid:'发起部门',bizUrl:'业务功能跳转',bizName:'流程分类编号',categoryId:'流程分类编号',branchId:'云用户机构编号',lastUserid:'最后更新用户编号',lastTime:'最后更新时间',flowState:'审批状态0未开始1审批中2审批结束',formShowType:'智能表单数据展现方式form/table',startUsername:'发起人姓名',startDeptName:'发起部门名称',fp:'备用字段1',sp:'备用字段2',tp:'备用字段3',pconfig:'5个备用字段',fo:'备用字段4',fi:'备用字段5',tagNames:'标签名称逗号分隔',tagIds:'标签编号逗号分隔'}
 **/
 
//普通查询 条件之间and关系  
export const listProcinstParames = params => { return axios.get(`${base}/mdp/workflow/ru/procinstParames/list`, { params: params }); };

//模糊查询mdp_ru_procinst_parames 条件之间or关系  
//export const listProcinstParamesKey = params => { return axios.get(`${base}/mdp/workflow/ru/procinstParames/listKey`, { params: params }); };

//删除一条mdp_ru_procinst_parames params={id:'主键 主键'}
export const delProcinstParames = params => { return axios.post(`${base}/mdp/workflow/ru/procinstParames/del`,params); };

//批量删除mdp_ru_procinst_parames  params=[{id:'主键 主键'}]
export const batchDelProcinstParames = params => { return axios.post(`${base}/mdp/workflow/ru/procinstParames/batchDel`, params); };

//修改一条mdp_ru_procinst_parames记录
export const editProcinstParames = params => { return axios.post(`${base}/mdp/workflow/ru/procinstParames/edit`, params); };

//新增一条mdp_ru_procinst_parames
export const addProcinstParames = params => { return axios.post(`${base}/mdp/workflow/ru/procinstParames/add`, params); };

//单独更新计划完成时间
export const editPlanFinishTime = params => { return axios.post(`${base}/mdp/workflow/ru/procinstParames/editPlanFinishTime`, params); };
