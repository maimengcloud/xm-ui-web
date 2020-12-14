import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_file
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'文档编号 主键',name:'文件名称',projectId:'项目编号',projectName:'项目名称',description:'文件说明',createUserid:'任务创建人编号',createUsername:'任务创建人',createTime:'创建时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmFile = params => { return axios.get(`${base}/xm/core/xmFile/list`, { params: params }); };

//模糊查询xm_file 条件之间or关系  
//export const listXmFileKey = params => { return axios.get(`${base}/xm/core/xmFile/listKey`, { params: params }); };

//删除一条xm_file params={id:'文档编号 主键'}
export const delXmFile = params => { return axios.post(`${base}/xm/core/xmFile/del`,params); };

//批量删除xm_file  params=[{id:'文档编号 主键'}]
export const batchDelXmFile = params => { return axios.post(`${base}/xm/core/xmFile/batchDel`, params); };

//修改一条xm_file记录
export const editXmFile = params => { return axios.post(`${base}/xm/core/xmFile/edit`, params); };

//新增一条xm_file
export const addXmFile = params => { return axios.post(`${base}/xm/core/xmFile/add`, params); };