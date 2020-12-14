import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getFormBasePath();


/**
 * 表单数据表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',two:'属性二',three:'属性三',four:'属性四',five:'属性五',six:'属性六',seven:'属性七',eight:'属性八',nine:'属性九',ten:'属性十',lastTime:'最后更新日期',one:'属性一',zero:'属性零',remark:'备注',formId:'表单编号',userid:'最后更新人',eleven:'字段十一',twelve:'字段十二',thirteen:'字段十三',fourteen:'字段十四',fifteen:'字段十五',attachmentUrls:'附件url多个',attachmentNames:'附件名称多个',branchId:'机构编号',bizKey:'唯一确定该业务的主键',deptid:'创建部门'}
 **/
 
//普通查询 条件之间and关系  
export const listFormData = params => { return axios.get(`${base}/mdp/form/formData/list`, { params: params }); };

//模糊查询表单数据表 条件之间or关系  
//export const listFormDataKey = params => { return axios.get(`${base}/mdp/form/formData/listKey`, { params: params }); };

//删除一条表单数据表 params={id:'主键 主键'}
export const delFormData = params => { return axios.post(`${base}/mdp/form/formData/del`,params); };

//批量删除表单数据表  params=[{id:'主键 主键'}]
export const batchDelFormData = params => { return axios.post(`${base}/mdp/form/formData/batchDel`, params); };

//修改一条表单数据表记录
export const editFormData = params => { return axios.post(`${base}/mdp/form/formData/edit`, params); };

//新增一条表单数据表
export const addFormData = params => { return axios.post(`${base}/mdp/form/formData/add`, params); };