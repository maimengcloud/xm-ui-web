import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getFormBasePath();


/**
 * 表单权限
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={formId:'表单编号 主键',allowQueryRoleids:'允许那些角色查询,号分割',allowQueryDeptids:'允许那些部门查询,号分割',allowQueryUserids:'允许哪些人查询,号分割',notQueryRoleids:'禁止哪些角色查询',notQueryDeptids:'禁止哪些部门查询',notQueryUserids:'禁止哪些人查询',allowOtherQuery:'是否允许其它人查询',allowOtherEdit:'是否允许其它人修改',allowOtherDel:'是否允许其它人删除',doDeptLvlCheck:'是否进行部门级别传递权限检查',deptLvlQx:'部门级别权限'}
 **/
 
//普通查询 条件之间and关系  
export const listFormQx = params => { return axios.get(`${base}/mdp/form/formQx/list`, { params: params }); };

//模糊查询表单权限 条件之间or关系  
//export const listFormQxKey = params => { return axios.get(`${base}/mdp/form/formQx/listKey`, { params: params }); };

//删除一条表单权限 params={formId:'表单编号 主键'}
export const delFormQx = params => { return axios.post(`${base}/mdp/form/formQx/del`,params); };

//批量删除表单权限  params=[{formId:'表单编号 主键'}]
export const batchDelFormQx = params => { return axios.post(`${base}/mdp/form/formQx/batchDel`, params); };

//修改一条表单权限记录
export const editFormQx = params => { return axios.post(`${base}/mdp/form/formQx/edit`, params); };

//新增一条表单权限
export const addFormQx = params => { return axios.post(`${base}/mdp/form/formQx/add`, params); };