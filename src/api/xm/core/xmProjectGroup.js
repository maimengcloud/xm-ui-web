import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();

/**
 * xm_project_group
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',groupName:'团队名称',projectId:'项目编号'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectGroup = params => { return axios.get(`${base}/xm/core/xmProjectGroup/list`, { params: params }); };

//模糊查询xm_project_group 条件之间or关系  
//export const listXmProjectGroupKey = params => { return axios.get(`${base}/xm/core/xmProjectGroup/listKey`, { params: params }); };

//删除一条xm_project_group params={id:'主键 主键'}
export const delXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/del`,params); };

//批量删除xm_project_group  params=[{id:'主键 主键'}]
export const batchDelXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/batchDel`, params); };

//修改一条xm_project_group记录
export const editXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/edit`, params); };

//新增一条xm_project_group
export const addXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/add`, params); };

export const updateGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/updateGroup`, params); };

export const getProjectGroup = params => { return axios.get(`${base}/xm/core/xmProjectGroup/getGroup`, { params: params }); };

