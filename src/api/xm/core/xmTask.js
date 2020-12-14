import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();

/**
 * xm_task
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'任务编号 主键',name:'任务名称',parentTaskid:'父任务编号',parentTaskname:'父任务名称',projectId:'项目编号',projectName:'项目名称',level:'任务级别',sortLevel:'排序级别',executorUserid:'任务执行人编号',executorUsername:'任务执行人',preTaskid:'前置任务编号',preTaskname:'前置任务名称',startTime:'任务开始时间',endTime:'任务结束时间',milestone:'里程碑',description:'任务描述',remarks:'备注',createUserid:'任务创建人编号',createUsername:'任务创建人',createTime:'创建时间',rate:'任务进度'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTask = params => { return axios.get(`${base}/xm/core/xmTask/list`, { params: params }); };

//模糊查询xm_task 条件之间or关系  
//export const listXmTaskKey = params => { return axios.get(`${base}/xm/core/xmTask/listKey`, { params: params }); };

//删除一条xm_task params={id:'任务编号 主键'}
export const delXmTask = params => { return axios.post(`${base}/xm/core/xmTask/del`,params); };

//批量删除xm_task  params=[{id:'任务编号 主键'}]
export const batchDelXmTask = params => { return axios.post(`${base}/xm/core/xmTask/batchDel`, params); };

//修改一条xm_task记录
export const editXmTask = params => { return axios.post(`${base}/xm/core/xmTask/edit`, params); };

//新增一条xm_task
export const addXmTask = params => { return axios.post(`${base}/xm/core/xmTask/add`, params); };

export const getTask = params => { return axios.get(`${base}/xm/core/xmTask/getTask`, { params: params }); };

export const addTask = params => { return axios.post(`${base}/xm/core/xmTask/addTask`, params ); };

export const editRate = params => { return axios.post(`${base}/xm/core/xmTask/editProgress`, params); };


//批量删除xm_task  params=[{id:'任务编号 主键'}]
export const batchImportTaskFromTemplate = params => { return axios.post(`${base}/xm/core/xmTask/batchImportFromTemplate`, params); }; 


//批量删除xm_task  params=[{id:'任务编号 主键'}]
export const batchSaveBudget = params => { return axios.post(`${base}/xm/core/xmTask/batchSaveBudget`, params); }; 

export const batchRelTasksWithMenu = params => { return axios.post(`${base}/xm/core/xmTask/batchRelTasksWithMenu`, params); }; 





