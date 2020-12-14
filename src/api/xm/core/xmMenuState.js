import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 功能状态表,无需前端维护，所有数据由汇总统计得出
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',menuId:'功能编号',planStartTime:'开始时间',planEndTime:'结束时间',actStartTime:'实际开始时间',actEndTime:'实际结束时间',planWorkload:'计划工作量，根据关联任务汇总',actWorkload:'实际工作量，根据关联任务汇总',planCostAmount:'计划成本，根据关联任务汇总',actCostAmount:'实际成本金额根据关联任务汇总',finishRate:'总体完成比例0-100之间,根据taskType进行汇总',demandRate:'需求完成率0-100之间,根据taskType进行汇总',designRate:'设计完成率0-100之间,根据taskType进行汇总',devRate:'开发完成率0-100之间,根据taskType进行汇总',uatRate:'uat测试完成率0-100之间,根据taskType进行汇总',sitRate:'sit测试完成率0-100之间,根据taskType进行汇总',onlineStatus:'上线状态0未上线1上线成功',onlineTime:'上线时间',planStatus:'计划状态0初始1正常2暂停3延误4结束5关闭',chargeUserid:'负责人编号',chargeUsername:'负责人姓名',menuStatus:'状态0初始1设计中2开发中3测试中4uat测试2已上线3已下线4已删除',ctime:'创建时间',ltime:'更新时间',cuserid:'创建人编号',cusername:'创建人姓名',calcTime:'汇总时间',menuName:'菜单名字',planWorkhours:'工时数',planWorkerCnt:'总人数',closedBugs:'总关闭bugs',activeBugs:'激活bugs',confirmedBugs:'已确认bugs总数',resolvedBugs:'已解决bugs总数',productId:'产品编号',productName:'产品名称',testCases:'测试案例总数',execCases:'测试中案例总数',designCases:'设计中案例总数',finishCases:'完成案例总数',projectCnt:'关联项目数',iterationCnt:'关联迭代数',taskCnt:'任务数',finishTaskCnt:'完成的任务数'}
 **/
 
//普通查询 条件之间and关系  
export const listXmMenuState = params => { return axios.get(`${base}/xm/core/xmMenuState/list`, { params: params }); };

//模糊查询功能状态表,无需前端维护，所有数据由汇总统计得出 条件之间or关系  
//export const listXmMenuStateKey = params => { return axios.get(`${base}/xm/core/xmMenuState/listKey`, { params: params }); };

//删除一条功能状态表,无需前端维护，所有数据由汇总统计得出 params={id:'主键 主键'}
export const delXmMenuState = params => { return axios.post(`${base}/xm/core/xmMenuState/del`,params); };

//批量删除功能状态表,无需前端维护，所有数据由汇总统计得出  params=[{id:'主键 主键'}]
export const batchDelXmMenuState = params => { return axios.post(`${base}/xm/core/xmMenuState/batchDel`, params); };

//修改一条功能状态表,无需前端维护，所有数据由汇总统计得出记录
export const editXmMenuState = params => { return axios.post(`${base}/xm/core/xmMenuState/edit`, params); };

//新增一条功能状态表,无需前端维护，所有数据由汇总统计得出
export const addXmMenuState = params => { return axios.post(`${base}/xm/core/xmMenuState/add`, params); };
export const loadTasksToXmMenuState = params => { return axios.post(`${base}/xm/core/xmMenuState/loadTasksToXmMenuState`, params); };

