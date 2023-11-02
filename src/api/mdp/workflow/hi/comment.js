import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getWorkflowContext();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listComment = params => { return axios.get(`${base}/mdp/workflow/hi/comment/list`, { params: params }); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
//export const listCommentKey = params => { return axios.get(`${base}/mdp/workflow/hi/comment/listKey`, { params: params }); };

//删除一个
export const delComment = params => { return axios.post(`${base}/mdp/workflow/hi/comment/del`,params); };

//批量删除
export const batchDelComment = params => { return axios.post(`${base}/mdp/workflow/hi/comment/batchDel`, params); };

//修改一个
export const editComment = params => { return axios.post(`${base}/mdp/workflow/hi/comment/edit`, params); };

//新增一个
export const addComment = params => { return axios.post(`${base}/mdp/workflow/hi/comment/add`, params); };