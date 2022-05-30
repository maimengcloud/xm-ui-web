import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 用户角色表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键ID 主键',roleid:'用户组编号',userid:'用户编号',remark:'备注',userroleBeg:'有效时间始',userroleEnd:'有效时间止',createDate:'创建日期',roleSort:'顺序号',enabled:'0不启用1启用',deptid:'机构编号',branchId:'云用户机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listUserRole = params => { return axios.get(`${base}/mdp/sys/userRole/list`, { params: params }); };

//普通查询
export const listUserInfosByRoleid = params => { return axios.get(`${base}/sys/userRole/list/users`, { params: params }); };

//删除一条用户角色表 params={id:'主键ID 主键'}
export const delUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/del`,params); };

//批量删除用户角色表  params=[{id:'主键ID 主键'}]
export const batchDelUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/batchDel`, params); };

//修改一条用户角色表记录
export const editUserRole = params => { return axios.post(`${base}/mdp/sys/userRole/edit`, params); };

//批量删除
export const batchEditUserRole = params => { return axios.post(`${base}/sys/userRole/batchEdit`, params); };

//修改一个
//export const editUserRole = params => { return axios.post(`${base}/sys/userRole/edit`, params); };

//新增一个
//export const addUserRole = params => { return axios.post(`${base}/sys/userRole/add`, params); };