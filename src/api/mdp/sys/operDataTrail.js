import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getSysContext()

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listOperDataTrail = params => { return axios.get(`${base}/sys/operDataTrail/list`, { params: params }); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
//export const listOperDataTrailKey = params => { return axios.get(`${base}/sys/operDataTrail/listKey`, { params: params }); };

//删除一个
export const delOperDataTrail = params => { return axios.post(`${base}/sys/operDataTrail/del`,params); };

//批量删除
export const batchDelOperDataTrail = params => { return axios.post(`${base}/sys/operDataTrail/batchDel`, params); };

//修改一个
export const editOperDataTrail = params => { return axios.post(`${base}/sys/operDataTrail/edit`, params); };

//新增一个
export const addOperDataTrail = params => { return axios.post(`${base}/sys/operDataTrail/add`, params); };

//修改一个
export const operEnd = params => { return axios.post(`${base}/sys/operDataTrail/edit/end`, params); };