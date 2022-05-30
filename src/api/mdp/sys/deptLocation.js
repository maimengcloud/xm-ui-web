import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * sys_dept_location
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={deptid:'部门地址编号 主键',longitude:'经度',latitude:'纬度',address:'地址',province:'省',city:'市',district:'区'}
 **/
 
//普通查询 条件之间and关系  
export const listDeptLocation = params => { return axios.get(`${base}/mdp/sys/deptLocation/list`, { params: params }); };

//模糊查询sys_dept_location 条件之间or关系  
//export const listDeptLocationKey = params => { return axios.get(`${base}/mdp/sys/deptLocation/listKey`, { params: params }); };

//删除一条sys_dept_location params={deptid:'部门地址编号 主键'}
export const delDeptLocation = params => { return axios.post(`${base}/mdp/sys/deptLocation/del`,params); };

//批量删除sys_dept_location  params=[{deptid:'部门地址编号 主键'}]
export const batchDelDeptLocation = params => { return axios.post(`${base}/mdp/sys/deptLocation/batchDel`, params); };

//修改一条sys_dept_location记录
export const editDeptLocation = params => { return axios.post(`${base}/mdp/sys/deptLocation/edit`, params); };

//新增一条sys_dept_location
export const addDeptLocation = params => { return axios.post(`${base}/mdp/sys/deptLocation/add`, params); };
//addAndEditDeptLocation
export const addAndEditDeptLocation = params => { return axios.post(`${base}/mdp/sys/deptLocation/addAndEditDeptLocation`, params); };
//getDeptLocation
export const getDeptLocation = params => { return axios.post(`${base}/mdp/sys/deptLocation/getDeptLocation`, params); };