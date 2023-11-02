import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getImContext();


/**
 * 群组定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'群组主键 主键',groupName:'组名',categoryId:'组类别',cuserid:'创建人编号',cusername:'创建人姓名',cdate:'创建日期',bizStatus:'业务状态0已提出1咨询中2已结束',gstatus:'群状态0初始1有效2已解散3全体禁言',resStatus:'响应状态：I正在响应，S退出响应，O超时未响应，F结束响应',locationId:'门店编号',shopId:'商户编号',branchId:'归属机构号',onlineUsers:'在线人数',deptid:'归属部门',allowJoin:'是否允许加入0不允许1允许',needAudit:'是否需要审核0不需要1需要',headimgurl:'群头像地址',allowSpeechTime:'下次允许发言时间',isPrichat:'是否为私聊群0否1是两人人对话有第三人加入自动升级为普通群'}
 **/

//普通查询 条件之间and关系
export const listImGroup = params => { return axios.get(`${base}/mdp/im/group/imGroup/list`, { params: params }); };

//查询我所在的群组
export const listMyChannelGroups = params => { return axios.get(`${base}/mdp/im/group/imGroup/listMyChannelGroups`, { params: params }); };

/**查询一个组及其所有成员 */
export const queryGroupAndUsers = params => { return axios.get(`${base}/mdp/im/group/imGroup/queryGroupAndUsers`, { params: params }); };

//模糊查询群组定义 条件之间or关系
//export const listImGroupKey = params => { return axios.get(`${base}/mdp/im/group/imGroup/listKey`, { params: params }); };

//删除一条群组定义 params={id:'群组主键 主键'}
export const delImGroup = params => { return axios.post(`${base}/mdp/im/group/imGroup/del`,params); };

//批量删除群组定义  params=[{id:'群组主键 主键'}]
export const batchDelImGroup = params => { return axios.post(`${base}/mdp/im/group/imGroup/batchDel`, params); };

//修改一条群组定义记录
export const editImGroup = params => { return axios.post(`${base}/mdp/im/group/imGroup/edit`, params); };

//新增一条群组定义
export const addImGroup = params => { return axios.post(`${base}/mdp/im/group/imGroup/add`, params); };
