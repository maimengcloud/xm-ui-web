import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getLcodeContext();


/**
 * form_data_tag
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={dataId:'表单数据编号 主键',tagId:'标签编号',tagName:'标签名字',id:'主键',createTime:'添加事件'}
 **/
 
//普通查询 条件之间and关系  
export const listFormDataTag = params => { return axios.get(`${base}/mdp/lcode/formDataTag/list`, { params: params }); };

//模糊查询form_data_tag 条件之间or关系  
//export const listFormDataTagKey = params => { return axios.get(`${base}/mdp/lcode/formDataTag/listKey`, { params: params }); };

//删除一条form_data_tag params={dataId:'表单数据编号 主键'}
export const delFormDataTag = params => { return axios.post(`${base}/mdp/lcode/formDataTag/del`,params); };

//批量删除form_data_tag  params=[{dataId:'表单数据编号 主键'}]
export const batchDelFormDataTag = params => { return axios.post(`${base}/mdp/lcode/formDataTag/batchDel`, params); };

//修改一条form_data_tag记录
export const editFormDataTag = params => { return axios.post(`${base}/mdp/lcode/formDataTag/edit`, params); };

//新增一条form_data_tag
export const addFormDataTag = params => { return axios.post(`${base}/mdp/lcode/formDataTag/add`, params); };

// params=[{dataId:'',tags:[{tagId:'',tagName:''}]}]
export const batchInsertOrDeleteTags = params => { return axios.post(`${base}/mdp/lcode/formDataTag/batchInsertOrDeleteTags`, params); };