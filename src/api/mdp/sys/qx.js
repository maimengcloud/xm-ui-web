import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 权限定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={qxId:'权限编号 主键',qxName:'权限名称',qxType:'权限类型data/url/base/area',remark:'备注',qxCode:'权限编码',enabled:'是否启用',deptid:'机构编号',branchId:'云用户机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listQx = params => { return axios.get(`${base}/mdp/sys/qx/list`, { params: params }); };

//模糊查询权限定义 条件之间or关系  
//export const listQxKey = params => { return axios.get(`${base}/mdp/sys/qx/listKey`, { params: params }); };

//删除一条权限定义 params={qxId:'权限编号 主键'}
export const delQx = params => { return axios.post(`${base}/mdp/sys/qx/del`,params); };

//批量删除权限定义  params=[{qxId:'权限编号 主键'}]
export const batchDelQx = params => { return axios.post(`${base}/mdp/sys/qx/batchDel`, params); };

//修改一条权限定义记录
export const editQx = params => { return axios.post(`${base}/mdp/sys/qx/edit`, params); };

//新增一条权限定义
export const addQx = params => { return axios.post(`${base}/mdp/sys/qx/add`, params); };