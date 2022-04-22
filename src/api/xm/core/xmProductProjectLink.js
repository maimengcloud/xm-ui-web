import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={projectId:'项目表中的主键 主键',productId:'产品表中的主键 主键',ctime:'创建时间',cuserid:'创建人编号',cusername:'创建人姓名',linkStatus:'关联状态1关联0取消关联'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProductProjectLink = params => { return axios.get(`${base}/xm/core/xmProductProjectLink/list`, { params: params }); };

//模糊查询产品与项目的关联关系表，一般由产品经理挂接项目到产品上 条件之间or关系  
//export const listXmProductProjectLinkKey = params => { return axios.get(`${base}/xm/core/xmProductProjectLink/listKey`, { params: params }); };

//删除一条产品与项目的关联关系表，一般由产品经理挂接项目到产品上 params={projectId:'项目表中的主键 主键',productId:'产品表中的主键 主键'}
export const delXmProductProjectLink = params => { return axios.post(`${base}/xm/core/xmProductProjectLink/del`,params); };

//批量删除产品与项目的关联关系表，一般由产品经理挂接项目到产品上  params=[{projectId:'项目表中的主键 主键',productId:'产品表中的主键 主键'}]
export const batchDelXmProductProjectLink = params => { return axios.post(`${base}/xm/core/xmProductProjectLink/batchDel`, params); };

//修改一条产品与项目的关联关系表，一般由产品经理挂接项目到产品上记录
export const editXmProductProjectLink = params => { return axios.post(`${base}/xm/core/xmProductProjectLink/edit`, params); };

//新增一条产品与项目的关联关系表，一般由产品经理挂接项目到产品上
export const addXmProductProjectLink = params => { return axios.post(`${base}/xm/core/xmProductProjectLink/add`, params); };

//新增一条产品与项目的关联关系表，一般由产品经理挂接项目到产品上
export const editSomeFieldsXmProductProjectLink = params => { return axios.post(`${base}/xm/core/xmProductProjectLink/editSomeFields`, params); };