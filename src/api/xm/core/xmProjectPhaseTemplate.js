import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 项目阶段模板
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'阶段主键 主键',phaseName:'阶段名称',remark:'备注',parentPhaseId:'上级阶段编号',branchId:'机构编号',projectId:'当前项目编号',beginDate:'开始时间',endDate:'结束时间',phaseBudgetHours:'工时(不包括下一级)-应该大于或等于task中总工时',phaseBudgetStaffNu:'投入人员数(不包括下一级)-应该大于或等于task中总人数',ctime:'创建时间',phaseBudgetNouserAt:'非人力成本总预算(不包括下一级)-应该大于或等于task中非人力总成本',phaseBudgetInnerUserAt:'内部人力成本总预算(不包括下一级)-应该大于或等于task中内部人力总成本',phaseBudgetOutUserAt:'外购人力成本总预算(不包括下一级)-应该大于或等于task中外购总成本',phaseBudgetWorkload:'总工作量单位人时-应该大于或者等于task中的预算总工作量',taskType:'0售前方案1投标2需求3设计4开发5测试6验收7部署8运维--来自基础数据表taskType',planType:'计划类型w1-周,w2-2周,w3-3周,m1-1月,m2-2月,q1-季,q2-半年，y1-年',seqNo:'顺序号',phaseBudgetInnerUserWorkload:'内部人力工作量总预算(不包括下一级)-应该大于或等于task中内部人力总成本',phaseBudgetOutUserWorkload:'外购人力工作量总预算(不包括下一级)-应该大于或等于task中外购总成本',phaseBudgetInnerUserPrice:'内部人力成本单价元/人时',phaseBudgetOutUserPrice:'外购人力成本单价元/人时',phaseBudgetOutUserCnt:'外购人数',phaseBudgetInnerUserCnt:'内部人数'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectPhaseTemplate = params => { return axios.get(`${base}/xm/core/xmProjectPhaseTemplate/list`, { params: params }); };

//模糊查询项目阶段模板 条件之间or关系  
//export const listXmProjectPhaseTemplateKey = params => { return axios.get(`${base}/xm/core/xmProjectPhaseTemplate/listKey`, { params: params }); };

//删除一条项目阶段模板 params={id:'阶段主键 主键'}
export const delXmProjectPhaseTemplate = params => { return axios.post(`${base}/xm/core/xmProjectPhaseTemplate/del`,params); };

//批量删除项目阶段模板  params=[{id:'阶段主键 主键'}]
export const batchDelXmProjectPhaseTemplate = params => { return axios.post(`${base}/xm/core/xmProjectPhaseTemplate/batchDel`, params); };

//修改一条项目阶段模板记录
export const editXmProjectPhaseTemplate = params => { return axios.post(`${base}/xm/core/xmProjectPhaseTemplate/edit`, params); };

//新增一条项目阶段模板
export const addXmProjectPhaseTemplate = params => { return axios.post(`${base}/xm/core/xmProjectPhaseTemplate/add`, params); };