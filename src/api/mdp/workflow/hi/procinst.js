import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getWorkflowBasePath();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listProcinst = params => { return axios.get(`${base}/mdp/workflow/hi/procinst/list`, { params: params }); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
//export const listProcinstKey = params => { return axios.get(`${base}/mdp/workflow/hi/procinst/listKey`, { params: params }); };

//删除一个
export const delProcinst = params => { return axios.post(`${base}/mdp/workflow/hi/procinst/del`,params); };

//批量删除
export const batchDelProcinst = params => { return axios.post(`${base}/mdp/workflow/hi/procinst/batchDel`, params); };

//修改一个
export const editProcinst = params => { return axios.post(`${base}/mdp/workflow/hi/procinst/edit`, params); };

//新增一个
export const addProcinst = params => { return axios.post(`${base}/mdp/workflow/hi/procinst/add`, params); };