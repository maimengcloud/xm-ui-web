import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 迭代定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',iterationId:'对应的迭代编号',menuId:'需求编号',productId:'产品编号',ctime:'关联时间',relStatus:'关联状态0不再关联1正常关联'}
 **/
 
//普通查询 条件之间and关系  
export const listXmIterationMenu = params => { return axios.get(`${base}/xm/core/xmIterationMenu/list`, { params: params }); };

//模糊查询迭代定义 条件之间or关系  
//export const listXmIterationMenuKey = params => { return axios.get(`${base}/xm/core/xmIterationMenu/listKey`, { params: params }); };

//删除一条迭代定义 params={id:'主键 主键'}
export const delXmIterationMenu = params => { return axios.post(`${base}/xm/core/xmIterationMenu/del`,params); };

//批量删除迭代定义  params=[{id:'主键 主键'}]
export const batchDelXmIterationMenu = params => { return axios.post(`${base}/xm/core/xmIterationMenu/batchDel`, params); };

//修改一条迭代定义记录
export const editXmIterationMenu = params => { return axios.post(`${base}/xm/core/xmIterationMenu/edit`, params); };

//新增一条迭代定义
export const addXmIterationMenu = params => { return axios.post(`${base}/xm/core/xmIterationMenu/add`, params); };

export const batchAddXmIterationMenu = params => { return axios.post(`${base}/xm/core/xmIterationMenu/batchAdd`, params); };
