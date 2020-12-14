import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();

/**
 * xm_project_leader
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',leadType:'领导类型，0为负责人，1为审批人，2为监控人',userid:'项目负责人编号',username:'项目负责人'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectLeader = params => { return axios.get(`${base}/xm/core/xmProjectLeader/list`, { params: params }); };

//模糊查询xm_project_leader 条件之间or关系  
//export const listXmProjectLeaderKey = params => { return axios.get(`${base}/xm/core/xmProjectLeader/listKey`, { params: params }); };

//删除一条xm_project_leader params={id:'主键 主键'}
export const delXmProjectLeader = params => { return axios.post(`${base}/xm/core/xmProjectLeader/del`,params); };

//批量删除xm_project_leader  params=[{id:'主键 主键'}]
export const batchDelXmProjectLeader = params => { return axios.post(`${base}/xm/core/xmProjectLeader/batchDel`, params); };

//修改一条xm_project_leader记录
export const editXmProjectLeader = params => { return axios.post(`${base}/xm/core/xmProjectLeader/edit`, params); };

//新增一条xm_project_leader
export const addXmProjectLeader = params => { return axios.post(`${base}/xm/core/xmProjectLeader/add`, params); };