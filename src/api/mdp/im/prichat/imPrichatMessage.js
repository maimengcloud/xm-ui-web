import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getImBasePath();


/**
 * 私聊消息
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键ID 主键',sendUserid:'发送者ID',sendTime:'发送时间',sendObject:'发送对象L门店P商品K规格O订单S物流T其他M手机号码W微信号码M邮箱A广告',sendContent:'发送内容',readTime:'读取时间',groupId:'群组编号',toUserid:'接收者编号',sendUsername:'发送者名称',msgAction:'消息动作inviteJoinFrend邀请成为好友,inviteJoinGroup邀请加入群,invitePhone邀请发送手机号码,inviteWeixin邀请发送微信,inviteResume邀请发送简历,inviteInterview邀请面试,showAd展示广告',msgClass:'消息分类0普通消息1群组通知公告2IM通知3广告',msgState:'消息状态send已发送reach已送达read已读back已回撤'}
 **/
 
//普通查询 条件之间and关系  
export const listImPrichatMessage = params => { return axios.get(`${base}/mdp/im/prichat/imPrichatMessage/list`, { params: params }); };

//查询我的私聊组
export const listMyPrichatChannelGroups = params => { return axios.get(`${base}/mdp/im/prichat/imPrichatMessage/listMyPrichatChannelGroups`, { params: params }); };

//模糊查询私聊消息 条件之间or关系  
//export const listImPrichatMessageKey = params => { return axios.get(`${base}/mdp/im/prichat/imPrichatMessage/listKey`, { params: params }); };

//删除一条私聊消息 params={id:'主键ID 主键'}
export const delImPrichatMessage = params => { return axios.post(`${base}/mdp/im/prichat/imPrichatMessage/del`,params); };

//批量删除私聊消息  params=[{id:'主键ID 主键'}]
export const batchDelImPrichatMessage = params => { return axios.post(`${base}/mdp/im/prichat/imPrichatMessage/batchDel`, params); };

//修改一条私聊消息记录
export const editImPrichatMessage = params => { return axios.post(`${base}/mdp/im/prichat/imPrichatMessage/edit`, params); };

//新增一条私聊消息
export const addImPrichatMessage = params => { return axios.post(`${base}/mdp/im/prichat/imPrichatMessage/add`, params); };