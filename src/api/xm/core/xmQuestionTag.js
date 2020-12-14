import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 问题标签关联表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',questionId:'问题编号',tagId:'标签编号',tagName:'标签名称',ctime:'添加时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmQuestionTag = params => { return axios.get(`${base}/xm/core/xmQuestionTag/list`, { params: params }); };

//模糊查询问题标签关联表 条件之间or关系  
//export const listXmQuestionTagKey = params => { return axios.get(`${base}/xm/core/xmQuestionTag/listKey`, { params: params }); };

//删除一条问题标签关联表 params={id:'主键 主键'}
export const delXmQuestionTag = params => { return axios.post(`${base}/xm/core/xmQuestionTag/del`,params); };

//批量删除问题标签关联表  params=[{id:'主键 主键'}]
export const batchDelXmQuestionTag = params => { return axios.post(`${base}/xm/core/xmQuestionTag/batchDel`, params); };

//修改一条问题标签关联表记录
export const editXmQuestionTag = params => { return axios.post(`${base}/xm/core/xmQuestionTag/edit`, params); };

//新增一条问题标签关联表
export const addXmQuestionTag = params => { return axios.post(`${base}/xm/core/xmQuestionTag/add`, params); };