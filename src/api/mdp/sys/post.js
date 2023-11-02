import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 岗位管理
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',postName:'岗位名称',remark:'备注',branchId:'归属机构号',cdate:'创建日期',postLvl:'岗位级别引用字典',postType:'岗位类型引用字典'}
 **/
 
//普通查询 条件之间and关系  
export const listPost = params => { return axios.get(`${base}/mdp/sys/post/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryPostById = params => { return axios.get(`${base}/mdp/sys/post/queryById`, { params: params }); };

//删除一条岗位管理 params={id:'主键 主键'}
export const delPost = params => { return axios.post(`${base}/mdp/sys/post/del`,params); };

//批量删除岗位管理  params=[{id:'主键 主键'}]
export const batchAddPost = params => { return axios.post(`${base}/mdp/sys/post/batchAdd`, params); };

//批量删除岗位管理  params=[{id:'主键 主键'}]
export const batchDelPost = params => { return axios.post(`${base}/mdp/sys/post/batchDel`, params); };

//修改一条岗位管理记录
export const editPost = params => { return axios.post(`${base}/mdp/sys/post/edit`, params); };

//新增一条岗位管理
export const addPost = params => { return axios.post(`${base}/mdp/sys/post/add`, params); };

//批量修改某些字段
export const editSomeFieldsPost = params => { return axios.post(`${base}/mdp/sys/post/editSomeFields`, params); };