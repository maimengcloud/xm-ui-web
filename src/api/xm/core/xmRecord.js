import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_record
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'日志编号 主键',projectId:'项目编号',operUserid:'操作人id',operUsername:'操作人名字',operTime:'操作时间',objType:'操作对象project/task',action:'操作的id',oldValue:'历史值',newValue:'新值',remarks:'备注',taskId:'任务编号',reqNo:'请求编号，用于跟踪日志'}
 **/
 
//普通查询 条件之间and关系  
export const listXmRecord = params => { return axios.get(`${base}/xm/core/xmRecord/list`, { params: params }); };

//模糊查询xm_record 条件之间or关系  
//export const listXmRecordKey = params => { return axios.get(`${base}/xm/core/xmRecord/listKey`, { params: params }); };

//删除一条xm_record params={id:'日志编号 主键'}
export const delXmRecord = params => { return axios.post(`${base}/xm/core/xmRecord/del`,params); };

//批量删除xm_record  params=[{id:'日志编号 主键'}]
export const batchDelXmRecord = params => { return axios.post(`${base}/xm/core/xmRecord/batchDel`, params); };

//修改一条xm_record记录
export const editXmRecord = params => { return axios.post(`${base}/xm/core/xmRecord/edit`, params); };

//新增一条xm_record
export const addXmRecord = params => { return axios.post(`${base}/xm/core/xmRecord/add`, params); };