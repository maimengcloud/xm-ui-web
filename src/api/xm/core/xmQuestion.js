import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_question
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'问题编号 主键',name:'问题标题',projectId:'项目编号',projectName:'项目名称',taskId:'任务编号',taskName:'任务名称',endTime:'到期时间',askUserid:'提出人编号',askUsername:'提出人',handlerUserid:'处理人编号',handlerUsername:'处理人',priority:'优先级别',solution:'解决方案',processTime:'处理时间',receiptMessage:'回执信息',receiptTime:'回执时间',description:'问题描述',createUserid:'问题创建人编号',createUsername:'问题创建人',createTime:'创建时间',status:'状态，0未提交，1已提交，2处理中，3未解决，4已解决'}
 **/
 
//普通查询 条件之间and关系  
export const listXmQuestion = params => { return axios.get(`${base}/xm/core/xmQuestion/list`, { params: params }); };

//模糊查询xm_question 条件之间or关系  
//export const listXmQuestionKey = params => { return axios.get(`${base}/xm/core/xmQuestion/listKey`, { params: params }); };

//删除一条xm_question params={id:'问题编号 主键'}
export const delXmQuestion = params => { return axios.post(`${base}/xm/core/xmQuestion/del`,params); };

//批量删除xm_question  params=[{id:'问题编号 主键'}]
export const batchDelXmQuestion = params => { return axios.post(`${base}/xm/core/xmQuestion/batchDel`, params); };

//修改一条xm_question记录
export const editXmQuestion = params => { return axios.post(`${base}/xm/core/xmQuestion/edit`, params); };

//新增一条xm_question
export const addXmQuestion = params => { return axios.post(`${base}/xm/core/xmQuestion/add`, params); };

export const editStatus = params => { return axios.post(`${base}/xm/core/xmQuestion/editStatus`, params); };

export const editXmQuestionSomeFields = params => { return axios.post(`${base}/xm/core/xmQuestion/editSomeFields`, params); };


export const getXmQuestionAttDist = params => { return axios.get(`${base}/xm/core/xmQuestion/getXmQuestionAttDist`, { params: params }); };



export const getXmQuestionAgeDist = params => { return axios.get(`${base}/xm/core/xmQuestion/getXmQuestionAgeDist`, { params: params }); };
export const getXmQuestionSort = params => { return axios.get(`${base}/xm/core/xmQuestion/getXmQuestionSort`, { params: params }); };

 



