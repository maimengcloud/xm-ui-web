import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 用户角色表(作废)
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={roleid:'用户组编号 主键',userid:'用户编号 主键',}
 **/
 
//普通查询 条件之间and关系  
export const listUserRole = params => { return axios.get(`${base}/mdp/sys/userRole/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryUserRoleById = params => { return axios.get(`${base}/mdp/sys/userRole/queryById`, { params: params }); };

//删除一条用户角色表(作废) params={roleid:'用户组编号 主键',userid:'用户编号 主键'}
export const delUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/del`,params); };

//批量删除用户角色表(作废)  params=[{roleid:'用户组编号 主键',userid:'用户编号 主键'}]
export const batchAddUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/batchAdd`, params); };

//批量删除用户角色表(作废)  params=[{roleid:'用户组编号 主键',userid:'用户编号 主键'}]
export const batchDelUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/batchDel`, params); };

//修改一条用户角色表(作废)记录
export const editUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/edit`, params); };

//新增一条用户角色表(作废)
export const addUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/editSomeFields`, params); };