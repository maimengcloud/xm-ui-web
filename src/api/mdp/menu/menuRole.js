import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 菜单角色分配
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'编号 主键',roleid:'用户组编号',mid:'菜单编号',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listMenuRole = params => { return axios.get(`${base}/mdp/menu/menuRole/list`, { params: params }); };

//模糊查询菜单角色分配 条件之间or关系  
//export const listMenuRoleKey = params => { return axios.get(`${base}/mdp/menu/menuRole/listKey`, { params: params }); };

//删除一条菜单角色分配 params={id:'编号 主键'}
export const delMenuRole = params => { return axios.post(`${base}/mdp/menu/menuRole/del`,params); };

//批量删除菜单角色分配  params=[{id:'编号 主键'}]
export const batchDelMenuRole = params => { return axios.post(`${base}/mdp/menu/menuRole/batchDel`, params); };

export const batchEditMenusToRole = params => { return axios.post(`${base}/mdp/menu/menuRole/batchEditMenusToRole`, params); };
export const batchEditMenusToRoles = params => { return axios.post(`${base}/mdp/menu/menuRole/batchEditMenusToRoles`, params); };

export const batchEditMenuToRoles = params => { return axios.post(`${base}/mdp/menu/menuRole/batchEditMenuToRoles`, params); };



//修改一条菜单角色分配记录
export const editMenuRole = params => { return axios.post(`${base}/mdp/menu/menuRole/edit`, params); };

//新增一条菜单角色分配
export const addMenuRole = params => { return axios.post(`${base}/mdp/menu/menuRole/add`, params); };