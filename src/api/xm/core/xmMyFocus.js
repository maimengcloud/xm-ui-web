import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_my_focus
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'用户编号',username:'用户名称',taskId:'关注的任务主键',focusType:'对象类型项目-project/任务-task',projectId:'项目编号',projectName:'项目名称',taskName:'任务名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmMyFocus = params => { return axios.get(`${base}/xm/core/xmMyFocus/list`, { params: params }); };

//模糊查询xm_my_focus 条件之间or关系  
//export const listXmMyFocusKey = params => { return axios.get(`${base}/xm/core/xmMyFocus/listKey`, { params: params }); };

//删除一条xm_my_focus params={id:'主键 主键'}
export const delXmMyFocus = params => { return axios.post(`${base}/xm/core/xmMyFocus/del`,params); };

//批量删除xm_my_focus  params=[{id:'主键 主键'}]
export const batchDelXmMyFocus = params => { return axios.post(`${base}/xm/core/xmMyFocus/batchDel`, params); };

//修改一条xm_my_focus记录
export const editXmMyFocus = params => { return axios.post(`${base}/xm/core/xmMyFocus/edit`, params); };

//新增一条xm_my_focus
export const addXmMyFocus = params => { return axios.post(`${base}/xm/core/xmMyFocus/add`, params); };