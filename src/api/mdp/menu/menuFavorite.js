import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * 菜单收藏夹
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={favoriteid:'菜单收藏夹ID 主键',deptPostUserid:'部门-岗位-用户ID（暂时不用）',deptid:'部门ID（暂时不用）',postid:'岗位ID（暂时不用）',userid:'用户ID（暂时不用）',menuid:'菜单ID（暂时不用）',menuname:'菜单名称',sort:'排序',branchId:'云用户机构编号',cuserid:'创建人',cdate:'创建时间',lopuserid:'最后操作人',lopcreate:'最后操作时间',accUrl:'访问路径',icon:'菜单图标'}
 **/
 
//普通查询 条件之间and关系  
export const listMenuFavorite = params => { return axios.get(`${base}/mdp/menu/menuFavorite/list`, { params: params }); };

//模糊查询菜单收藏夹 条件之间or关系  
//export const listMenuFavoriteKey = params => { return axios.get(`${base}/mdp/menu/menuFavorite/listKey`, { params: params }); };

//删除一条菜单收藏夹 params={favoriteid:'菜单收藏夹ID 主键'}
export const delMenuFavorite = params => { return axios.post(`${base}/mdp/menu/menuFavorite/del`,params); };

//批量删除菜单收藏夹  params=[{favoriteid:'菜单收藏夹ID 主键'}]
export const batchDelMenuFavorite = params => { return axios.post(`${base}/mdp/menu/menuFavorite/batchDel`, params); };

//修改一条菜单收藏夹记录
export const editMenuFavorite = params => { return axios.post(`${base}/mdp/menu/menuFavorite/edit`, params); };

//新增一条菜单收藏夹
export const addMenuFavorite = params => { return axios.post(`${base}/mdp/menu/menuFavorite/add`, params); };


export const saveMenuFavoritesApi = params => { return axios.post(`${base}/mdp/menu/menuFavorite/saveMenuFavorites`, params); };

export const getMenuFavoritesApi = params => { return axios.post(`${base}/mdp/menu/menuFavorite/getMenuFavorites`, params); };

export const addMenuFavoriteIconApi = params => { return axios.post(`${base}/mdp/menu/menuFavorite/addMenuFavoriteIcon`, params); };
