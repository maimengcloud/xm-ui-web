import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 用户部门关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'用户编号',deptid:'部门编号',enabled:'是否启用',seq:'顺序号',branchId:'云机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listUserDept = params => { return axios.get(`${base}/mdp/sys/userDept/list`, { params: params }); };


//模糊查询用户部门关系表 条件之间or关系  
//export const listUserDeptKey = params => { return axios.get(`${base}/mdp/sys/userDept/listKey`, { params: params }); };

//删除一条用户部门关系表 params={id:'主键 主键'}
export const delUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/del`,params); };

//批量删除用户部门关系表  params=[{id:'主键 主键'}]
export const batchDelUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/batchDel`, params); };

//批量删除用户部门关系表  params={branchId:'',userid:'',dpetids:[]}
export const batchEditUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/batchEdit`, params); };

//修改一条用户部门关系表记录
export const editUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/edit`, params); };

//新增一条用户部门关系表
export const addUserDept = params => { return axios.post(`${base}/mdp/sys/userDept/add`, params); };