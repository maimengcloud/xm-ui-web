import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_question_handle
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',handlerUserid:'处理人编号',handlerUsername:'处理人',handleSolution:'解决方案:',receiptMessage:'回执信息',receiptTime:'回执时间',handleStatus:'create创建（active激活）–confirm确认（confirmed已确认）–solve解决（resolved已解决）–close关闭（closed已关闭）',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',questionId:'问题编号',lastUpdateTime:'最后更新日期',createTime:'创建时间',actWorkload:'实际工时',actCostAmount:'实际金额',urls:'链接地址列表逗号分隔',targetUserid:'指派给谁',targetUsername:'指派给谁'}
 **/
 
//普通查询 条件之间and关系  
export const listXmQuestionHandle = params => { return axios.get(`${base}/xm/core/xmQuestionHandle/list`, { params: params }); };

//模糊查询xm_question_handle 条件之间or关系  
//export const listXmQuestionHandleKey = params => { return axios.get(`${base}/xm/core/xmQuestionHandle/listKey`, { params: params }); };

//删除一条xm_question_handle params={id:'主键 主键'}
export const delXmQuestionHandle = params => { return axios.post(`${base}/xm/core/xmQuestionHandle/del`,params); };

//批量删除xm_question_handle  params=[{id:'主键 主键'}]
export const batchDelXmQuestionHandle = params => { return axios.post(`${base}/xm/core/xmQuestionHandle/batchDel`, params); };

//修改一条xm_question_handle记录
export const editXmQuestionHandle = params => { return axios.post(`${base}/xm/core/xmQuestionHandle/edit`, params); };

//新增一条xm_question_handle
export const addXmQuestionHandle = params => { return axios.post(`${base}/xm/core/xmQuestionHandle/add`, params); };