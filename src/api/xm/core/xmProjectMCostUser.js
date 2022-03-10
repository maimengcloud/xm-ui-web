import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_m_cost_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',subjectId:'科目编号',projectId:'项目编号',userid:'用户编号',createTime:'创建时间',sendCostTime:'费用发放时间',username:'用户名称',projectName:'项目名称',remark:'备注',taskId:'任务编号',taskName:'任务名称',actWorkload:'实际工时',bizzStartDate:'费用归属周期开始日期',bizzEndDate:'费用归属周期结束日期',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',phaseId:'项目计划阶段编号',actCostAmount:'金额',costType:'成本类型0非人力1内部人力2外购人力',bizMonth:'业务归属月份yyyy-mm',bizDate:'业务归属日期yyyy-mm-dd',subjectName:'科目名称',projectPhaseName:'阶段名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectMCostUser = params => { return axios.get(`${base}/xm/core/xmProjectMCostUser/list`, { params: params }); };

//模糊查询xm_project_m_cost_user 条件之间or关系  
//export const listXmProjectMCostUserKey = params => { return axios.get(`${base}/xm/core/xmProjectMCostUser/listKey`, { params: params }); };

//删除一条xm_project_m_cost_user params={id:'主键 主键'}
export const delXmProjectMCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMCostUser/del`,params); };

//批量删除xm_project_m_cost_user  params=[{id:'主键 主键'}]
export const batchDelXmProjectMCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMCostUser/batchDel`, params); };

//修改一条xm_project_m_cost_user记录
export const editXmProjectMCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMCostUser/edit`, params); };

//新增一条xm_project_m_cost_user
export const addXmProjectMCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMCostUser/add`, params); };


export const listSumXmProjectMCostUser = params => { return axios.get(`${base}/xm/core/xmProjectMCostUser/listSum`, { params: params }); };

//批量新增
export const batchAddXmProjectMCostUser = params => { return axios.post(`${base}/xm/core/xmProjectMCostUser/batchAdd`, params); };
 

export const batchEdit = params => { return axios.post(`${base}/xm/core/xmProjectMCostUser/batchEdit`, params); };