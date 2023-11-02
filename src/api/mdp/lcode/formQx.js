import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getLcodeContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 表单权限
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={formId:'表单编号 主键',qryRoleids:'允许那些角色查询,号分割',qryDeptids:'允许那些部门查询,号分割',qryUserids:'允许哪些人查询,号分割',nqRoleids:'禁止哪些角色查询',nqDeptids:'禁止哪些部门查询',nqUserids:'禁止哪些人查询',othQuery:'是否允许其它人查询',othEdit:'是否允许其它人修改',othDel:'是否允许其它人删除',lvlCheck:'是否进行部门级别传递权限检查',qryMinLvl:'最低级别查询权限',editRoleids:'允许那些角色更新,号分割',editDeptids:'允许那些部门更新,号分割',editUserids:'允许哪些人更新号分割',neRoleids:'禁止哪些角色更新',neDeptids:'禁止哪些部门更新',neUserids:'禁止哪些人更新',delRoleids:'允许那些角色删除,号分割',delDeptids:'允许那些部门删除,号分割',delUserids:'允许哪些人删除,号分割',ndRoleids:'禁止哪些角色删除',ndDeptids:'禁止哪些部门删除',ndUserids:'禁止哪些人查询',editMinLvl:'最低级别更新权限',delMinLvl:'最低级别删除权限'}
 **/
 
//普通查询 条件之间and关系  
export const listFormQx = params => { return axios.get(`${base}/mdp/lcode/formQx/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryFormQxById = params => { return axios.get(`${base}/mdp/lcode/formQx/queryById`, { params: params }); };

//删除一条表单权限 params={formId:'表单编号 主键'}
export const delFormQx = params => { return axios.post(`${base}/mdp/lcode/formQx/del`,params); };

//批量删除表单权限  params=[{formId:'表单编号 主键'}]
export const batchAddFormQx = params => { return axios.post(`${base}/mdp/lcode/formQx/batchAdd`, params); };

//批量删除表单权限  params=[{formId:'表单编号 主键'}]
export const batchDelFormQx = params => { return axios.post(`${base}/mdp/lcode/formQx/batchDel`, params); };

//修改一条表单权限记录
export const editFormQx = params => { return axios.post(`${base}/mdp/lcode/formQx/edit`, params); };

//新增一条表单权限
export const addFormQx = params => { return axios.post(`${base}/mdp/lcode/formQx/add`, params); };

//批量修改某些字段
export const editSomeFieldsFormQx = params => { return axios.post(`${base}/mdp/lcode/formQx/editSomeFields`, params); };