import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();

/**
 * xm_project_group_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',groupId:'团队编号',userid:'团队成员编号',username:'团队成员'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectGroupUser = params => { return axios.get(`${base}/xm/core/xmProjectGroupUser/list`, { params: params }); };

//模糊查询xm_project_group_user 条件之间or关系  
//export const listXmProjectGroupUserKey = params => { return axios.get(`${base}/xm/core/xmProjectGroupUser/listKey`, { params: params }); };

//删除一条xm_project_group_user params={id:'主键 主键'}
export const delXmProjectGroupUser = params => { return axios.post(`${base}/xm/core/xmProjectGroupUser/del`,params); };

//批量删除xm_project_group_user  params=[{id:'主键 主键'}]
export const batchDelXmProjectGroupUser = params => { return axios.post(`${base}/xm/core/xmProjectGroupUser/batchDel`, params); };

//修改一条xm_project_group_user记录
export const editXmProjectGroupUser = params => { return axios.post(`${base}/xm/core/xmProjectGroupUser/edit`, params); };

//新增一条xm_project_group_user
export const addXmProjectGroupUser = params => { return axios.post(`${base}/xm/core/xmProjectGroupUser/add`, params); };