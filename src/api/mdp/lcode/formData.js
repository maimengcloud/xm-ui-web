import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getLcodeContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 表单数据表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',two:'属性二',three:'属性三',four:'属性四',five:'属性五',six:'属性六',seven:'属性七',eight:'属性八',nine:'属性九',ten:'属性十',lastTime:'最后更新日期',one:'属性一',zero:'属性零',remark:'备注',formId:'表单编号',userid:'最后更新人',eleven:'字段十一',twelve:'字段十二',thirteen:'字段十三',fourteen:'字段十四',fifteen:'字段十五',attachmentUrls:'附件url多个',attachmentNames:'附件名称多个',branchId:'机构编号',bizKey:'唯一确定该业务的主键竖线分隔多个，如果是联合组件的话',deptid:'创建部门',flowState:'0初始1审批中2结束审批',createTime:'创建时间',dqxCode:'数据权限码',cuserid:'创建人编号',tagIds:'标签编号列表逗号分割',tagNames:'标签名列表逗号分割',cusername:'创建人姓名',deptName:'创建部门'}
 **/
 
//普通查询 条件之间and关系  
export const listFormData = params => { return axios.get(`${base}/mdp/lcode/formData/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryFormDataById = params => { return axios.get(`${base}/mdp/lcode/formData/queryById`, { params: params }); };

//删除一条表单数据表 params={id:'主键 主键'}
export const delFormData = params => { return axios.post(`${base}/mdp/lcode/formData/del`,params); };

//批量删除表单数据表  params=[{id:'主键 主键'}]
export const batchAddFormData = params => { return axios.post(`${base}/mdp/lcode/formData/batchAdd`, params); };

//批量删除表单数据表  params=[{id:'主键 主键'}]
export const batchDelFormData = params => { return axios.post(`${base}/mdp/lcode/formData/batchDel`, params); };

//修改一条表单数据表记录
export const editFormData = params => { return axios.post(`${base}/mdp/lcode/formData/edit`, params); };

//新增一条表单数据表
export const addFormData = params => { return axios.post(`${base}/mdp/lcode/formData/add`, params); };

//批量修改某些字段
export const editSomeFieldsFormData = params => { return axios.post(`${base}/mdp/lcode/formData/editSomeFields`, params); };