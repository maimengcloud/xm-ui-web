import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listDept = params => { return axios.get(`${base}/sys/dept/list`, { params: params }); };

//普通查询
export const listTreeDept = params => { return axios.get(`${base}/sys/dept/list/tree`, { params: params }); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
export const listDeptKey = params => { return axios.get(`${base}/sys/dept/listKey`, { params: params }); };

//删除一个
export const delDept = params => { return axios.post(`${base}/sys/dept/del`,params); };

//批量删除
export const batchDelDept = params => { return axios.post(`${base}/sys/dept/batchDel`, params); };

//修改一个
export const editDept = params => { return axios.post(`${base}/sys/dept/edit`, params); };

//新增一个
export const addDept = params => { return axios.post(`${base}/sys/dept/add`, params); };