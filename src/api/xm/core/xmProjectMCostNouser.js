import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_m_cost_nouser
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',userid:'用户编号',createTime:'创建时间',sendCostTime:'费用发放时间',username:'用户名称',projectName:'项目名称',remark:'备注',taskId:'任务编号',taskName:'任务名称',subjectId:'科目编号',bizzStartDate:'费用归属周期开始日期',bizzEndDate:'费用归属周期结束日期',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',projectPhaseId:'项目计划阶段编号',actCostAmount:'实际成本金额',costType:'成本类型0非人力1内部人力2外购人力',bizMonth:'业务归属月份yyyy-mm',bizDate:'业务归属日期yyyy-mm-dd',subjectName:'科目名称',projectPhaseName:'阶段名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectMCostNouser = params => { return axios.get(`${base}/xm/core/xmProjectMCostNouser/list`, { params: params }); };

//模糊查询xm_project_m_cost_nouser 条件之间or关系  
//export const listXmProjectMCostNouserKey = params => { return axios.get(`${base}/xm/core/xmProjectMCostNouser/listKey`, { params: params }); };

//删除一条xm_project_m_cost_nouser params={id:'主键 主键'}
export const delXmProjectMCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMCostNouser/del`,params); };

//批量删除xm_project_m_cost_nouser  params=[{id:'主键 主键'}]
export const batchDelXmProjectMCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMCostNouser/batchDel`, params); };

//修改一条xm_project_m_cost_nouser记录
export const editXmProjectMCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMCostNouser/edit`, params); };

//新增一条xm_project_m_cost_nouser
export const addXmProjectMCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMCostNouser/add`, params); };

export const listSumXmProjectMCostNouser = params => { return axios.get(`${base}/xm/core/xmProjectMCostNouser/listSum`, { params: params }); };

//批量新增
export const batchAddXmProjectMCostNouser = params => { return axios.post(`${base}/xm/core/xmProjectMCostNouser/batchAdd`, params); };
 

export const batchEdit = params => { return axios.post(`${base}/xm/core/xmProjectMCostNouser/batchEdit`, params); };
