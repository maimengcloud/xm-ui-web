import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 数据项定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',itemCode:'代码',itemName:'名称',remark:'备注',categoryId:'分类编号',itemSize:'长度',itemType:'类型',branchId:'机构编号',deptid:'部门编号'}
 **/
 
//普通查询 条件之间and关系  
export const listItem = params => { return axios.get(`${base}/mdp/meta/item/list`, { params: params }); };

//模糊查询数据项定义 条件之间or关系  
//export const listItemKey = params => { return axios.get(`${base}/mdp/meta/item/listKey`, { params: params }); };

//删除一条数据项定义 params={id:'主键 主键'}
export const delItem = params => { return axios.post(`${base}/mdp/meta/item/del`,params); };

//批量删除数据项定义  params=[{id:'主键 主键'}]
export const batchDelItem = params => { return axios.post(`${base}/mdp/meta/item/batchDel`, params); };

//修改一条数据项定义记录
export const editItem = params => { return axios.post(`${base}/mdp/meta/item/edit`, params); };

//新增一条数据项定义
export const addItem = params => { return axios.post(`${base}/mdp/meta/item/add`, params); };