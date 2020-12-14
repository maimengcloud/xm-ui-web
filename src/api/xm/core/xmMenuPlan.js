import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 功能计划表,无需前端维护，所有数据由汇总统计得出
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',projectName:'项目名称',menuId:'功能编号',planStartTime:'开始时间',planEndTime:'结束时间',actStartTime:'实际开始时间',actEndTime:'实际结束时间',planWorkload:'计划工作量，根据关联任务汇总',actWorkload:'实际工作量，根据关联任务汇总',planCostAmount:'计划成本，根据关联任务汇总',actCostAmount:'实际成本金额根据关联任务汇总',finishRate:'总体完成比例0-1之间,根据taskType进行汇总',demandRate:'需求完成率0-1之间,根据taskType进行汇总',designRate:'设计完成率0-1之间,根据taskType进行汇总',devRate:'开发完成率0-1之间,根据taskType进行汇总',uatRate:'uat测试完成率0-1之间,根据taskType进行汇总',sitRate:'sit测试完成率0-1之间,根据taskType进行汇总',onlineStatus:'上线状态0未上线1上线成功',onlineTime:'上线时间',planStatus:'计划状态0初始1正常2暂停3延误4结束5关闭',chargeUserid:'负责人编号',chargeUsername:'负责人姓名',menuStatus:'状态0初始1设计中2开发中3测试中4uat测试2已上线3已下线4已删除',ctime:'创建时间',ltime:'更新时间',cuserid:'创建人编号',cusername:'创建人姓名',calcTime:'汇总时间',menuName:'菜单名字'}
 **/
 
//普通查询 条件之间and关系  
export const listXmMenuPlan = params => { return axios.get(`${base}/xm/core/xmMenuPlan/list`, { params: params }); };

//模糊查询功能计划表,无需前端维护，所有数据由汇总统计得出 条件之间or关系  
//export const listXmMenuPlanKey = params => { return axios.get(`${base}/xm/core/xmMenuPlan/listKey`, { params: params }); };

//删除一条功能计划表,无需前端维护，所有数据由汇总统计得出 params={id:'主键 主键'}
export const delXmMenuPlan = params => { return axios.post(`${base}/xm/core/xmMenuPlan/del`,params); };

//批量删除功能计划表,无需前端维护，所有数据由汇总统计得出  params=[{id:'主键 主键'}]
export const batchDelXmMenuPlan = params => { return axios.post(`${base}/xm/core/xmMenuPlan/batchDel`, params); };

//修改一条功能计划表,无需前端维护，所有数据由汇总统计得出记录
export const editXmMenuPlan = params => { return axios.post(`${base}/xm/core/xmMenuPlan/edit`, params); };

//新增一条功能计划表,无需前端维护，所有数据由汇总统计得出
export const addXmMenuPlan = params => { return axios.post(`${base}/xm/core/xmMenuPlan/add`, params); };

export const batchAddPlanFromTasks = params => { return axios.post(`${base}/xm/core/xmMenuPlan/batchAddPlanFromTasks`, params); };
export const batchUpdatePlanFromTasks = params => { return axios.post(`${base}/xm/core/xmMenuPlan/batchUpdatePlanFromTasks`, params); }; 
export const batchEditXmMenuPlan = params => { return axios.post(`${base}/xm/core/xmMenuPlan/batchEdit`, params); }; 
export const loadTasksToXmMenuPlan = params => { return axios.post(`${base}/xm/core/xmMenuPlan/loadTasksToXmMenuPlan`, params); }; 
 