import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getArcBasePath();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listCategory = params => { return axios.get(`${base}/mdp/arc/category/list`, { params: params }); };

//普通查询
export const listTreeCategory = params => { return axios.get(`${base}/mdp/arc/category/list/tree`, { params: params }); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
//export const listCategoryKey = params => { return axios.get(`${base}/mdp/arc/category/listKey`, { params: params }); };

//删除一个
export const delCategory = params => { return axios.post(`${base}/mdp/arc/category/del`,params); };

//批量删除
export const batchDelCategory = params => { return axios.post(`${base}/mdp/arc/category/batchDel`, params); };

//修改一个
export const editCategory = params => { return axios.post(`${base}/mdp/arc/category/edit`, params); };

//新增一个
export const addCategory = params => { return axios.post(`${base}/mdp/arc/category/add`, params); };