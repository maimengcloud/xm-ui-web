import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getArcBasePath();

/**
 * 图片分类
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',categoryName:'分类名称',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listImageCategory = params => { return axios.get(`${base}/mdp/arc/imageCategory/list`, { params: params }); };

//模糊查询图片分类 条件之间or关系  
//export const listImageCategoryKey = params => { return axios.get(`${base}/mdp/arc/imageCategory/listKey`, { params: params }); };

//删除一条图片分类 params={id:'主键 主键'}
export const delImageCategory = params => { return axios.post(`${base}/mdp/arc/imageCategory/del`,params); };

//批量删除图片分类  params=[{id:'主键 主键'}]
export const batchDelImageCategory = params => { return axios.post(`${base}/mdp/arc/imageCategory/batchDel`, params); };

//修改一条图片分类记录
export const editImageCategory = params => { return axios.post(`${base}/mdp/arc/imageCategory/edit`, params); };

//新增一条图片分类
export const addImageCategory = params => { return axios.post(`${base}/mdp/arc/imageCategory/add`, params); };