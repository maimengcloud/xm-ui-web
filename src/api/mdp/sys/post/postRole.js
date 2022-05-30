import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * 岗位角色关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',postId:'岗位编号',roleid:'角色编号'}
 **/
 
//普通查询 条件之间and关系  
export const listPostRole = params => { return axios.get(`${base}/mdp/sys/post/postRole/list`, { params: params }); };

//模糊查询岗位角色关系表 条件之间or关系  
//export const listPostRoleKey = params => { return axios.get(`${base}/mdp/sys/post/postRole/listKey`, { params: params }); };

//删除一条岗位角色关系表 params={id:'主键 主键'}
export const delPostRole = params => { return axios.post(`${base}/mdp/sys/post/postRole/del`,params); };

//批量删除岗位角色关系表  params=[{id:'主键 主键'}]
export const batchDelPostRole = params => { return axios.post(`${base}/mdp/sys/post/postRole/batchDel`, params); };

//批量删除岗位角色关系表  params=[{id:'主键 主键'}]
export const batchAddPostRole = params => { return axios.post(`${base}/mdp/sys/post/postRole/batchAdd`, params); };

//修改一条岗位角色关系表记录
export const editPostRole = params => { return axios.post(`${base}/mdp/sys/post/postRole/edit`, params); };

//新增一条岗位角色关系表
export const addPostRole = params => { return axios.post(`${base}/mdp/sys/post/postRole/add`, params); };