import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_phase
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'阶段主键 主键',name:'阶段名称',remark:'备注',parentId:'上级阶段编号',branchId:'机构编号',projectId:'当前项目编号',beginDate:'开始时间',endDate:'结束时间',planWorkingHours:'工时',planWorkingStaffNu:'投入人员数',ctime:'创建时间',totalBudgetNouser:'非人力成本总预算',totalBudgetIuser:'内部人力成本总预算',totalBudgetOuser:'外购人力成本总预算',baselineId:'项目级基线',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除'}
 **/
 
//普通查询 条件之间and关系  
export const listXmPhase = params => { return axios.get(`${base}/xm/core/xmPhase/list`, { params: params }); };

//模糊查询xm_project_phase 条件之间or关系  
//export const listXmPhaseKey = params => { return axios.get(`${base}/xm/core/xmPhase/listKey`, { params: params }); };

//删除一条xm_project_phase params={id:'阶段主键 主键'}
export const delXmPhase = params => { return axios.post(`${base}/xm/core/xmPhase/del`,params); };

//批量删除xm_project_phase  params=[{id:'阶段主键 主键'}]
export const batchDelXmPhase = params => { return axios.post(`${base}/xm/core/xmPhase/batchDel`, params); };

//修改一条xm_project_phase记录
export const editXmPhase = params => { return axios.post(`${base}/xm/core/xmPhase/edit`, params); };

//新增一条xm_project_phase
export const addXmPhase = params => { return axios.post(`${base}/xm/core/xmPhase/add`, params); };

//批量从模板导入到项目  params=[{id:'阶段主键 主键'}]
export const batchImportFromTemplate = params => { return axios.post(`${base}/xm/core/xmPhase/batchImportFromTemplate`, params); };



//批量从模板导入到项目  params=[{id:'阶段主键 主键'}]
export const batchSaveBudget = params => { return axios.post(`${base}/xm/core/xmPhase/batchSaveBudget`, params); };

//批量从模板导入到项目  params=[{id:'阶段主键 主键'}]
export const calcSomePhaseActDataFromTasks = params => { return axios.post(`${base}/xm/core/xmPhase/calcSomePhaseActDataFromTasks`, params); };

export const loaMenusToXmPhase = params => { return axios.post(`${base}/xm/core/xmPhase/loaMenusToXmPhase`, params); };

//修改负责人
export const setPhaseMngUser = params => { return axios.post(`${base}/xm/core/xmPhase/setPhaseMngUser`, params); };


export const calcKeyPaths = params => { return axios.post(`${base}/xm/core/xmPhase/calcKeyPaths`, params); };


export const selectTotalProductAndPhaseBudgetCost = params => { return axios.post(`${base}/xm/core/xmPhase/selectTotalProductAndPhaseBudgetCost`, params); };

