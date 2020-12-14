import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * 部门岗位关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',deptid:'部门编号',postId:'岗位编号',ldate:'最后更新时间'}
 **/
 
//普通查询 条件之间and关系  
export const listDeptPost = params => { return axios.get(`${base}/mdp/sys/post/deptPost/list`, { params: params }); };

//模糊查询部门岗位关系表 条件之间or关系  
//export const listDeptPostKey = params => { return axios.get(`${base}/mdp/sys/post/deptPost/listKey`, { params: params }); };

//删除一条部门岗位关系表 params={id:'主键 主键'}
export const delDeptPost = params => { return axios.post(`${base}/mdp/sys/post/deptPost/del`,params); };

//批量删除部门岗位关系表  params=[{id:'主键 主键'}]
export const batchDelDeptPost = params => { return axios.post(`${base}/mdp/sys/post/deptPost/batchDel`, params); };

//批量添加岗位到部门
export const batchAddDeptPost = params => { return axios.post(`${base}/mdp/sys/post/deptPost/batchAdd`, params); };

//修改一条部门岗位关系表记录
export const editDeptPost = params => { return axios.post(`${base}/mdp/sys/post/deptPost/edit`, params); };

//新增一条部门岗位关系表
export const addDeptPost = params => { return axios.post(`${base}/mdp/sys/post/deptPost/add`, params); };