import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext();

/**
 * 个人消息通知
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'消息编号 主键',sendUserid:'操作人id',sendUsername:'操作人名字',operTime:'操作时间',objType:'对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7/关注用户-8/点赞文章-9/评论文章-10/收藏文章-11/12-用户注销/13-商务合作',msg:'备注-完整描述',gloNo:'全局根踪号，用于跟踪日志',branchId:'机构编号',ip:'ip地址',bizId:'业务主键编号',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号',bizName:'对象名称',toUserid:'接收用户编号',toUsername:'接收用户名称',hadRead:'是否已读',url:'跳转地址'}
 * @author maimeng-mdp code-gen
 * @since 2023-9-29
 **/
 
//普通查询 条件之间and关系  
export const listNotifyMsg = params => { return axios.get(`${base}/mdp/sys/notifyMsg/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryNotifyMsgById = params => { return axios.get(`${base}/mdp/sys/notifyMsg/queryById`, { params: params }); };

//删除一条个人消息通知 params={id:'消息编号 主键'}
export const delNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/del`,params); };

//批量删除个人消息通知  params=[{id:'消息编号 主键'}]
export const batchAddNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/batchAdd`, params); };

//批量删除个人消息通知  params=[{id:'消息编号 主键'}]
export const batchDelNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/batchDel`, params); };

//修改一条个人消息通知记录
export const editNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/edit`, params); };

//新增一条个人消息通知
export const addNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/add`, params); };

//批量修改某些字段
export const editSomeFieldsNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/editSomeFields`, params); };