import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 角色管理
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={roleid:'角色编号 主键',rolename:'角色名',remark:'备注',roletype:'角色类型0-机构私有,1-公共',rolebeg:'开始时间',roleend:'结束时间',crdate:'创建日期',enabled:'是否启用',deptid:'机构编号',sortOrder:'角色排序',branchId:'云用户机构编号',dataLvl:'数据访问等级'}
 **/
 
//普通查询 条件之间and关系  
export const listRole = params => { return axios.get(`${base}/mdp/sys/role/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryRoleById = params => { return axios.get(`${base}/mdp/sys/role/queryById`, { params: params }); };

//删除一条角色管理 params={roleid:'角色编号 主键'}
export const delRole = params => { return axios.post(`${base}/mdp/sys/role/del`,params); };

//批量删除角色管理  params=[{roleid:'角色编号 主键'}]
export const batchAddRole = params => { return axios.post(`${base}/mdp/sys/role/batchAdd`, params); };

//批量删除角色管理  params=[{roleid:'角色编号 主键'}]
export const batchDelRole = params => { return axios.post(`${base}/mdp/sys/role/batchDel`, params); };

//修改一条角色管理记录
export const editRole = params => { return axios.post(`${base}/mdp/sys/role/edit`, params); };

//新增一条角色管理
export const addRole = params => { return axios.post(`${base}/mdp/sys/role/add`, params); };

//批量修改某些字段
export const editSomeFieldsRole = params => { return axios.post(`${base}/mdp/sys/role/editSomeFields`, params); };