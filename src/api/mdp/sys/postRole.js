import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 岗位角色关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={postId:'岗位编号 主键',roleid:'角色编号 主键',}
 **/
 
//普通查询 条件之间and关系  
export const listPostRole = params => { return axios.get(`${base}/mdp/sys/postRole/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryPostRoleById = params => { return axios.get(`${base}/mdp/sys/postRole/queryById`, { params: params }); };

//删除一条岗位角色关系表 params={postId:'岗位编号 主键',roleid:'角色编号 主键'}
export const delPostRole = params => { return axios.post(`${base}/mdp/sys/postRole/del`,params); };

//设置多个角色给某个岗位 params={postId:'',roleids:[]}
export const setRolesToPost = params => { return axios.post(`${base}/mdp/sys/postRole/setRolesToPost`, params); };

//批量删除岗位角色关系表  params=[{postId:'岗位编号 主键',roleid:'角色编号 主键'}]
export const batchDelPostRole = params => { return axios.post(`${base}/mdp/sys/postRole/batchDel`, params); };

//修改一条岗位角色关系表记录
export const editPostRole = params => { return axios.post(`${base}/mdp/sys/postRole/edit`, params); };

//新增一条岗位角色关系表
export const addPostRole = params => { return axios.post(`${base}/mdp/sys/postRole/add`, params); };

//批量修改某些字段
export const editSomeFieldsPostRole = params => { return axios.post(`${base}/mdp/sys/postRole/editSomeFields`, params); };