import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getWorkflowBasePath();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listActAssignee = params => { return axios.get(`${base}/mdp/workflow/re/actAssignee/list`, { params: params }); };

//普通查询模型中的所有节点的执行人列表，需要procDefId
export const getBpmnActAssignees = params => { return axios.get(`${base}/mdp/workflow/re/actAssignee/getBpmnActAssignees`, { params: params }); };


//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
//export const listActAssigneeKey = params => { return axios.get(`${base}/mdp/workflow/re/actAssignee/listKey`, { params: params }); };

//删除一个
export const delActAssignee = params => { return axios.post(`${base}/mdp/workflow/re/actAssignee/del`,params); };

//批量删除
export const batchDelActAssignee = params => { return axios.post(`${base}/mdp/workflow/re/actAssignee/batchDel`, params); };

//修改一个
export const editActAssignee = params => { return axios.post(`${base}/mdp/workflow/re/actAssignee/edit`, params); };

//新增一个
export const addActAssignee = params => { return axios.post(`${base}/mdp/workflow/re/actAssignee/add`, params); };