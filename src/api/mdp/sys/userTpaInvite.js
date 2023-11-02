import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext();

/**
 * 第三方邀请加入流水表，send_branch_id+join_userid唯一索引
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={inviteId:'邀请编号，带到邀请链接中的state字段，通过该邀请码反查邀请信息 主键',joinUserid:'被邀请的用户编号，对应sys_user.userid',sendBranchId:'邀请加入的企业编号',sendUserid:'发起邀请的用户编号',sendBranchName:'邀请加入的企业编号',sendUsername:'发起邀请的用户名',joinUsername:'被邀请的用户名称',sendTime:'邀请时间',joinTime:'加入时间',inviteState:'邀请状态，字典invite_state，0-发起，1-待客户扫码确认，2-已加入',inviteScene:'邀请场景，1-裸邦，创建个人虚拟企业及账户',inviteType:'邀请类型，1-微信-扫码，2-手机号码+短信验证码，3-邮件+验证码，4-小程序'}
 * @author maimeng-mdp code-gen
 * @since 2023-9-22
 **/
 
//普通查询 条件之间and关系  
export const listUserTpaInvite = params => { return axios.get(`${base}/mdp/sys/userTpaInvite/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryUserTpaInviteById = params => { return axios.get(`${base}/mdp/sys/userTpaInvite/queryById`, { params: params }); };

//删除一条第三方邀请加入流水表，send_branch_id+join_userid唯一索引 params={inviteId:'邀请编号，带到邀请链接中的state字段，通过该邀请码反查邀请信息 主键'}
export const delUserTpaInvite = params => { return axios.post(`${base}/mdp/sys/userTpaInvite/del`,params); };

//批量删除第三方邀请加入流水表，send_branch_id+join_userid唯一索引  params=[{inviteId:'邀请编号，带到邀请链接中的state字段，通过该邀请码反查邀请信息 主键'}]
export const batchAddUserTpaInvite = params => { return axios.post(`${base}/mdp/sys/userTpaInvite/batchAdd`, params); };

//批量删除第三方邀请加入流水表，send_branch_id+join_userid唯一索引  params=[{inviteId:'邀请编号，带到邀请链接中的state字段，通过该邀请码反查邀请信息 主键'}]
export const batchDelUserTpaInvite = params => { return axios.post(`${base}/mdp/sys/userTpaInvite/batchDel`, params); };

//修改一条第三方邀请加入流水表，send_branch_id+join_userid唯一索引记录
export const editUserTpaInvite = params => { return axios.post(`${base}/mdp/sys/userTpaInvite/edit`, params); };

//新增一条第三方邀请加入流水表，send_branch_id+join_userid唯一索引
export const addUserTpaInvite = params => { return axios.post(`${base}/mdp/sys/userTpaInvite/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserTpaInvite = params => { return axios.post(`${base}/mdp/sys/userTpaInvite/editSomeFields`, params); };

//创建邀请码
export const createInviteId = params => { return axios.post(`${base}/mdp/sys/userTpaInvite/createInviteId`,params); };


//检查邀请码是否有效
export const checkInviteId = params => { return axios.get(`${base}/mdp/sys/userTpaInvite/checkInviteId`, { params: params }); };
