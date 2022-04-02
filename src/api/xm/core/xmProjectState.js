import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 项目指标日统计表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',bizDate:'统计日期yyyy-mm-dd类型',totalFileCnt:'文件数据',totalBugCnt:'bug数目',totalTaskCnt:'任务数',totalBudgetNouserAmount:'项目总非人力预算-来自项目表',projectName:'项目名称',totalStaffCnt:'总参与人数',calCtime:'统计执行日期',calStatus:'0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖',totalCostNouserAmount:'项目总非人力成本',totalClosedBugCnt:'已关闭bug总数',totalResolvedBugCnt:'已解决bug总数',totalCompleteTaskCnt:'已完成任务总数-来自任务表',totalPhaseCnt:'项目阶段计划数',totalCompletePhaseCnt:'项目阶段计划已完成数',totalNeedPayAmount:'待付款总金额',totalFinishPayAmount:'已付款总金额',totalNeedColAmount:'待收款总金额',totalFinishColAmount:'已收款总金额',totalCostUserAmount:'项目总人力成本',totalBudgetIuserAmount:'项目总内部人力预算-来自项目表',totalPlanWorkload:'项目总预算工作量-来自项目表',totalRiskCnt:'项目风险总数',totalCompleteRiskCnt:'已完成风险总数',branchId:'机构编号',branchName:'机构名称',totalBudgetOuserAmount:'项目总外购人力预算-来自项目表',totalCompleteWorkload:'已完成工作量-来自计划中实际完成工作量',todayNewBugCnt:'今日新增bug数目',todayResolvedBugCnt:'今日解决bug数目',todayClosedBugCnt:'今日关闭bug',todayNewTaskCnt:'今日新增任务数',todayCompleteTaskCnt:'今日完成任务数',todayNewPhaseCnt:'今日新增计划数目',todayCompletePhaseCnt:'今日完成计划数目',todayNewStaffCnt:'今日新增员工数',todaySubStaffCnt:'今日退出员工数',todayNewPlanWorkload:'今日新增预算工作量',todayNewActWorkload:'今日新增实际工作量',todayNeedColAmount:'今日需要收款金额',todayFinishColAmount:'今日完成收款金额',todayCostUserAmount:'今日人力成本金额',todayCostIuserAmount:'今日内部人力成本金额',todayCostOuserAmount:'今日外购人力成本金额',todayCostNouserAmount:'今日非人力成本金额',totalCostIuserAmount:'项目总内部人力成本金额',totalCostOuserAmount:'项目总外购人力成本金额',todayNeedPayAmount:'今日新增待付款总金额',todayFinishPayAmount:'今日新增完成付款总金额',todayNewRiskCnt:'今日新增项目风险总数',todayCompleteRiskCnt:'今日完成风险总数',todayNewFileCnt:'今日新增文档',totalProgress:'项目进度0~100之间，来自任务表',totalActiveBugCnt:'激活的bug总数',totalConfirmedBugCnt:'已解决bug总数',projectStatus:'项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停',totalActWorkload:'实际总工作量，来自任务表',totalActOutWorkload:'实际外购总工作量，来自任务表',totalActInnerWorkload:'实际内部总工作量，来自任务表',totalTaskBudgetCostAt:'已经分配到任务的总预算',totalTaskOutCnt:'外购任务数，来自任务表',totalNeedPayCnt:'待付款笔数',totalFinishPayCnt:'完成付款总比数',todayConfirmedBugCnt:'今日确认bug',todayActiveBugCnt:'今日激活的bug',totalFinishPayUserCnt:'已付款总人数',totalNeedPayUserCnt:'待付款总人数',todayNeedPayUserCnt:'今日待付款总人数',todayFinishPayUserCnt:'今日已付款总人数'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectState = params => { return axios.get(`${base}/xm/core/xmProjectState/list`, { params: params }); };

//模糊查询项目指标日统计表 条件之间or关系  
//export const listXmProjectStateKey = params => { return axios.get(`${base}/xm/core/xmProjectState/listKey`, { params: params }); };

//删除一条项目指标日统计表 params={id:'主键 主键'}
export const delXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/del`,params); };

//批量删除项目指标日统计表  params=[{id:'主键 主键'}]
export const batchDelXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/batchDel`, params); };

//修改一条项目指标日统计表记录
export const editXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/edit`, params); };

//新增一条项目指标日统计表
export const addXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/add`, params); };


export const loadProjectToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadProjectToXmProjectState`, params); };


export const loadBugsToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadBugsToXmProjectState`, params); };


export const loadTasksToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadTasksToXmProjectState`, params); };


export const loadTasksSettleToXmProjectState = params => { return axios.post(`${base}/xm/core/xmProjectState/loadTasksSettleToXmProjectState`, params); };


//普通查询 条件之间and关系  
export const listXmProjectStateHis = params => { return axios.get(`${base}/xm/core/xmProjectState/list/his`, { params: params }); };