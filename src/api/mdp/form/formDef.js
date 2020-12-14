import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getFormBasePath();


/**
 * 表单定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',tableName:'表名',tableOwner:'表名拥有者',isCreateTable:'是否已经创建库表',formName:'表单名称',userid:'创建人',deptid:'创建部门',formType:'表单类型',isTemplate:'是否为模板',bizType:'业务分类',ctime:'创建日期',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listFormDef = params => { return axios.get(`${base}/mdp/form/formDef/list`, { params: params }); };

//模糊查询表单定义 条件之间or关系  
//export const listFormDefKey = params => { return axios.get(`${base}/mdp/form/formDef/listKey`, { params: params }); };

//删除一条表单定义 params={id:'主键 主键'}
export const delFormDef = params => { return axios.post(`${base}/mdp/form/formDef/del`,params); };

//批量删除表单定义  params=[{id:'主键 主键'}]
export const batchDelFormDef = params => { return axios.post(`${base}/mdp/form/formDef/batchDel`, params); };

//修改一条表单定义记录
export const editFormDef = params => { return axios.post(`${base}/mdp/form/formDef/edit`, params); };

//新增一个
export const addFormDef = params => { return axios.post(`${base}/mdp/form/formDef/add`, params); };

//新增一个及其属性多个 {formDef:{formName:'',formId:''},formFields:[{fieldId:'',fieldTitle:''},{fieldId:'',fieldTitle:''}]}
export const addFormDefAndFields = params => { return axios.post(`${base}/mdp/form/formDef/addFormDefAndFields`, params); };

//新增一个及其属性多个 {formDef:{formName:'',formId:''},formFields:[{fieldId:'',fieldTitle:''},{fieldId:'',fieldTitle:''}]}
export const editFormDefAndFields = params => { return axios.post(`${base}/mdp/form/formDef/editFormDefAndFields`, params); };