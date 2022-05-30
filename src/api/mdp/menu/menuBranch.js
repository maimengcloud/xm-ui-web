import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 菜单分配到机构
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',mid:'菜单编号',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listMenuBranch = params => { return axios.get(`${base}/mdp/menu/menuBranch/list`, { params: params }); };

//模糊查询菜单分配到机构 条件之间or关系  
//export const listMenuBranchKey = params => { return axios.get(`${base}/mdp/menu/menuBranch/listKey`, { params: params }); };

//删除一条菜单分配到机构 params={id:'主键 主键'}
export const delMenuBranch = params => { return axios.post(`${base}/mdp/menu/menuBranch/del`,params); };

//批量删除菜单分配到机构  params=[{id:'主键 主键'}]
export const batchDelMenuBranch = params => { return axios.post(`${base}/mdp/menu/menuBranch/batchDel`, params); };

//修改一条菜单分配到机构记录
export const editMenuBranch = params => { return axios.post(`${base}/mdp/menu/menuBranch/edit`, params); };

//新增一条菜单分配到机构
export const addMenuBranch = params => { return axios.post(`${base}/mdp/menu/menuBranch/add`, params); };