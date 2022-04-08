import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_task_execuser
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'编号 主键',taskId:'任务id',userid:'执行人id',startTime:'加入时间',endTime:'离开时间',status:'执行人状态',remarks:'备注',settleAmount:'结算金额',settleHour:'结算金额',settleStatus:'结算状态',settleTime:'结算时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTaskExecuser = params => { return axios.get(`${base}/xm/core/xmTaskExecuser/list`, { params: params }); };

//模糊查询xm_task_execuser 条件之间or关系  
//export const listXmTaskExecuserKey = params => { return axios.get(`${base}/xm/core/xmTaskExecuser/listKey`, { params: params }); };

//删除一条xm_task_execuser params={id:'编号 主键'}
export const delXmTaskExecuser = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/del`,params); };

//批量删除xm_task_execuser  params=[{id:'编号 主键'}]
export const batchDelXmTaskExecuser = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/batchDel`, params); };

//修改一条xm_task_execuser记录
export const editXmTaskExecuser = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/edit`, params); };

//新增一条xm_task_execuser
export const addXmTaskExecuser = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/add`, params); };

export const leaveTask = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/leave`, params); };

export const beExecutor = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/execute`, params); };

export const settleExec = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/settle`, params); };


export const quotePrice = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/quotePrice`, params); };

export const becomeCandidate = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/candidate`, params); };

export const toTest = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/toTest`, params); };
export const testSuccess = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/testSuccess`, params); };
export const testFail = params => { return axios.post(`${base}/xm/core/xmTaskExecuser/testFail`, params); }; 

export const listXmTaskExecuserWithTask = params => { return axios.get(`${base}/xm/core/xmTaskExecuser/listWithTask`, { params: params }); };


