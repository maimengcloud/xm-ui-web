import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_m_budget_cost_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',userid:'项目成员编号',budgetCost:'预算金额/每月',remark:'备注',username:'用户名',subjectId:'预算科目编号',bizzStartDate:'费用归属周期开始日期',bizzEndDate:'费用归属周期结束日期',bizzMonth:'费用归属月份yyyy-mm',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',phaseId:'项目阶段',costType:'成本类型0非人力1内部人力2外购人力'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectMBudgetCostUser = params => { return axios.get(`${base}/xm/core/xmProjectMBudgetCostUser/list`, { params: params }); };

//模糊查询xm_project_m_budget_cost_user 条件之间or关系  
//export const listXmProjectMBudgetCostUserKey = params => { return axios.get(`${base}/xm/core/xmProjectMBudgetCostUser/listKey`, { params: params }); };

//删除一条xm_project_m_budget_cost_user params={id:'主键 主键'}
export const delXmProjectMBudgetCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostUser/del`,params); };

//批量删除xm_project_m_budget_cost_user  params=[{id:'主键 主键'}]
export const batchDelXmProjectMBudgetCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostUser/batchDel`, params); };

//修改一条xm_project_m_budget_cost_user记录
export const editXmProjectMBudgetCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostUser/edit`, params); };

//新增一条xm_project_m_budget_cost_user
export const addXmProjectMBudgetCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostUser/add`, params); };


//批量新增
export const batchAddXmProjectMBudgetCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostUser/batchAdd`, params); };

//普通查询 条件之间and关系  
export const listSumXmProjectMBudgetCostUser = params => { return axios.get(`${base}/xm/core/xmProjectMBudgetCostUser/listSum`, { params: params }); };

export const batchEdit = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostUser/batchEdit`, params); };
