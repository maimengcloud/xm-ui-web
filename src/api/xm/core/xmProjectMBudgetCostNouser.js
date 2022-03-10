import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_m_budget_cost_nouser
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',budgetCost:'预算金额',remark:'备注',subjectId:'预算科目',bizzStartDate:'费用归属周期开始日期',bizzEndDate:'费用归属周期结束日期',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',phaseId:'阶段计划',costType:'成本类型0非人力1内部人力2外购人力',bizzMonth:'费用归属月份yyyy-mm'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectMBudgetCostNouser = params => { return axios.get(`${base}/xm/core/xmProjectMBudgetCostNouser/list`, { params: params }); };

//模糊查询xm_project_m_budget_cost_nouser 条件之间or关系  
//export const listXmProjectMBudgetCostNouserKey = params => { return axios.get(`${base}/xm/core/xmProjectMBudgetCostNouser/listKey`, { params: params }); };

//删除一条xm_project_m_budget_cost_nouser params={id:'主键 主键'}
export const delXmProjectMBudgetCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostNouser/del`,params); };

//批量删除xm_project_m_budget_cost_nouser  params=[{id:'主键 主键'}]
export const batchDelXmProjectMBudgetCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostNouser/batchDel`, params); };

//修改一条xm_project_m_budget_cost_nouser记录
export const editXmProjectMBudgetCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostNouser/edit`, params); };

//新增一条xm_project_m_budget_cost_nouser
export const addXmProjectMBudgetCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostNouser/add`, params); };

//批量删除xm_project_m_budget_cost_nouser  params=[{id:'主键 主键'}]
export const batchAddXmProjectMBudgetCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostNouser/batchAdd`, params); };

//普通查询 条件之间and关系  
export const listSumXmProjectMBudgetCostNouser = params => { return axios.get(`${base}/xm/core/xmProjectMBudgetCostNouser/listSum`, { params: params }); };


export const batchEdit = params => { return axios.post(`${base}/xm/core/xmProjectMBudgetCostNouser/batchEdit`, params); };

