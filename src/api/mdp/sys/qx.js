import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 权限定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={qxId:'权限编号 主键',qxName:'权限名称',moduleId:'权限归属模块编号',qxSql:'权限sql片段，一般查询列表需要配置sql',qxType:'权限类型c-新增，r-读，u-更新，d-删除，p-打印'}
 **/
 
//普通查询 条件之间and关系  
export const listQx = params => { return axios.get(`${base}/mdp/sys/qx/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryQxById = params => { return axios.get(`${base}/mdp/sys/qx/queryById`, { params: params }); };

//删除一条权限定义 params={qxId:'权限编号 主键'}
export const delQx = params => { return axios.post(`${base}/mdp/sys/qx/del`,params); };

//批量删除权限定义  params=[{qxId:'权限编号 主键'}]
export const batchAddQx = params => { return axios.post(`${base}/mdp/sys/qx/batchAdd`, params); };

//批量删除权限定义  params=[{qxId:'权限编号 主键'}]
export const batchDelQx = params => { return axios.post(`${base}/mdp/sys/qx/batchDel`, params); };

//修改一条权限定义记录
export const editQx = params => { return axios.post(`${base}/mdp/sys/qx/edit`, params); };

//新增一条权限定义
export const addQx = params => { return axios.post(`${base}/mdp/sys/qx/add`, params); };

//批量修改某些字段
export const editSomeFieldsQx = params => { return axios.post(`${base}/mdp/sys/qx/editSomeFields`, params); };