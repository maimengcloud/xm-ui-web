import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 项目指标日统计表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={projectId:'项目编号 主键',bizDate:'统计日期yyyy-mm-dd类型',totalFileCnt:'文件数据',totalBugCnt:'bug数目',totalTaskCnt:'任务数',totalBudgetNouserAmount:'项目总非人力预算-来自项目表',projectName:'项目名称',totalStaffCnt:'总参与人数',calcTime:'统计执行日期',calcStatus:'0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖',totalCostNouserAmount:'项目总非人力成本',totalClosedBugCnt:'已关闭bug总数',totalResolvedBugCnt:'已解决bug总数',totalCompleteTaskCnt:'已完成任务总数-来自任务表',totalPhaseCnt:'项目阶段计划数',totalCompletePhaseCnt:'项目阶段计划已完成数',totalNeedPayAmount:'待付款总金额',totalFinishPayAmount:'已付款总金额',totalNeedColAmount:'待收款总金额',totalFinishColAmount:'已收款总金额',totalCostUserAmount:'项目总人力成本',totalBudgetIuserAmount:'项目总内部人力预算-来自项目表',totalPlanWorkload:'项目总预算工作量-来自项目表',totalRiskCnt:'项目风险总数',totalCompleteRiskCnt:'已完成风险总数',branchId:'机构编号',branchName:'机构名称',totalBudgetOuserAmount:'项目总外购人力预算-来自项目表',totalCompleteWorkload:'已完成工作量-来自计划中实际完成工作量',totalCostIuserAmount:'项目总内部人力成本金额',totalCostOuserAmount:'项目总外购人力成本金额',totalProgress:'项目进度0~100之间，来自任务表',totalActiveBugCnt:'激活的bug总数',totalConfirmedBugCnt:'已解决bug总数',projectStatus:'0|初始',totalActWorkload:'实际总工作量，来自任务表',totalActOutWorkload:'实际外购总工作量，来自任务表',totalActInnerWorkload:'实际内部总工作量，来自任务表',totalTaskBudgetCostAt:'已经分配到任务的总预算',totalTaskOutCnt:'外购任务数，来自任务表',totalNeedPayCnt:'待付款笔数',totalFinishPayCnt:'完成付款总比数',totalFinishPayUserCnt:'已付款总人数',totalNeedPayUserCnt:'待付款总人数',totalPlanIuserWorkload:'内部人力总工作量-应该大于或等于阶段计划内部人力总成本',totalPlanOuserWorkload:'外购人力总工作量-应该大于或等于阶段计划外购人力总成本',testCases:'测试案例总数',execCases:'测试中案例总数',designCases:'设计中案例总数',finishCases:'完成案例总数',iterationCnt:'迭代数',productCnt:'产品数',menuCnt:'故事数',finishMenuCnt:'完成的故事数',estimateWorkload:'预估工时=计划结束时间在计算当日前完成的任务的预算工时总和',execTaskCnt:'执行中任务数=任务表开始日期小于=当前日期，进度<100的任务',toStartTaskCnt:'待开始的任务数=任务表中开始日期=当前日期+1的任务数',execMenuCnt:'执行中需求=需求表中开始日期小于小于等于当前日期，进度<100的需求',toStartMenuCnt:'待开始需求数=需求表中开始日期=当前日期+1的需求数',minStartTime:'最早开始日期',maxEndTime:'最晚结束时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectState = params => { return axios.get(`${base}/xm/core/xmProjectState/list`, { params: params }); };

//模糊查询项目指标日统计表 条件之间or关系  
//export const listXmProjectStateKey = params => { return axios.get(`${base}/xm/core/xmProjectState/listKey`, { params: params }); };

//删除一条项目指标日统计表 params={projectId:'项目编号 主键'}
export const delXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/del`,params); };

//批量删除项目指标日统计表  params=[{projectId:'项目编号 主键'}]
export const batchDelXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/batchDel`, params); };

//修改一条项目指标日统计表记录
export const editXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/edit`, params); };

//新增一条项目指标日统计表
export const addXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/add`, params); };


export const loadProjectToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadProjectToXmProjectState`, params); };


export const loadBugsToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadBugsToXmProjectState`, params); };


export const loadTasksToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadTasksToXmProjectState`, params); };


export const loadTasksSettleToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadTasksSettleToXmProjectState`, params); };

