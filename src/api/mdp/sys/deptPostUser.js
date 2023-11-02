import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',postId:'岗位编号',deptid:'部门编号',userid:'用户编号',startDate:'开始任职时间',endDate:'结束任职时间',actEndDate:'实际结束任职时间',enabled:'状态0-无效1-有效',lastDate:'最后更新时间',master:'是否为主岗位0否1是'}
 **/
 
//普通查询 条件之间and关系  
export const listDeptPostUser = params => { return axios.get(`${base}/mdp/sys/deptPostUser/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryDeptPostUserById = params => { return axios.get(`${base}/mdp/sys/deptPostUser/queryById`, { params: params }); };

//删除一条部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余） params={id:'主键 主键'}
export const delDeptPostUser = params => { return axios.post(`${base}/mdp/sys/deptPostUser/del`,params); };

//批量删除部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）  params=[{id:'主键 主键'}]
export const batchAddDeptPostUser = params => { return axios.post(`${base}/mdp/sys/deptPostUser/batchAdd`, params); };

//批量删除部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）  params=[{id:'主键 主键'}]
export const batchDelDeptPostUser = params => { return axios.post(`${base}/mdp/sys/deptPostUser/batchDel`, params); };

//修改一条部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）记录
export const editDeptPostUser = params => { return axios.post(`${base}/mdp/sys/deptPostUser/edit`, params); };

//新增一条部门岗位用户关系表（根据部门岗位关系,岗位用户关系自动冗余）
export const addDeptPostUser = params => { return axios.post(`${base}/mdp/sys/deptPostUser/add`, params); };

//批量修改某些字段
export const editSomeFieldsDeptPostUser = params => { return axios.post(`${base}/mdp/sys/deptPostUser/editSomeFields`, params); };

//普通查询 条件之间and关系
export const listDeptPostUserWithDeptPosts = params => { return axios.get(`${base}/mdp/sys/deptPostUser/list/withDeptPosts`, { params: params }); };

//人员岗位菜单快捷查询
export const listDeptPostUserMenus = params => { return axios.get(`${base}/mdp/sys/deptPostUser/list/menus`, { params: params }); };

//人员岗位角色快捷查询
export const listDeptPostUserRoles = params => { return axios.get(`${base}/mdp/sys/deptPostUser/list/roles`, { params: params }); };

export const setPostMaster = params => { return axios.post(`${base}/mdp/sys/deptPostUser/setPostMaster`, params); };