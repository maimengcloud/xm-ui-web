import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={iterationId:'迭代表主键 主键',proId:'产品表主键 主键',ctime:'创建时间',cuserid:'创建人编号',cusername:'创建人姓名',linkStatus:'关联状态1关联0取消关联'}
 **/
 
//普通查询 条件之间and关系  
export const listXmIterationLink = params => { return axios.get(`${base}/xm/core/xmIterationLink/list`, { params: params }); };

//模糊查询迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表 条件之间or关系  
//export const listXmIterationLinkKey = params => { return axios.get(`${base}/xm/core/xmIterationLink/listKey`, { params: params }); };

//删除一条迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表 params={iterationId:'迭代表主键 主键',proId:'产品表主键 主键'}
export const delXmIterationLink = params => { return axios.post(`${base}/xm/core/xmIterationLink/del`,params); };

//批量删除迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表  params=[{iterationId:'迭代表主键 主键',proId:'产品表主键 主键'}]
export const batchDelXmIterationLink = params => { return axios.post(`${base}/xm/core/xmIterationLink/batchDel`, params); };

//修改一条迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表记录
export const editXmIterationLink = params => { return axios.post(`${base}/xm/core/xmIterationLink/edit`, params); };

//新增一条迭代表与产品表的关联关系，一般由迭代管理员将迭代挂接到产品表
export const addXmIterationLink = params => { return axios.post(`${base}/xm/core/xmIterationLink/add`, params); };