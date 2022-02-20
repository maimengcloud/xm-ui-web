import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 产品表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'菜单编号 主键',productName:'菜单名称',branchId:'机构号',remark:'备注'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProduct = params => { return axios.get(`${base}/xm/core/xmProduct/list`, { params: params }); };
export const listXmProductWithState = params => { return axios.get(`${base}/xm/core/xmProduct/listWithState`, { params: params }); };

//模糊查询产品表 条件之间or关系  
//export const listXmProductKey = params => { return axios.get(`${base}/xm/core/xmProduct/listKey`, { params: params }); };

//删除一条产品表 params={id:'菜单编号 主键'}
export const delXmProduct = params => { return axios.post(`${base}/xm/core/xmProduct/del`,params); };

//批量删除产品表  params=[{id:'菜单编号 主键'}]
export const batchDelXmProduct = params => { return axios.post(`${base}/xm/core/xmProduct/batchDel`, params); };

//修改一条产品表记录
export const editXmProduct = params => { return axios.post(`${base}/xm/core/xmProduct/edit`, params); };

//新增一条产品表
export const addXmProduct = params => { return axios.post(`${base}/xm/core/xmProduct/add`, params); };
//新增一条产品表
export const copyTo = params => { return axios.post(`${base}/xm/core/xmProduct/copyTo`, params); };