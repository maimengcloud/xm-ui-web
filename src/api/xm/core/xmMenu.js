import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 功能表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={menuId:'功能编号 主键',menuName:'功能名称',pmenuId:'上级功能',productId:'归属产品编号',remark:'备注',status:'状态0初始1设计中2开发中3测试中4uat测试2已上线3已下线4已删除',online:'是否已上线',demandUrl:'需求链接',codeUrl:'代码链接',designUrl:'设计链接',docUrl:'文档链接',helpUrl:'帮助文档链接',operDocUrl:'操作手册链接'}
 **/
 
//普通查询 条件之间and关系  
export const listXmMenu = params => { return axios.get(`${base}/xm/core/xmMenu/list`, { params: params }); };

//普通查询 条件之间and关系  
export const listXmMenuWithPlan = params => { return axios.get(`${base}/xm/core/xmMenu/listWithPlan`, { params: params }); };

export const listXmMenuWithState = params => { return axios.get(`${base}/xm/core/xmMenu/listWithState`, { params: params }); };


//模糊查询功能表 条件之间or关系  
//export const listXmMenuKey = params => { return axios.get(`${base}/xm/core/xmMenu/listKey`, { params: params }); };

//删除一条功能表 params={menuId:'功能编号 主键'}
export const delXmMenu = params => { return axios.post(`${base}/xm/core/xmMenu/del`,params); };

//批量删除功能表  params=[{menuId:'功能编号 主键'}]
export const batchDelXmMenu = params => { return axios.post(`${base}/xm/core/xmMenu/batchDel`, params); };

//修改一条功能表记录
export const editXmMenu = params => { return axios.post(`${base}/xm/core/xmMenu/edit`, params); };

//新增一条功能表
export const addXmMenu = params => { return axios.post(`${base}/xm/core/xmMenu/add`, params); };

export const batchAddXmMenu = params => { return axios.post(`${base}/xm/core/xmMenu/batchAdd`, params); };

export const batchEditXmMenu = params => { return axios.post(`${base}/xm/core/xmMenu/batchEdit`, params); };


export const batchChangeParentMenu = params => { return axios.post(`${base}/xm/core/xmMenu/batchChangeParentMenu`, params); };



