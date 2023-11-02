import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getLcodeContext();


/**
 * 表单字段定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',formId:'表单编号',fieldId:'字段编号对应数据库',fieldTitle:'字段显示内容',secondCodeRow:'下拉时候关联的分组',fieldType:'字段类型',fieldLength:'字段长度',defaultValue:'默认值',isMultiple:'是否多选',placeholder:'输入框占位文本',isRequired:'是否必输',isFromBaseData:'是否关联基础数据',fieldIdCamel:'字段驼峰命名',remark:'字段备注',extFieldType:'扩展信息',isCloneToFlow:'是否提交到工作流',flowFieldId:'提交到工作流的变量编号',isBizKey:'是否是业务主键'}
 **/
 
//普通查询 条件之间and关系  
export const listFormField = params => { return axios.get(`${base}/mdp/lcode/formField/list`, { params: params }); };

//查询数据库表的字段列表
export const listTableColumn = params => { return axios.get(`${base}/mdp/dev/db/table/column/list`, { params: params }); };

//模糊查询表单字段定义 条件之间or关系  
//export const listFormFieldKey = params => { return axios.get(`${base}/mdp/lcode/formField/listKey`, { params: params }); };

//删除一条表单字段定义 params={id:'主键 主键'}
export const delFormField = params => { return axios.post(`${base}/mdp/lcode/formField/del`,params); };

//批量删除表单字段定义  params=[{id:'主键 主键'}]
export const batchDelFormField = params => { return axios.post(`${base}/mdp/lcode/formField/batchDel`, params); };

//修改一条表单字段定义记录
export const editFormField = params => { return axios.post(`${base}/mdp/lcode/formField/edit`, params); };

//新增一条表单字段定义
export const addFormField = params => { return axios.post(`${base}/mdp/lcode/formField/add`, params); };