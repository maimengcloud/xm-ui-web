import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 迭代定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={iterationId:'迭代编号 主键',distBudgetCost:'已分配到任务的预算从任务表汇总而来',distBudgetWorkload:'已分配到任务的预算工作量从任务表汇总而来',actCost:'实际成本从任务表汇总而来',actWorkload:'实际工作量从任务表汇总而来',actStaffNum:'实际投入人员数',finishRate:'进度',testCases:'测试案例总数',execCases:'测试中案例总数',designCases:'设计中案例总数',finishCases:'完成案例总数',projectCnt:'关联项目数',productCnt:'关联产品数',menuCnt:'关联故事数',taskCnt:'关联任务数',finishTaskCnt:'已完成的任务数',calcTime:'计算日期',iterationName:'迭代名称',budgetCost:'预算成本',budgetWorkload:'预算工作量',bizDate:'业务日期yyyy-MM-dd字符串',closedBugCnt:'已关闭bug总数',resolvedBugCnt:'已解决bug总数',activeBugCnt:'激活的bug总数',confirmedBugCnt:'已解决bug总数',bugCnt:'bug总数',estimateWorkload:'预估工时=计划结束时间在计算当日前完成的任务的预算工时总和',minStartTime:'最早开始日期',maxEndTime:'最晚结束时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmIterationState = params => { return axios.get(`${base}/xm/core/xmIterationState/list`, { params: params }); };

//模糊查询迭代定义 条件之间or关系  
//export const listXmIterationStateKey = params => { return axios.get(`${base}/xm/core/xmIterationState/listKey`, { params: params }); };

//删除一条迭代定义 params={iterationId:'迭代编号 主键'}
export const delXmIterationState = params => { return axios.post(`${base}/xm/core/xmIterationState/del`,params); };

//批量删除迭代定义  params=[{iterationId:'迭代编号 主键'}]
export const batchDelXmIterationState = params => { return axios.post(`${base}/xm/core/xmIterationState/batchDel`, params); };

//修改一条迭代定义记录
export const editXmIterationState = params => { return axios.post(`${base}/xm/core/xmIterationState/edit`, params); };

//新增一条迭代定义
export const addXmIterationState = params => { return axios.post(`${base}/xm/core/xmIterationState/add`, params); };

export const loadTasksToXmIterationState= params => { return axios.post(`${base}/xm/core/xmIterationState/loadTasksToXmIterationState`, params); };

