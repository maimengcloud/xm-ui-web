import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_test_case_exec
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'执行编号 主键',execUserid:'执行人',startTime:'开始时间',projectId:'项目编号',projectName:'项目名称',caseId:'测试案例编号',caseName:'测试案例名称',endTime:'到期时间',remark:'问题描述',createUserid:'问题创建人编号',createUsername:'问题创建人',createTime:'创建时间',execStatus:'0新建1测试中2已完成',iterationId:'迭代编号',iterationName:'迭代名称',execUsername:'执行人姓名',taskId:'归属测试任务编号',taskName:'归属测试任务名称',menuId:'需求编号'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTestCaseExec = params => { return axios.get(`${base}/xm/core/xmTestCaseExec/list`, { params: params }); };

//模糊查询xm_test_case_exec 条件之间or关系  
//export const listXmTestCaseExecKey = params => { return axios.get(`${base}/xm/core/xmTestCaseExec/listKey`, { params: params }); };

//删除一条xm_test_case_exec params={id:'执行编号 主键'}
export const delXmTestCaseExec = params => { return axios.post(`${base}/xm/core/xmTestCaseExec/del`,params); };

//批量删除xm_test_case_exec  params=[{id:'执行编号 主键'}]
export const batchDelXmTestCaseExec = params => { return axios.post(`${base}/xm/core/xmTestCaseExec/batchDel`, params); };

//修改一条xm_test_case_exec记录
export const editXmTestCaseExec = params => { return axios.post(`${base}/xm/core/xmTestCaseExec/edit`, params); };

//新增一条xm_test_case_exec
export const addXmTestCaseExec = params => { return axios.post(`${base}/xm/core/xmTestCaseExec/add`, params); };

export const batchAddXmTestCaseExec = params => { return axios.post(`${base}/xm/core/xmTestCaseExec/batchAdd`, params); };
export const batchEditXmTestCaseExec = params => { return axios.post(`${base}/xm/core/xmTestCaseExec/batchEdit`, params); };
 