import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 功能状态表,无需前端维护，所有数据由汇总统计得出
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',planStartTime:'开始时间',planEndTime:'结束时间',actStartTime:'实际开始时间',actEndTime:'实际结束时间',planWorkload:'计划工作量，根据关联任务汇总',actWorkload:'实际工作量，根据关联任务汇总',planCostAmount:'计划成本，根据关联任务汇总',actCostAmount:'实际成本金额根据关联任务汇总',finishRate:'总体完成比例0-100之间,根据taskType进行汇总',demandRate:'需求完成率0-100之间,根据taskType进行汇总',designRate:'设计完成率0-100之间,根据taskType进行汇总',devRate:'开发完成率0-100之间,根据taskType进行汇总',uatRate:'uat测试完成率0-100之间,根据taskType进行汇总',sitRate:'sit测试完成率0-100之间,根据taskType进行汇总',ctime:'创建时间',calcTime:'汇总时间',planWorkhours:'工时数',planWorkerCnt:'总人数',closedBugs:'总关闭bugs',activeBugs:'激活bugs',confirmedBugs:'已确认bugs总数',resolvedBugs:'已解决bugs总数',testCases:'测试案例总数',execCases:'测试中案例总数',designCases:'设计中案例总数',finishCases:'完成案例总数',iterationCnt:'关联迭代数',taskCnt:'任务数',finishTaskCnt:'完成的任务数',bizDate:'业务日期yyyy-MM-dd字符串',bugCnt:'bug总数',groupId:'团队编号',projectId:'项目编号',projectName:'项目名称',groupName:'团队名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmGroupState = params => { return axios.get(`${base}/xm/core/xmGroupState/list`, { params: params }); };

//模糊查询功能状态表,无需前端维护，所有数据由汇总统计得出 条件之间or关系  
//export const listXmGroupStateKey = params => { return axios.get(`${base}/xm/core/xmGroupState/listKey`, { params: params }); };

//删除一条功能状态表,无需前端维护，所有数据由汇总统计得出 params={id:'主键 主键'}
export const delXmGroupState = params => { return axios.post(`${base}/xm/core/xmGroupState/del`,params); };

//批量删除功能状态表,无需前端维护，所有数据由汇总统计得出  params=[{id:'主键 主键'}]
export const batchDelXmGroupState = params => { return axios.post(`${base}/xm/core/xmGroupState/batchDel`, params); };

//修改一条功能状态表,无需前端维护，所有数据由汇总统计得出记录
export const editXmGroupState = params => { return axios.post(`${base}/xm/core/xmGroupState/edit`, params); };

//新增一条功能状态表,无需前端维护，所有数据由汇总统计得出
export const addXmGroupState = params => { return axios.post(`${base}/xm/core/xmGroupState/add`, params); };

export const loadTasksToXmGroupState = params => { return axios.post(`${base}/xm/core/xmGroupState/loadTasksToXmGroupState`, params); };



//普通查询 条件之间and关系  
export const listXmGroupStatehHis = params => { return axios.get(`${base}/xm/core/xmGroupState/list/his`, { params: params }); };
