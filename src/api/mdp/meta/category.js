import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getSysContext()

/**
 * 元数据分类
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'分类编号 主键',categoryName:'分类名称',isShow:'是否显示0否1是',remark:'备注',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listCategory = params => { return axios.get(`${base}/mdp/meta/category/list`, { params: params }); };

//模糊查询元数据分类 条件之间or关系  
//export const listCategoryKey = params => { return axios.get(`${base}/mdp/meta/category/listKey`, { params: params }); };

//删除一条元数据分类 params={id:'分类编号 主键'}
export const delCategory = params => { return axios.post(`${base}/mdp/meta/category/del`,params); };

//批量删除元数据分类  params=[{id:'分类编号 主键'}]
export const batchDelCategory = params => { return axios.post(`${base}/mdp/meta/category/batchDel`, params); };

//修改一条元数据分类记录
export const editCategory = params => { return axios.post(`${base}/mdp/meta/category/edit`, params); };

//新增一条元数据分类
export const addCategory = params => { return axios.post(`${base}/mdp/meta/category/add`, params); };