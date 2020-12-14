import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getFormBasePath();


/**
 * form_def_tag
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={formId:'表单编号 主键',tagId:'标签编号',tagName:'标签名字',id:'主键',createTime:'添加事件'}
 **/
 
//普通查询 条件之间and关系  
export const listFormDefTag = params => { return axios.get(`${base}/mdp/form/formDefTag/list`, { params: params }); };

//模糊查询form_def_tag 条件之间or关系  
//export const listFormDefTagKey = params => { return axios.get(`${base}/mdp/form/formDefTag/listKey`, { params: params }); };

//删除一条form_def_tag params={formId:'表单编号 主键'}
export const delFormDefTag = params => { return axios.post(`${base}/mdp/form/formDefTag/del`,params); };

//批量删除form_def_tag  params=[{formId:'表单编号 主键'}]
export const batchDelFormDefTag = params => { return axios.post(`${base}/mdp/form/formDefTag/batchDel`, params); };

//修改一条form_def_tag记录
export const editFormDefTag = params => { return axios.post(`${base}/mdp/form/formDefTag/edit`, params); };

//新增一条form_def_tag
export const addFormDefTag = params => { return axios.post(`${base}/mdp/form/formDefTag/add`, params); };


// params=[{formId:'',tags:[{tagId:'',tagName:''}]}]
export const batchInsertOrDeleteTags = params => { return axios.post(`${base}/mdp/form/formDefTag/batchInsertOrDeleteTags`, params); };