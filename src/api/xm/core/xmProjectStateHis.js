import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_state_his
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'本表主键 主键',projectId:'项目编号',bizDate:'统计日期yyyy-mm-dd类型',totalFileCnt:'文件数据',totalBugCnt:'bug数目',totalTaskCnt:'任务数',totalBudgetNouserAmount:'项目总非人力预算-来自项目表',projectName:'项目名称',stateId:'xm_project_state原表主键id',totalStaffCnt:'总参与人数',calCtime:'统计执行日期',calStatus:'0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖',totalCostNouserAmount:'项目总非人力成本',totalCloseBugCnt:'已关闭bug总数',totalResolveBugCnt:'已解决bug总数',totalCompleteTaskCnt:'已完成任务总数-来自任务表',totalPhaseCnt:'项目阶段计划数',totalCompletePhaseCnt:'项目阶段计划已完成数',totalNeedPayAmount:'待付款总金额',totalFinishPayAmount:'已付款总金额',totalNeedColAmount:'待收款总金额',totalFinishColAmount:'已收款总金额',totalCostUserAmount:'项目总人力成本',totalBudgetInnerUserAmount:'项目总内部人力预算-来自项目表',totalPlanWorkload:'项目总预算工作量-来自项目表',totalRiskCnt:'项目风险总数',totalCompleteRiskCnt:'已完成风险总数',branchId:'机构编号',branchName:'机构名称',totalBudgetOutUserAmount:'项目总外购人力预算-来自项目表',totalCompleteWorkload:'已完成工作量-来自计划中实际完成工作量'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectStateHis = params => { return axios.get(`${base}/xm/core/xmProjectStateHis/list`, { params: params }); };

//模糊查询xm_project_state_his 条件之间or关系  
//export const listXmProjectStateHisKey = params => { return axios.get(`${base}/xm/core/xmProjectStateHis/listKey`, { params: params }); };

//删除一条xm_project_state_his params={id:'本表主键 主键'}
export const delXmProjectStateHis = params => { return axios.post(`${base}/xm/core/xmProjectStateHis/del`,params); };

//批量删除xm_project_state_his  params=[{id:'本表主键 主键'}]
export const batchDelXmProjectStateHis = params => { return axios.post(`${base}/xm/core/xmProjectStateHis/batchDel`, params); };

//修改一条xm_project_state_his记录
export const editXmProjectStateHis = params => { return axios.post(`${base}/xm/core/xmProjectStateHis/edit`, params); };

//新增一条xm_project_state_his
export const addXmProjectStateHis = params => { return axios.post(`${base}/xm/core/xmProjectStateHis/add`, params); };