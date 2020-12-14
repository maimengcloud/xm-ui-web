import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 产品表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'产品编号 主键',productName:'产品名称',branchId:'机构号',remark:'备注',templateId:'项目模板编号',tcuserid:'模板创建人编号',tcusername:'模板创建人姓名',tremark:'模板备注',tctime:'模板创建时间',tcbranchId:'模板创建机构编号',shareScope:'共享范围0-全部,1-本机构'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProductTemplate = params => { return axios.get(`${base}/xm/core/xmProductTemplate/list`, { params: params }); };

//模糊查询产品表 条件之间or关系  
//export const listXmProductTemplateKey = params => { return axios.get(`${base}/xm/core/xmProductTemplate/listKey`, { params: params }); };

//删除一条产品表 params={id:'产品编号 主键'}
export const delXmProductTemplate = params => { return axios.post(`${base}/xm/core/xmProductTemplate/del`,params); };

//批量删除产品表  params=[{id:'产品编号 主键'}]
export const batchDelXmProductTemplate = params => { return axios.post(`${base}/xm/core/xmProductTemplate/batchDel`, params); };

//修改一条产品表记录
export const editXmProductTemplate = params => { return axios.post(`${base}/xm/core/xmProductTemplate/edit`, params); };

//新增一条产品表
export const addXmProductTemplate = params => { return axios.post(`${base}/xm/core/xmProductTemplate/add`, params); };