import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 用户部门关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'用户编号 主键',deptid:'部门编号 主键',enabled:'是否启用',seq:'顺序号'}
 **/
 
//普通查询 条件之间and关系  
export const listUserDept = params => { return axios.get(`${base}/mdp/sys/userDept/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryUserDeptById = params => { return axios.get(`${base}/mdp/sys/userDept/queryById`, { params: params }); };

//删除一条用户部门关系表 params={userid:'用户编号 主键',deptid:'部门编号 主键'}
export const delUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/del`,params); };

//批量删除用户部门关系表  params=[{userid:'用户编号 主键',deptid:'部门编号 主键'}]
export const batchAddUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/batchAdd`, params); };

//批量删除用户部门关系表  params=[{userid:'用户编号 主键',deptid:'部门编号 主键'}]
export const batchDelUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/batchDel`, params); };

//修改一条用户部门关系表记录
export const editUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/edit`, params); };

//新增一条用户部门关系表
export const addUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/editSomeFields`, params); };

//批量删除用户部门关系表  params={branchId:'',userid:'',dpetid:[]}
export const batchEditUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/batchEdit`, params); };