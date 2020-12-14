import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_phase_baseline
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'基线主键 主键',baseCtime:'基线建立时间',projectPhaseId:'阶段主键',phaseName:'阶段名称',remark:'备注',parentPhaseId:'上级阶段编号',branchId:'机构编号',projectId:'当前项目编号',beginDate:'开始时间',endDate:'结束时间',planWorkingHours:'工时',planWorkingStaffNu:'投入人员数',ctime:'创建时间',totalBudgetNouser:'非人力成本总预算',totalBudgetInnerUser:'内部人力成本总预算',totalBudgetOutUser:'外购人力成本总预算',baseRemark:'基线备注',projectBaselineId:'项目级基线',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectPhaseBaseline = params => { return axios.get(`${base}/xm/core/xmProjectPhaseBaseline/list`, { params: params }); };

//模糊查询xm_project_phase_baseline 条件之间or关系  
//export const listXmProjectPhaseBaselineKey = params => { return axios.get(`${base}/xm/core/xmProjectPhaseBaseline/listKey`, { params: params }); };

//删除一条xm_project_phase_baseline params={id:'基线主键 主键'}
export const delXmProjectPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmProjectPhaseBaseline/del`,params); };

//批量删除xm_project_phase_baseline  params=[{id:'基线主键 主键'}]
export const batchDelXmProjectPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmProjectPhaseBaseline/batchDel`, params); };

//修改一条xm_project_phase_baseline记录
export const editXmProjectPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmProjectPhaseBaseline/edit`, params); };

//新增一条xm_project_phase_baseline
export const addXmProjectPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmProjectPhaseBaseline/add`, params); };