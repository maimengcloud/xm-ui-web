import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * sys_post
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',postName:'岗位名称',remark:'备注',branchId:'归属机构号',cdate:'创建日期'}
 **/
 
//普通查询 条件之间and关系  
export const listPost = params => { return axios.get(`${base}/mdp/sys/post/post/list`, { params: params }); };

//查询未添加到部门的岗位 
export const listPostNotInDeptid = params => { return axios.get(`${base}/mdp/sys/post/post/list/notInDeptid`, { params: params }); };

//模糊查询sys_post 条件之间or关系  
//export const listPostKey = params => { return axios.get(`${base}/mdp/sys/post/post/listKey`, { params: params }); };

//删除一条sys_post params={id:'主键 主键'}
export const delPost = params => { return axios.post(`${base}/mdp/sys/post/post/del`,params); };

//批量删除sys_post  params=[{id:'主键 主键'}]
export const batchDelPost = params => { return axios.post(`${base}/mdp/sys/post/post/batchDel`, params); };

//修改一条sys_post记录
export const editPost = params => { return axios.post(`${base}/mdp/sys/post/post/edit`, params); };

//新增一条sys_post
export const addPost = params => { return axios.post(`${base}/mdp/sys/post/post/add`, params); };