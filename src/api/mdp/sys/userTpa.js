import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext();

/**
 * 第三方系统向我方开放的用户列表
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={openid:'帐户加密后的编号，用于对第三方系统进行开放 主键',unionid:'全局唯一编号',locked:'是否被锁定',startdate:'启用日期',nickname:'昵称',username:'用户名称',phoneno:'移动电话号码',country:'国家',city:'城市',headimgurl:'头像地址',province:'省份',mdpAppid:'前端应用系统编号',appid:'第三方登录应用系统编号',authId:'授权编号',bizType:'biz_type',gender:'性别',appType:'第三方应用类型，字典tpa_app_type,1-微信公众号，2-小程序，3-微信开放平台',inviteId:'邀请码-对应invite.invite_id'}
 * @author maimeng-mdp code-gen
 * @since 2023-9-22
 **/
 
//普通查询 条件之间and关系  
export const listUserTpa = params => { return axios.get(`${base}/mdp/sys/userTpa/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryUserTpaById = params => { return axios.get(`${base}/mdp/sys/userTpa/queryById`, { params: params }); };

//删除一条第三方系统向我方开放的用户列表 params={openid:'帐户加密后的编号，用于对第三方系统进行开放 主键'}
export const delUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/del`,params); };

//批量删除第三方系统向我方开放的用户列表  params=[{openid:'帐户加密后的编号，用于对第三方系统进行开放 主键'}]
export const batchAddUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/batchAdd`, params); };

//批量删除第三方系统向我方开放的用户列表  params=[{openid:'帐户加密后的编号，用于对第三方系统进行开放 主键'}]
export const batchDelUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/batchDel`, params); };

//修改一条第三方系统向我方开放的用户列表记录
export const editUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/edit`, params); };

//新增一条第三方系统向我方开放的用户列表
export const addUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/editSomeFields`, params); };